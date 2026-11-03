/**
 * API Key Manager - Round Robin Rotation & Quota Notification Engine
 * 
 * Fitur:
 * 1. Rotasi otomatis 5 API Key (Round Robin) pada setiap permintaan jawaban.
 * 2. Failover otomatis jika kuota habis (HTTP 429 Too Many Requests / Resource Exhausted).
 * 3. Pemantauan status & pemberitahuan kuota per key (Ready, Cooldown, Quota Exceeded, Invalid).
 * 4. Masking API Key untuk keamanan.
 * 5. Dukungan input via Environment Variables maupun Custom Client Keys dari UI.
 */

import {
  isRedisAvailable,
  redisGet,
  redisSet,
  redisIncr,
} from "./redisClient.js";

// In-memory runtime state for key metrics (L1 cache and fallback if Redis is unconfigured)
const globalKeyStats = new Map();
let currentRoundRobinIndex = -1;

/**
 * Mask an API key for safe display in UI & logs (e.g., "AQ.Ab8RN...nTsg")
 */
export function maskApiKey(key) {
  if (!key || typeof key !== "string") return "Belum diisi";
  const trimmed = key.trim();
  if (trimmed.length <= 10) return "****" + trimmed.slice(-3);
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-5)}`;
}

/**
 * Helper key generation untuk Redis key
 */
function getRedisKeyForApiKey(key) {
  const safeMask = maskApiKey(key).replace(/[^a-zA-Z0-9]/g, "_");
  return `revou:admission:keystats:${safeMask}`;
}

/**
 * Helper case-insensitive untuk membaca env var di Linux/Vercel
 */
function getEnvValue(name) {
  if (typeof process === "undefined" || !process.env) return null;
  if (process.env[name]) return process.env[name];
  const target = name.toLowerCase();
  for (const key of Object.keys(process.env)) {
    if (key.toLowerCase() === target) {
      return process.env[key];
    }
  }
  return null;
}

/**
 * Mengumpulkan daftar API keys yang valid dari Server Env dan/atau Client Keys
 */
export function resolveApiKeys(customKeys = null) {
  const result = [];

  // 1. Jika ada custom keys yang valid dari client
  if (Array.isArray(customKeys) && customKeys.length > 0) {
    for (const k of customKeys) {
      if (k && typeof k === "string" && k.trim().length > 10) {
        result.push(k.trim());
      }
    }
    if (result.length > 0) {
      return result.slice(0, 5); // Maksimal 5 keys
    }
  }

  // 2. Dari Environment Variable GEMINI_API_KEYS (comma / newline separated) - case-insensitive
  const combinedKeys = getEnvValue("GEMINI_API_KEYS");
  if (combinedKeys) {
    const splitKeys = combinedKeys.split(/[\n,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 10);
    for (const k of splitKeys) {
      if (!result.includes(k)) result.push(k);
    }
  }

  // 3. Dari Environment Variables GEMINI_API_KEY_1 s/d 5 (mendukung huruf besar maupun kecil: gemini_api_key_1)
  for (let i = 1; i <= 5; i++) {
    const val =
      getEnvValue(`GEMINI_API_KEY_${i}`) ||
      getEnvValue(`GEMINI_API_KEY${i}`) ||
      getEnvValue(`Admission_Assistant${i}`) ||
      getEnvValue(`Admission_Assistant_${i}`);
    if (val && typeof val === "string" && val.trim().length > 10) {
      const trimmed = val.trim();
      if (!result.includes(trimmed)) result.push(trimmed);
    }
  }

  // 3b. Scan otomatis jika ada nama env var yang cocok dengan pola gemini_api_key_* atau admission_assistant*
  if (result.length < 5 && typeof process !== "undefined" && process.env) {
    const matchingEnvKeys = Object.keys(process.env)
      .filter((k) => /^(?:gemini_api_key|admission_assistant)/i.test(k))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const k of matchingEnvKeys) {
      const val = process.env[k];
      if (val && typeof val === "string" && val.trim().length > 10) {
        const trimmed = val.trim();
        if (!result.includes(trimmed)) result.push(trimmed);
      }
    }
  }

  // 4. Fallback ke GEMINI_API_KEY tunggal / GOOGLE_API_KEY (case-insensitive)
  const fallbackKey = getEnvValue("GEMINI_API_KEY") || getEnvValue("GOOGLE_API_KEY");
  if (fallbackKey && fallbackKey.trim().length > 10) {
    const trimmed = fallbackKey.trim();
    if (!result.includes(trimmed)) result.push(trimmed);
  }

  return result.slice(0, 5);
}

/**
 * Inisialisasi atau ambil statistik runtime lokal (L1 In-Memory Cache)
 */
function getLocalKeyRecord(key, index) {
  if (!globalKeyStats.has(key)) {
    globalKeyStats.set(key, {
      id: `key-${index + 1}`,
      index: index + 1,
      masked: maskApiKey(key),
      status: "ready", // "ready" | "cooldown" | "rate_limited" | "invalid"
      usageCount: 0,
      quotaHits: 0,
      errorCount: 0,
      cooldownUntil: 0,
      lastUsedAt: null,
      lastError: null,
    });
  }
  const record = globalKeyStats.get(key);
  record.index = index + 1;
  record.masked = maskApiKey(key);

  // Check if cooldown has expired
  if (record.cooldownUntil && Date.now() >= record.cooldownUntil) {
    record.status = "ready";
    record.cooldownUntil = 0;
  }

  return record;
}

/**
 * Inisialisasi atau ambil statistik runtime untuk key tertentu (Sinkronisasi Redis)
 */
export async function getKeyRecord(key, index) {
  const local = getLocalKeyRecord(key, index);
  if (!isRedisAvailable()) {
    return local;
  }

  try {
    const redisKey = getRedisKeyForApiKey(key);
    const remote = await redisGet(redisKey);

    if (remote && typeof remote === "object") {
      local.usageCount = Number(remote.usageCount) || 0;
      local.quotaHits = Number(remote.quotaHits) || 0;
      local.errorCount = Number(remote.errorCount) || 0;
      local.cooldownUntil = Number(remote.cooldownUntil) || 0;
      local.lastUsedAt = remote.lastUsedAt || null;
      local.lastError = remote.lastError || null;

      if (local.cooldownUntil && Date.now() >= local.cooldownUntil) {
        local.status = "ready";
        local.cooldownUntil = 0;
        await redisSet(redisKey, local, 86400);
      } else if (local.cooldownUntil && Date.now() < local.cooldownUntil) {
        local.status = "rate_limited";
      } else if (remote.status) {
        local.status = remote.status;
      }
    } else {
      await redisSet(redisKey, local, 86400);
    }
  } catch (err) {
    console.warn(`[Redis] Gagal sinkronisasi data key #${index + 1}:`, err.message);
  }

  return local;
}

