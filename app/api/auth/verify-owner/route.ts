import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    const expectedPin = process.env.OWNER_SECRET_PIN || "revou-owner-2026";

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, message: "PIN harus diisi." },
        { status: 400 }
      );
    }

    if (pin.trim() === expectedPin.trim()) {
      // Create a deterministic verification token
      const token = `owner_auth_${Buffer.from(expectedPin + "_verified_session").toString("base64")}`;
      return NextResponse.json({
        success: true,
        token,
        message: "Autentikasi Owner berhasil!",
      });
    }

    return NextResponse.json(
      { success: false, message: "PIN Owner salah. Akses ditolak." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

