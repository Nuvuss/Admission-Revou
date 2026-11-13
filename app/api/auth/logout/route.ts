import { NextResponse } from "next/server";
import { removeUserOnline } from "../../../../lib/onlineTracker";
import { clearSessionCookie, getSessionFromRequest } from "../../../../lib/authSession";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // sendBeacon bisa mengirim body sebagai Blob/text, jadi parse manual agar toleran
    const raw = await req.text().catch(() => "");
    let body: any = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }
    const { userName, userEmail, sessionId, allSessions } = body || {};
    const verifiedSession = await getSessionFromRequest(req);

    const targetName = verifiedSession?.name || (typeof userName === "string" ? userName : null);
    const targetEmail = verifiedSession?.email || (typeof userEmail === "string" ? userEmail : null);
    const isTabOnlyClose = Boolean(sessionId && typeof sessionId === "string" && !allSessions);

    if (targetName || (sessionId && typeof sessionId === "string")) {
      await removeUserOnline({
        userName: targetName,
        userEmail: targetEmail,
        sessionId: typeof sessionId === "string" ? sessionId : null,
        allSessions: Boolean(allSessions) || !sessionId,
      });
    }

    const response = NextResponse.json({
      success: true,
      message: isTabOnlyClose ? "Sesi tab dihapus." : "Sesi berhasil diakhiri.",
    });

    // Hanya hapus cookie auth pada explicit logout, BUKAN saat menutup satu tab / refresh (pagehide)
    if (!isTabOnlyClose) {
      clearSessionCookie(response);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Logout error" }, { status: 500 });
  }
}
