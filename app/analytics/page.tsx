"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Users,
  Sparkles,
  Copy,
  TrendingUp,
  Clock,
  Crown,
  RefreshCw,
  Award,
  BarChart3,
  Layers,
  AlertCircle,
  Flame,
  CheckCircle2,
  Zap,
  GraduationCap,
  Scale,
  ChevronRight,
} from "lucide-react";
import { UserSession } from "../types/auth";
import OwnerHistoryDrawer from "../components/OwnerHistoryDrawer";
import ActivityAreaChart from "../components/ActivityAreaChart";
import { usePresenceHeartbeat } from "../hooks/usePresenceHeartbeat";
import { getSupabase } from "../../lib/supabaseClient";
import { getModeColorToken, getRoleColorToken } from "../utils/analyticsColors";

// ========================================================
// 1. HELPER COMPONENTS
// ========================================================

// Smooth Count-Up Ticker with Tabular Numerals
function AnimatedCounter({ value, duration = 650 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const prevValueRef = useRef(value || 0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;
    const startVal = prevValueRef.current;
    const targetVal = Number.isFinite(value) ? value : 0;

    if (startVal === targetVal) {
      setDisplayValue(targetVal);
      return;
    }

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = Math.min((now - startTime) / duration, 1);
      const progress = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(startVal + (targetVal - startVal) * progress);
      setDisplayValue(current);

      if (elapsed < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        prevValueRef.current = targetVal;
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <span className="tabular-numbers">{displayValue.toLocaleString("id-ID")}</span>;
}

// Data-Driven Mini Sparkline in KPI Card Corner
function MiniSparkline({
  color = "#FFD84D",
  data = [],
}: {
  color?: string;
  data?: number[];
}) {
  const values = data.length > 0 ? data : [0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...values, 1);
  const hasAny = values.some((v) => v > 0);
  const w = 64;
  const h = 20;

  const points = values
    .map((v, i) => {
      const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2;
      const y = hasAny ? h - 2 - (v / maxVal) * (h - 5) : h - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className="w-16 h-5 overflow-visible opacity-85 shrink-0" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ========================================================
// 2. MAIN COMPONENT (CLEAN WHITE REVOU DASHBOARD)
// ========================================================
export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Filters & State (Single Source of Truth)
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [roleFilter, setRoleFilter] = useState<"all" | "ac" | "bm">("all");
  const [chartMode, setChartMode] = useState<"all" | "pitch" | "alumni" | "comparison">("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [historyTopic, setHistoryTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeRangeRef = useRef(timeRange);
  useEffect(() => {
    timeRangeRef.current = timeRange;
  }, [timeRange]);

  const sessionRef = useRef<UserSession | null>(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const fetchStats = useCallback(
    async (range: string, silent = false): Promise<{ ok: boolean; error?: string }> => {
      if (!silent) setIsLoading(true);
      setIsSyncing(true);
      if (!silent) setErrorMessage(null);
      try {
        const res = await fetch(`/api/analytics/stats?range=${range}&_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal mengambil data analitik.");
        }
        setStatsData(data);
        return { ok: true };
      } catch (err: any) {
        console.error("Fetch stats error:", err);
        const msg = err?.message || "Terjadi kesalahan saat memuat data analitik.";
        if (!silent) {
          setErrorMessage(msg);
        }
        return { ok: false, error: msg };
      } finally {
        if (!silent) setIsLoading(false);
        setIsSyncing(false);
      }
    },
    []
  );

  // Heartbeat presence per tab saat Owner membuka dashboard analitik
  usePresenceHeartbeat({
    userName: session?.name,
    userRole: session?.role || "Owner",
    userEmail: session?.email,
    page: "analytics",
    silent: true,
  });

  // Check Owner Authorization on Mount (via HttpOnly server session)
  useEffect(() => {
    let active = true;
    const verifyOwnerSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.authenticated && data?.user?.role === "Owner") {
            const verified: UserSession = {
              name: data.user.name,
              role: data.user.role,
              email: data.user.email,
              savedAt: Date.now(),
            };
            try {
              localStorage.setItem("revou_admission_user_session_v1", JSON.stringify(verified));
            } catch (e) {}
            if (!active) return;
            setSession(verified);
            setIsAuthorized(true);
            fetchStats("30d", false);
            return;
          }
        }
      } catch (e) {}

      if (!active) return;
      setIsAuthorized(false);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    };

    verifyOwnerSession();
    return () => {
      active = false;
    };
  }, [router, fetchStats]);

  // Real-Time Synchronization: Supabase Realtime + Auto-Polling + Window Focus
  useEffect(() => {
    if (!isAuthorized) return;

    // 1. Silent auto-polling every 6 seconds
    const intervalId = setInterval(() => {
      fetchStats(timeRangeRef.current, true);
    }, 6000);

    // 2. Refresh immediately when user focuses tab
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchStats(timeRangeRef.current, true);
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // 3. Supabase Realtime Postgres Changes subscription
    const supabase = getSupabase();
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel("realtime-admission-activity")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "admission_activity_logs",
          },
          () => {
            fetchStats(timeRangeRef.current, true);
          }
        )
        .subscribe();
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAuthorized, fetchStats]);

  const handleRangeChange = (range: string) => {
    setTimeRange(range);
    fetchStats(range);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  // If unauthorized
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-white text-[#141412] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E8E4] rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#141412]">Akses Ditolak</h2>
            <p className="text-xs text-[#7A7A74] mt-1">
              Halaman Traffic & Usage Analytics khusus untuk <strong>Role Owner</strong> (Lead / Manager).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Link
              href="/login?redirect=/analytics"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#141412] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D2D2A] transition-all"
            >
              Masuk Sebagai Owner
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#D9D9D4] bg-white text-[#141412] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F5F2] transition-all"
            >
              Kembali ke Asisten
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#FFD84D] border-t-[#141412] rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#141412]">Memverifikasi hak akses Owner...</p>
        </div>
      </div>
    );
  }

  const kpis = statsData?.kpis || {
    totalGenerates: 0,
    initialGenerates: 0,
    totalClarifications: 0,
    totalCopies: 0,
    totalComparisons: 0,
    totalActiveAgents: 0,
    acBmAgentsCount: 0,
    copyRate: 0,
    utilityActiveUsers: 0,
    utilityTotalUsers: 0,
    avgResponseTimeSec: null,
    totalEvents: 0,
  };

  // Leaderboard murni untuk konselor (AC & BM). Owner hanya memantau.
  const rawLeaderboard: any[] = (statsData?.leaderboard || []).filter(
    (a: any) => a.userRole === "AC" || a.userRole === "BM"
  );
  const roleFilteredLeaderboard =
    roleFilter === "ac"
      ? rawLeaderboard.filter((a) => a.userRole === "AC")
      : roleFilter === "bm"
        ? rawLeaderboard.filter((a) => a.userRole === "BM")
        : rawLeaderboard;

  const leaderboardActivityCounts = {
    all: roleFilteredLeaderboard.reduce((acc, a) => acc + (a.totalActions || 0), 0),
    pitch: roleFilteredLeaderboard.reduce(
      (acc, a) => acc + (a.byMode?.pitch?.totalActions ?? a.pitch ?? 0),
      0
    ),
    alumni: roleFilteredLeaderboard.reduce(
      (acc, a) => acc + (a.byMode?.alumni?.totalActions ?? a.alumni ?? 0),
      0
    ),
    comparison: roleFilteredLeaderboard.reduce(
      (acc, a) => acc + (a.byMode?.comparison?.totalActions ?? a.comparison ?? 0),
      0
    ),
  };

  const leaderboard = roleFilteredLeaderboard
    .map((agent) => {
      if (chartMode === "all") {
        return {
          ...agent,
          displayPrimaryMetric: agent.generates || 0,
          displayCopies: agent.copies || 0,
          displayTotalActions: agent.totalActions || (agent.generates || 0) + (agent.copies || 0),
        };
      }
      const modeStats = agent.byMode?.[chartMode];
      const fallbackPrimary =
        chartMode === "pitch"
          ? agent.pitch || 0
          : chartMode === "alumni"
            ? agent.alumni || 0
            : agent.comparison || 0;
      const primaryMetric =
        chartMode === "comparison"
          ? modeStats?.comparisons ?? fallbackPrimary
          : modeStats?.generates ?? fallbackPrimary;
      const copiesMetric = modeStats?.copies ?? 0;
      const totalMetric = modeStats?.totalActions ?? fallbackPrimary;

      return {
        ...agent,
        displayPrimaryMetric: primaryMetric,
        displayCopies: copiesMetric,
        displayTotalActions: totalMetric,
      };
    })
    .filter((agent) => (chartMode === "all" ? true : agent.displayTotalActions > 0))
    .sort((a, b) => {
      if (b.displayPrimaryMetric !== a.displayPrimaryMetric) {
        return b.displayPrimaryMetric - a.displayPrimaryMetric;
      }
      if (b.displayCopies !== a.displayCopies) {
        return b.displayCopies - a.displayCopies;
      }
      return b.displayTotalActions - a.displayTotalActions;
    });

  const modeDistribution = statsData?.modeDistribution || { pitch: 0, alumni: 0, comparison: 0 };
  const rawModeSum =
    (modeDistribution.pitch || 0) +
    (modeDistribution.alumni || 0) +
    (modeDistribution.comparison || 0);
  const pitchPct = rawModeSum > 0 ? Math.round(((modeDistribution.pitch || 0) / rawModeSum) * 100) : 0;
  const alumniPct = rawModeSum > 0 ? Math.round(((modeDistribution.alumni || 0) / rawModeSum) * 100) : 0;
  const compPct = rawModeSum > 0 ? Math.round(((modeDistribution.comparison || 0) / rawModeSum) * 100) : 0;

  // ========================================================
  // COMPACT & PROPORTIONAL AREA CHART DATA PROCESSING
  // Activity graph is strictly for AC and BM counselors (Owner activity is excluded)
  // ========================================================
  const allAvailableUsers = rawLeaderboard
    .filter((a: any) => a.userRole === "AC" || a.userRole === "BM")
    .map((a: any) => ({
      name: a.userName,
      role: a.userRole,
      count: a.totalActions || 0,
      generates: a.generates || 0,
      copies: a.copies || 0,
      pitch: a.pitch || 0,
      alumni: a.alumni || 0,
      comparison: a.comparison || 0,
      avgResponseTimeSec: a.avgResponseTimeSec,
      topTopic: a.topTopic,
    }));

  const availableUsers =
    roleFilter === "ac"
      ? allAvailableUsers.filter((u) => u.role === "AC")
      : roleFilter === "bm"
        ? allAvailableUsers.filter((u) => u.role === "BM")
        : allAvailableUsers;

  const handleRoleFilterChange = (nextRole: "all" | "ac" | "bm") => {
    setRoleFilter(nextRole);
    if (selectedUser !== "all") {
      const userObj = allAvailableUsers.find((u) => u.name === selectedUser);
      if (
        !userObj ||
        (nextRole === "ac" && userObj.role !== "AC") ||
        (nextRole === "bm" && userObj.role !== "BM")
      ) {
        setSelectedUser("all");
      }
    }
  };

  const totalAcBmEvents = availableUsers.reduce((acc, u) => acc + (u.count || 0), 0);
  const totalAcBmPitch = availableUsers.reduce((acc, u) => acc + (u.pitch || 0), 0);
  const totalAcBmAlumni = availableUsers.reduce((acc, u) => acc + (u.alumni || 0), 0);
  const totalAcBmComp = availableUsers.reduce((acc, u) => acc + (u.comparison || 0), 0);

  // Fallback to 'all' if selectedUser is not an active AC/BM counselor in the active role filter
  const isSelectedUserValid =
    selectedUser === "all" || availableUsers.some((u) => u.name === selectedUser);
  const activeSelectedUser = isSelectedUserValid ? selectedUser : "all";

  const selectedUserData =
    activeSelectedUser !== "all" ? availableUsers.find((u) => u.name === activeSelectedUser) : null;

  const topTopics: any[] = statsData?.topTopics || [];

  const rawActiveTopics: { name: string; count: number }[] =
    activeSelectedUser === "all"
      ? topTopics
      : (() => {
        const found = rawLeaderboard.find((a: any) => a.userName === activeSelectedUser);
        if (!found || !found.topicCounts) return [];
        return Object.entries(found.topicCounts)
          .map(([name, count]) => ({ name, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
      })();

  const activeUserTopics: { name: string; count: number }[] = rawActiveTopics.filter((t) => {
    if (chartMode === "all") return true;
    if (chartMode === "comparison") return t.name.startsWith("Komparasi");
    if (chartMode === "alumni") return t.name.startsWith("Alumni") || t.name.includes("Kisah Alumni");
    if (chartMode === "pitch") return !t.name.startsWith("Komparasi") && !t.name.startsWith("Alumni") && !t.name.includes("Kisah Alumni");
    return true;
  });

  const totalTopicMentions = activeUserTopics.reduce((acc: number, t: any) => acc + (t.count || 0), 0);

  const timeline: any[] = statsData?.timeline || [];

  // Hourly Heatmap: respects selected role, user, and mode on hourly ranges (today / yesterday);
  // falls back to global AC & BM hourlyHeatmap on multi-day ranges where API buckets timeline by date.
  const isHourlyFilterable = timeRange === "today" || timeRange === "yesterday";
  const hourlyHeatmap: number[] = (() => {
    if (isHourlyFilterable && timeline.length === 24) {
      const key = chartMode === "all" ? "traffic" : chartMode;
      return Array.from({ length: 24 }, (_, h) => {
        const pt = timeline[h];
        if (!pt) return 0;
        if (activeSelectedUser !== "all") {
          return Number(pt.byUser?.[activeSelectedUser]?.[key] || 0);
        }
        if (roleFilter === "ac" || roleFilter === "bm") {
          return availableUsers.reduce((sum, u) => sum + Number(pt.byUser?.[u.name]?.[key] || 0), 0);
        }
        return Number(pt[key] || 0);
      });
    }
    return statsData?.hourlyHeatmap || Array(24).fill(0);
  })();
  const totalHourlyInteractions = hourlyHeatmap.reduce((acc, v) => acc + v, 0);
  const maxHourlyValue = Math.max(...hourlyHeatmap, 1);

  // Real Sparkline Series for the 3 KPI Cards
  // Pada filter "Hari Ini" & "Kemarin", gunakan seluruh jam (24 jam) agar generate di jam pagi/siang tidak terpotong oleh .slice(-10)
  const sparkSeries = timeRange === "today" || timeRange === "yesterday" ? timeline : timeline.slice(-10);
  const sparkGenerates = sparkSeries.map((pt) => Number(pt.scripts || 0));
  const sparkAgents = sparkSeries.map((pt) => Number(pt.agents || 0));
  const sparkUtility = sparkSeries.map((pt) => {
    const a = Number(pt.agents || 0);
    const total = Number(kpis.utilityTotalUsers || 0);
    return total > 0 ? Math.min(100, Math.round((a / total) * 100)) : 0;
  });

  // Complete Working Hours for Jam Sibuk Konsultasi (08:00 - 22:00 without skipping 12:00/18:00/22:00 + any outside hour with data)
  const displayHours = (() => {
    const hourSet = new Set<number>();
    for (let h = 8; h <= 22; h++) {
      hourSet.add(h);
    }
    hourlyHeatmap.forEach((count, h) => {
      if (count > 0) hourSet.add(h);
    });
    return Array.from(hourSet).sort((a, b) => a - b);
  })();

  return (
    <div className="min-h-screen bg-white text-[#141412] font-sans antialiased relative overflow-x-hidden selection:bg-[#FFF6D1] selection:text-[#141412]">
      {/* Soft Ambient Warm Glow on White Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 85% 10%, rgba(255, 216, 77, 0.10), transparent 70%), radial-gradient(40% 35% at 10% 25%, rgba(14, 98, 254, 0.03), transparent 60%)",
        }}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-5 sm:py-7 relative z-10 space-y-5">
        {/* ========================================================= */}
        {/* 1. FLOATING GLASS BAR (GLOBAL HEADER)                     */}
        {/* ========================================================= */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-3 z-40 px-4 py-2.5 rounded-2xl bg-white/90 border border-[#E8E8E4] shadow-sm backdrop-blur-xl flex items-center justify-between gap-3"
        >
          {/* Left: Brand & Owner Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-[#E8E8E4] bg-neutral-50 hover:bg-neutral-100 hover:border-[#141412] text-[#141412] transition-all active:scale-95 shadow-2xs"
              title="Kembali ke Asisten"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] shadow-[0_0_8px_#FFD84D]" />
              <span className="font-display font-black text-sm tracking-tight text-[#141412]">
                RevoU <span className="text-[#A15C00]">Analytics</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] bg-[#141412] text-[#FFD84D] font-black px-2 py-0.5 rounded-md shadow-2xs uppercase tracking-wide">
                <Crown className="w-2.5 h-2.5" />
                Owner Portal
              </span>
            </div>
          </div>

          {/* Right: Live Sync Indicator, Refresh, New Script CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAFAF8] border border-[#E8E8E4] text-[10.5px] font-mono text-[#4B4B46]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-[#D97706] animate-ping" : "bg-[#1F7A4D]"
                  }`}
              />
              <span>Live Sync: {statsData?.lastUpdatedWib || "Aktif"}</span>
            </div>

            <button
              onClick={async () => {
                const result = await fetchStats(timeRange);
                if (result.ok) {
                  showToast("Data analitik berhasil disinkronkan secara real-time", "success");
                } else {
                  showToast(result.error || "Gagal menyinkronkan data analitik.", "error");
                }
              }}
              disabled={isLoading}
              className="p-2 rounded-xl border border-[#E8E8E4] bg-neutral-50 hover:bg-neutral-100 hover:border-[#141412] text-[#141412] transition-all active:scale-95 shadow-2xs cursor-pointer"
              title="Refresh Data Sekarang"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isSyncing ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>+ Buat Script</span>
            </Link>
          </div>
        </motion.header>

        {/* Database notice if needed */}
        {statsData && !statsData.isConfigured && (
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm text-[#92400E]">
                {statsData.message || "Supabase Belum Dikonfigurasi atau Tabel Belum Dibuat"}
              </p>
              <p className="opacity-90">
                {statsData.details || "Jalankan skrip tabel di Supabase SQL Editor."}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => fetchStats(timeRange)}
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. GREETING & COMPACT GLOBAL FILTER BAR                   */}
        {/* ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1 space-y-3"
        >
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#141412]">
              Selamat datang kembali, {session?.name || "Lead Admisi"}
            </h1>
            <p className="text-xs sm:text-[13px] font-medium text-[#7A7A74]">
              {kpis.totalEvents > 0
                ? `${kpis.totalEvents} total aktivitas konselor (${kpis.totalGenerates} generate AI · ${kpis.totalCopies} script disalin · ${kpis.acBmAgentsCount} konselor online).`
                : "Pantau trafik interaksi prospek, performa script AI, dan konselor online secara real-time."}
            </p>
          </div>

          {/* Unified Compact Global Filter Bar (Time Range + Role + Mode) */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Time Range Filter */}
              <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4]">
                {[
                  { id: "today", label: "Hari Ini" },
                  { id: "yesterday", label: "Kemarin" },
                  { id: "7d", label: "7 Hari" },
                  { id: "30d", label: "30 Hari" },
                  { id: "all", label: "Semua" },
                ].map((tab) => {
                  const isActive = timeRange === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleRangeChange(tab.id)}
                      className={`relative px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer z-10 rounded-lg ${
                        isActive ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="globalTimeRangePill"
                          className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Role Filter: Semua / AC / BM */}
              <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-mono font-bold">
                {[
                  { id: "all", label: `Semua Role (${rawLeaderboard.length})` },
                  { id: "ac", label: `AC (${rawLeaderboard.filter((a) => a.userRole === "AC").length})` },
                  { id: "bm", label: `BM (${rawLeaderboard.filter((a) => a.userRole === "BM").length})` },
                ].map((r) => {
                  const isActive = roleFilter === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleFilterChange(r.id as "all" | "ac" | "bm")}
                      className={`relative px-2.5 py-1 rounded-lg cursor-pointer transition-colors z-10 ${
                        isActive ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="globalRoleFilterPill"
                          className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Filter: Semua Aktivitas / Create Pitch / Alumni Checker / Table Comparison */}
            <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-bold overflow-x-auto max-w-full">
              {[
                { id: "all", label: `Semua Aktivitas (${selectedUserData ? selectedUserData.count : leaderboardActivityCounts.all})` },
                { id: "pitch", label: `Create Pitch (${selectedUserData ? (selectedUserData.pitch ?? 0) : leaderboardActivityCounts.pitch})` },
                { id: "alumni", label: `Alumni Checker (${selectedUserData ? (selectedUserData.alumni ?? 0) : leaderboardActivityCounts.alumni})` },
                { id: "comparison", label: `Table Comparison (${selectedUserData ? (selectedUserData.comparison ?? 0) : leaderboardActivityCounts.comparison})` },
              ].map((seg) => {
                const isSelected = chartMode === seg.id;
                const segToken = getModeColorToken(seg.id);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => setChartMode(seg.id as any)}
                    className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer z-10 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                      isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="globalModeActivePill"
                        className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    {seg.id !== "all" && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? segToken.darkDotClass : segToken.dotClass}`} />
                    )}
                    {seg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* 3. ROW OF 3 REAL-TIME KPI CARDS                           */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {isLoading && !statsData ? (
            [
              "border-[#FDE68A] from-[#FFFBEB] via-[#FFFDF5]",
              "border-[#BBF7D0] from-[#F0FDF4] via-[#F7FDF9]",
              "border-[#E9D5FF] from-[#FAF5FF] via-[#FDFBFF]",
            ].map((tint, idx) => (
              <div
                key={idx}
                aria-hidden="true"
                className={`p-4 rounded-2xl border ${tint} bg-gradient-to-br to-white shadow-2xs flex flex-col justify-between animate-pulse`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 w-28 rounded bg-[#E8E8E4]/80" />
                  <div className="h-5 w-16 rounded bg-[#E8E8E4]/70" />
                </div>
                <div className="flex items-baseline justify-between gap-2 my-1">
                  <div className="h-8 w-20 rounded-lg bg-[#E8E8E4]/90" />
                  <div className="h-5 w-24 rounded-full bg-[#E8E8E4]/70" />
                </div>
                <div className="mt-2 pt-2 border-t border-[#F0F0EC]">
                  <div className="h-3 w-44 rounded bg-[#E8E8E4]/70" />
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Card 1: Total AI Generates (Yellow Tint) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded-2xl border border-[#FDE68A] bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF5] to-white shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A15C00]">
                    Total AI Generates
                  </span>
                  <MiniSparkline color="#D97706" data={sparkGenerates} />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl sm:text-[28px] font-display font-black text-[#141412] tracking-tight">
                    <AnimatedCounter value={kpis.totalGenerates} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD84D] text-[#141412] shadow-2xs">
                    {kpis.totalClarifications > 0
                      ? `${kpis.initialGenerates} Awal + ${kpis.totalClarifications} Revisi`
                      : "Script AI"}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7A74] mt-2 pt-2 border-t border-[#F0F0EC]">
                  Total draf & klarifikasi AI yang diproses
                </p>
              </motion.div>

              {/* Card 2: Konselor Online (Emerald Tint) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.13, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded-2xl border border-[#BBF7D0] bg-gradient-to-br from-[#F0FDF4] via-[#F7FDF9] to-white shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F7A4D]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
                    </span>
                    Konselor Online
                  </span>
                  <MiniSparkline color="#1F7A4D" data={sparkAgents} />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl sm:text-[28px] font-display font-black text-[#141412] tracking-tight">
                    <AnimatedCounter value={kpis.acBmAgentsCount} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#1F7A4D] border border-[#86EFAC]/60">
                    {kpis.acBmAgentsCount > 0
                      ? `${kpis.acBmAgentsCount} AC/BM Online`
                      : "Konselor Aktif"}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7A74] mt-2 pt-2 border-t border-[#F0F0EC]">
                  {kpis.acBmAgentsCount > 0
                    ? `${statsData?.onlinePresence?.acBmActiveCount ?? kpis.acBmAgentsCount} aktif · ${statsData?.onlinePresence?.acBmIdleCount ?? 0} idle (AC & BM) saat ini`
                    : "Tidak ada konselor AC/BM yang online saat ini"}
                </p>
              </motion.div>

              {/* Card 3: Copy Utility Rate (Violet Tint) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded-2xl border border-[#E9D5FF] bg-gradient-to-br from-[#FAF5FF] via-[#FDFBFF] to-white shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7E22CE]">
                    Utility Rate
                  </span>
                  <MiniSparkline color="#9333EA" data={sparkUtility} />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl sm:text-[28px] font-display font-black text-[#141412] tracking-tight">
                    <AnimatedCounter value={kpis.copyRate} />%
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#D8B4FE]/60">
                    Efektivitas
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7A74] mt-2 pt-2 border-t border-[#F0F0EC]">
                  Penetrasi fitur ({kpis.utilityActiveUsers ?? 0} dari {kpis.utilityTotalUsers ?? 0} konselor memakai Pitch / Alumni / Comparison)
                </p>
              </motion.div>
            </>
          )}
        </section>

        {/* ========================================================= */}
        {/* 4. COMPACT & PROPORTIONAL AREA CHART                      */}
        {/* ========================================================= */}
        <ActivityAreaChart
          timeline={timeline}
          timeRange={timeRange}
          rawLeaderboard={rawLeaderboard}
          kpis={kpis}
          topTopics={topTopics}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
          chartMode={chartMode}
          onChartModeChange={setChartMode}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />

        {/* ========================================================= */}
        {/* 5. LEADERBOARD & HOURLY HEATMAP GRID                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEADERBOARD (7 cols) */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0F0EC]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D97706]" />
                  <h3 className="text-sm font-display font-black uppercase tracking-wider text-[#141412]">
                    Leaderboard Konselor Admisi
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative inline-flex p-0.5 rounded-lg bg-[#F5F5F2] border border-[#E8E8E4] text-[10.5px] font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => handleRoleFilterChange("all")}
                      className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${
                        roleFilter === "all"
                          ? "text-[#FFD84D]"
                          : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {roleFilter === "all" && (
                        <motion.span
                          layoutId="roleFilterActivePill"
                          className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      Semua ({rawLeaderboard.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleFilterChange("ac")}
                      className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${
                        roleFilter === "ac"
                          ? "text-[#FFD84D]"
                          : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {roleFilter === "ac" && (
                        <motion.span
                          layoutId="roleFilterActivePill"
                          className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      AC ({rawLeaderboard.filter((a) => a.userRole === "AC").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleFilterChange("bm")}
                      className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${
                        roleFilter === "bm"
                          ? "text-[#FFD84D]"
                          : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {roleFilter === "bm" && (
                        <motion.span
                          layoutId="roleFilterActivePill"
                          className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      BM ({rawLeaderboard.filter((a) => a.userRole === "BM").length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Filter Tabs (Semua Aktivitas / Create Pitch / Alumni Checker / Table Comparison) */}
              <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-bold overflow-x-auto max-w-full">
                {[
                  { id: "all", label: `Semua Aktivitas (${leaderboardActivityCounts.all})` },
                  { id: "pitch", label: `Create Pitch (${leaderboardActivityCounts.pitch})` },
                  { id: "alumni", label: `Alumni Checker (${leaderboardActivityCounts.alumni})` },
                  { id: "comparison", label: `Table Comparison (${leaderboardActivityCounts.comparison})` },
                ].map((seg) => {
                  const isSelected = chartMode === seg.id;
                  const segToken = getModeColorToken(seg.id);
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setChartMode(seg.id as any)}
                      className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer z-10 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                        isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="leaderboardActivityActivePill"
                          className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {seg.id !== "all" && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? segToken.darkDotClass : segToken.dotClass}`} />
                      )}
                      {seg.label}
                    </button>
                  );
                })}
              </div>

              {leaderboard.length === 0 ? (
                <div className="py-10 text-center text-xs space-y-2 text-[#7A7A74]">
                  <Users className="w-7 h-7 mx-auto opacity-30" />
                  <p>Belum ada data aktivitas konselor pada filter ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E8E4] text-[10px] font-mono text-[#7A7A74] uppercase">
                        <th className="pb-2 font-bold">Rank</th>
                        <th className="pb-2 font-bold">Konselor</th>
                        <th className="pb-2 font-bold text-center">Role</th>
                        <th className="pb-2 font-bold text-right">
                          {chartMode === "comparison" ? "Komparasi" : "Generates"}
                        </th>
                        <th className="pb-2 font-bold text-right">Copies</th>
                        <th className="pb-2 font-bold text-right">Total Aksi</th>
                        <th className="pb-2 font-bold text-right">Utility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F2]">
                      {leaderboard.map((agent, idx) => {
                        const isTop1 = idx === 0;
                        const isTop2 = idx === 1;
                        const isTop3 = idx === 2;
                        const isSelected = activeSelectedUser === agent.userName;
                        const toggleSelectUser = () =>
                          setSelectedUser((prev) => (prev === agent.userName ? "all" : agent.userName));

                        return (
                          <motion.tr
                            key={agent.userName}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.04 }}
                            onClick={toggleSelectUser}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleSelectUser();
                              }
                            }}
                            tabIndex={0}
                            aria-pressed={isSelected}
                            title={
                              isSelected
                                ? `Klik untuk membatalkan fokus pada ${agent.userName}`
                                : `Klik untuk fokus grafik & topik pada ${agent.userName}`
                            }
                            className={`cursor-pointer transition-colors focus:outline-none focus-visible:bg-[#FFF6D1]/60 ${isSelected
                              ? "bg-[#FFF6D1]/70 hover:bg-[#FFF6D1]"
                              : "hover:bg-[#FAFAF8]"
                              }`}
                          >
                            <td
                              className={`py-2.5 font-mono font-bold ${isSelected ? "pl-2 shadow-[inset_3px_0_0_#D97706]" : ""}`}
                            >
                              {isTop1 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FFD84D] text-[#141412] font-black text-[11px] shadow-2xs">
                                  🥇
                                </span>
                              ) : isTop2 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E8E8E4] text-[#141412] font-black text-[11px]">
                                  🥈
                                </span>
                              ) : isTop3 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FED7AA] text-[#C2410C] font-black text-[11px]">
                                  🥉
                                </span>
                              ) : (
                                <span className="inline-block w-5 text-center text-[#7A7A74]">
                                  #{idx + 1}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 font-bold text-[#141412]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span>{agent.userName}</span>
                                {isSelected && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-[#141412] text-[#FFD84D] font-bold px-1.5 py-0.5 rounded-md">
                                    Fokus ✕
                                  </span>
                                )}
                                {agent.isOnline && (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] font-bold px-1.5 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                                    Online
                                  </span>
                                )}
                                {isTop1 && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-[#FFF6D1] border border-[#FFD84D] text-[#141412] font-bold px-1.5 py-0.2 rounded-md">
                                    <Flame className="w-2.5 h-2.5 text-[#D97706]" />
                                    Teraktif
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 text-center">
                              <span
                                className={`inline-block font-mono text-[9px] font-black px-2 py-0.5 rounded-md ${getRoleColorToken(agent.userRole).badgeLightClass}`}
                              >
                                {agent.userRole || "AC"}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-mono font-black text-[#141412] tabular-numbers">
                              {agent.displayPrimaryMetric}
                            </td>
                            <td className="py-2.5 text-right font-mono text-[#4B4B46] tabular-numbers">
                              {agent.displayCopies}
                            </td>
                            <td className="py-2.5 text-right font-mono text-[#7A7A74] tabular-numbers">
                              {agent.displayTotalActions}
                            </td>
                            <td className="py-2.5 text-right font-mono font-bold text-[#1F7A4D] tabular-numbers">
                              {agent.copyRate}%
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-xl text-[11px] bg-[#FAFAF8] border border-[#E8E8E4] text-[#7A7A74] flex items-center justify-between">
              <span>
                {chartMode === "comparison"
                  ? "Total Komparasi dari seluruh konselor di atas:"
                  : "Total Generates dari seluruh konselor di atas:"}
              </span>
              <span className="font-mono font-bold text-[#141412]">
                {leaderboard.reduce((acc, a) => acc + (a.displayPrimaryMetric || 0), 0)}{" "}
                {chartMode === "comparison" ? "Komparasi" : "Generates"} ·{" "}
                {leaderboard.reduce((acc, a) => acc + (a.displayCopies || 0), 0)} Copies
              </span>
            </div>
          </motion.section>

          {/* HOURLY HEATMAP & PEAK CONSULTATION HOURS (5 cols) */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0F0EC]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0E62FE]" />
                  <h3 className="text-sm font-display font-black uppercase tracking-wider text-[#141412]">
                    Jam Sibuk Konsultasi (WIB)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isHourlyFilterable ? (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${getModeColorToken(chartMode).totalBadgeClass}`}>
                      {selectedUserData
                        ? `${selectedUserData.name} (${selectedUserData.role})`
                        : roleFilter === "ac"
                          ? "Tim AC"
                          : roleFilter === "bm"
                            ? "Tim BM"
                            : "AC & BM"}
                    </span>
                  ) : (
                    <span
                      className="text-[10px] font-mono font-bold text-[#4B4B46] bg-[#F5F5F2] px-2 py-0.5 rounded-md border border-[#E8E8E4]"
                      title="Distribusi per jam untuk rentang multi-hari dihitung secara global (seluruh konselor AC & BM)"
                    >
                      Global (AC & BM)
                    </span>
                  )}
                  <span className="text-[10.5px] font-mono font-bold text-[#141412] bg-[#F5F5F2] px-2 py-0.5 rounded-md border border-[#E8E8E4]">
                    Total: {totalHourlyInteractions} Aksi
                  </span>
                </div>
              </div>

              {/* Complete Bar Timeline (No Skipped Hours) */}
              <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                {displayHours.map((hour) => {
                  const val = hourlyHeatmap[hour] || 0;
                  const pct = Math.round((val / maxHourlyValue) * 100);
                  const isPeak = val > 0 && val === maxHourlyValue;
                  const hourLabel = `${String(hour).padStart(2, "0")}:00`;

                  return (
                    <div
                      key={hour}
                      title={`${hourLabel} WIB: ${val} Aksi${isPeak ? " (Jam Tersibuk)" : ""}`}
                      className="flex items-center gap-2 text-xs font-mono"
                    >
                      <span
                        className={`w-11 text-[10px] shrink-0 tabular-numbers px-1 py-0.5 rounded text-center ${
                          isPeak
                            ? "font-black text-[#141412] bg-[#FFD84D]"
                            : "font-medium text-[#7A7A74]"
                        }`}
                      >
                        {hourLabel}
                      </span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden relative bg-[#F5F5F2] border border-[#E8E8E4]/60">
                        <div
                          style={{ width: `${Math.max(pct, val > 0 ? 8 : 0)}%` }}
                          className={`heatmap-bar h-full rounded-full transition-all duration-500 ${
                            isPeak
                              ? "peak-pulse bg-[#FFD84D] border border-[#D97706] shadow-[0_0_10px_rgba(255,216,77,0.55)]"
                              : val > 0
                                ? "bg-[#141412]"
                                : "bg-transparent"
                          }`}
                        />
                      </div>
                      <span
                        className={`w-7 text-right text-[10px] tabular-numbers ${
                          isPeak ? "font-black text-[#A15C00]" : "font-bold text-[#141412]"
                        }`}
                      >
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-xl text-[11px] mt-3 flex items-center gap-2 bg-[#FAFAF8] border border-[#E8E8E4] text-[#7A7A74]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] border border-[#141412] shrink-0" />
              <span>
                {isHourlyFilterable
                  ? `Menampilkan jam aktif sesuai filter (${selectedUserData ? `${selectedUserData.name} (${selectedUserData.role})` : roleFilter === "ac" ? "Tim AC" : roleFilter === "bm" ? "Tim BM" : "AC & BM"}).`
                  : "Kartu Global: menampilkan agregat jam aktif seluruh konselor AC & BM pada rentang multi-hari."}
              </span>
            </div>
          </motion.section>
        </div>

        {/* ========================================================= */}
        {/* 6. FITUR PALING SERING DIGUNAKAN & TOP OBJECTIONS          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Fitur Paling Sering Digunakan (5 cols) */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EC]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#9333EA]" />
                  <h3 className="text-sm font-display font-black uppercase tracking-wider text-[#141412]">
                    Fitur Paling Sering Digunakan
                  </h3>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#4B4B46] bg-[#F5F5F2] px-2 py-0.5 rounded-md border border-[#E8E8E4]">
                  Total: {rawModeSum} Sesi
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-center">
                  <p className="text-[10px] font-mono uppercase text-[#7A7A74] font-bold">
                    Create Pitch
                  </p>
                  <p className="text-xl font-black text-[#141412] mt-1 tabular-numbers">
                    <AnimatedCounter value={modeDistribution.pitch || 0} />
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 font-mono ${getModeColorToken("pitch").lightTextClass}`}>
                    {pitchPct}%
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-center">
                  <p className="text-[10px] font-mono uppercase text-[#7A7A74] font-bold">
                    Alumni Story
                  </p>
                  <p className="text-xl font-black text-[#141412] mt-1 tabular-numbers">
                    <AnimatedCounter value={modeDistribution.alumni || 0} />
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 font-mono ${getModeColorToken("alumni").lightTextClass}`}>
                    {alumniPct}%
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-center">
                  <p className="text-[10px] font-mono uppercase text-[#7A7A74] font-bold">
                    Comparison
                  </p>
                  <p className="text-xl font-black text-[#141412] mt-1 tabular-numbers">
                    <AnimatedCounter value={modeDistribution.comparison || 0} />
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 font-mono ${getModeColorToken("comparison").lightTextClass}`}>
                    {compPct}%
                  </p>
                </div>
              </div>
            </div>

            {/* Proportional Distribution Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2 rounded-full bg-[#F5F5F2] overflow-hidden flex border border-[#E8E8E4]/70">
                <div
                  style={{ width: `${pitchPct}%` }}
                  className={`${getModeColorToken("pitch").barBgClass} h-full transition-all duration-500`}
                  title={`Create Pitch: ${pitchPct}%`}
                />
                <div
                  style={{ width: `${alumniPct}%` }}
                  className={`${getModeColorToken("alumni").barBgClass} h-full transition-all duration-500`}
                  title={`Alumni Story: ${alumniPct}%`}
                />
                <div
                  style={{ width: `${compPct}%` }}
                  className={`${getModeColorToken("comparison").barBgClass} h-full transition-all duration-500`}
                  title={`Comparison: ${compPct}%`}
                />
              </div>
              <p className="text-[10.5px] text-[#7A7A74]">
                Murni menghitung sesi pemakaian fitur (tidak dihitung ganda saat klik salin script).
              </p>
            </div>
          </motion.section>

          {/* Top Objections & Pertanyaan Terbanyak (7 cols) */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EC]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#1F7A4D]" />
                  <h3 className="text-sm font-display font-black uppercase tracking-wider text-[#141412]">
                    {activeSelectedUser === "all"
                      ? chartMode === "comparison"
                        ? "Topik Table Comparison"
                        : chartMode === "alumni"
                          ? "Topik Alumni Checker"
                          : chartMode === "pitch"
                            ? "Top Objections & Create Pitch"
                            : "Top Objections & Topik Konsultasi Prospek"
                      : chartMode === "comparison"
                        ? `Topik Table Comparison (${activeSelectedUser})`
                        : chartMode === "alumni"
                          ? `Topik Alumni Checker (${activeSelectedUser})`
                          : chartMode === "pitch"
                            ? `Top Objections & Pitch (${activeSelectedUser})`
                            : `Top Objections & Topik (${activeSelectedUser})`}
                  </h3>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#4B4B46] bg-[#F5F5F2] px-2 py-0.5 rounded-md border border-[#E8E8E4]">
                  {totalTopicMentions} Konsultasi Terklasifikasi
                </span>
              </div>

              {activeUserTopics.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A7A74]">
                  {activeSelectedUser === "all"
                    ? "Belum ada data topik yang terdeteksi pada periode ini."
                    : `Belum ada data topik ${chartMode === "all" ? "" : chartMode} untuk ${activeSelectedUser} pada periode ini.`}
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 ${activeUserTopics.length > 2 ? "sm:grid-cols-2" : ""
                    } gap-2 pt-0.5`}
                >
                  {activeUserTopics.map((topic: any, i: number) => {
                    const pct =
                      totalTopicMentions > 0
                        ? Math.round((topic.count / totalTopicMentions) * 100)
                        : 0;
                    return (
                      <motion.button
                        type="button"
                        key={topic.name}
                        onClick={() => setHistoryTopic(topic.name)}
                        title="Klik untuk melihat riwayat generate topik ini"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -1.5 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="group relative overflow-hidden flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] hover:border-[#D9D9D4] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] focus-visible:border-[#141412] text-xs text-[#141412] transition-colors shadow-2xs text-left cursor-pointer"
                      >
                        <div
                          aria-hidden="true"
                          style={{ width: `${pct}%` }}
                          className="pointer-events-none absolute inset-y-0 left-0 bg-[#FFD84D]/20 group-hover:bg-[#FFD84D]/30 transition-all duration-500"
                        />
                        <div className="relative z-10 flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-bold text-[#5C5C56]">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-[#141412] truncate" title={topic.name}>
                            {topic.name}
                          </span>
                        </div>
                        <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-[10px] font-semibold text-[#5C5C56]">{pct}%</span>
                          <span className="font-mono text-[10.5px] bg-[#141412] text-[#FFD84D] px-1.5 py-0.5 rounded-md font-bold tabular-numbers">
                            {topic.count}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#4B4B46] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-200 shrink-0" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-[10.5px] text-[#7A7A74] pt-1">
              Diklasifikasikan otomatis dari konteks masalah prospek, keberatan harga/waktu, dan program yang dikonsultasikan. Klik topik untuk melihat hasil generate spesifik.
            </p>
          </motion.section>
        </div>
      </div>

      <OwnerHistoryDrawer
        open={historyTopic !== null}
        onClose={() => setHistoryTopic(null)}
        token={session?.token}
        topic={historyTopic}
        user={activeSelectedUser !== "all" ? activeSelectedUser : null}
      />

      {/* ========================================================= */}
      {/* 7. TOAST NOTIFICATION WITH DISMISS                         */}
      {/* ========================================================= */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className={`fixed left-1/2 bottom-6 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-xl border ${
              toast.type === "error"
                ? "bg-[#B42318] border-[#F87171]/40 text-white"
                : "bg-[#141412] border-[#2D2D2A] text-white"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#FFD84D] shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-black cursor-pointer ${
                toast.type === "error"
                  ? "bg-white text-[#B42318] hover:bg-white/90"
                  : "bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A]"
              }`}
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
