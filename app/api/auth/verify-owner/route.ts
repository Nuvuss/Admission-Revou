import { NextResponse } from "next/server";
import {
  createSessionToken,
  getOwnerSecretPin,
  getSessionFromRequest,
  setSessionCookie,
} from "../../../../lib/authSession";
import { safeCompareText } from "../../../../lib/passwordHash";

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

    if (safeCompareText(pin.trim(), expectedPin)) {
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
