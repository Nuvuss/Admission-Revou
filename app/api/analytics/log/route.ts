import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userName,
      userRole = "AC",
      userEmail = null,
      actionType,
      mode = "pitch",
      modelUsed = null,
      topic = null,
      inputSnippet = null,
      metadata = {},
    } = body;

    if (!userName || !actionType) {
      return NextResponse.json(
        { success: false, message: "userName dan actionType wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      // Supabase is not configured or offline - return soft success so client UX is unaffected
      return NextResponse.json({
        success: true,
        logged: false,
        note: "Supabase credentials not configured in environment.",
      });
    }

    // Truncate snippet to 200 chars for privacy & storage optimization
    const sanitizedSnippet = inputSnippet
      ? String(inputSnippet).slice(0, 200).trim()
      : null;

    const { data, error } = await supabase.from("admission_activity_logs").insert([
      {
        user_name: String(userName).slice(0, 100).trim(),
        user_role: ["Owner", "AC", "BM"].includes(userRole) ? userRole : "AC",
        user_email: userEmail ? String(userEmail).slice(0, 150).trim() : null,
        action_type: String(actionType).slice(0, 50).trim(),
        mode: String(mode).slice(0, 50).trim(),
        model_used: modelUsed ? String(modelUsed).slice(0, 50).trim() : null,
        topic: topic ? String(topic).slice(0, 100).trim() : null,
        input_snippet: sanitizedSnippet,
        metadata: metadata && typeof metadata === "object" ? metadata : {},
      },
    ]);

    if (error) {
      console.error("Supabase insert activity log error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 } // Return 200 to prevent noisy console errors on client
      );
    }

    return NextResponse.json({ success: true, logged: true });
  } catch (err: any) {
    console.error("Log API exception:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 200 }
    );
  }
}

