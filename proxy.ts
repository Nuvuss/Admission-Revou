import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./lib/authSession";

/**
 * Next.js 16 Proxy (pengganti middleware.ts)
 * Melakukan optimistic session & role check pada rute halaman UI.
 * Validasi otorisasi penuh tetap dijalankan di masing-masing API Route Handler.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  // Lindungi halaman utama & analytics jika belum login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Halaman /analytics hanya untuk role Owner
  if (pathname.startsWith("/analytics") && session.role !== "Owner") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/analytics/:path*"],
};

