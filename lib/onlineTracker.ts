// Distributed Online Presence Tracker
// --------------------------------------------------------------
// Presence disimpan per SESI TAB (sessionId), bukan per nama, sehingga:
//  - Multi-tab aman: menutup satu tab tidak membuat user dianggap offline.
//  - Identitas memakai email (lowercase) jika ada, fallback ke nama.
//  - Status "active" / "idle" + mode fitur yang sedang dibuka ikut tercatat.
//
// Storage:
//  - Upstash Redis (production / serverless): konsisten antar instance function.
//      ZSET  presence:v2:sessions          member = sessionId, score = lastPing (ms)
//      KEY   presence:v2:session:<id>      JSON record sesi, TTL = SESSION_TTL_SEC
//  - Fallback in-memory Map (development lokal tanpa Redis).

import type { Redis } from "@upstash/redis";
import { getRedisClient } from "./redisClient.js";

export type PresenceStatus = "active" | "idle";

export interface PresenceSessionRecord {
  sessionId: string;
  userKey: string;
  userName: string;
  userRole: string;
  userEmail: string | null;
  status: PresenceStatus;
  mode: string | null;
  page: string | null;
  connectedAt: number;
  lastActiveAt: number;
  lastPing: number;
}

export interface OnlineUserSummary {
  userKey: string;
  userName: string;
  userRole: string;
  userEmail: string | null;
  status: PresenceStatus;
  mode: string | null;
  page: string | null;
  connectedAt: number;
  lastActiveAt: number;
  lastPing: number;
  sessionCount: number;
}

export interface HeartbeatInput {
  sessionId?: string | null;
  userName: string;
  userRole?: string | null;
  userEmail?: string | null;
  status?: string | null;
  mode?: string | null;
  page?: string | null;
  lastActiveAt?: number | null;
}

// Sesi dianggap offline jika tidak ada heartbeat selama EXPIRY_MS.
// Client mengirim heartbeat tiap 20 detik, jadi 60 detik memberi toleransi 2x gagal kirim.
export const EXPIRY_MS = 60 * 1000;
const SESSION_TTL_SEC = 90;

const ZSET_KEY = "presence:v2:sessions";
const sessionKey = (id: string) => `presence:v2:session:${id}`;

const ALLOWED_ROLES = ["Owner", "AC", "BM"];
const ALLOWED_MODES = ["pitch", "alumni", "comparison"];
const ALLOWED_PAGES = ["assistant", "analytics"];

// ---------- In-memory fallback (survive hot reload di development) ----------
declare global {
  // eslint-disable-next-line no-var
  var __revouPresenceSessions: Map<string, PresenceSessionRecord> | undefined;
}
if (!globalThis.__revouPresenceSessions) {
  globalThis.__revouPresenceSessions = new Map<string, PresenceSessionRecord>();
}
const memorySessions = globalThis.__revouPresenceSessions;

function getRedis(): Redis | null {
  return (getRedisClient() as Redis | null) || null;
}

// ---------- Helpers ----------
export function buildUserKey(userName: string, userEmail?: string | null): string {
  const email = (userEmail || "").trim().toLowerCase();
  if (email) return `email:${email}`;
  return `name:${userName.trim().toLowerCase()}`;
}

