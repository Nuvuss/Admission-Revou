import { NextResponse } from "next/server";
import {
  createSessionToken,
  getClientIp,
  getOwnerSecretPin,
  getSessionFromRequest,
  setSessionCookie,
} from "../../../../lib/authSession";
import { safeCompareText } from "../../../../lib/passwordHash";
import { redisGet, redisSet, redisDel } from "../../../../lib/redisClient";

interface PinRateLimitRecord {
  attempts: number;
  lockedUntil?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body || {};

    const expectedPin = getOwnerSecretPin();
    if (!expectedPin) {
      return NextResponse.json(
        { success: false, message: "OWNER_SECRET_PIN belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, message: "PIN harus diisi." },
        { status: 400 }
      );
    }

    // ── Distributed Rate Limiting via Upstash Redis ──
    const ip = getClientIp(req);
    const sanitizedIp = ip.trim().replace(/[^a-zA-Z0-9_.:-]/g, "_");
    const ipKey = `ratelimit:pin:ip:${sanitizedIp}`;
    const globalKey = "ratelimit:pin:global";
    const now = Date.now();

    let ipRecord: PinRateLimitRecord | null = null;
    let globalRecord: PinRateLimitRecord | null = null;

    try {
      ipRecord = await redisGet(ipKey);
      globalRecord = await redisGet(globalKey);
    } catch (redisErr) {
      // Fail open: log warning but do not lock out legitimate admin if Redis is temporarily unreachable
      console.warn("[RateLimit] Upstash Redis check error (failing open):", redisErr);
    }

    // Check IP-level lockout
    if (ipRecord?.lockedUntil && now < ipRecord.lockedUntil) {
      const retryAfter = Math.max(1, Math.ceil((ipRecord.lockedUntil - now) / 1000));
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan PIN salah. Akses dikunci sementara. Silakan coba lagi dalam ${retryAfter} detik.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // Check global-level lockout (protects against distributed IP-rotation attacks)
    if (globalRecord?.lockedUntil && now < globalRecord.lockedUntil) {
      const retryAfter = Math.max(1, Math.ceil((globalRecord.lockedUntil - now) / 1000));
      return NextResponse.json(
        {
          success: false,
          message: `Sistem mendeteksi percobaan login PIN massal. Akses dikunci sementara. Silakan coba lagi dalam ${retryAfter} detik.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // Constant-time PIN comparison
    if (safeCompareText(pin.trim(), expectedPin)) {
      // Reset rate limit counters on success
      try {
        await redisDel(ipKey);
      } catch (delErr) {
        console.warn("[RateLimit] Failed to clear IP lockout counter on success:", delErr);
      }

      const existingSession = await getSessionFromRequest(req);
      const jwtToken = await createSessionToken({
        id: existingSession?.sub || "owner-pin",
        name: existingSession?.name || "Lead Admission",
        email: existingSession?.email || "",
        role: "Owner",
      });

      const response = NextResponse.json({
        success: true,
        message: "Autentikasi Owner berhasil!",
      });
      setSessionCookie(response, jwtToken);
      return response;
    }

    // ── Failed PIN Attempt: Calculate Escalating Lockout ──
    const nextIpAttempts = (ipRecord?.attempts || 0) + 1;
    const nextGlobalAttempts = (globalRecord?.attempts || 0) + 1;

    let lockoutMs = 0;
    if (nextIpAttempts >= 7) {
      lockoutMs = 15 * 60 * 1000; // 15 minutes lockout for 7+ attempts
    } else if (nextIpAttempts >= 6) {
      lockoutMs = 5 * 60 * 1000; // 5 minutes lockout for 6 attempts
    } else if (nextIpAttempts >= 5) {
      lockoutMs = 1 * 60 * 1000; // 1 minute lockout for 5 attempts
    }

    let globalLockoutMs = 0;
    if (nextGlobalAttempts >= 25) {
      globalLockoutMs = 15 * 60 * 1000; // 15 minutes global lockout if 25+ failed attempts occur
    }

    const lockedUntil = lockoutMs > 0 ? now + lockoutMs : undefined;
    const globalLockedUntil = globalLockoutMs > 0 ? now + globalLockoutMs : undefined;
    const ipTtlSec = Math.max(lockoutMs > 0 ? Math.ceil(lockoutMs / 1000) : 1800, 1800);

    try {
      await redisSet(ipKey, { attempts: nextIpAttempts, lockedUntil }, ipTtlSec);
      await redisSet(globalKey, { attempts: nextGlobalAttempts, lockedUntil: globalLockedUntil }, 1800);
    } catch (writeErr) {
      console.warn("[RateLimit] Failed to record failed attempt in Redis:", writeErr);
    }

    if (lockoutMs > 0) {
      const retryAfter = Math.ceil(lockoutMs / 1000);
      return NextResponse.json(
        {
          success: false,
          message: `PIN Owner salah 5 kali berturut-turut. Akses dikunci sementara selama ${Math.ceil(lockoutMs / 60000)} menit.`,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    const remainingAttempts = Math.max(0, 5 - nextIpAttempts);
    return NextResponse.json(
      {
        success: false,
        message: `PIN Owner salah. Akses ditolak. Sisa percobaan sebelum terkunci: ${remainingAttempts}.`,
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
