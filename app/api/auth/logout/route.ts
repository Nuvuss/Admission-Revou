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
    const { sessionId, allSessions } = body || {};
    const verifiedSession = await getSessionFromRequest(req);

    // Security binding: Untrusted body fields (userName/userEmail) are NEVER trusted to evict users.
    // Presence removal is strictly tied to verifiedSession, or to an explicit unguessable tab sessionId.
    const targetName = verifiedSession?.name || null;
    const targetEmail = verifiedSession?.email || null;
    const rawSessionId = typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : null;
    const isTabOnlyClose = Boolean(rawSessionId && !allSessions);

    if (verifiedSession || rawSessionId) {
      await removeUserOnline({
        userName: targetName,
        userEmail: targetEmail,
        sessionId: rawSessionId,
        allSessions: Boolean(verifiedSession && (allSessions || !rawSessionId)),
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
