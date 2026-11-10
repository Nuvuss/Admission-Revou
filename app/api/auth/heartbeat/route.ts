import { NextResponse } from "next/server";
import { trackUserHeartbeat, getOnlineUsers } from "../../../../lib/onlineTracker";

export const dynamic = "force-dynamic";

function presenceResponse(onlineData: Awaited<ReturnType<typeof getOnlineUsers>>) {
  return NextResponse.json({
    success: true,
    onlineCount: onlineData.count,
    acBmCount: onlineData.acBmCount,
    acBmActiveCount: onlineData.acBmActiveCount,
    acBmIdleCount: onlineData.acBmIdleCount,
    storage: onlineData.storage,
    serverTime: onlineData.serverTime,
    users: onlineData.users,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userName, userRole, userEmail, sessionId, status, mode, page, lastActiveAt, silent } = body || {};

    if (userName && typeof userName === "string") {
      await trackUserHeartbeat({
        userName,
        userRole: userRole || "AC",
        userEmail: typeof userEmail === "string" ? userEmail : null,
        sessionId: typeof sessionId === "string" ? sessionId : null,
        status: typeof status === "string" ? status : null,
        mode: typeof mode === "string" ? mode : null,
        page: typeof page === "string" ? page : null,
        lastActiveAt: typeof lastActiveAt === "number" ? lastActiveAt : null,
      });
    }

    // Client konselor tidak butuh daftar user lain: kirim respons minimal (hemat bandwidth & read Redis)
    if (silent) {
      return NextResponse.json({ success: true });
    }

    return presenceResponse(await getOnlineUsers());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Heartbeat error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    return presenceResponse(await getOnlineUsers());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Presence error" }, { status: 500 });
  }
}
