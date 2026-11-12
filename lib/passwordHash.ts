import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const HASH_PREFIX = "scrypt";
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

/**
 * Hash a plaintext password using Node's built-in scrypt KDF.
 * Stored format: scrypt$<saltHex>$<derivedKeyHex>
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${HASH_PREFIX}$${salt}$${derived}`;
}

export function isPasswordHashed(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith(`${HASH_PREFIX}$`);
}

/**
 * Constant-time string comparison using UTF-8 buffers.
 */
export function safeCompareText(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Verify a candidate password against a stored value (hashed or legacy plaintext).
 * Returns `needsRehash: true` when the stored password was legacy plaintext and matched,
 * allowing seamless automatic upgrade on login.
 */
export function verifyPassword(
  candidate: string,
  stored: string
): { valid: boolean; needsRehash: boolean } {
  if (!candidate || !stored || typeof stored !== "string") {
    return { valid: false, needsRehash: false };
  }

  if (isPasswordHashed(stored)) {
    const parts = stored.split("$");
    if (parts.length !== 3) {
      return { valid: false, needsRehash: false };
    }
    const [, salt, expectedHex] = parts;
    if (!salt || !expectedHex) {
      return { valid: false, needsRehash: false };
    }
    try {
      const derivedBuf = scryptSync(candidate, salt, KEY_LENGTH);
      const expectedBuf = Buffer.from(expectedHex, "hex");
      if (derivedBuf.length !== expectedBuf.length) {
        return { valid: false, needsRehash: false };
      }
      return {
        valid: timingSafeEqual(derivedBuf, expectedBuf),
        needsRehash: false,
      };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Legacy plaintext transition fallback
  const matched = safeCompareText(candidate, stored);
  return { valid: matched, needsRehash: matched };
}

