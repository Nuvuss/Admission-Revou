import { NextResponse } from "next/server";
import { trackUserHeartbeat, getOnlineUsers } from "../../../../lib/onlineTracker";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userName, userRole } = body;

    if (userName && typeof userName === "string") {
      trackUserHeartbeat(userName, userRole || "AC");
    }

    const onlineData = getOnlineUsers();
    return NextResponse.json({
      success: true,
      onlineCount: onlineData.count,
      acBmCount: onlineData.acBmCount,
      users: onlineData.users,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Heartbeat error" }, { status: 500 });
  }
}

export async function GET() {
  const onlineData = getOnlineUsers();
  return NextResponse.json({
    success: true,
    onlineCount: onlineData.count,
    acBmCount: onlineData.acBmCount,
    users: onlineData.users,
  });
}

