import { NextResponse } from "next/server";
import { removeUserOnline, getOnlineUsers } from "../../../../lib/onlineTracker";

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

    if ((userName && typeof userName === "string") || (sessionId && typeof sessionId === "string")) {
      await removeUserOnline({
        userName: typeof userName === "string" ? userName : null,
        userEmail: typeof userEmail === "string" ? userEmail : null,
        sessionId: typeof sessionId === "string" ? sessionId : null,
        // Tanpa sessionId (client lama / logout eksplisit) => hapus semua sesi user
        allSessions: Boolean(allSessions) || !sessionId,
      });
    }

    const onlineData = await getOnlineUsers();
    return NextResponse.json({
      success: true,
      message: "Sesi berhasil diakhiri.",
      onlineCount: onlineData.count,
      acBmCount: onlineData.acBmCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Logout error" }, { status: 500 });
  }
}
