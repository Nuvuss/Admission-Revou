"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, startTransition } from "react";
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
  Radio,
  X,
  Activity,
} from "lucide-react";
import { UserSession } from "../types/auth";
import OwnerHistoryDrawer from "../components/OwnerHistoryDrawer";
import ActivityAreaChart from "../components/ActivityAreaChart";
import AnimatedCounter from "../components/AnimatedCounter";
import { usePresenceHeartbeat } from "../hooks/usePresenceHeartbeat";
import { cn } from "../../lib/cn";
import { getModeColorToken, getRoleColorToken } from "../utils/analyticsColors";
import {
  EASE_OUT,
  SPRING_PILL,
  SPRING_TOAST,
  TRANSITION_ENTER,
  TRANSITION_STAGGER,
} from "../../lib/motion";

// Polling interval for silent background stats refresh (6 seconds)
const STATS_POLL_INTERVAL_MS = 6000;

// Module-level flag so staggered entrance animations run only once after the first statsData arrives
let hasPlayedAnalyticsStagger = false;

// ========================================================
// 1. HELPER COMPONENTS
// ========================================================

// Data-Driven Subtle Mini Sparkline in KPI Card Corner
function MiniSparkline({
  color = "#D97706",
  data = [],
}: {
  color?: string;
  data?: number[];
}) {
  const values = data.length > 0 ? data : [0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...values, 1);
  const hasAny = values.some((v) => v > 0);
  const w = 58;
  const h = 18;

  const points = values
    .map((v, i) => {
      const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2;
      const y = hasAny ? h - 2 - (v / maxVal) * (h - 5) : h - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="w-[58px] h-[18px] overflow-visible opacity-75 shrink-0"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
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
  const [chartMode, setChartMode] = useState<"all" | "pitch" | "alumni" | "comparison" | "faq">("all");
  const [compareDate, setCompareDate] = useState<"none" | "yesterday" | "7d" | "30d">("none");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [historyTopic, setHistoryTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncingRange, setIsSyncingRange] = useState<boolean>(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeRangeRef = useRef(timeRange);
  timeRangeRef.current = timeRange;

  const compareDateRef = useRef(compareDate);
  compareDateRef.current = compareDate;

  const sessionRef = useRef<UserSession | null>(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Client-side in-memory cache keyed by `${range}_${compare}` to enable instant 0ms tab switches
  const clientCacheRef = useRef<Record<string, { data: any; timestamp: number }>>({});
  // Controller to abort in-flight requests on rapid tab changes
  const activeFetchControllerRef = useRef<AbortController | null>(null);
  // Flag to pause background polling while user-initiated tab transitions take place
  const isUserTransitioningRef = useRef<boolean>(false);

  const fetchStats = useCallback(
    async (
      range: string,
      silent = false,
      compare?: string,
      forceBust = false
    ): Promise<{ ok: boolean; error?: string }> => {
      // Safely abort previous in-flight request if a new active request comes in
      if (activeFetchControllerRef.current) {
        try {
          activeFetchControllerRef.current.abort("new_request");
        } catch (e) {}
        activeFetchControllerRef.current = null;
      }

      const controller = new AbortController();
      activeFetchControllerRef.current = controller;

      if (!silent) setIsLoading(true);
      if (!silent) setErrorMessage(null);
      const activeCompare = compare !== undefined ? compare : compareDateRef.current;
      const bustParam = forceBust ? `&force=1&_t=${Date.now()}` : "";

      try {
        const res = await fetch(`/api/analytics/stats?range=${range}&compare=${activeCompare}${bustParam}`, {
          cache: forceBust ? "no-store" : "default",
          signal: controller.signal,
          headers: forceBust
            ? {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
              }
            : undefined,
        });

        if (controller.signal.aborted) {
          return { ok: false, error: "aborted" };
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal mengambil data analitik.");
        }

        // Store into in-memory client cache
        const cacheKey = `${range}_${activeCompare}`;
        clientCacheRef.current[cacheKey] = {
          data,
          timestamp: Date.now(),
        };

        // Only update active screen if user is still on this range
        if (timeRangeRef.current === range && compareDateRef.current === activeCompare) {
          setStatsData(data);
        }
        return { ok: true };
      } catch (err: any) {
        if (
          err?.name === "AbortError" ||
          err?.message?.includes("abort") ||
          controller.signal.aborted
        ) {
          return { ok: false, error: "aborted" };
        }
        console.error("Fetch stats error:", err);
        const msg = err?.message || "Terjadi kesalahan saat memuat data analitik.";
        if (!silent) {
          setErrorMessage(msg);
        }
        return { ok: false, error: msg };
      } finally {
        if (activeFetchControllerRef.current === controller) {
          activeFetchControllerRef.current = null;
        }
        if (!silent) setIsLoading(false);
        setIsSyncingRange(false);
        isUserTransitioningRef.current = false;
      }
    },
    []
  );

  // Dedicated background prefetcher that does not abort active user requests or trigger spinners
  const prefetchRange = useCallback(async (targetRange: string, compareOption?: string) => {
    const activeCompare = compareOption !== undefined ? compareOption : compareDateRef.current;
    const cacheKey = `${targetRange}_${activeCompare}`;

    // Skip if already cached and fresh (< 2.5 minutes)
    const existing = clientCacheRef.current[cacheKey];
    if (existing && Date.now() - existing.timestamp < 150000) return;

    try {
      const res = await fetch(
        `/api/analytics/stats?range=${targetRange}&compare=${activeCompare}`,
        { cache: "default" }
      );
      if (!res.ok) return;
      const data = await res.json();
      clientCacheRef.current[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      // If user navigated to this tab while prefetch was in flight, apply it immediately
      if (timeRangeRef.current === targetRange && compareDateRef.current === activeCompare) {
        setStatsData(data);
        setIsLoading(false);
      }
    } catch (e) {
      // Silent failure for prefetching
    }
  }, []);

  // Heartbeat presence per tab saat Owner membuka dashboard analitik
  usePresenceHeartbeat({
    userName: session?.name,
    userRole: session?.role || "Owner",
    userEmail: session?.email,
    page: "analytics",
    silent: true,
  });

  const allowStaggerRef = useRef(!hasPlayedAnalyticsStagger);
  const hasFirstData = Boolean(statsData);
  const shouldPlayStagger = hasFirstData && allowStaggerRef.current;

  useEffect(() => {
    if (statsData) {
      hasPlayedAnalyticsStagger = true;
      allowStaggerRef.current = false;
    }
  }, [statsData]);

  // Check Owner Authorization & Fetch Initial Stats in Parallel on Mount
  useEffect(() => {
    let active = true;

    try {
      const cached = localStorage.getItem("revou_admission_user_session_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.name) setSession(parsed);
      }
    } catch (e) {}

    // proxy.ts already validates Owner session server-side; start fetching stats immediately
    fetchStats("30d", false, "none").then(async (res) => {
      if (res?.ok && active) {
        // Pre-warm remaining time ranges sequentially in the background (0ms tab switches)
        for (const r of ["7d", "today", "yesterday", "all"]) {
          if (!active) break;
          await prefetchRange(r, "none");
        }
      }
    });

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
  }, [router, fetchStats, prefetchRange]);

  // Real-Time Synchronization: Auto-Polling + Window Focus (melalui API server yang terotorisasi)
  useEffect(() => {
    if (!isAuthorized) return;

    // 1. Silent auto-polling every 6 seconds (paused if user is actively transitioning tabs)
    const intervalId = setInterval(() => {
      if (isUserTransitioningRef.current) return;
      fetchStats(timeRangeRef.current, true, compareDateRef.current, false);
    }, STATS_POLL_INTERVAL_MS);

    // 2. Refresh immediately when user focuses tab
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchStats(timeRangeRef.current, true, compareDateRef.current, false);
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [isAuthorized, fetchStats]);

  const handleRangeChange = useCallback(
    (range: string) => {
      timeRangeRef.current = range;
      isUserTransitioningRef.current = true;
      setIsSyncingRange(true);

      const cacheKey = `${range}_${compareDateRef.current}`;
      const cached = clientCacheRef.current[cacheKey];

      startTransition(() => {
        setTimeRange(range);
        if (cached) {
          setStatsData(cached.data);
          setIsLoading(false);
        }
      });

      // Revalidate in background: silent if cache already populated (zero-blank switch), blocking spinner only if cold
      fetchStats(range, Boolean(cached), compareDateRef.current, false);
    },
    [fetchStats]
  );

  const handleCompareDateChange = useCallback(
    (nextCompare: "none" | "yesterday" | "7d" | "30d") => {
      compareDateRef.current = nextCompare;
      isUserTransitioningRef.current = true;
      setIsSyncingRange(true);

      const cacheKey = `${timeRangeRef.current}_${nextCompare}`;
      const cached = clientCacheRef.current[cacheKey];

      startTransition(() => {
        setCompareDate(nextCompare);
        if (cached) {
          setStatsData(cached.data);
          setIsLoading(false);
        }
      });

      fetchStats(timeRangeRef.current, Boolean(cached), nextCompare, false);
    },
    [fetchStats]
  );

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

  const kpis = useMemo(
    () =>
      statsData?.kpis || {
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
      },
    [statsData?.kpis]
  );

  // Leaderboard murni untuk konselor (AC & BM) yang memiliki aktivitas (> 0). Owner hanya memantau.
  const rawLeaderboard: any[] = useMemo(
    () =>
      (statsData?.leaderboard || []).filter(
        (a: any) => (a.userRole === "AC" || a.userRole === "BM") && (a.totalActions || 0) > 0
      ),
    [statsData?.leaderboard]
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
    faq: roleFilteredLeaderboard.reduce(
      (acc, a) => acc + (a.byMode?.faq?.totalActions ?? a.faq ?? 0),
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
            : chartMode === "faq"
              ? agent.faq || 0
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

  const modeDistribution = statsData?.modeDistribution || { pitch: 0, alumni: 0, comparison: 0, faq: 0 };
  const rawModeSum =
    (modeDistribution.pitch || 0) +
    (modeDistribution.alumni || 0) +
    (modeDistribution.comparison || 0) +
    (modeDistribution.faq || 0);
  const pitchPct = rawModeSum > 0 ? Math.round(((modeDistribution.pitch || 0) / rawModeSum) * 100) : 0;
  const alumniPct = rawModeSum > 0 ? Math.round(((modeDistribution.alumni || 0) / rawModeSum) * 100) : 0;
  const compPct = rawModeSum > 0 ? Math.round(((modeDistribution.comparison || 0) / rawModeSum) * 100) : 0;
  const faqPct = rawModeSum > 0 ? Math.round(((modeDistribution.faq || 0) / rawModeSum) * 100) : 0;

  // ========================================================
  // COMPACT & PROPORTIONAL AREA CHART DATA PROCESSING
  // Activity graph is strictly for AC and BM counselors (Owner activity is excluded)
  // ========================================================
  const allAvailableUsers = useMemo(
    () =>
      rawLeaderboard
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
          faq: a.faq || 0,
          avgResponseTimeSec: a.avgResponseTimeSec,
          topTopic: a.topTopic,
        })),
    [rawLeaderboard]
  );

  const availableUsers = useMemo(
    () =>
      roleFilter === "ac"
        ? allAvailableUsers.filter((u) => u.role === "AC")
        : roleFilter === "bm"
          ? allAvailableUsers.filter((u) => u.role === "BM")
          : allAvailableUsers,
    [allAvailableUsers, roleFilter]
  );

  const handleRoleFilterChange = useCallback(
    (nextRole: "all" | "ac" | "bm") => {
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
    },
    [allAvailableUsers, selectedUser]
  );

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

  const topTopics: any[] = useMemo(() => statsData?.topTopics || [], [statsData?.topTopics]);

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
    if (chartMode === "faq") return t.name.startsWith("FAQ");
    if (chartMode === "pitch") return !t.name.startsWith("Komparasi") && !t.name.startsWith("Alumni") && !t.name.includes("Kisah Alumni") && !t.name.startsWith("FAQ");
    return true;
  });

  const totalTopicMentions = activeUserTopics.reduce((acc: number, t: any) => acc + (t.count || 0), 0);

  const timeline: any[] = useMemo(() => statsData?.timeline || [], [statsData?.timeline]);

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

  // Live Online Counselors (AC & BM) for Real-Time Live Floor Monitor
  const onlineCounselors: {
    userKey: string;
    userName: string;
    userRole: string;
    status: "active" | "idle";
    mode: string | null;
    sessionCount: number;
  }[] = useMemo(() => {
    const users = statsData?.onlinePresence?.users || [];
    return users.filter((u: any) => u.userRole === "AC" || u.userRole === "BM");
  }, [statsData?.onlinePresence?.users]);

  const peakTraffic = statsData?.peaks?.traffic || { maxVal: 0, peakLabel: "", peakIdx: 0 };

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

  // If unauthorized (placed after all React hooks to satisfy Rules of Hooks)
  if (isAuthorized === false) {
    return (
      <div className="min-h-dvh bg-white text-[#141412] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E8E4] rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#141412] text-balance">Akses Ditolak</h1>
            <p className="text-xs text-[#5C5C56] mt-1 text-pretty">
              Halaman Traffic & Usage Analytics khusus untuk <strong>Role Owner</strong> (Lead / Manager).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Link
              href="/login?redirect=/analytics"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#141412] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D2D2A] transition-colors duration-150"
            >
              Masuk Sebagai Owner
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#D9D9D4] bg-white text-[#141412] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F5F2] transition-colors duration-150"
            >
              Kembali ke Asisten
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const MODE_SHORT_LABEL: Record<string, string> = {
    pitch: "Pitch",
    alumni: "Alumni",
    comparison: "Komparasi",
    faq: "FAQ",
  };

  return (
    <div className="min-h-dvh bg-[#F6F6F3] text-[#141412] font-sans antialiased relative overflow-x-hidden selection:bg-[#FFF6D1] selection:text-[#141412]">
      <div className="max-w-[1180px] mx-auto px-3.5 sm:px-6 py-4 sm:py-6 relative z-10 space-y-4 sm:space-y-5">
        {/* ========================================================= */}
        {/* 1. EXECUTIVE COMMAND BAR (STICKY HEADER + LIVE SYNC RAIL) */}
        {/* ========================================================= */}
        <header className="sticky top-2.5 z-40 rounded-2xl bg-white/95 border border-[#E6E6E0] shadow-xs backdrop-blur-md overflow-hidden">
          {/* Non-blocking sync runner during time-range / compare switches (zero-blank switch) */}
          <div className="h-[2px] w-full bg-transparent overflow-hidden" aria-hidden="true">
            {(isSyncingRange || isManualRefreshing) && (
              <div className="h-full w-1/2 bg-[#FFD84D] dash-sync-runner" />
            )}
          </div>

          <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2.5">
            {/* Left: Brand & Owner Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Link
                href="/"
                className="dash-btn p-2 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] hover:bg-[#F2F2EE] hover:border-[#141412] text-[#141412] shrink-0"
                title="Kembali ke Asisten"
                aria-label="Kembali ke Asisten"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>

              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2.5 rounded-full bg-[#FFD84D] ring-2 ring-[#141412]/10 shrink-0" />
                <span className="font-display font-black text-sm sm:text-[15px] tracking-tight text-[#141412] truncate">
                  RevoU Analytics
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-[#141412] text-[#FFD84D] font-bold px-2 py-0.5 rounded-md shrink-0">
                  <Crown className="size-2.5" aria-hidden="true" />
                  <span>Owner</span>
                </span>
              </div>
            </div>

            {/* Right: Live Sync Status, Manual Refresh, New Script CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAFAF8] border border-[#E6E6E0] text-[11px] font-mono text-[#4B4B46]"
              >
                <span className="relative flex size-2 shrink-0" aria-hidden="true">
                  <span className="dash-live-ring absolute inline-flex h-full w-full rounded-full bg-[#16804A]" />
                  <span className="relative inline-flex rounded-full size-2 bg-[#16804A]" />
                </span>
                <Radio className="size-3 text-[#16804A] shrink-0 hidden sm:block" aria-hidden="true" />
                <span className="tabular-nums">
                  {isSyncingRange || isManualRefreshing
                    ? "Menyinkronkan..."
                    : statsData?.lastUpdatedWib
                      ? `Live ${statsData.lastUpdatedWib}`
                      : "Live aktif"}
                </span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setIsManualRefreshing(true);
                  const result = await fetchStats(timeRange, false, compareDateRef.current, true);
                  setIsManualRefreshing(false);
                  if (result.ok) {
                    showToast("Data analitik berhasil disinkronkan secara real-time", "success");
                  } else if (result.error !== "aborted") {
                    showToast(result.error || "Gagal menyinkronkan data analitik.", "error");
                  }
                }}
                disabled={isLoading || isManualRefreshing}
                className="dash-btn p-2 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] hover:bg-[#F2F2EE] hover:border-[#141412] text-[#141412] cursor-pointer disabled:opacity-50"
                title="Refresh Data Sekarang"
                aria-label="Refresh Data Sekarang"
              >
                <RefreshCw className={cn("size-3.5", (isLoading || isManualRefreshing) && "animate-spin")} aria-hidden="true" />
              </button>

              <Link
                href="/"
                className="dash-btn hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] text-xs font-bold tracking-tight"
              >
                <Zap className="size-3.5 fill-current" aria-hidden="true" />
                <span>Buat Script</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Database notice if needed */}
        {statsData && !statsData.isConfigured && (
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-[#D97706]" aria-hidden="true" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm text-[#92400E] text-pretty">
                {statsData.message || "Supabase Belum Dikonfigurasi atau Tabel Belum Dibuat"}
              </p>
              <p className="opacity-90 text-pretty">
                {statsData.details || "Jalankan skrip tabel di Supabase SQL Editor."}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchStats(timeRange, false, compareDateRef.current, true)}
              className="dash-btn px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. EXECUTIVE GREETING & GLOBAL FILTER BAR                 */}
        {/* ========================================================= */}
        <section className={cn("pt-0.5 space-y-3", shouldPlayStagger && "dash-enter")}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#141412] text-balance">
                Selamat datang kembali, {session?.name || "Lead Admisi"}
              </h1>
              <p className="text-xs sm:text-[13px] text-[#5A5A54] text-pretty">
                {kpis.totalEvents > 0
                  ? `${kpis.totalEvents} aktivitas konselor tercatat (${kpis.totalGenerates} generate AI, ${kpis.totalCopies} salin script, ${kpis.acBmAgentsCount} konselor online saat ini).`
                  : "Pantau kinerja tim admisi, distribusi fitur AI, dan konselor online secara real-time."}
              </p>
            </div>

            {activeSelectedUser !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedUser("all")}
                className="dash-btn self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141412] text-[#FFD84D] text-xs font-bold cursor-pointer"
                title={`Batalkan fokus pada ${activeSelectedUser}`}
              >
                <span>Fokus: {activeSelectedUser}</span>
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Global Filter Bar (Time Range + Role + Mode — GPU-composited CSS tabs) */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E6E6E0] flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-0.5 sm:pb-0">
              {/* Time Range Filter */}
              <div
                role="group"
                aria-label="Rentang waktu"
                className="inline-flex p-1 rounded-xl bg-[#F4F4F0] border border-[#E6E6E0] shrink-0"
              >
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
                      aria-pressed={isActive}
                      onClick={() => handleRangeChange(tab.id)}
                      className={cn(
                        "dash-tab px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer",
                        isActive
                          ? "bg-[#141412] text-white shadow-2xs"
                          : "text-[#5A5A54] hover:text-[#141412]"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Role Filter: Semua / AC / BM */}
              <div
                role="group"
                aria-label="Filter role konselor"
                className="inline-flex p-1 rounded-xl bg-[#F4F4F0] border border-[#E6E6E0] text-xs font-mono font-bold shrink-0"
              >
                {[
                  { id: "all", label: `Semua (${rawLeaderboard.length})` },
                  { id: "ac", label: `AC (${rawLeaderboard.filter((a) => a.userRole === "AC").length})` },
                  { id: "bm", label: `BM (${rawLeaderboard.filter((a) => a.userRole === "BM").length})` },
                ].map((r) => {
                  const isActive = roleFilter === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleRoleFilterChange(r.id as "all" | "ac" | "bm")}
                      className={cn(
                        "dash-tab px-2.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap shrink-0 tabular-nums",
                        isActive
                          ? "bg-[#141412] text-[#FFD84D] shadow-2xs"
                          : "text-[#5A5A54] hover:text-[#141412]"
                      )}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Filter: Semua / Pitch / Alumni / Comparison / FAQ */}
            <div
              role="group"
              aria-label="Filter mode aktivitas"
              className="inline-flex p-1 rounded-xl bg-[#F4F4F0] border border-[#E6E6E0] text-xs font-bold overflow-x-auto max-w-full shrink-0"
            >
              {[
                { id: "all", label: `Semua (${selectedUserData ? selectedUserData.count : leaderboardActivityCounts.all})` },
                { id: "pitch", label: `Pitch (${selectedUserData ? (selectedUserData.pitch ?? 0) : leaderboardActivityCounts.pitch})` },
                { id: "alumni", label: `Alumni (${selectedUserData ? (selectedUserData.alumni ?? 0) : leaderboardActivityCounts.alumni})` },
                { id: "comparison", label: `Komparasi (${selectedUserData ? (selectedUserData.comparison ?? 0) : leaderboardActivityCounts.comparison})` },
                { id: "faq", label: `FAQ (${selectedUserData ? (selectedUserData.faq ?? 0) : leaderboardActivityCounts.faq})` },
              ].map((seg) => {
                const isSelected = chartMode === seg.id;
                const segToken = getModeColorToken(seg.id);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setChartMode(seg.id as any)}
                    className={cn(
                      "dash-tab px-2.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 tabular-nums",
                      isSelected
                        ? "bg-[#141412] text-white shadow-2xs"
                        : "text-[#5A5A54] hover:text-[#141412]"
                    )}
                  >
                    {seg.id !== "all" && (
                      <span className={cn("size-1.5 rounded-full", isSelected ? segToken.darkDotClass : segToken.dotClass)} />
                    )}
                    {seg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. HERO SPLIT: EXECUTIVE TELEMETRY (8) + LIVE FLOOR (4)   */}
        {/* ========================================================= */}
        <section
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch",
            shouldPlayStagger && "dash-enter dash-enter-1"
          )}
        >
          {/* LEFT (8 cols): Unified Executive Telemetry Strip */}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E6E6E0] flex flex-col justify-between overflow-hidden min-h-[212px]">
            {isLoading && !statsData ? (
              <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EEEEE9] flex-1 motion-safe:animate-pulse">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <div className="h-3.5 w-24 rounded bg-[#E8E8E4]" />
                      <div className="h-[18px] w-[58px] rounded bg-[#E8E8E4]/70" />
                    </div>
                    <div className="h-9 w-20 rounded-lg bg-[#E8E8E4]" />
                    <div className="h-3.5 w-36 rounded bg-[#E8E8E4]/70" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EEEEE9] flex-1">
                  {/* Metric 1: Total AI Generates */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A54]">
                        <Sparkles className="size-3.5 text-[#D97706]" aria-hidden="true" />
                        Total AI Generates
                      </span>
                      <MiniSparkline color="#D97706" data={sparkGenerates} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-3xl sm:text-[34px] font-display font-black text-[#141412] tracking-tight leading-none tabular-nums">
                        <AnimatedCounter value={kpis.totalGenerates} />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#FFF6D1] text-[#8F5000] border border-[#FFD84D]/70 tabular-nums">
                        {kpis.totalClarifications > 0
                          ? `${kpis.initialGenerates} Awal · ${kpis.totalClarifications} Revisi`
                          : "Draf Script AI"}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#5A5A54] leading-snug">
                      Total draf awal & revisi yang diproses
                    </p>
                  </div>

                  {/* Metric 2: Feature Utility Rate */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A54]">
                        <Layers className="size-3.5 text-[#141412]" aria-hidden="true" />
                        Feature Utility Rate
                      </span>
                      <MiniSparkline color="#4B4B46" data={sparkUtility} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-3xl sm:text-[34px] font-display font-black text-[#141412] tracking-tight leading-none tabular-nums">
                        <AnimatedCounter value={kpis.copyRate} />%
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#F4F4F0] text-[#4B4B46] border border-[#E6E6E0]">
                        Penetrasi 4 Fitur
                      </div>
                    </div>

                    <p
                      className="text-[11px] text-[#5A5A54] leading-snug truncate"
                      title={`${kpis.utilityActiveUsers ?? 0} dari ${kpis.utilityTotalUsers ?? 0} konselor aktif memakai Pitch, Alumni, Komparasi, atau FAQ`}
                    >
                      {kpis.utilityActiveUsers ?? 0} dari {kpis.utilityTotalUsers ?? 0} konselor pakai Pitch/Alumni/Tabel/FAQ
                    </p>
                  </div>

                  {/* Metric 3: Peak Activity */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A54]">
                        <TrendingUp className="size-3.5 text-[#16804A]" aria-hidden="true" />
                        Puncak Aktivitas
                      </span>
                      <MiniSparkline color="#16804A" data={sparkAgents} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-2xl sm:text-[26px] font-display font-black text-[#141412] tracking-tight leading-tight tabular-nums truncate" title={peakTraffic.peakLabel || "Belum ada puncak"}>
                        {peakTraffic.maxVal > 0 ? peakTraffic.peakLabel : "—"}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#E9F7EF] text-[#16804A] border border-[#B7E4C7] tabular-nums">
                        <Flame className="size-3" aria-hidden="true" />
                        <span>{peakTraffic.maxVal > 0 ? `${peakTraffic.maxVal} aksi tertinggi` : "Belum ada data"}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#5A5A54] leading-snug">
                      {timeRange === "today" || timeRange === "yesterday"
                        ? "Jam paling ramai (WIB)"
                        : "Hari tersibuk pada rentang aktif"}
                    </p>
                  </div>
                </div>

                {/* Compact Executive Telemetry Sub-Strip */}
                <div className="px-4 sm:px-5 py-2.5 bg-[#FAFAF8] border-t border-[#EEEEE9] flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[11px] text-[#5A5A54]">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Activity className="size-3.5 text-[#141412]" aria-hidden="true" />
                      Total Aksi: <strong className="font-mono text-[#141412] tabular-nums">{kpis.totalEvents}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Copy className="size-3.5 text-[#5A5A54]" aria-hidden="true" />
                      Script Disalin: <strong className="font-mono text-[#141412] tabular-nums">{kpis.totalCopies}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Scale className="size-3.5 text-[#9333EA]" aria-hidden="true" />
                      Komparasi: <strong className="font-mono text-[#141412] tabular-nums">{kpis.totalComparisons}</strong>
                    </span>
                  </div>
                  <span className="font-mono text-[10.5px] text-[#6E6E68] tabular-nums">
                    Konselor aktif di periode: <strong className="text-[#141412]">{rawLeaderboard.length}</strong>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* RIGHT (4 cols): Dark Real-Time Live Floor Monitor (#141412) */}
          <aside
            aria-label="Live Floor Monitor Konselor Online"
            className="lg:col-span-4 rounded-2xl bg-[#141412] text-white border border-[#2A2A26] p-4 sm:p-5 flex flex-col justify-between min-h-[212px]"
          >
            <div className="space-y-3">
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
                    <span className="dash-live-ring absolute inline-flex h-full w-full rounded-full bg-[#FFD84D]" />
                    <span className="relative inline-flex rounded-full size-2.5 bg-[#FFD84D]" />
                  </span>
                  <h2 className="text-sm font-display font-bold tracking-tight text-white">
                    Live Floor
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFD84D] text-[#141412] font-mono text-[11px] font-black tabular-nums">
                  <Users className="size-3" aria-hidden="true" />
                  <AnimatedCounter value={kpis.acBmAgentsCount} /> Online
                </span>
              </div>

              {/* Active vs Idle Status Counters (Icon + Text, never color alone) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#C8C8C2]">
                    <CheckCircle2 className="size-3.5 text-[#4ADE80]" aria-hidden="true" />
                    Aktif
                  </span>
                  <span className="font-mono text-xs font-black text-white tabular-nums">
                    {statsData?.onlinePresence?.acBmActiveCount ?? 0}
                  </span>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#C8C8C2]">
                    <Clock className="size-3.5 text-[#FBBF24]" aria-hidden="true" />
                    Idle
                  </span>
                  <span className="font-mono text-xs font-black text-white tabular-nums">
                    {statsData?.onlinePresence?.acBmIdleCount ?? 0}
                  </span>
                </div>
              </div>

              {/* Live Online Counselor List */}
              {onlineCounselors.length === 0 ? (
                <div className="py-5 text-center space-y-1">
                  <p className="text-xs font-medium text-[#A8A8A0]">
                    Belum ada konselor AC/BM online saat ini.
                  </p>
                  <p className="text-[11px] text-[#7A7A72]">
                    Status diperbarui otomatis setiap 6 detik.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {onlineCounselors.map((u) => {
                    const isFocused = activeSelectedUser === u.userName;
                    const modeLabel = u.mode ? MODE_SHORT_LABEL[u.mode] || u.mode : null;
                    return (
                      <li key={u.userKey}>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser((prev) => (prev === u.userName ? "all" : u.userName))
                          }
                          className={cn(
                            "dash-btn w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-2 cursor-pointer border",
                            isFocused
                              ? "bg-[#FFD84D]/15 border-[#FFD84D]/60"
                              : "bg-white/[0.04] border-white/5 hover:bg-white/[0.08]"
                          )}
                          title={`Klik untuk fokus analitik pada ${u.userName}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {u.status === "active" ? (
                              <CheckCircle2 className="size-3.5 text-[#4ADE80] shrink-0" aria-label="Aktif" />
                            ) : (
                              <Clock className="size-3.5 text-[#FBBF24] shrink-0" aria-label="Idle" />
                            )}
                            <span className="text-xs font-semibold text-white truncate">
                              {u.userName}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-[#E6E6E0] shrink-0">
                              {u.userRole}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {modeLabel && (
                              <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-[#FFD84D]">
                                {modeLabel}
                              </span>
                            )}
                            <span
                              className={cn(
                                "text-[10px] font-mono font-bold",
                                u.status === "active" ? "text-[#4ADE80]" : "text-[#FBBF24]"
                              )}
                            >
                              {u.status === "active" ? "Aktif" : "Idle"}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between text-[10.5px] font-mono text-[#9A9A92]">
              <span>Monitoring AC & BM</span>
              <span>Auto-sync 6 dtk</span>
            </div>
          </aside>
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
          compareDate={compareDate}
          onCompareDateChange={handleCompareDateChange}
          isLoading={isLoading || isManualRefreshing}
          hasData={hasFirstData}
          animateEntrance={shouldPlayStagger}
        />

        {/* ========================================================= */}
        {/* 5. LEADERBOARD & HOURLY HEATMAP GRID                      */}
        {/* ========================================================= */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5",
            shouldPlayStagger && "dash-enter dash-enter-3"
          )}
        >
          {/* LEADERBOARD (7 cols) */}
          <section className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E6E0] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EEEEE9]">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-[#D97706]" aria-hidden="true" />
                  <h2 className="text-sm font-display font-bold tracking-tight text-[#141412] text-balance">
                    Leaderboard Konselor Admisi
                  </h2>
                </div>

                {/* Local Role Filter (kept per user preference, CSS-composited tabs) */}
                <div
                  role="group"
                  aria-label="Filter role leaderboard"
                  className="inline-flex p-0.5 rounded-lg bg-[#F4F4F0] border border-[#E6E6E0] text-[11px] font-mono font-bold"
                >
                  {[
                    { id: "all", label: `Semua (${rawLeaderboard.length})` },
                    { id: "ac", label: `AC (${rawLeaderboard.filter((a) => a.userRole === "AC").length})` },
                    { id: "bm", label: `BM (${rawLeaderboard.filter((a) => a.userRole === "BM").length})` },
                  ].map((r) => {
                    const isActive = roleFilter === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleRoleFilterChange(r.id as "all" | "ac" | "bm")}
                        className={cn(
                          "dash-tab px-2 py-0.5 rounded-md cursor-pointer tabular-nums",
                          isActive
                            ? "bg-[#141412] text-[#FFD84D] shadow-2xs"
                            : "text-[#5A5A54] hover:text-[#141412]"
                        )}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Local Activity Filter Tabs (kept per user preference, CSS-composited tabs) */}
              <div
                role="group"
                aria-label="Filter aktivitas leaderboard"
                className="inline-flex p-1 rounded-xl bg-[#F4F4F0] border border-[#E6E6E0] text-xs font-bold overflow-x-auto max-w-full"
              >
                {[
                  { id: "all", label: `Semua (${leaderboardActivityCounts.all})` },
                  { id: "pitch", label: `Create Pitch (${leaderboardActivityCounts.pitch})` },
                  { id: "alumni", label: `Alumni (${leaderboardActivityCounts.alumni})` },
                  { id: "comparison", label: `Komparasi (${leaderboardActivityCounts.comparison})` },
                  { id: "faq", label: `FAQ (${leaderboardActivityCounts.faq})` },
                ].map((seg) => {
                  const isSelected = chartMode === seg.id;
                  const segToken = getModeColorToken(seg.id);
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setChartMode(seg.id as any)}
                      className={cn(
                        "dash-tab px-2.5 py-1 rounded-lg cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 tabular-nums",
                        isSelected
                          ? "bg-[#141412] text-white shadow-2xs"
                          : "text-[#5A5A54] hover:text-[#141412]"
                      )}
                    >
                      {seg.id !== "all" && (
                        <span className={cn("size-1.5 rounded-full", isSelected ? segToken.darkDotClass : segToken.dotClass)} />
                      )}
                      {seg.label}
                    </button>
                  );
                })}
              </div>

              {isLoading && !statsData ? (
                <div aria-hidden="true" className="min-h-[210px] space-y-2.5 pt-1 motion-safe:animate-pulse">
                  {[0, 1, 2, 3, 4].map((rowIdx) => (
                    <div key={rowIdx} className="flex items-center justify-between py-2 border-b border-[#F4F4F0]">
                      <div className="flex items-center gap-3">
                        <div className="size-5 rounded-full bg-[#E8E8E4]" />
                        <div className="h-3.5 w-28 rounded bg-[#E8E8E4]" />
                        <div className="h-4 w-9 rounded bg-[#E8E8E4]/70" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-3.5 w-8 rounded bg-[#E8E8E4]/70" />
                        <div className="h-3.5 w-8 rounded bg-[#E8E8E4]/70" />
                        <div className="h-3.5 w-10 rounded bg-[#E8E8E4]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="min-h-[210px] flex flex-col items-center justify-center py-10 text-center text-xs space-y-2 text-[#5A5A54]">
                  <Users className="size-7 mx-auto opacity-30" aria-hidden="true" />
                  <p className="text-pretty">Belum ada data aktivitas konselor pada filter ini.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Rows (< 640px) — Zero forced horizontal scrolling */}
                  <div className="sm:hidden space-y-2">
                    {leaderboard.map((agent, idx) => {
                      const isTop1 = idx === 0;
                      const isSelected = activeSelectedUser === agent.userName;
                      const toggleSelectUser = () =>
                        setSelectedUser((prev) => (prev === agent.userName ? "all" : agent.userName));

                      return (
                        <button
                          key={agent.userName}
                          type="button"
                          onClick={toggleSelectUser}
                          className={cn(
                            "dash-btn w-full p-3 rounded-xl border text-left space-y-2 cursor-pointer",
                            isSelected
                              ? "bg-[#FFF6D1]/70 border-[#FFD84D]"
                              : "bg-[#FAFAF8] border-[#E6E6E0]"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={cn(
                                  "inline-flex items-center justify-center size-5 rounded-full font-mono text-[11px] font-black shrink-0",
                                  isTop1
                                    ? "bg-[#FFD84D] text-[#141412]"
                                    : "bg-white border border-[#E6E6E0] text-[#5A5A54]"
                                )}
                              >
                                {idx + 1}
                              </span>
                              <span className="font-bold text-xs text-[#141412] truncate">
                                {agent.userName}
                              </span>
                              {agent.isOnline && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#16804A] bg-[#E9F7EF] px-1.5 py-0.5 rounded shrink-0">
                                  <CheckCircle2 className="size-2.5" aria-hidden="true" />
                                  Online
                                </span>
                              )}
                            </div>
                            <span
                              className={cn(
                                "font-mono text-[10.5px] font-black px-2 py-0.5 rounded-md shrink-0",
                                getRoleColorToken(agent.userRole).badgeLightClass
                              )}
                            >
                              {agent.userRole || "AC"}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-[#EEEEE9] text-[11px] font-mono">
                            <div>
                              <span className="text-[#6E6E68] block text-[10px]">
                                {chartMode === "comparison" ? "Komparasi" : "Generates"}
                              </span>
                              <strong className="text-[#141412] tabular-nums">{agent.displayPrimaryMetric}</strong>
                            </div>
                            <div>
                              <span className="text-[#6E6E68] block text-[10px]">Copies</span>
                              <strong className="text-[#4B4B46] tabular-nums">{agent.displayCopies}</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-[#6E6E68] block text-[10px]">Utility</span>
                              <strong className="text-[#16804A] tabular-nums">{agent.copyRate}%</strong>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E6E6E0] text-[11px] font-mono text-[#5A5A54]">
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
                      <tbody className="divide-y divide-[#F4F4F0]">
                        {leaderboard.map((agent, idx) => {
                          const isTop1 = idx === 0;
                          const isTop2 = idx === 1;
                          const isTop3 = idx === 2;
                          const isSelected = activeSelectedUser === agent.userName;
                          const toggleSelectUser = () =>
                            setSelectedUser((prev) => (prev === agent.userName ? "all" : agent.userName));

                          return (
                            <tr
                              key={agent.userName}
                              onClick={toggleSelectUser}
                              title={
                                isSelected
                                  ? `Klik untuk membatalkan fokus pada ${agent.userName}`
                                  : `Klik untuk fokus grafik & topik pada ${agent.userName}`
                              }
                              className={cn(
                                "cursor-pointer transition-colors duration-150",
                                isSelected
                                  ? "bg-[#FFF6D1]/70 hover:bg-[#FFF6D1]"
                                  : "hover:bg-[#FAFAF8]"
                              )}
                            >
                              <td
                                className={cn(
                                  "py-2.5 font-mono font-bold",
                                  isSelected && "pl-2 shadow-[inset_3px_0_0_#D97706]"
                                )}
                              >
                                {isTop1 ? (
                                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#FFD84D] text-[#141412] font-black text-[11px]">
                                    1
                                  </span>
                                ) : isTop2 ? (
                                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#F4F4F0] border border-[#E6E6E0] text-[#141412] font-black text-[11px]">
                                    2
                                  </span>
                                ) : isTop3 ? (
                                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#F4F4F0] border border-[#E6E6E0] text-[#5A5A54] font-bold text-[11px]">
                                    3
                                  </span>
                                ) : (
                                  <span className="inline-block w-5 text-center text-[#7A7A74] text-[11px] tabular-nums">
                                    #{idx + 1}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 font-bold text-[#141412]">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSelectUser();
                                    }}
                                    className="inline-flex items-center text-left font-bold text-[#141412] bg-transparent border-0 p-0 m-0 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141412]"
                                  >
                                    {agent.userName}
                                  </button>
                                  {agent.isOnline && (
                                    <span
                                      title="Sedang online"
                                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#16804A] bg-[#E9F7EF] px-1.5 py-0.5 rounded shrink-0"
                                    >
                                      <CheckCircle2 className="size-2.5" aria-hidden="true" />
                                      Online
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#141412] text-[#FFD84D] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                                      Fokus ×
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 text-center">
                                <span
                                  className={cn(
                                    "inline-block font-mono text-[11px] font-black px-2 py-0.5 rounded-md",
                                    getRoleColorToken(agent.userRole).badgeLightClass
                                  )}
                                >
                                  {agent.userRole || "AC"}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-black text-[#141412] tabular-nums">
                                {agent.displayPrimaryMetric}
                              </td>
                              <td className="py-2.5 text-right font-mono text-[#4B4B46] tabular-nums">
                                {agent.displayCopies}
                              </td>
                              <td className="py-2.5 text-right font-mono text-[#5A5A54] tabular-nums">
                                {agent.displayTotalActions}
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-[#16804A] tabular-nums">
                                {agent.copyRate}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="p-2.5 rounded-xl text-[11px] bg-[#FAFAF8] border border-[#E6E6E0] text-[#5A5A54] flex flex-wrap items-center justify-between gap-2">
              <span>
                {chartMode === "comparison"
                  ? "Total komparasi konselor pada filter ini:"
                  : "Total generates konselor pada filter ini:"}
              </span>
              <span className="font-mono font-bold text-[#141412] tabular-nums">
                {leaderboard.reduce((acc, a) => acc + (a.displayPrimaryMetric || 0), 0)}{" "}
                {chartMode === "comparison" ? "Komparasi" : "Generates"} ·{" "}
                {leaderboard.reduce((acc, a) => acc + (a.displayCopies || 0), 0)} Copies
              </span>
            </div>
          </section>

          {/* HOURLY HEATMAP & PEAK CONSULTATION HOURS (5 cols) */}
          <section className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E6E0] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EEEEE9]">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#0E62FE]" aria-hidden="true" />
                  <h2 className="text-sm font-display font-bold tracking-tight text-[#141412] text-balance">
                    Jam Sibuk Konsultasi (WIB)
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isHourlyFilterable ? (
                    <span className={cn("text-[11px] font-mono font-bold px-2 py-0.5 rounded-md", getModeColorToken(chartMode).totalBadgeClass)}>
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
                      className="text-[11px] font-mono font-bold text-[#4B4B46] bg-[#F4F4F0] px-2 py-0.5 rounded-md border border-[#E6E6E0]"
                      title="Distribusi per jam untuk rentang multi-hari dihitung secara global (seluruh konselor AC & BM)"
                    >
                      Global AC & BM
                    </span>
                  )}
                  <span className="text-[11px] font-mono font-bold text-[#141412] bg-[#F4F4F0] px-2 py-0.5 rounded-md border border-[#E6E6E0] tabular-nums">
                    {totalHourlyInteractions} Aksi
                  </span>
                </div>
              </div>

              {/* Complete Bar Timeline (Compositor-only scaleX via dash-bar-fill) */}
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
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
                        className={cn(
                          "w-12 text-[11px] shrink-0 tabular-nums px-1 py-0.5 rounded text-center inline-flex items-center justify-center gap-0.5",
                          isPeak
                            ? "font-black text-[#141412] bg-[#FFD84D]"
                            : "font-medium text-[#5A5A54]"
                        )}
                      >
                        {isPeak && <Flame className="size-2.5 shrink-0" aria-hidden="true" />}
                        {hourLabel}
                      </span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden relative bg-[#F4F4F0] border border-[#E6E6E0]/70">
                        <div
                          style={{ transform: `scaleX(${Math.max(pct, val > 0 ? 8 : 0) / 100})` }}
                          className={cn(
                            "dash-bar-fill w-full h-full rounded-full",
                            isPeak
                              ? "bg-[#FFD84D]"
                              : val > 0
                                ? "bg-[#141412]"
                                : "bg-transparent"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "w-7 text-right text-[11px] tabular-nums",
                          isPeak ? "font-black text-[#8F5000]" : "font-bold text-[#141412]"
                        )}
                      >
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-xl text-[11px] mt-3 flex items-center gap-2 bg-[#FAFAF8] border border-[#E6E6E0] text-[#5A5A54]">
              <Flame className="size-3.5 text-[#D97706] shrink-0" aria-hidden="true" />
              <span>
                {isHourlyFilterable
                  ? `Menampilkan jam aktif sesuai filter (${selectedUserData ? `${selectedUserData.name} (${selectedUserData.role})` : roleFilter === "ac" ? "Tim AC" : roleFilter === "bm" ? "Tim BM" : "AC & BM"}).`
                  : "Agregat jam aktif seluruh konselor AC & BM pada rentang multi-hari."}
              </span>
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* 6. DISTRIBUSI 4 FITUR & TOP OBJECTIONS                    */}
        {/* ========================================================= */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5",
            shouldPlayStagger && "dash-enter dash-enter-4"
          )}
        >
          {/* Distribusi Fitur (5 cols) */}
          <section className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E6E0] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEE9]">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-[#9333EA]" aria-hidden="true" />
                  <h2 className="text-sm font-display font-bold tracking-tight text-[#141412] text-balance">
                    Fitur Paling Sering Digunakan
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#4B4B46] bg-[#F4F4F0] px-2 py-0.5 rounded-md border border-[#E6E6E0] tabular-nums">
                  {rawModeSum} Sesi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "pitch", title: "Create Pitch", value: modeDistribution.pitch || 0, pct: pitchPct },
                  { id: "alumni", title: "Alumni Story", value: modeDistribution.alumni || 0, pct: alumniPct },
                  { id: "comparison", title: "Comparison", value: modeDistribution.comparison || 0, pct: compPct },
                  { id: "faq", title: "FAQ", value: modeDistribution.faq || 0, pct: faqPct },
                ].map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] text-center">
                    <p className="text-[11px] font-medium text-[#5A5A54] truncate" title={m.title}>
                      {m.title}
                    </p>
                    <p className="text-lg sm:text-xl font-display font-black text-[#141412] mt-0.5 tabular-nums">
                      <AnimatedCounter value={m.value} />
                    </p>
                    <p className={cn("text-[11px] font-bold mt-0.5 font-mono tabular-nums", getModeColorToken(m.id).lightTextClass)}>
                      {m.pct}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proportional Distribution Bar (Compositor-only scaleX) */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 rounded-full bg-[#F4F4F0] overflow-hidden relative border border-[#E6E6E0]/70">
                <div
                  style={{ transform: `scaleX(${Math.min(1, (pitchPct + alumniPct + compPct + faqPct) / 100)})` }}
                  className={cn(getModeColorToken("faq").barBgClass, "dash-bar-fill absolute inset-0 z-[5]")}
                  title={`FAQ: ${faqPct}%`}
                />
                <div
                  style={{ transform: `scaleX(${Math.min(1, (pitchPct + alumniPct + compPct) / 100)})` }}
                  className={cn(getModeColorToken("comparison").barBgClass, "dash-bar-fill absolute inset-0 z-10")}
                  title={`Comparison: ${compPct}%`}
                />
                <div
                  style={{ transform: `scaleX(${Math.min(1, (pitchPct + alumniPct) / 100)})` }}
                  className={cn(getModeColorToken("alumni").barBgClass, "dash-bar-fill absolute inset-0 z-20")}
                  title={`Alumni Story: ${alumniPct}%`}
                />
                <div
                  style={{ transform: `scaleX(${Math.min(1, pitchPct / 100)})` }}
                  className={cn(getModeColorToken("pitch").barBgClass, "dash-bar-fill absolute inset-0 z-30")}
                  title={`Create Pitch: ${pitchPct}%`}
                />
              </div>
              <p className="text-[11px] text-[#5A5A54] text-pretty">
                Murni menghitung sesi pemakaian fitur (tidak dihitung ganda saat salin script).
              </p>
            </div>
          </section>

          {/* Top Objections & Pertanyaan Terbanyak (7 cols) */}
          <section className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E6E0] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EEEEE9]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-[#16804A]" aria-hidden="true" />
                  <h2 className="text-sm font-display font-bold tracking-tight text-[#141412] text-balance">
                    {activeSelectedUser === "all"
                      ? chartMode === "comparison"
                        ? "Topik Table Comparison"
                        : chartMode === "alumni"
                          ? "Topik Alumni Checker"
                          : chartMode === "faq"
                            ? "Topik FAQ Admission"
                            : chartMode === "pitch"
                              ? "Top Objections & Create Pitch"
                              : "Top Objections & Topik Prospek"
                      : chartMode === "comparison"
                        ? `Topik Table Comparison (${activeSelectedUser})`
                        : chartMode === "alumni"
                          ? `Topik Alumni Checker (${activeSelectedUser})`
                          : chartMode === "faq"
                            ? `Topik FAQ Admission (${activeSelectedUser})`
                            : chartMode === "pitch"
                              ? `Top Objections & Pitch (${activeSelectedUser})`
                              : `Top Objections & Topik (${activeSelectedUser})`}
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#4B4B46] bg-[#F4F4F0] px-2 py-0.5 rounded-md border border-[#E6E6E0] tabular-nums">
                  {totalTopicMentions} Terklasifikasi
                </span>
              </div>

              {isLoading && !statsData ? (
                <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 motion-safe:animate-pulse">
                  {[0, 1, 2, 3, 4, 5].map((skIdx) => (
                    <div
                      key={skIdx}
                      className="h-[42px] px-3 py-2.5 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] flex items-center justify-between gap-2"
                    >
                      <div className="h-3.5 w-32 rounded bg-[#E8E8E4]" />
                      <div className="h-4 w-12 rounded bg-[#E8E8E4]/70" />
                    </div>
                  ))}
                </div>
              ) : activeUserTopics.length === 0 ? (
                <div className="min-h-[142px] flex items-center justify-center py-8 text-center text-xs text-[#5A5A54]">
                  {activeSelectedUser === "all"
                    ? "Belum ada data topik yang terdeteksi pada periode ini."
                    : `Belum ada data topik ${chartMode === "all" ? "" : chartMode} untuk ${activeSelectedUser} pada periode ini.`}
                </div>
              ) : (
                <div
                  className={cn(
                    "grid grid-cols-1 gap-2 pt-0.5",
                    activeUserTopics.length > 2 && "sm:grid-cols-2"
                  )}
                >
                  {activeUserTopics.map((topic: any, i: number) => {
                    const pct =
                      totalTopicMentions > 0
                        ? Math.round((topic.count / totalTopicMentions) * 100)
                        : 0;
                    return (
                      <button
                        type="button"
                        key={topic.name}
                        onClick={() => setHistoryTopic(topic.name)}
                        title="Klik untuk melihat riwayat generate topik ini"
                        className="dash-btn group relative overflow-hidden flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] hover:border-[#D4D4CE] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] focus-visible:border-[#141412] text-xs text-[#141412] text-left cursor-pointer"
                      >
                        <div
                          aria-hidden="true"
                          style={{ transform: `scaleX(${pct / 100})` }}
                          className="dash-bar-fill pointer-events-none absolute inset-0 origin-left bg-[#FFD84D]/25 group-hover:bg-[#FFD84D]/35 transition-[transform,background-color]"
                        />
                        <div className="relative z-10 flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[11px] font-bold text-[#5A5A54] tabular-nums">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-[#141412] truncate" title={topic.name}>
                            {topic.name}
                          </span>
                        </div>
                        <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-[11px] font-bold text-[#141412] bg-white border border-[#E6E6E0] px-2 py-0.5 rounded-md tabular-nums">
                            {topic.count} <span className="font-medium text-[#5A5A54]">({pct}%)</span>
                          </span>
                          <ChevronRight className="size-3.5 text-[#7A7A74] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-[opacity,transform] duration-150 shrink-0" aria-hidden="true" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#5A5A54] pt-1 text-pretty">
              Klik salah satu topik untuk membuka riwayat hasil generate AI terkait.
            </p>
          </section>
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
            role={toast.type === "error" ? "alert" : "status"}
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={SPRING_TOAST}
            className={cn(
              "fixed left-1/2 bottom-6 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-xl border",
              toast.type === "error"
                ? "bg-[#B42318] border-[#F87171]/40 text-white"
                : "bg-[#141412] border-[#2D2D2A] text-white"
            )}
          >
            {toast.type === "error" ? (
              <AlertCircle aria-hidden="true" className="size-4 text-white shrink-0" />
            ) : (
              <CheckCircle2 aria-hidden="true" className="size-4 text-[#FFD84D] shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-black cursor-pointer",
                toast.type === "error"
                  ? "bg-white text-[#B42318] hover:bg-white/90"
                  : "bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A]"
              )}
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
