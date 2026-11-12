import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";
import { hashPassword, verifyPassword } from "../../../../lib/passwordHash";
import {
  createSessionToken,
  setSessionCookie,
  SessionRole,
} from "../../../../lib/authSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan Password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Koneksi Supabase belum terkonfigurasi di environment." },
        { status: 500 }
      );
    }

    // Query admission_users table in Supabase (server-side using Service Role Key)
    const { data: user, error } = await supabase
      .from("admission_users")
      .select("id, email, password, name, role, is_active")
      .eq("email", normalizedEmail)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Akun ini telah dinonaktifkan. Hubungi Admin." },
        { status: 403 }
      );
    }

    // Verify password (supports scrypt hash and seamless auto-upgrade from legacy plaintext)
    const { valid, needsRehash } = verifyPassword(normalizedPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    if (needsRehash) {
      try {
        const upgradedHash = hashPassword(normalizedPassword);
        await supabase
          .from("admission_users")
          .update({ password: upgradedHash })
          .eq("id", user.id);
      } catch (rehashErr) {
        console.warn("[Auth] Gagal auto-upgrade hash password:", rehashErr);
      }
    }

    const role: SessionRole =
      user.role === "Owner" || user.role === "BM" ? user.role : "AC";

    const jwtToken = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        role,
        email: user.email,
      },
    });

    setSessionCookie(response, jwtToken);
    return response;
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
