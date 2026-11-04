import { NextResponse } from "next/server";
import { removeUserOnline, getOnlineUsers } from "../../../../lib/onlineTracker";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userName } = body;

    if (userName && typeof userName === "string") {
      removeUserOnline(userName);
    }

    const onlineData = getOnlineUsers();
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

