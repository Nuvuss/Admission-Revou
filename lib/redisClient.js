/**
 * Redis Client - Upstash Redis & Redis Cloud Distributed State Provider
 * 
 * Mendukung:
 * 1. Upstash Redis REST API via @upstash/redis (UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN)
 * 2. Vercel KV REST API (KV_REST_API_URL & KV_REST_API_TOKEN)
 * 3. Graceful in-memory fallback jika environment variable belum dikonfigurasi.
 */

import { Redis } from "@upstash/redis";

let redisInstance = null;
let isConfigured = false;
let initChecked = false;

function initRedis() {
  if (initChecked) return redisInstance;
  initChecked = true;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    (process.env.REDIS_URL && process.env.REDIS_URL.startsWith("http") ? process.env.REDIS_URL : null);

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_TOKEN;

  if (url && token) {
    try {
      redisInstance = new Redis({
        url: url.trim(),
        token: token.trim(),
      });
      isConfigured = true;
      console.log("[Redis] Berhasil terhubung ke Upstash Redis / Redis Cloud.");
    } catch (err) {
      console.warn("[Redis] Gagal menginisialisasi client Upstash Redis:", err.message);
      redisInstance = null;
      isConfigured = false;
    }
  } else {
    // Info bagi pengembang lokal
    isConfigured = false;
    redisInstance = null;
  }

  return redisInstance;
}

/**
 * Akses langsung ke instance Upstash Redis (null jika belum dikonfigurasi).
 * Dipakai untuk operasi lanjutan seperti sorted set / pipeline (mis. online presence).
 */
export function getRedisClient() {
  return initRedis();
}

export function isRedisAvailable() {
  initRedis();
  return isConfigured && redisInstance !== null;
}

/**
 * Ambil data dari Redis (otomatis parse JSON jika tersimpan sebagai string/objek)
 */
export async function redisGet(key) {
  try {
    const client = initRedis();
    if (!client) return null;
    return await client.get(key);
  } catch (err) {
    console.warn(`[Redis] Error pada GET ${key}:`, err.message);
    return null;
  }
}

/**
 * Simpan data ke Redis dengan opsional TTL (dalam detik)
 * @param {string} key
 * @param {any} value
 * @param {number|null} [ttlSeconds=null]
 */
export async function redisSet(key, value, ttlSeconds = null) {
  try {
    const client = initRedis();
    if (!client) return false;
    if (ttlSeconds && typeof ttlSeconds === "number" && ttlSeconds > 0) {
      await client.set(key, value, { ex: ttlSeconds });
    } else {
      await client.set(key, value);
    }
    return true;
  } catch (err) {
    console.warn(`[Redis] Error pada SET ${key}:`, err.message);
    return false;
  }
}

/**
 * Atomic increment integer counter (cocok untuk distributed Round Robin)
 */
export async function redisIncr(key) {
  try {
    const client = initRedis();
    if (!client) return null;
    return await client.incr(key);
  } catch (err) {
    console.warn(`[Redis] Error pada INCR ${key}:`, err.message);
    return null;
  }
}

/**
 * Hapus key dari Redis
 */
export async function redisDel(key) {
  try {
    const client = initRedis();
    if (!client) return false;
    await client.del(key);
    return true;
  } catch (err) {
    console.warn(`[Redis] Error pada DEL ${key}:`, err.message);
    return false;
  }
}
