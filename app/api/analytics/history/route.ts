import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";
import { normalizeTopic } from "../../../../lib/topicNormalizer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_INPUT_CHARS = 5000;
const MAX_RESULT_BYTES = 100_000;
const MAX_THREAD_BYTES = 100_000;
const ALLOWED_ROLES = ["Owner", "AC", "BM"];
const ALLOWED_MODES = ["pitch", "alumni", "comparison"];

function isOwner(req: Request): boolean {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return false;
  const ownerPin = process.env.OWNER_SECRET_PIN || "revou-owner-2026";
  const expected = `owner_auth_${Buffer.from(ownerPin + "_verified_session").toString("base64")}`;
  return token === expected;
}

function jsonSize(value: unknown): number {
  try {
    return JSON.stringify(value ?? null).length;
  } catch {
    return Infinity;
  }
}

// POST: simpan hasil generate penuh (dipanggil dari halaman utama, fire-and-forget)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientSessionId,
      userName,
      userRole = "AC",
      mode = "pitch",
      modelUsed = null,
      topic = null,
      inputText,
      resultJson = null,
      durationMs = null,
    } = body || {};

    if (!userName || !clientSessionId || !inputText) {
      return NextResponse.json(
        { success: false, message: "userName, clientSessionId dan inputText wajib diisi." },
        { status: 400 }
      );
    }
    if (jsonSize(resultJson) > MAX_RESULT_BYTES) {
      return NextResponse.json({ success: false, message: "Hasil terlalu besar." }, { status: 413 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, saved: false, note: "Supabase belum terkonfigurasi." });
    }

    const fullInput = String(inputText).slice(0, MAX_INPUT_CHARS);
    const safeMode = ALLOWED_MODES.includes(mode) ? mode : "pitch";
    // Topik dinormalisasi dengan fungsi & input (200 char) yang sama seperti statistik Top Objections
    const cleanTopic = normalizeTopic(topic, fullInput.slice(0, 200).trim(), safeMode);

    const { error } = await supabase.from("admission_generate_history").upsert(
      [
        {
          client_session_id: String(clientSessionId).slice(0, 100),
          user_name: String(userName).slice(0, 100).trim(),
          user_role: ALLOWED_ROLES.includes(userRole) ? userRole : "AC",
          mode: safeMode,
          model_used: modelUsed ? String(modelUsed).slice(0, 50) : null,
          topic: cleanTopic ? cleanTopic.slice(0, 100) : null,
          input_text: fullInput,
          result_json: resultJson && typeof resultJson === "object" ? resultJson : null,
          duration_ms: Number.isFinite(Number(durationMs)) ? Math.round(Number(durationMs)) : null,
        },
      ],
      { onConflict: "user_name,client_session_id" }
    );

    if (error) {
      console.error("Supabase insert generate history error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }
    return NextResponse.json({ success: true, saved: true });
  } catch (err: any) {
    console.error("History POST exception:", err);
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 200 });
  }
}

// PATCH: perbarui thread klarifikasi untuk satu sesi generate
export async function PATCH(req: Request) {
  try {
    const { userName, clientSessionId, chatThread } = (await req.json()) || {};
    if (!userName || !clientSessionId || !Array.isArray(chatThread)) {
      return NextResponse.json(
        { success: false, message: "userName, clientSessionId dan chatThread (array) wajib diisi." },
        { status: 400 }
      );
    }
    if (jsonSize(chatThread) > MAX_THREAD_BYTES) {
      return NextResponse.json({ success: false, message: "Thread terlalu besar." }, { status: 413 });
    }
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ success: true, saved: false });

    const { error } = await supabase
      .from("admission_generate_history")
      .update({ chat_thread: chatThread })
      .eq("user_name", String(userName).slice(0, 100).trim())
      .eq("client_session_id", String(clientSessionId).slice(0, 100));

    if (error) {
      console.error("Supabase update chat thread error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }
    return NextResponse.json({ success: true, saved: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 200 });
  }
}

// GET: khusus Owner. ?id=<uuid> untuk detail, atau daftar dengan filter topic/user/mode/from/to/limit/cursor
export async function GET(req: Request) {
  if (!isOwner(req)) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Hanya Owner." }, { status: 403 });
  }
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "Supabase belum terkonfigurasi." }, { status: 500 });
    }
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    if (id) {
      const { data, error } = await supabase
        .from("admission_generate_history")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ success: false, message: "Tidak ditemukan." }, { status: 404 });
      return NextResponse.json({ success: true, item: data });
    }

    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1), 50);
    let query = supabase
      .from("admission_generate_history")
      .select("id, created_at, user_name, user_role, mode, model_used, topic, input_text, duration_ms")
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    const topic = searchParams.get("topic");
    const user = searchParams.get("user");
    const mode = searchParams.get("mode");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const cursor = searchParams.get("cursor");
    if (topic) query = query.eq("topic", topic);
    if (user) query = query.eq("user_name", user);
    if (mode && ALLOWED_MODES.includes(mode)) query = query.eq("mode", mode);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);
    if (cursor) query = query.lt("created_at", cursor);

    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

    const rows = data || [];
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.map((r: any) => ({
      ...r,
      input_text: String(r.input_text || "").slice(0, 160),
    }));
    return NextResponse.json({
      success: true,
      items,
      nextCursor: hasMore ? page[page.length - 1].created_at : null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Internal error" }, { status: 500 });
  }
}