/**
 * Dapatkan API key berikutnya menggunakan urutan Round Robin terdistribusi via Redis,
 * dengan prioritas key yang tidak sedang dalam status rate-limited/cooldown.
 */
export async function getNextRoundRobinKey(customKeys = null) {
  const keys = resolveApiKeys(customKeys);

  if (keys.length === 0) {
    return {
      key: null,
      index: 0,
      totalKeys: 0,
      record: null,
      rotatedFrom: null,
      quotaWarning: "Tidak ada API Key yang dikonfigurasi.",
    };
  }

  let initialIndex = 0;

  if (isRedisAvailable()) {
    const counter = await redisIncr("revou:admission:rr_index");
    if (counter !== null && !isNaN(Number(counter))) {
      initialIndex = (Number(counter) - 1) % keys.length;
    } else {
      currentRoundRobinIndex = (currentRoundRobinIndex + 1) % keys.length;
      initialIndex = currentRoundRobinIndex;
    }
  } else {
    currentRoundRobinIndex = (currentRoundRobinIndex + 1) % keys.length;
    initialIndex = currentRoundRobinIndex;
  }

  let selectedIndex = initialIndex;

  // Baca status seluruh candidate keys dari Redis secara paralel
  const records = await Promise.all(keys.map((k, idx) => getKeyRecord(k, idx)));

  let attempts = 0;
  while (attempts < keys.length) {
    const record = records[selectedIndex];
    if (record.status !== "rate_limited" && (!record.cooldownUntil || Date.now() >= record.cooldownUntil)) {
      break;
    }
    selectedIndex = (selectedIndex + 1) % keys.length;
    attempts++;
  }

  // Jika semua key sedang cooldown, pilih yang sisa cooldown-nya paling cepat berakhir
  if (attempts >= keys.length) {
    let bestIdx = 0;
    let shortestCooldown = Infinity;
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      if (rec.cooldownUntil < shortestCooldown) {
        shortestCooldown = rec.cooldownUntil;
        bestIdx = i;
      }
    }
    selectedIndex = bestIdx;
  }

  const selectedKey = keys[selectedIndex];
  const record = records[selectedIndex];
  record.lastUsedAt = Date.now();

  if (isRedisAvailable()) {
    await redisSet(getRedisKeyForApiKey(selectedKey), record, 86400);
  }

  return {
    key: selectedKey,
    index: selectedIndex + 1,
    totalKeys: keys.length,
    record,
    wasRotatedFromCooldown: selectedIndex !== initialIndex,
    allKeys: keys,
  };
}

/**
 * Catat hasil eksekusi API (Sukses atau Error) untuk key tertentu dan simpan ke Redis
 */
