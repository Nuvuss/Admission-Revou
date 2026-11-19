import { redisGet, redisSet, redisDel } from "./redisClient";

export interface RateLimitRecord {
  attempts: number;
  lockedUntil?: number;
}

export interface LockoutCheckResult {
  isLocked: boolean;
  retryAfterSec: number;
  message?: string;
}

export interface FailedAttemptResult {
  isLocked: boolean;
  retryAfterSec: number;
  remainingAttempts: number;
  attempts: number;
}

/**
 * Checks whether any of the provided rate-limit keys are currently locked out.
 * Fails open (returns not locked) if Redis is temporarily unreachable.
 */
export async function checkLockout(keys: string[]): Promise<LockoutCheckResult> {
  const now = Date.now();

  for (const key of keys) {
    try {
      const record = (await redisGet(key)) as RateLimitRecord | null;
      if (record?.lockedUntil && now < record.lockedUntil) {
        const retryAfterSec = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
        return {
          isLocked: true,
          retryAfterSec,
          message: `Terlalu banyak percobaan gagal. Akses dikunci sementara. Silakan coba lagi dalam ${retryAfterSec} detik.`,
        };
      }
    } catch (err) {
      console.warn(`[RateLimit] Redis read error for ${key} (failing open):`, err);
    }
  }

  return { isLocked: false, retryAfterSec: 0 };
}

/**
 * Records a failed attempt for each key with escalating lockouts:
 * - 5th failed attempt: 1 minute (60s)
 * - 6th failed attempt: 5 minutes (300s)
 * - 7+ failed attempts: 15 minutes (900s)
 */
export async function recordFailedAttempt(
  keys: string[],
  lockoutThreshold = 5
): Promise<FailedAttemptResult> {
  const now = Date.now();
  let highestAttempts = 0;
  let maxLockoutMs = 0;

  for (const key of keys) {
    try {
      const record = (await redisGet(key)) as RateLimitRecord | null;
      const nextAttempts = (record?.attempts || 0) + 1;
      if (nextAttempts > highestAttempts) {
        highestAttempts = nextAttempts;
      }

      let lockoutMs = 0;
      if (nextAttempts >= 7) {
        lockoutMs = 15 * 60 * 1000; // 15 minutes
      } else if (nextAttempts >= 6) {
        lockoutMs = 5 * 60 * 1000; // 5 minutes
      } else if (nextAttempts >= lockoutThreshold) {
        lockoutMs = 1 * 60 * 1000; // 1 minute
      }

      if (lockoutMs > maxLockoutMs) {
        maxLockoutMs = lockoutMs;
      }

      const lockedUntil = lockoutMs > 0 ? now + lockoutMs : undefined;
      const ttlSec = Math.max(lockoutMs > 0 ? Math.ceil(lockoutMs / 1000) : 1800, 1800);

      await redisSet(key, { attempts: nextAttempts, lockedUntil }, ttlSec);
    } catch (err) {
      console.warn(`[RateLimit] Redis write error for ${key}:`, err);
    }
  }

  const isLocked = maxLockoutMs > 0;
  const retryAfterSec = isLocked ? Math.ceil(maxLockoutMs / 1000) : 0;
  const remainingAttempts = Math.max(0, lockoutThreshold - highestAttempts);

  return {
    isLocked,
    retryAfterSec,
    remainingAttempts,
    attempts: highestAttempts,
  };
}

/**
 * Resets failed attempt records for all provided keys upon successful authentication.
 */
export async function resetFailedAttempts(keys: string[]): Promise<void> {
  for (const key of keys) {
    try {
      await redisDel(key);
    } catch (err) {
      console.warn(`[RateLimit] Redis del error for ${key}:`, err);
    }
  }
}
