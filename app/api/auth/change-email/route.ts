import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";
import { verifyPassword } from "../../../../lib/passwordHash";
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { currentEmail, newEmail, password } = body || {};

    if (!currentEmail || !newEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Email saat ini, email baru, dan password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedCurrentEmail = String(currentEmail).trim().toLowerCase();
    const normalizedNewEmail = String(newEmail).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    // ── Session Binding Authorization ──
    const isPinOwner = !auth.session.email && auth.session.role === "Owner";

    if (auth.session.email) {
      // Standard session: caller can only update their own email account
      if (auth.session.email !== normalizedCurrentEmail) {
        return NextResponse.json(
          { success: false, message: "Anda hanya dapat mengubah email milik akun yang sedang login." },
          { status: 403 }
        );
      }
    } else if (isPinOwner) {
      // PIN-authenticated Owner: permitted to manage accounts, but only accounts with role Owner (checked below)
    } else {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid untuk mengubah email." },
        { status: 403 }
      );
    }

    if (!EMAIL_REGEX.test(normalizedNewEmail)) {
      return NextResponse.json(
        { success: false, message: "Format email baru tidak valid." },
        { status: 400 }
      );
    }

    if (normalizedCurrentEmail === normalizedNewEmail) {
      return NextResponse.json(
        { success: false, message: "Email baru tidak boleh sama dengan email saat ini." },
        { status: 400 }
      );
    }

    // ── Distributed Rate Limiting (per-IP and per-session/user) ──
    const ip = getClientIp(req);
    const sanitizedIp = ip.trim().replace(/[^a-zA-Z0-9_.:-]/g, "_");
    const sessionUserId = auth.session.sub || auth.session.email || "pin-owner";
    const sanitizedUserId = sessionUserId.trim().replace(/[^a-zA-Z0-9_.:-]/g, "_");

    const ipLimitKey = `ratelimit:email:ip:${sanitizedIp}`;
    const userLimitKey = `ratelimit:email:user:${sanitizedUserId}`;
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

    // Query current user in admission_users
    const { data: user, error: fetchError } = await supabase
      .from("admission_users")
      .select("id, email, password, name, role, is_active")
      .eq("email", normalizedCurrentEmail)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, message: "Akun dengan email saat ini tidak ditemukan di database." },
        { status: 404 }
      );
    }

    if (user.is_active === false) {
      return NextResponse.json(
        { success: false, message: "Akun ini telah dinonaktifkan. Hubungi Admin." },
        { status: 403 }
      );
    }

    // PIN-authenticated Owner can only change email of accounts with role Owner
    if (isPinOwner && user.role !== "Owner") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Sesi PIN Owner hanya dapat mengelola akun dengan role Owner." },
        { status: 403 }
      );
    }

    // ── Mandatory Current-Password Verification (for both email-bound and PIN-owner paths) ──
    const { valid } = verifyPassword(normalizedPassword, user.password);
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
          message: `Password saat ini tidak cocok. Sisa percobaan: ${failResult.remainingAttempts}.`,
        },
        { status: 401 }
      );
    }

    // Reset rate-limit counters on success
    await resetFailedAttempts(rateLimitKeys);

    // Ensure new email is not already taken by another account
    const { data: existingUser } = await supabase
      .from("admission_users")
      .select("id")
      .eq("email", normalizedNewEmail)
      .maybeSingle();

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Email baru sudah digunakan oleh akun lain." },
        { status: 409 }
      );
    }

    // Update email in database
    const { error: updateError } = await supabase
      .from("admission_users")
      .update({ email: normalizedNewEmail })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update email:", updateError);
      return NextResponse.json(
        { success: false, message: "Gagal memperbarui email: " + updateError.message },
        { status: 500 }
      );
    }

    // Refresh JWT session cookie with the new email and identical cookie attributes
    const newJwt = await createSessionToken({
      id: user.id,
      name: user.name,
      email: normalizedNewEmail,
      role: auth.session.role,
    });

    const response = NextResponse.json({
      success: true,
      email: normalizedNewEmail,
      message: "Email akun berhasil diperbarui! Silakan gunakan email baru Anda saat login berikutnya.",
    });
    setSessionCookie(response, newJwt);
    return response;
  } catch (err: any) {
    console.error("Change email route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
