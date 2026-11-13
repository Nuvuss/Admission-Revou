import { NextResponse } from "next/server";
import { trackUserHeartbeat, getOnlineUsers } from "../../../../lib/onlineTracker";
import { requireOwner, requireSession } from "../../../../lib/authSession";

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
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, status, mode, page, lastActiveAt, silent } = body || {};

    await trackUserHeartbeat({
      userName: auth.session.name,
      userRole: auth.session.role,
      userEmail: auth.session.email || null,
      sessionId: typeof sessionId === "string" ? sessionId : null,
      status: typeof status === "string" ? status : null,
      mode: typeof mode === "string" ? mode : null,
      page: typeof page === "string" ? page : null,
      lastActiveAt: typeof lastActiveAt === "number" ? lastActiveAt : null,
    });

    // Client konselor tidak butuh daftar user lain: kirim respons minimal (hemat bandwidth & read Redis)
    if (silent) {
      return NextResponse.json({ success: true });
    }

    if (auth.session.role !== "Owner") {
      return NextResponse.json({ success: true });
    }

    return presenceResponse(await getOnlineUsers());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Heartbeat error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const auth = await requireOwner(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    return presenceResponse(await getOnlineUsers());
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Presence error" }, { status: 500 });
  }
}
