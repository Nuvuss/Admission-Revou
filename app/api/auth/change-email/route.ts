import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentEmail, newEmail, password } = body;

    if (!currentEmail || !newEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Email saat ini, email baru, dan password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedCurrentEmail = String(currentEmail).trim().toLowerCase();
    const normalizedNewEmail = String(newEmail).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

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

    // Verify password before updating email
    if (user.password !== normalizedPassword) {
      return NextResponse.json(
        { success: false, message: "Password saat ini tidak cocok." },
        { status: 401 }
      );
    }

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

    return NextResponse.json({
      success: true,
      email: normalizedNewEmail,
      message: "Email akun berhasil diperbarui! Silakan gunakan email baru Anda saat login berikutnya.",
    });
  } catch (err: any) {
    console.error("Change email route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