function sanitizeSessionId(raw: string | null | undefined, fallbackUserKey: string): string {
  const cleaned = String(raw || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  // Client lama (tanpa sessionId) tetap didukung: 1 sesi per user.
  return cleaned || `legacy-${fallbackUserKey.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80)}`;
}

function normalizeRecord(input: HeartbeatInput, existing: PresenceSessionRecord | null, now: number) {
  const userName = input.userName.trim().slice(0, 100);
  const userEmail = input.userEmail ? String(input.userEmail).trim().toLowerCase().slice(0, 150) : null;
  const userKey = buildUserKey(userName, userEmail);
  const sessionId = sanitizeSessionId(input.sessionId, userKey);
  const userRole = ALLOWED_ROLES.includes(String(input.userRole)) ? String(input.userRole) : "AC";
  const status: PresenceStatus = input.status === "idle" ? "idle" : "active";
  const mode = input.mode && ALLOWED_MODES.includes(input.mode) ? input.mode : existing?.mode ?? null;
  const page = input.page && ALLOWED_PAGES.includes(input.page) ? input.page : existing?.page ?? null;

  // lastActiveAt dari client dibatasi agar tidak bisa di masa depan / terlalu lama
  const clientActive = Number(input.lastActiveAt);
  let lastActiveAt =
    Number.isFinite(clientActive) && clientActive > 0 ? Math.min(clientActive, now) : existing?.lastActiveAt ?? now;
  if (status === "active") lastActiveAt = Math.max(lastActiveAt, now - EXPIRY_MS);

  const record: PresenceSessionRecord = {
    sessionId,
    userKey,
    userName,
    userRole,
    userEmail,
    status,
    mode,
    page,
    connectedAt: existing?.connectedAt ?? now,
    lastActiveAt,
    lastPing: now,
  };
  return record;
}

// ---------- Public API ----------
export async function trackUserHeartbeat(input: HeartbeatInput): Promise<void> {
  if (!input?.userName || !String(input.userName).trim()) return;
  const now = Date.now();
  const redis = getRedis();

  if (redis) {
    try {
      const provisionalKey = buildUserKey(input.userName, input.userEmail);
      const id = sanitizeSessionId(input.sessionId, provisionalKey);
      const existing = await redis.get<PresenceSessionRecord>(sessionKey(id));
      const record = normalizeRecord({ ...input, sessionId: id }, existing || null, now);
      const p = redis.pipeline();
      p.set(sessionKey(record.sessionId), record, { ex: SESSION_TTL_SEC });
      p.zadd(ZSET_KEY, { score: now, member: record.sessionId });
      await p.exec();
      return;
    } catch (err: any) {
      console.warn("[Presence] Redis heartbeat gagal, fallback ke memori:", err?.message);
    }
  }

  const provisionalKey = buildUserKey(input.userName, input.userEmail);
  const id = sanitizeSessionId(input.sessionId, provisionalKey);
  const record = normalizeRecord({ ...input, sessionId: id }, memorySessions.get(id) || null, now);
  memorySessions.set(record.sessionId, record);
}

/**
 * Hapus presence.
 * - Dengan sessionId: hanya sesi tab tersebut (tutup tab / refresh).
 * - allSessions=true: semua sesi milik user (logout eksplisit).
 */
export async function removeUserOnline(opts: {
  userName?: string | null;
  userEmail?: string | null;
  sessionId?: string | null;
  allSessions?: boolean;
}): Promise<void> {
  const userName = (opts.userName || "").trim();
  if (!userName && !opts.sessionId) return;
  const userKey = userName ? buildUserKey(userName, opts.userEmail) : null;
  const legacyNameKey = userName ? buildUserKey(userName, null) : null;
  const redis = getRedis();

  const matchesUser = (rec: PresenceSessionRecord | null | undefined) =>
    !!rec && (rec.userKey === userKey || rec.userKey === legacyNameKey || rec.userName === userName);

  if (redis) {
    try {
      if (opts.sessionId && !opts.allSessions) {
        const id = sanitizeSessionId(opts.sessionId, userKey || "unknown");
        const rec = await redis.get<PresenceSessionRecord>(sessionKey(id));
        // Cegah satu user menghapus sesi milik user lain
        if (!rec || !userName || matchesUser(rec)) {
          const p = redis.pipeline();
          p.del(sessionKey(id));
          p.zrem(ZSET_KEY, id);
          await p.exec();
        }
        return;
      }
      if (!userName) return;
      const ids = await redis.zrange<string[]>(ZSET_KEY, 0, -1);
      if (!ids.length) return;
      const records = await redis.mget<(PresenceSessionRecord | null)[]>(...ids.map(sessionKey));
      const toRemove = ids.filter((id, i) => matchesUser(records[i]));
      if (toRemove.length) {
        const p = redis.pipeline();
        p.del(...toRemove.map(sessionKey));
        p.zrem(ZSET_KEY, ...toRemove);
        await p.exec();
      }
      return;
    } catch (err: any) {
      console.warn("[Presence] Redis remove gagal, fallback ke memori:", err?.message);
    }
  }

  if (opts.sessionId && !opts.allSessions) {
    const id = sanitizeSessionId(opts.sessionId, userKey || "unknown");
    const rec = memorySessions.get(id);
    if (!rec || !userName || matchesUser(rec)) memorySessions.delete(id);
    return;
  }
  for (const [id, rec] of Array.from(memorySessions.entries())) {
    if (matchesUser(rec)) memorySessions.delete(id);
  }
}

async function getActiveSessions(): Promise<PresenceSessionRecord[]> {
  const now = Date.now();
  const cutoff = now - EXPIRY_MS;
  const redis = getRedis();

  if (redis) {
    try {
      const p = redis.pipeline();
      p.zremrangebyscore(ZSET_KEY, 0, cutoff);
      p.zrange(ZSET_KEY, 0, -1);
      const [, ids] = (await p.exec()) as [number, string[]];
      if (!ids || !ids.length) return [];
      const records = await redis.mget<(PresenceSessionRecord | null)[]>(...ids.map(sessionKey));
      const orphaned: string[] = [];
      const active: PresenceSessionRecord[] = [];
      ids.forEach((id, i) => {
        const rec = records[i];
        if (!rec) orphaned.push(id);
        else if (rec.lastPing >= cutoff) active.push(rec);
      });
      if (orphaned.length) redis.zrem(ZSET_KEY, ...orphaned).catch(() => {});
      return active;
    } catch (err: any) {
      console.warn("[Presence] Redis read gagal, fallback ke memori:", err?.message);
    }
  }

  const active: PresenceSessionRecord[] = [];
  for (const [id, rec] of Array.from(memorySessions.entries())) {
    if (rec.lastPing < cutoff) memorySessions.delete(id);
    else active.push(rec);
  }
  return active;
}

/**
 * Ringkasan presence per user (sesi multi-tab digabung).
 * Status user = "active" jika minimal satu tab aktif.
 */
export async function getOnlineUsers() {
  const sessions = await getActiveSessions();
  const byUser = new Map<string, OnlineUserSummary>();

  for (const s of sessions) {
    const cur = byUser.get(s.userKey);
    if (!cur) {
      byUser.set(s.userKey, {
        userKey: s.userKey,
        userName: s.userName,
        userRole: s.userRole,
        userEmail: s.userEmail,
        status: s.status,
        mode: s.mode,
        page: s.page,
        connectedAt: s.connectedAt,
        lastActiveAt: s.lastActiveAt,
        lastPing: s.lastPing,
        sessionCount: 1,
      });
      continue;
    }
    cur.sessionCount += 1;
    cur.connectedAt = Math.min(cur.connectedAt, s.connectedAt);
    cur.lastPing = Math.max(cur.lastPing, s.lastPing);
    if (s.status === "active") cur.status = "active";
    // Mode/halaman diambil dari tab yang paling baru berinteraksi
    if (s.lastActiveAt >= cur.lastActiveAt) {
      cur.lastActiveAt = s.lastActiveAt;
      cur.mode = s.mode ?? cur.mode;
      cur.page = s.page ?? cur.page;
    }
  }

  const users = Array.from(byUser.values()).sort((a, b) => {
    if (a.status !== b.status) return a.status === "active" ? -1 : 1;
    return b.lastActiveAt - a.lastActiveAt;
  });

  const counselors = users.filter((u) => u.userRole === "AC" || u.userRole === "BM");

  return {
    count: users.length,
    acBmCount: counselors.length,
    acBmActiveCount: counselors.filter((u) => u.status === "active").length,
    acBmIdleCount: counselors.filter((u) => u.status === "idle").length,
    storage: getRedis() ? ("redis" as const) : ("memory" as const),
    serverTime: Date.now(),
    users,
  };
}
