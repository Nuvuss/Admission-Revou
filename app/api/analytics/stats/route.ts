import { NextResponse } from "next/server";
import { getSupabase, getLastSupabaseServerDate } from "../../../../lib/supabaseClient";
import { getOnlineUsers, trackUserHeartbeat } from "../../../../lib/onlineTracker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeTopic(rawTopic?: string | null, snippet?: string | null, mode?: string | null): string | null {
  const userSnippet = (snippet || "").toLowerCase().trim();
  const fallbackTopic = (rawTopic || "").toLowerCase().trim();
  const primaryText = userSnippet || fallbackTopic;

  if (!primaryText && mode !== "comparison") return null;

  if (mode === "comparison") {
    if (/\bpurwadhika\b/.test(primaryText)) return "Komparasi vs Purwadhika";
    if (/\bdibimbing\b/.test(primaryText)) return "Komparasi vs Dibimbing";
    if (/\b(dqlab|it\s*lab)\b/.test(primaryText)) return "Komparasi vs DQLab";
    if (/\bhacktiv8\b/.test(primaryText)) return "Komparasi vs Hacktiv8";
    return "Komparasi Kompetitor";
  }

  // Prioritaskan analisis langsung dari input_snippet (prompt asli user) dengan word boundary (\b) ketat
  // agar tidak tertipu oleh kata substring seperti "bisa"/"analisa" (isa), "peluang" (uang), "antusias" (usia), atau "sesuai" (ui)
  if (
    /\b(mahal|kemahalan|biaya|biayanya|harga|harganya|cicilan|nyicil|kredit|refund|skema\s+isa|income\s+share|danacita|diskon|promo|budget|angsuran|bayar\s+bertahap|kendala\s+uang|masalah\s+uang|belum\s+ada\s+uang|tidak\s+ada\s+uang)\b/.test(
      primaryText
    )
  ) {
    return "Keberatan Biaya & Skema Cicilan";
  }
  if (
    /\b(sibuk|tidak\s+ada\s+waktu|susah\s+bagi\s+waktu|jadwal|jadwalnya|kelas\s+malam|lembur|sambil\s+kerja|sambil\s+kuliah|bentrok|offline|tatap\s+muka)\b/.test(
      primaryText
    )
  ) {
    return "Kendala Waktu & Jadwal Kelas";
  }
  if (
    /\b(izin\s+atasan|izin\s+kantor|izin\s+bos|izin\s+suami|izin\s+istri|izin\s+orang\s+tua|izin\s+ortu|izin\s+keluarga|tanya\s+suami|tanya\s+istri|tanya\s+orang\s+tua|tanya\s+ortu|tanya\s+atasan|diskusi\s+sama|persetujuan\s+atasan|sponsor\s+kantor|dibayarin\s+kantor|suami|istri|orang\s+tua|ortu)\b/.test(
      primaryText
    )
  ) {
    return "Izin Atasan / Keluarga";
  }
  if (
    /\b(career\s*switch|switch\s*karir|switch\s*career|pindah\s*jalur|pindah\s*karir|non-it|non\s+it|bukan\s+it|tidak\s+ada\s+basic|tanpa\s+basic|gaptek|ragu\s+bisa|takut\s+tidak\s+bisa|faktor\s+usia|faktor\s+umur|terlalu\s+tua|lulusan\s+sma|lulusan\s+smk|ibu\s+rumah\s+tangga|career\s+break)\b/.test(
      primaryText
    )
  ) {
    return "Keraguan Career Switch / Non-IT";
  }

  // Deteksi Program Spesifik dari Prompt User
  if (/\b(itb|ai\s+enabled\s+leaders|decision\s+making)\b/.test(primaryText)) {
    return "Pitch Program RevoU x ITB (AI & Leaders)";
  }
  if (/\b(binus|cyber\s*security|applied\s+ai)\b/.test(primaryText)) {
    return "Pitch Program RevoU x BINUS (AI & Cyber)";
  }
  if (/\b(revou\s*x\s*ui|universitas\s+indonesia|strategic\s+finance|program\s+ui|finance)\b/.test(primaryText)) {
    return "Pitch Program RevoU x UI (Strategic Finance)";
  }
  if (/\b(fsse|software\s+engineering|software\s+engineer|coding|full\s*stack\s+developer|web\s+developer)\b/.test(primaryText)) {
    return "Pitch Program Software Engineering (FSSE)";
  }
  if (/\b(fsdm|digital\s+marketing|marketing|ads|seo|sosmed|e-commerce)\b/.test(primaryText)) {
    return "Pitch Program Digital Marketing (FSDM)";
  }
  if (/\b(fsda|data\s+analytics|data\s+analyst|analisis\s+data|data\s+science|sql|python|tableau)\b/.test(primaryText)) {
    return "Pitch Program Data Analytics (FSDA)";
  }

  // Deteksi Profil Prospek / Karir & Alumni
  if (/\b(fresh\s*grad|fresh\s*graduate|baru\s+lulus|mahasiswa|lulusan\s+baru)\b/.test(primaryText)) {
    return "Pitch Prospek Fresh Graduate / Mahasiswa";
  }
  if (
    /\b(jaminan\s+kerja|prospek\s+karir|peluang\s+karir|hiring|gaji|salary|magang|internship|portofolio|bumn|manufaktur|kisah\s+alumni|bukti\s+alumni)\b/.test(
      primaryText
    )
  ) {
    return "Prospek Karir & Bukti Alumni";
  }

  if (mode === "alumni") return "Pencarian Bukti Kisah Alumni";
  return "Konsultasi Pitch Program RevoU";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d"; // today, 7d, 30d, all
    const activeUser = searchParams.get("activeUser");
    const activeRole = searchParams.get("activeRole") || "Owner";

    // Register active user heartbeat if passed in stats query
    if (activeUser && activeUser.trim()) {
      trackUserHeartbeat(activeUser.trim(), activeRole);
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        isConfigured: false,
        message: "Supabase belum terkonfigurasi di environment.",
        kpis: {
          totalGenerates: 0,
          initialGenerates: 0,
          totalClarifications: 0,
          totalCopies: 0,
          totalComparisons: 0,
          totalActiveAgents: 0,
          acBmAgentsCount: 0,
          copyRate: 0,
          avgResponseTimeSec: null,
          totalEvents: 0,
        },
        leaderboard: [],
        hourlyHeatmap: Array(24).fill(0),
        modeDistribution: { pitch: 0, alumni: 0, comparison: 0 },
        topTopics: [],
        timeline: [],
      });
    }

    // Fetch recent logs without premature local-clock filtering to prevent OS clock skew issues
    const { data: rawLogs, error } = await supabase
      .from("admission_activity_logs")
      .select("id, created_at, user_name, user_role, action_type, mode, topic, input_snippet, metadata")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) {
      console.warn("Supabase query activity logs warning:", error.message);

      if (
        error.code === "PGRST204" ||
        error.code === "42P01" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("relation") ||
        error.message?.includes("does not exist")
      ) {
        return NextResponse.json({
          isConfigured: false,
          needsTableCreation: true,
          message: "Tabel 'admission_activity_logs' belum dibuat di Supabase.",
          kpis: {
            totalGenerates: 0,
            initialGenerates: 0,
            totalClarifications: 0,
            totalCopies: 0,
            totalComparisons: 0,
            totalActiveAgents: 0,
            acBmAgentsCount: 0,
            copyRate: 0,
            avgResponseTimeSec: null,
            totalEvents: 0,
          },
          leaderboard: [],
          hourlyHeatmap: Array(24).fill(0),
          modeDistribution: { pitch: 0, alumni: 0, comparison: 0 },
          topTopics: [],
          timeline: [],
        });
      }

      if (
        error.message?.includes("Invalid API key") ||
        error.message?.includes("JWT") ||
        error.code === "PGRST301"
      ) {
        return NextResponse.json({
          isConfigured: false,
          invalidKey: true,
          message: "Kredensial Supabase Tidak Cocok (Invalid API Key)",
          details:
            "URL Proyek di .env.local tidak cocok dengan NEXT_PUBLIC_SUPABASE_ANON_KEY. Salin Anon Key dari proyek Supabase yang sama.",
          kpis: {
            totalGenerates: 0,
            initialGenerates: 0,
            totalClarifications: 0,
            totalCopies: 0,
            totalComparisons: 0,
            totalActiveAgents: 0,
            acBmAgentsCount: 0,
            copyRate: 0,
            avgResponseTimeSec: null,
            totalEvents: 0,
          },
          leaderboard: [],
          hourlyHeatmap: Array(24).fill(0),
          modeDistribution: { pitch: 0, alumni: 0, comparison: 0 },
          topTopics: [],
          timeline: [],
        });
      }

      return NextResponse.json({ isConfigured: true, error: error.message }, { status: 500 });
    }

    const fetchedLogs = rawLogs || [];

    // WIB is UTC+7
    const WIB_OFFSET = 7 * 60 * 60 * 1000;

    // Anchor reference "Now" to Supabase's own server clock (via HTTP Date header)
    // so local OS clock skew (e.g. Windows set to Nov 2026) never breaks Today/7d/30d filters
    const supabaseServerNow = getLastSupabaseServerDate();
    const systemNow = new Date();
    let nowUtc = supabaseServerNow || systemNow;
    if (!supabaseServerNow && fetchedLogs.length > 0) {
      const latestLogDate = new Date(fetchedLogs[0].created_at);
      if (Math.abs(systemNow.getTime() - latestLogDate.getTime()) > 24 * 60 * 60 * 1000) {
        nowUtc = latestLogDate;
      }
    }
    const nowWib = new Date(nowUtc.getTime() + WIB_OFFSET);

    // Determine timestamp threshold in UTC
    let timeThresholdMs: number | null = null;
    if (range === "today") {
      const startOfDayWib = new Date(
        Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), nowWib.getUTCDate(), 0, 0, 0, 0)
      );
      timeThresholdMs = startOfDayWib.getTime() - WIB_OFFSET;
    } else if (range === "7d") {
      const startOf7dWib = new Date(
        Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), nowWib.getUTCDate() - 6, 0, 0, 0, 0)
      );
      timeThresholdMs = startOf7dWib.getTime() - WIB_OFFSET;
    } else if (range === "30d") {
      const startOf30dWib = new Date(
        Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), nowWib.getUTCDate() - 29, 0, 0, 0, 0)
      );
      timeThresholdMs = startOf30dWib.getTime() - WIB_OFFSET;
    }

    const allLogs =
      timeThresholdMs !== null
        ? fetchedLogs.filter((log) => new Date(log.created_at).getTime() >= timeThresholdMs!)
        : fetchedLogs;

    // 1. KPI Accumulators
    let initialGenerates = 0;
    let totalClarifications = 0;
    let totalCopies = 0;
    let totalComparisons = 0;
    let totalConsultationEvents = 0;

    const responseDurationsMs: number[] = [];

    const agentMap: Record<
      string,
      {
        userName: string;
        userRole: string;
        generates: number;
        initialGenerates: number;
        clarifications: number;
        copies: number;
        comparisons: number;
        totalActions: number;
        lastActive: string;
        responseDurationsMs: number[];
        topicCounts: Record<string, number>;
      }
    > = {};

    const hourlyHeatmap = Array(24).fill(0);
    const modeDistribution: Record<string, number> = { pitch: 0, alumni: 0, comparison: 0 };
    const topicCounts: Record<string, number> = {};

    // 2. Build Timeline Buckets
    const timeline: {
      label: string;
      sublabel?: string;
      key: string;
      traffic: number;
      scripts: number;
      copies: number;
      activeAgentsSet?: Set<string>;
      agents?: number;
      byUser?: Record<string, { traffic: number; scripts: number; copies: number }>;
      actions?: { user: string; role: string; actionLabel: string; topic: string; timestamp?: string }[];
    }[] = [];

    if (range === "today") {
      for (let h = 0; h < 24; h++) {
        const hourStr = `${String(h).padStart(2, "0")}:00`;
        timeline.push({
          label: hourStr,
          sublabel: "WIB",
          key: String(h),
          traffic: 0,
          scripts: 0,
          copies: 0,
          activeAgentsSet: new Set<string>(),
        });
      }
    } else if (range === "7d") {
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      for (let i = 6; i >= 0; i--) {
        const dWib = new Date(nowWib.getTime() - i * 24 * 60 * 60 * 1000);
        const dayLabel = dayNames[dWib.getUTCDay()];
        const dateNum = dWib.getUTCDate();
        const monthStr = dWib.toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" });
        const key = `${dWib.getUTCFullYear()}-${String(dWib.getUTCMonth() + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;
        timeline.push({
          label: `${dayLabel}`,
          sublabel: `${dateNum} ${monthStr}`,
          key,
          traffic: 0,
          scripts: 0,
          copies: 0,
          activeAgentsSet: new Set<string>(),
        });
      }
    } else if (range === "30d") {
      for (let i = 29; i >= 0; i--) {
        const dWib = new Date(nowWib.getTime() - i * 24 * 60 * 60 * 1000);
        const dateNum = dWib.getUTCDate();
        const monthStr = dWib.toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" });
        const key = `${dWib.getUTCFullYear()}-${String(dWib.getUTCMonth() + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;
        timeline.push({
          label: `${dateNum} ${monthStr}`,
          key,
          traffic: 0,
          scripts: 0,
          copies: 0,
          activeAgentsSet: new Set<string>(),
        });
      }
    } else {
      const daysSet = new Set<string>();
      for (const log of allLogs) {
        const dWib = new Date(new Date(log.created_at).getTime() + WIB_OFFSET);
        const key = `${dWib.getUTCFullYear()}-${String(dWib.getUTCMonth() + 1).padStart(2, "0")}-${String(dWib.getUTCDate()).padStart(2, "0")}`;
        daysSet.add(key);
      }
      if (daysSet.size === 0) {
        timeline.push({
          label: "Hari Ini",
          key: "today",
          traffic: 0,
          scripts: 0,
          copies: 0,
          activeAgentsSet: new Set<string>(),
        });
      } else {
        const sorted = Array.from(daysSet).sort();
        for (const k of sorted) {
          const [y, m, d] = k.split("-");
          const dateObj = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
          timeline.push({
            label: `${dateObj.getUTCDate()} ${dateObj.toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" })}`,
            key: k,
            traffic: 0,
            scripts: 0,
            copies: 0,
            activeAgentsSet: new Set<string>(),
          });
        }
      }
    }

    // 3. Process logs accurately (without double-counting copies/logins in modeDistribution)
    let hasBogusTabSwitchLogs = false;
    for (const log of allLogs) {
      const action = log.action_type;
      const role = log.user_role || "AC";
      const user = (log.user_name || "Unknown").trim();
      const mode = log.mode || "pitch";
      const meta = log.metadata && typeof log.metadata === "object" ? log.metadata : {};

      // Ignore any accidental tab_switch or un-clicked comparison logs
      if (
        action === "view_comparison" &&
        (meta.source === "tab_switch" ||
          log.input_snippet === "Membuka menu Comparison Table" ||
          (!meta.programId && !meta.competitor))
      ) {
        hasBogusTabSwitchLogs = true;
        continue;
      }

      const isGenerate = action === "generate";
      const isClarify = action === "clarify";
      const isAiScriptGeneration = isGenerate || isClarify;
      const isCopy = action === "copy_script";
      const isComparisonView =
        action === "view_comparison" && Boolean(meta.programId || meta.competitor);
      const isLogin = action === "login";

      if (isGenerate) initialGenerates++;
      if (isClarify) totalClarifications++;
      if (isCopy) totalCopies++;
      if (isComparisonView) totalComparisons++;
      if (!isLogin) totalConsultationEvents++;

      // Ensure agentMap entry exists for the current user
      if (!agentMap[user]) {
        agentMap[user] = {
          userName: user,
          userRole: role,
          generates: 0,
          initialGenerates: 0,
          clarifications: 0,
          copies: 0,
          comparisons: 0,
          totalActions: 0,
          lastActive: log.created_at,
          responseDurationsMs: [],
          topicCounts: {},
        };
      }

      // Collect real AI response latency if recorded
      const dur = Number(meta.durationMs || meta.latency_ms || 0);
      if (isAiScriptGeneration && dur > 100 && dur < 120000) {
        responseDurationsMs.push(dur);
        agentMap[user].responseDurationsMs.push(dur);
      }

      // Feature / Mode breakdown: ONLY count feature usage (generate, clarify, view_comparison, view_alumni)
      // Do NOT count "login" or "copy_script" here so numbers are never double-counted!
      if (isAiScriptGeneration || isComparisonView || action === "view_alumni") {
        if (mode === "pitch") {
          modeDistribution.pitch++;
        } else if (mode === "alumni") {
          modeDistribution.alumni++;
        } else if (mode === "comparison" || isComparisonView) {
          modeDistribution.comparison++;
        }
      }

      // Hourly Heatmap & Timeline Matching (WIB is UTC+7)
      // Exclude passive "login" events from consultation traffic & heatmap so charts show real assistant usage
      if (!isLogin) {
        try {
          const logDateWib = new Date(new Date(log.created_at).getTime() + WIB_OFFSET);
          const hour = logDateWib.getUTCHours();
          hourlyHeatmap[hour]++;

          const logDayKey = `${logDateWib.getUTCFullYear()}-${String(logDateWib.getUTCMonth() + 1).padStart(2, "0")}-${String(logDateWib.getUTCDate()).padStart(2, "0")}`;
          const targetPt =
            range === "today"
              ? timeline[hour]
              : timeline.find((t) => t.key === logDayKey);

          if (targetPt) {
            targetPt.traffic++;
            if (isAiScriptGeneration) targetPt.scripts++;
            if (isCopy) targetPt.copies++;
            targetPt.activeAgentsSet?.add(user);

            if (!targetPt.byUser) targetPt.byUser = {};
            if (!targetPt.byUser[user]) targetPt.byUser[user] = { traffic: 0, scripts: 0, copies: 0 };
            targetPt.byUser[user].traffic++;
            if (isAiScriptGeneration) targetPt.byUser[user].scripts++;
            if (isCopy) targetPt.byUser[user].copies++;

            if (!targetPt.actions) targetPt.actions = [];
            if (targetPt.actions.length < 8) {
              const cleanTopic = normalizeTopic(log.topic, log.input_snippet, mode);
              const actionLabel = isGenerate
                ? "Generate Script AI"
                : isClarify
                ? "Revisi Script AI"
                : isCopy
                ? "Salin Script ke WA"
                : isComparisonView
                ? "Lihat Komparasi"
                : "Konsultasi Asisten";
              targetPt.actions.push({
                user,
                role,
                actionLabel,
                topic: cleanTopic || log.topic || "Konsultasi Admisi",
                timestamp: log.created_at,
              });
            }
          }
        } catch (e) {
          // ignore date parse issues
        }
      }

      // Topic / Objection aggregation: only count once per consultation/feature query (not on copy or login)
      if (isAiScriptGeneration || isComparisonView) {
        const cleanTopic = normalizeTopic(log.topic, log.input_snippet, mode);
        if (cleanTopic) {
          topicCounts[cleanTopic] = (topicCounts[cleanTopic] || 0) + 1;
          agentMap[user].topicCounts[cleanTopic] =
            (agentMap[user].topicCounts[cleanTopic] || 0) + 1;

          // Auto-heal database row if previously saved topic was misclassified
          if (log.id && log.topic !== cleanTopic) {
            supabase
              .from("admission_activity_logs")
              .update({ topic: cleanTopic })
              .eq("id", log.id)
              .then(() => {});
          }
        }
      }

      if (isGenerate) {
        agentMap[user].initialGenerates++;
        agentMap[user].generates++;
      }
      if (isClarify) {
        agentMap[user].clarifications++;
        agentMap[user].generates++;
      }
      if (isCopy) agentMap[user].copies++;
      if (isComparisonView) agentMap[user].comparisons++;
      if (!isLogin) agentMap[user].totalActions++;
    }

    if (hasBogusTabSwitchLogs) {
      supabase
        .from("admission_activity_logs")
        .delete()
        .eq("action_type", "view_comparison")
        .eq("input_snippet", "Membuka menu Comparison Table")
        .then(() => {});
    }

    const totalGenerates = initialGenerates + totalClarifications;

    // Finalize timeline agent counts and clean up Set before JSON serialization
    const cleanTimeline = timeline.map((pt) => {
      const agentsCount = pt.activeAgentsSet ? pt.activeAgentsSet.size : 0;
      const { activeAgentsSet, ...rest } = pt;
      return {
        ...rest,
        agents: agentsCount,
      };
    });

    // Leaderboard with bounded Utility Rate (0% - 100%) and per-user top stats
    const leaderboard = Object.values(agentMap)
      .filter((agent) => agent.totalActions > 0 || Object.keys(agentMap).length <= 5)
      .map((agent) => {
        const denom = agent.generates + agent.comparisons;
        const rate =
          denom > 0
            ? Math.min(100, Math.round((agent.copies / denom) * 100))
            : agent.copies > 0
            ? 100
            : 0;

        const userDurations = agent.responseDurationsMs || [];
        const avgUserResp =
          userDurations.length > 0
            ? Number(
                (
                  userDurations.reduce((acc: number, v: number) => acc + v, 0) /
                  userDurations.length /
                  1000
                ).toFixed(1)
              )
            : null;

        const userTopTopic =
          Object.entries(agent.topicCounts || {})
            .map(([name, count]) => ({ name, count: count as number }))
            .sort((a, b) => b.count - a.count)[0] || null;

        const { responseDurationsMs: _d, topicCounts: _tc, ...restAgent } = agent;

        const onlinePresence = getOnlineUsers();
        const onlineNames = new Set(onlinePresence.users.map((u) => u.userName));

        return {
          ...restAgent,
          copyRate: rate,
          avgResponseTimeSec: avgUserResp,
          topTopic: userTopTopic,
          isOnline: onlineNames.has(agent.userName),
        };
      })
      .sort((a, b) => {
        if (b.generates !== a.generates) return b.generates - a.generates;
        if (b.copies !== a.copies) return b.copies - a.copies;
        return b.totalActions - a.totalActions;
      });

    const activeAgentsList = Object.values(agentMap).filter((a) => a.totalActions > 0);
    const historicalActiveCount = activeAgentsList.length;

    // Real-Time Online Presence (Pendekatan 1: Murni menghitung sesi yang sedang login saat ini)
    const onlinePresence = getOnlineUsers();
    const onlineCounselorsCount = onlinePresence.count;
    const onlineAcBmCount = onlinePresence.acBmCount;

    // Global Copy / Utility Rate (bounded 0% - 100%)
    const totalFeatureUses = totalGenerates + totalComparisons;
    const globalCopyRate =
      totalFeatureUses > 0
        ? Math.min(100, Math.round((totalCopies / totalFeatureUses) * 100))
        : totalCopies > 0
        ? 100
        : 0;

    // Average AI Response Time in seconds
    const avgResponseTimeSec =
      responseDurationsMs.length > 0
        ? Number(
            (
              responseDurationsMs.reduce((acc, v) => acc + v, 0) /
              responseDurationsMs.length /
              1000
            ).toFixed(1)
          )
        : null;

    // Top Topics
    const topTopics = Object.entries(topicCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Peak Analysis
    const findPeak = (key: "traffic" | "scripts" | "copies") => {
      let maxVal = 0;
      let peakLabel = "";
      let peakIdx = 0;
      cleanTimeline.forEach((pt, idx) => {
        if (pt[key] > maxVal) {
          maxVal = pt[key];
          peakIdx = idx;
          peakLabel = pt.sublabel ? `${pt.label} (${pt.sublabel})` : pt.label;
        }
      });
      return { maxVal, peakLabel, peakIdx };
    };

    const peakTraffic = findPeak("traffic");
    const peakScripts = findPeak("scripts");
    const peakCopies = findPeak("copies");

    return NextResponse.json({
      isConfigured: true,
      range,
      referenceTimeIso: nowUtc.toISOString(),
      lastUpdatedWib: `${String(nowWib.getUTCHours()).padStart(2, "0")}:${String(nowWib.getUTCMinutes()).padStart(2, "0")}:${String(nowWib.getUTCSeconds()).padStart(2, "0")} WIB`,
      kpis: {
        totalGenerates,
        initialGenerates,
        totalClarifications,
        totalCopies,
        totalComparisons,
        totalActiveAgents: onlineCounselorsCount, // Pendekatan 1: Real-time Online Presence
        acBmAgentsCount: onlineAcBmCount,
        historicalActiveCount,
        copyRate: globalCopyRate,
        avgResponseTimeSec,
        totalEvents: totalConsultationEvents,
      },
      onlinePresence: {
        count: onlineCounselorsCount,
        acBmCount: onlineAcBmCount,
        users: onlinePresence.users,
      },
      timeline: cleanTimeline,
      peaks: {
        traffic: peakTraffic,
        scripts: peakScripts,
        copies: peakCopies,
      },
      leaderboard,
      hourlyHeatmap,
      modeDistribution,
      topTopics,
    });
  } catch (err: any) {
    console.error("Stats API exception:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
