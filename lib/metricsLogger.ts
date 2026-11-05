import fs from "fs/promises";
import path from "path";

export interface ChatbotRequestMetrics {
  requestId: string;
  timestamp: string;
  tab: string;
  model: string;
  isStream: boolean;

  // Latency Metrics (ms)
  retrievalMs: number;
  ttftMs: number;
  totalDurationMs: number;

  // Token Metrics from Gemini usageMetadata
  promptTokenCount: number;
  candidatesTokenCount: number;
  thoughtsTokenCount: number;
  cachedContentTokenCount: number;
  totalTokenCount: number;

  // Resilience & Error Tracking
  rateLimit429Count: number;
  retryCount: number;

  status: "completed" | "interrupted" | "error";
  errorMessage?: string | null;
}

const LOGS_DIR = path.join(process.cwd(), "logs");
const METRICS_FILE = path.join(LOGS_DIR, "metrics.jsonl");

/**
 * Normalizes and extracts token counts safely from Gemini usageMetadata,
 * including thoughtsTokenCount (reasoning) and cachedContentTokenCount.
 */
export function extractUsageMetadata(rawMetadata: any) {
  if (!rawMetadata || typeof rawMetadata !== "object") {
    return {
      promptTokenCount: 0,
      candidatesTokenCount: 0,
      thoughtsTokenCount: 0,
      cachedContentTokenCount: 0,
      totalTokenCount: 0,
    };
  }

  // Thoughts tokens can be directly in thoughtsTokenCount or inside candidatesTokensDetails
  let thoughts = typeof rawMetadata.thoughtsTokenCount === "number" ? rawMetadata.thoughtsTokenCount : 0;
  if (!thoughts && Array.isArray(rawMetadata.candidatesTokensDetails)) {
    const thoughtDetail = rawMetadata.candidatesTokensDetails.find(
      (d: any) =>
        d &&
        (d.modality === "THOUGHTS" ||
          d.modality === "THINKING" ||
          d.modality?.toUpperCase?.() === "THOUGHTS")
    );
    if (thoughtDetail && typeof thoughtDetail.tokenCount === "number") {
      thoughts = thoughtDetail.tokenCount;
    }
  }

  // Support both Gemini (promptTokenCount / candidatesTokenCount) and OpenRouter (prompt_tokens / completion_tokens)
  const prompt =
    typeof rawMetadata.promptTokenCount === "number"
      ? rawMetadata.promptTokenCount
      : typeof rawMetadata.prompt_tokens === "number"
      ? rawMetadata.prompt_tokens
      : 0;

  const candidates =
    typeof rawMetadata.candidatesTokenCount === "number"
      ? rawMetadata.candidatesTokenCount
      : typeof rawMetadata.completion_tokens === "number"
      ? rawMetadata.completion_tokens
      : 0;

  const cached =
    typeof rawMetadata.cachedContentTokenCount === "number"
      ? rawMetadata.cachedContentTokenCount
      : 0;

  const total =
    typeof rawMetadata.totalTokenCount === "number"
      ? rawMetadata.totalTokenCount
      : typeof rawMetadata.total_tokens === "number"
      ? rawMetadata.total_tokens
      : prompt + candidates + thoughts;

  return {
    promptTokenCount: prompt,
    candidatesTokenCount: candidates,
    thoughtsTokenCount: thoughts,
    cachedContentTokenCount: cached,
    totalTokenCount: total,
  };
}

/**
 * Asynchronously writes 1 JSON line per request to logs/metrics.jsonl.
 * Fails safely without throwing so telemetry never blocks or breaks client responses.
 */
export async function logMetricsToJsonl(metrics: ChatbotRequestMetrics): Promise<void> {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    const line = JSON.stringify(metrics) + "\n";
    await fs.appendFile(METRICS_FILE, line, { encoding: "utf-8", flag: "a" });
  } catch (error) {
    console.error("[Telemetry] Error writing metrics to logs/metrics.jsonl:", error);
  }
}

