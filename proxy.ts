import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./lib/authSession";
import { isMaintenanceMode, isOwnerBypassEnabled } from "./lib/maintenance";

/**
 * Next.js 16 Proxy (pengganti middleware.ts)
 * Menangani mode maintenance (Opsi A via env) dengan bypass role Owner,
 * serta optimistic session & role check pada rute halaman UI.
 * Validasi otorisasi penuh tetap dijalankan di masing-masing API Route Handler.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const maintenanceActive = isMaintenanceMode();

  if (maintenanceActive) {
    // Izinkan halaman /maintenance (termasuk untuk preview oleh Owner)
    if (pathname === "/maintenance") {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // Halaman /login selalu terbuka; penentuan akses Owner vs non-Owner dilakukan saat login
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // Pengguna (termasuk Owner) yang belum login wajib melalui /login terlebih dahulu
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Role Owner yang sudah login tetap dapat mengakses aplikasi selama maintenance
    if (session.role === "Owner" && isOwnerBypassEnabled()) {
      const response = NextResponse.next();
      response.headers.set("x-maintenance-bypass", "owner");
      return response;
    }

    // Pengguna non-Owner (BM / AC) yang sudah punya sesi langsung diarahkan ke /maintenance
    const response = NextResponse.rewrite(
      new URL("/maintenance", request.url),
      { status: 503 }
    );
    response.headers.set("Retry-After", "300");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  }

  // Jika maintenance tidak aktif, arahkan /maintenance kembali ke beranda
  if (pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Halaman /login selalu bisa diakses saat mode normal
  if (pathname === "/login") {
    return NextResponse.next();
  }

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
  matcher: ["/", "/analytics/:path*", "/maintenance", "/login"],
};

