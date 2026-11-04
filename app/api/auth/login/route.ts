import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

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
      // Fallback if Supabase not configured in env
      if (normalizedPassword === (process.env.OWNER_SECRET_PIN || "revou-owner-2026")) {
        return NextResponse.json({
          success: true,
          user: { name: "Lead Admission", role: "Owner", email: normalizedEmail },
          token: "owner_session_fallback",
        });
      }
      return NextResponse.json(
        { success: false, message: "Koneksi Supabase belum terkonfigurasi di environment." },
        { status: 500 }
      );
    }

    // Query admission_users table in Supabase
    const { data: user, error } = await supabase
      .from("admission_users")
      .select("id, email, password, name, role, is_active")
      .eq("email", normalizedEmail)
      .single();

    if (error || !user) {
      // Also check fallback for default Owner PIN if table is just created
      const expectedOwnerPin = process.env.OWNER_SECRET_PIN || "revou-owner-2026";
      if (normalizedPassword === expectedOwnerPin) {
        return NextResponse.json({
          success: true,
          user: {
            name: normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            role: "Owner",
            email: normalizedEmail,
          },
          token: `owner_auth_${Buffer.from(expectedOwnerPin + "_verified_session").toString("base64")}`,
        });
      }

      return NextResponse.json(
        { success: false, message: "Email tidak terdaftar di database Supabase." },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Akun ini telah dinonaktifkan. Hubungi Admin." },
        { status: 403 }
      );
    }

    // Check password
    if (user.password !== normalizedPassword) {
      return NextResponse.json(
        { success: false, message: "Password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // Generate token if role is Owner
    let token: string | undefined = undefined;
    if (user.role === "Owner") {
      const ownerPin = process.env.OWNER_SECRET_PIN || "revou-owner-2026";
      token = `owner_auth_${Buffer.from(ownerPin + "_verified_session").toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
      },
      token,
    });
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

