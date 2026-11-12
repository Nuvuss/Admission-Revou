import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";
import { hashPassword, verifyPassword } from "../../../../lib/passwordHash";
import { requireSession } from "../../../../lib/authSession";

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

    if (auth.session.email && auth.session.email !== normalizedEmail) {
      return NextResponse.json(
        { success: false, message: "Anda hanya dapat mengubah password akun yang sedang login." },
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

    // Verify old password
    const { valid } = verifyPassword(normalizedOldPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Password saat ini / lama tidak cocok." },
        { status: 401 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan gunakan password baru Anda saat login berikutnya.",
    });
  } catch (err: any) {
    console.error("Change password route error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