export async function recordKeyExecution(key, keyIndex, status, statusCode, errorMsg = "") {
  if (!key) return;
  const record = await getKeyRecord(key, keyIndex - 1);
  record.lastUsedAt = Date.now();

  if (status === "success") {
    record.usageCount += 1;
    record.status = "ready";
    record.cooldownUntil = 0;
    record.lastError = null;
  } else if (status === "rate_limited" || statusCode === 429) {
    record.quotaHits += 1;
    record.status = "rate_limited";
    // Cooldown 60 detik untuk pemulihan rate limit Gemini
    record.cooldownUntil = Date.now() + 60 * 1000;
    record.lastError = errorMsg || "Batas kuota terlampaui (429 Resource Exhausted)";
  } else if (status === "invalid" || statusCode === 400 || statusCode === 403) {
    record.errorCount += 1;
    record.status = "invalid";
    record.lastError = errorMsg || "API Key tidak valid atau tidak memiliki izin (400/403)";
  } else {
    record.errorCount += 1;
    record.lastError = errorMsg || `Error HTTP ${statusCode}`;
  }

  if (isRedisAvailable()) {
    await redisSet(getRedisKeyForApiKey(key), record, 86400);
  }
}

/**
 * Dapatkan ringkasan status semua API Key untuk ditampilkan di UI / Dashboard Quota
 * (Disinkronkan dengan Redis jika aktif)
 */
export async function getApiKeysStatus(customKeys = null) {
  const keys = resolveApiKeys(customKeys);
  const now = Date.now();

  let activeIndex = currentRoundRobinIndex;
  if (isRedisAvailable()) {
    const remoteCounter = await redisGet("revou:admission:rr_index");
    if (remoteCounter !== null && !isNaN(Number(remoteCounter))) {
      activeIndex = (Number(remoteCounter) - 1) % (keys.length || 1);
    }
  }

  const records = await Promise.all(keys.map((k, idx) => getKeyRecord(k, idx)));

  const statuses = records.map((record, idx) => {
    const cooldownRemaining = record.cooldownUntil && record.cooldownUntil > now
      ? Math.ceil((record.cooldownUntil - now) / 1000)
      : 0;

    return {
      index: idx + 1,
      id: `key-${idx + 1}`,
      isConfigured: true,
      status: cooldownRemaining > 0 ? "rate_limited" : record.status,
      usageCount: record.usageCount,
      quotaHits: record.quotaHits,
      errorCount: record.errorCount,
      cooldownSeconds: cooldownRemaining,
      lastUsedAt: record.lastUsedAt,
      lastError: record.lastError,
      isCurrentlyActiveNext: idx === activeIndex,
    };
  });

  const healthyCount = statuses.filter((s) => s.status === "ready").length;
  const limitedCount = statuses.filter((s) => s.status === "rate_limited").length;
  const invalidCount = statuses.filter((s) => s.status === "invalid").length;

  return {
    totalKeys: keys.length,
    activeRoundRobinIndex: (activeIndex % (keys.length || 1)) + 1,
    isRedisEnabled: isRedisAvailable(),
    storageEngine: isRedisAvailable() ? "Upstash Redis / Redis Cloud (Distributed)" : "In-Memory (Local Process)",
    isSupabaseVectorEnabled: false,
    knowledgeEngine: "In-Memory Knowledge Base (Targeted Precision Fallback)",
    summary: {
      healthy: healthyCount,
      rateLimited: limitedCount,
      invalid: invalidCount,
    },
    quotaHealth:
      keys.length === 0
        ? "unconfigured"
        : limitedCount === keys.length
          ? "all_exhausted"
          : limitedCount > 0
            ? "partial_warning"
            : "optimal",
    keys: statuses,
  };
}

/**
 * Fungsi pengujian (ping) sebuah API Key untuk memverifikasi validitas & kuota
 */
export async function testSingleApiKey(key, preferredModel = "gemini-3.5-flash") {
  const candidateModels = [
    preferredModel,
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  let lastResult = null;
  const startTime = Date.now();

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 2 },
        }),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          valid: true,
          statusCode: 200,
          quotaAvailable: true,
          latencyMs: latency,
          modelTested: model,
          message: `API Key aktif dan kuota tersedia (Model: ${model}).`,
        };
      }

      const errText = await response.text();
      if (response.status === 429) {
        return {
          valid: true,
          statusCode: 429,
          quotaAvailable: false,
          latencyMs: latency,
          modelTested: model,
          message: "Kuota habis atau batas laju request terlampaui (429 Rate Limit).",
        };
      }

      if (response.status === 400 || response.status === 403) {
        return {
          valid: false,
          statusCode: response.status,
          quotaAvailable: false,
          latencyMs: latency,
          modelTested: model,
          message: "API Key tidak valid atau dinonaktifkan di Google AI Studio.",
        };
      }

      // If 503 or other server-side errors, record and try next candidate model
      lastResult = {
        valid: false,
        statusCode: response.status,
        quotaAvailable: false,
        latencyMs: latency,
        modelTested: model,
        message: `Google API Error (${response.status}): ${errText.slice(0, 100)}`,
      };
    } catch (err) {
      lastResult = {
        valid: false,
        statusCode: 500,
        quotaAvailable: false,
        latencyMs: Date.now() - startTime,
        modelTested: model,
        message: `Koneksi gagal: ${err.message}`,
      };
    }
  }

  return (
    lastResult || {
      valid: false,
      statusCode: 500,
      quotaAvailable: false,
      latencyMs: Date.now() - startTime,
      message: "Tidak dapat menghubungi endpoint Google Gemini.",
    }
  );
}
