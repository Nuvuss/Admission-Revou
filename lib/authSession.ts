import { NextResponse } from "next/server";

export type SessionRole = "Owner" | "AC" | "BM";

export interface SessionPayload {
  sub: string;
  name: string;
  email: string;
  role: SessionRole;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "revou_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

const ALLOWED_ROLES: SessionRole[] = ["Owner", "AC", "BM"];

function getSigningSecret(): string | null {
  const explicit =
    process.env.AUTH_JWT_SECRET?.trim() ||
    process.env.JWT_SECRET?.trim();
  if (explicit) return explicit;

  // Fallback only to configured server secrets (never hardcoded literals)
  const serverFallback =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.OWNER_SECRET_PIN?.trim();

  if (serverFallback) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Auth] AUTH_JWT_SECRET belum diset; menggunakan derivasi dari server secret environment."
      );
    }
    return `revou-derived:${serverFallback}`;
  }

  return null;
}

export function getOwnerSecretPin(): string | null {
  const pin = process.env.OWNER_SECRET_PIN?.trim();
  return pin && pin.length > 0 ? pin : null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    "raw",
    enc,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Create a signed HS256 JWT token using Web Crypto API (compatible with Edge & Node.js).
 */
export async function createSessionToken(user: {
  id?: string;
  name: string;
  email: string;
  role: SessionRole;
}): Promise<string> {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error(
      "Server auth secret (AUTH_JWT_SECRET / SUPABASE_SERVICE_ROLE_KEY) belum dikonfigurasi."
    );
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const role: SessionRole = ALLOWED_ROLES.includes(user.role) ? user.role : "AC";

  const header = { alg: "HS256", typ: "JWT" };
  const payload: SessionPayload = {
    sub: String(user.id || user.email || user.name).slice(0, 150),
    name: String(user.name).trim().slice(0, 100),
    email: String(user.email || "").trim().toLowerCase().slice(0, 150),
    role,
    iat: nowSec,
    exp: nowSec + SESSION_TTL_SECONDS,
  };

  const enc = new TextEncoder();
  const headerB64 = toBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = toBase64Url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  const sigB64 = toBase64Url(new Uint8Array(sigBuffer));

  return `${signingInput}.${sigB64}`;
}

/**
 * Verify an HS256 JWT token and return its payload if valid and unexpired.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  const secret = getSigningSecret();
  if (!secret) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  const sigBytes = fromBase64Url(sigB64);
  const payloadBytes = fromBase64Url(payloadB64);
  if (!sigBytes || !payloadBytes) return null;

  try {
    const key = await importHmacKey(secret);
    const enc = new TextEncoder();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(`${headerB64}.${payloadB64}`)
    );
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= nowSec) return null;
    if (!payload.name || !ALLOWED_ROLES.includes(payload.role)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function extractCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    if (key === name) {
      return decodeURIComponent(pair.slice(eqIdx + 1).trim());
    }
  }
  return null;
}

export async function getSessionFromRequest(req: Request): Promise<SessionPayload | null> {
  const cookieToken = extractCookieValue(req.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (cookieToken) {
    const verified = await verifySessionToken(cookieToken);
    if (verified) return verified;
  }

  // Optional Bearer token support (only valid signed JWTs are accepted)
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    const verified = await verifySessionToken(bearerToken);
    if (verified) return verified;
  }

  return null;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function requireSession(
  req: Request
): Promise<{ session: SessionPayload; errorResponse?: never } | { session?: never; errorResponse: NextResponse }> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali." },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export async function requireOwner(
  req: Request
): Promise<{ session: SessionPayload; errorResponse?: never } | { session?: never; errorResponse: NextResponse }> {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth;
  if (auth.session.role !== "Owner") {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "Akses ditolak. Hanya Owner yang diizinkan." },
        { status: 403 }
      ),
    };
  }
  return { session: auth.session };
}

