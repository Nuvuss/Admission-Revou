import { NextResponse } from "next/server";
import {
  getApiKeysStatus,
  resolveApiKeys,
  testSingleApiKey,
  maskApiKey,
} from "../../../lib/apiKeyManager";
import { requireOwner } from "../../../lib/authSession";

export const dynamic = "force-dynamic";

/**
 * GET /api/keys
 * Mengembalikan status kuota dan rotasi dari pool API Keys yang aktif (khusus Owner)
 */
export async function GET(request) {
  const auth = await requireOwner(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const status = await getApiKeysStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error("Error in GET /api/keys:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/keys
 * Digunakan untuk:
 * 1. action: "status" -> Cek status key pool (mendukung custom keys dari client)
 * 2. action: "test" -> Test langsung setiap key (ping Gemini) untuk validasi & cek ketersediaan kuota
 */
export async function POST(request) {
  const auth = await requireOwner(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json().catch(() => ({}));
    const { action = "status", customKeys = null } = body;

    if (action === "test") {
      const keysToTest = resolveApiKeys(customKeys);

      if (keysToTest.length === 0) {
        return NextResponse.json({
          success: false,
          message: "Tidak ada API Key yang dikonfigurasi untuk diuji.",
          results: [],
        });
      }

      // Test all keys in parallel
      const testPromises = keysToTest.map(async (key, idx) => {
        const testResult = await testSingleApiKey(key);
        return {
          index: idx + 1,
          isConfigured: true,
          ...testResult,
        };
      });

      const testResults = await Promise.all(testPromises);

      const availableCount = testResults.filter((r) => r.quotaAvailable).length;
      const rateLimitedCount = testResults.filter((r) => r.statusCode === 429).length;
      const invalidCount = testResults.filter((r) => !r.valid).length;

      return NextResponse.json({
        success: true,
        totalTested: testResults.length,
        availableKeys: availableCount,
        rateLimitedKeys: rateLimitedCount,
        invalidKeys: invalidCount,
        overallQuotaStatus:
          availableCount === testResults.length
            ? "all_healthy"
            : availableCount > 0
            ? "partially_healthy"
            : "exhausted",
        results: testResults,
      });
    }

    // Default action: return status
    const status = await getApiKeysStatus(customKeys);
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error("Error in POST /api/keys:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
