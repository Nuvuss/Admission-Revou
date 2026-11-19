import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";
import { hashPassword, verifyPassword } from "../../../../lib/passwordHash";
import {
  createSessionToken,
  getClientIp,
  requireSession,
  setSessionCookie,
} from "../../../../lib/authSession";
import {
  checkLockout,
  recordFailedAttempt,
  resetFailedAttempts,
} from "../../../../lib/authRateLimit";

export async function POST(req: Request) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { email, oldPassword, newPassword } = body || {};

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, password lama, dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedOldPassword = String(oldPassword).trim();
    const normalizedNewPassword = String(newPassword).trim();

    // ── Session Binding Authorization ──
    const isPinOwner = !auth.session.email && auth.session.role === "Owner";

    if (auth.session.email) {
      // Standard session: caller can only update their own account
      if (auth.session.email !== normalizedEmail) {
        return NextResponse.json(
          { success: false, message: "Anda hanya dapat mengubah password akun yang sedang login." },
          { status: 403 }
        );
      }
    } else if (isPinOwner) {
      // PIN-authenticated Owner: permitted to manage accounts, but only accounts with role Owner (checked below)
    } else {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid untuk mengubah password." },
        { status: 403 }
      );
    }

    if (normalizedNewPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    if (normalizedOldPassword === normalizedNewPassword) {
      return NextResponse.json(
        { success: false, message: "Password baru tidak boleh sama dengan password lama." },
        { status: 400 }
      );
    }

    // ── Distributed Rate Limiting (per-IP and per-session/user) ──
    const ip = getClientIp(req);
    const sanitizedIp = ip.trim().replace(/[^a-zA-Z0-9_.:-]/g, "_");
    const sessionUserId = auth.session.sub || auth.session.email || "pin-owner";
    const sanitizedUserId = sessionUserId.trim().replace(/[^a-zA-Z0-9_.:-]/g, "_");

    const ipLimitKey = `ratelimit:pwd:ip:${sanitizedIp}`;
    const userLimitKey = `ratelimit:pwd:user:${sanitizedUserId}`;
    const rateLimitKeys = [ipLimitKey, userLimitKey];

    const lockout = await checkLockout(rateLimitKeys);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan password salah. Akses dikunci sementara. Silakan coba lagi dalam ${lockout.retryAfterSec} detik.`,
          retryAfter: lockout.retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(lockout.retryAfterSec) },
        }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Koneksi Supabase belum terkonfigurasi di environment." },
        { status: 500 }
      );
    }

    // Query user in admission_users
    const { data: user, error: fetchError } = await supabase
      .from("admission_users")
      .select("id, email, password, name, role, is_active")
      .eq("email", normalizedEmail)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, message: "Akun dengan email tersebut tidak ditemukan di database." },
        { status: 404 }
      );
    }

    if (user.is_active === false) {
      return NextResponse.json(
        { success: false, message: "Akun ini telah dinonaktifkan. Hubungi Admin." },
        { status: 403 }
      );
    }

    // PIN-authenticated Owner can only change passwords of accounts with role Owner
    if (isPinOwner && user.role !== "Owner") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Sesi PIN Owner hanya dapat mengelola akun dengan role Owner." },
        { status: 403 }
      );
    }

    // ── Mandatory Current-Password Verification (for both email-bound and PIN-owner paths) ──
    const { valid } = verifyPassword(normalizedOldPassword, user.password);
    if (!valid) {
      const failResult = await recordFailedAttempt(rateLimitKeys);
      if (failResult.isLocked) {
        return NextResponse.json(
          {
            success: false,
            message: `Password saat ini salah 5 kali berturut-turut. Akses dikunci sementara selama ${Math.ceil(failResult.retryAfterSec / 60)} menit.`,
            retryAfter: failResult.retryAfterSec,
          },
          {
            status: 429,
            headers: { "Retry-After": String(failResult.retryAfterSec) },
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: `Password saat ini / lama tidak cocok. Sisa percobaan: ${failResult.remainingAttempts}.`,
        },
        { status: 401 }
      );
    }

    // Reset rate-limit counters on success
    await resetFailedAttempts(rateLimitKeys);

    // Store hashed password in database
    const hashedNewPassword = hashPassword(normalizedNewPassword);
    const { error: updateError } = await supabase
      .from("admission_users")
      .update({ password: hashedNewPassword })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return NextResponse.json(
        { success: false, message: "Gagal memperbarui password: " + updateError.message },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan gunakan password baru Anda saat login berikutnya.",
    });

    // If caller was an empty-email PIN Owner, re-issue session token bound to the verified account
    if (isPinOwner) {
      const newJwt = await createSessionToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "Owner",
      });
      setSessionCookie(response, newJwt);
    }

    return response;
  } catch (err: any) {
    console.error("Change password route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
