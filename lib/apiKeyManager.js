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

// In-memory runtime state for key metrics across the Next.js process
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

  // 2. Dari Environment Variable GEMINI_API_KEYS (comma / newline separated)
  if (process.env.GEMINI_API_KEYS) {
    const splitKeys = process.env.GEMINI_API_KEYS.split(/[\n,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 10);
    for (const k of splitKeys) {
      if (!result.includes(k)) result.push(k);
    }
  }

  // 3. Dari Environment Variables GEMINI_API_KEY_1 s/d GEMINI_API_KEY_5
  for (let i = 1; i <= 5; i++) {
    const envKey = process.env[`GEMINI_API_KEY_${i}`];
    if (envKey && envKey.trim().length > 10) {
      const trimmed = envKey.trim();
      if (!result.includes(trimmed)) result.push(trimmed);
    }
  }

  // 4. Fallback ke GEMINI_API_KEY tunggal / GOOGLE_API_KEY
  const fallbackKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (fallbackKey && fallbackKey.trim().length > 10) {
    const trimmed = fallbackKey.trim();
    if (!result.includes(trimmed)) result.push(trimmed);
  }

  return result.slice(0, 5);
}

/**
 * Inisialisasi atau ambil statistik runtime untuk key tertentu
 */
function getKeyRecord(key, index) {
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
  record.index = index + 1; // update index position
  record.masked = maskApiKey(key);

  // Check if cooldown has expired
  if (record.cooldownUntil && Date.now() >= record.cooldownUntil) {
    record.status = "ready";
    record.cooldownUntil = 0;
  }

  return record;
}

/**
 * Dapatkan API key berikutnya menggunakan urutan Round Robin,
 * dengan prioritas key yang tidak sedang dalam status rate-limited/cooldown.
 */
export function getNextRoundRobinKey(customKeys = null) {
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

  // Round Robin advance
  currentRoundRobinIndex = (currentRoundRobinIndex + 1) % keys.length;
  const initialIndex = currentRoundRobinIndex;

  // Cek apakah key pada indeks terpilih sehat atau sedang cooldown
  let selectedIndex = initialIndex;
  let attempts = 0;

  while (attempts < keys.length) {
    const candidateKey = keys[selectedIndex];
    const record = getKeyRecord(candidateKey, selectedIndex);

    // Jika key ready (tidak sedang cooldown karena 429), pilih key ini
    if (record.status !== "rate_limited" && (!record.cooldownUntil || Date.now() >= record.cooldownUntil)) {
      break;
    }

    // Jika sedang cooldown, lompat ke key berikutnya
    selectedIndex = (selectedIndex + 1) % keys.length;
    attempts++;
  }

  // Jika semua key sedang cooldown, ambil key dengan sisa cooldown terpendek
  if (attempts >= keys.length) {
    let bestIdx = 0;
    let shortestCooldown = Infinity;
    for (let i = 0; i < keys.length; i++) {
      const rec = getKeyRecord(keys[i], i);
      if (rec.cooldownUntil < shortestCooldown) {
        shortestCooldown = rec.cooldownUntil;
        bestIdx = i;
      }
    }
    selectedIndex = bestIdx;
  }

  const selectedKey = keys[selectedIndex];
  const record = getKeyRecord(selectedKey, selectedIndex);
  record.lastUsedAt = Date.now();

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
 * Catat hasil eksekusi API (Sukses atau Error) untuk key tertentu
 */
export function recordKeyExecution(key, keyIndex, status, statusCode, errorMsg = "") {
  if (!key) return;
  const record = getKeyRecord(key, keyIndex - 1);
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
}

/**
 * Dapatkan ringkasan status semua API Key untuk ditampilkan di UI / Dashboard Quota
 */
export function getApiKeysStatus(customKeys = null) {
  const keys = resolveApiKeys(customKeys);
  const now = Date.now();

  const statuses = keys.map((key, idx) => {
    const record = getKeyRecord(key, idx);
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
      isCurrentlyActiveNext: idx === currentRoundRobinIndex,
    };
  });

  const healthyCount = statuses.filter((s) => s.status === "ready").length;
  const limitedCount = statuses.filter((s) => s.status === "rate_limited").length;
  const invalidCount = statuses.filter((s) => s.status === "invalid").length;

  return {
    totalKeys: keys.length,
    activeRoundRobinIndex: (currentRoundRobinIndex % (keys.length || 1)) + 1,
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
export async function testSingleApiKey(key, model = "gemini-3.5-flash-lite") {
  const startTime = Date.now();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6000),
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
        message: "API Key aktif dan kuota tersedia.",
      };
    }

    const errText = await response.text();
    if (response.status === 429) {
      return {
        valid: true,
        statusCode: 429,
        quotaAvailable: false,
        latencyMs: latency,
        message: "Kuota habis atau batas laju request terlampaui (429 Rate Limit).",
      };
    }

    if (response.status === 400 || response.status === 403) {
      return {
        valid: false,
        statusCode: response.status,
        quotaAvailable: false,
        latencyMs: latency,
        message: "API Key tidak valid atau dinonaktifkan di Google AI Studio.",
      };
    }

    return {
      valid: false,
      statusCode: response.status,
      quotaAvailable: false,
      latencyMs: latency,
      message: `Google API Error (${response.status}): ${errText.slice(0, 100)}`,
    };
  } catch (err) {
    return {
      valid: false,
      statusCode: 500,
      quotaAvailable: false,
      latencyMs: Date.now() - startTime,
      message: `Koneksi gagal: ${err.message}`,
    };
  }
}
