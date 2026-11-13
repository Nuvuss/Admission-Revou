"use client";

import React, { memo, useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, Sparkles, GraduationCap, Scale, Search, ChevronDown, Check, X, GitCompare, RefreshCw } from "lucide-react";
import { getModeColorToken, getRoleColorToken } from "../utils/analyticsColors";
import { cn } from "../../lib/cn";
import {
  EASE_OUT,
  EASE_IN_OUT,
  SPRING_PILL,
  TRANSITION_STAGGER,
  TRANSITION_POPOVER,
} from "../../lib/motion";

export type CompareDateOption = "none" | "yesterday" | "7d" | "30d";

export interface ActivityAreaChartProps {
  timeline: any[];
  timeRange: string;
  rawLeaderboard: any[];
  kpis: any;
  topTopics: any[];
  roleFilter?: "all" | "ac" | "bm";
  onRoleFilterChange?: (role: "all" | "ac" | "bm") => void;
  chartMode?: "all" | "pitch" | "alumni" | "comparison";
  onChartModeChange?: (mode: "all" | "pitch" | "alumni" | "comparison") => void;
  selectedUser?: string;
  onSelectUser?: (user: string) => void;
  compareDate?: CompareDateOption;
  onCompareDateChange?: (compare: CompareDateOption) => void;
  isLoading?: boolean;
}

// Snappy Animated Number Counter with Tabular Numerals (Emil Kowalski Philosophy)
function AnimatedCounter({ value, duration = 200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const prevValueRef = useRef(value || 0);

  useEffect(() => {
    const targetVal = Number.isFinite(value) ? value : 0;
    const startVal = prevValueRef.current;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (startVal === targetVal || prefersReduced) {
      setDisplayValue(targetVal);
      prevValueRef.current = targetVal;
      return;
    }

    let startTime: number | null = null;
    let frameId: number;

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

function ActivityAreaChartInner({
  timeline,
  timeRange,
  rawLeaderboard,
  kpis,
  topTopics,
  roleFilter = "all",
  onRoleFilterChange,
  chartMode = "all",
  onChartModeChange,
  selectedUser = "all",
  onSelectUser,
  compareDate = "none",
  onCompareDateChange,
  isLoading = false,
}: ActivityAreaChartProps) {
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const setChartMode = (m: "all" | "pitch" | "alumni" | "comparison") => {
    if (onChartModeChange) onChartModeChange(m);
  };

  const setRoleFilter = (r: "all" | "ac" | "bm") => {
    if (onRoleFilterChange) onRoleFilterChange(r);
  };

  const setSelectedUser = (u: string) => {
    if (onSelectUser) onSelectUser(u);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsComboboxOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsComboboxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Reset hovered point index when timeRange changes to avoid out-of-bounds guideline
  useEffect(() => {
    setHoveredPointIdx(null);
  }, [timeRange]);

  // Available counselors (AC and BM only)
  const allAvailableUsers = useMemo(() => {
    return (rawLeaderboard || [])
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
  }, [rawLeaderboard]);

  const availableUsers = useMemo(() => {
    if (roleFilter === "ac") return allAvailableUsers.filter((u) => u.role === "AC");
    if (roleFilter === "bm") return allAvailableUsers.filter((u) => u.role === "BM");
    return allAvailableUsers;
  }, [allAvailableUsers, roleFilter]);

  const filteredComboboxUsers = useMemo(() => {
    const q = userSearchQuery.trim().toLowerCase();
    if (!q) return availableUsers;
    return availableUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || String(u.role || "").toLowerCase().includes(q)
    );
  }, [availableUsers, userSearchQuery]);

  const totalAcBmEvents = useMemo(() => availableUsers.reduce((acc, u) => acc + (u.count || 0), 0), [availableUsers]);
  const totalAcBmPitch = useMemo(() => availableUsers.reduce((acc, u) => acc + (u.pitch || 0), 0), [availableUsers]);
  const totalAcBmAlumni = useMemo(() => availableUsers.reduce((acc, u) => acc + (u.alumni || 0), 0), [availableUsers]);
  const totalAcBmComp = useMemo(() => availableUsers.reduce((acc, u) => acc + (u.comparison || 0), 0), [availableUsers]);

  const activeSelectedUser = useMemo(() => {
    if (selectedUser === "all") return "all";
    return availableUsers.some((u) => u.name === selectedUser) ? selectedUser : "all";
  }, [selectedUser, availableUsers]);

  const selectedUserData = useMemo(() => {
    return activeSelectedUser !== "all" ? availableUsers.find((u) => u.name === activeSelectedUser) : null;
  }, [activeSelectedUser, availableUsers]);

  // Current values according to metric filter and user filter
  const currentModeValues = useMemo(() => {
    const key = chartMode === "all" ? "traffic" : chartMode;
    return (timeline || []).map((pt) => {
      if (activeSelectedUser !== "all") {
        return Number(pt.byUser?.[activeSelectedUser]?.[key] || 0);
      }
      if (roleFilter === "ac" || roleFilter === "bm") {
        return availableUsers.reduce((sum, u) => sum + Number(pt.byUser?.[u.name]?.[key] || 0), 0);
      }
      return Number(pt[key] || 0);
    });
  }, [timeline, chartMode, activeSelectedUser, roleFilter, availableUsers]);

  // Compare values according to metric filter, user filter, and selected compareDate
  const compareModeValues = useMemo(() => {
    if (!compareDate || compareDate === "none") return [];
    const key = chartMode === "all" ? "traffic" : chartMode;
    const compareKey =
      chartMode === "all"
        ? "compareTraffic"
        : `compare${chartMode.charAt(0).toUpperCase() + chartMode.slice(1)}`;
    return (timeline || []).map((pt) => {
      if (activeSelectedUser !== "all") {
        return Number(pt.compareByUser?.[activeSelectedUser]?.[key] || 0);
      }
      if (roleFilter === "ac" || roleFilter === "bm") {
        return availableUsers.reduce(
          (sum, u) => sum + Number(pt.compareByUser?.[u.name]?.[key] || 0),
          0
        );
      }
      return Number(pt[compareKey] ?? pt.compareTraffic ?? 0);
    });
  }, [timeline, chartMode, activeSelectedUser, roleFilter, availableUsers, compareDate]);

  const hasCompareData = useMemo(() => compareModeValues.some((v) => v > 0), [compareModeValues]);
  const totalCompareSum = useMemo(
    () => compareModeValues.reduce((acc, v) => acc + v, 0),
    [compareModeValues]
  );

  const maxChartVal = useMemo(() => {
    const maxCurr = Math.max(...currentModeValues, 0);
    const maxComp = compareModeValues.length > 0 ? Math.max(...compareModeValues, 0) : 0;
    return Math.max(maxCurr, maxComp, 1);
  }, [currentModeValues, compareModeValues]);

  const hasChartData = useMemo(() => currentModeValues.some((v) => v > 0), [currentModeValues]);
  const totalChartModeSum = useMemo(() => currentModeValues.reduce((acc, v) => acc + v, 0), [currentModeValues]);

  // Peak index
  const { peakIdx, peakVal } = useMemo(() => {
    let pIdx = 0;
    let pVal = 0;
    currentModeValues.forEach((val, i) => {
      if (val > pVal) {
        pVal = val;
        pIdx = i;
      }
    });
    return { peakIdx: pIdx, peakVal: pVal };
  }, [currentModeValues]);

  // Normalized SVG coordinates (viewBox 0 0 600 120)
  const svgW = 600;
  const svgH = 120;
  const padTop = 16;
  const padBottom = 8;
  const plotH = svgH - padTop - padBottom; // 96

  const pointsCoords = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return timeline.map((pt, i) => {
      const pctX = timeline.length > 1 ? i / (timeline.length - 1) : 0.5;
      const x = pctX * svgW;
      const val = currentModeValues[i] ?? 0;
      const rawPctY = hasChartData && maxChartVal > 0 ? val / maxChartVal : 0;
      const boundedPctY = Math.max(0, Math.min(1, rawPctY));
      const y = padTop + plotH * (1 - boundedPctY);
      return {
        x,
        y,
        pctX: pctX * 100,
        pctY: (y / svgH) * 100,
        val,
        label: pt.label,
        sublabel: pt.sublabel,
        key: pt.key,
        rawPt: pt,
      };
    });
  }, [timeline, currentModeValues, hasChartData, maxChartVal, plotH]);

  const comparePointsCoords = useMemo(() => {
    if (!timeline || timeline.length === 0 || !compareModeValues.length) return [];
    return timeline.map((pt, i) => {
      const pctX = timeline.length > 1 ? i / (timeline.length - 1) : 0.5;
      const x = pctX * svgW;
      const val = compareModeValues[i] ?? 0;
      const rawPctY = hasCompareData && maxChartVal > 0 ? val / maxChartVal : 0;
      const boundedPctY = Math.max(0, Math.min(1, rawPctY));
      const y = padTop + plotH * (1 - boundedPctY);
      return {
        x,
        y,
        pctX: pctX * 100,
        pctY: (y / svgH) * 100,
        val,
      };
    });
  }, [timeline, compareModeValues, hasCompareData, maxChartVal, plotH]);

  // Smooth Bezier curve (Primary)
  const { chartStrokePath, chartAreaPath } = useMemo(() => {
    if (pointsCoords.length === 0) {
      const emptyStroke = `M 0,${padTop + plotH} L ${svgW},${padTop + plotH}`;
      return { chartStrokePath: emptyStroke, chartAreaPath: `${emptyStroke} L ${svgW},${svgH} L 0,${svgH} Z` };
    }
    if (pointsCoords.length === 1) {
      const singleStroke = `M 0,${pointsCoords[0].y.toFixed(1)} L ${svgW},${pointsCoords[0].y.toFixed(1)}`;
      return { chartStrokePath: singleStroke, chartAreaPath: `${singleStroke} L ${svgW},${svgH} L 0,${svgH} Z` };
    }

    let stroke = `M ${pointsCoords[0].x.toFixed(1)},${pointsCoords[0].y.toFixed(1)}`;
    for (let i = 0; i < pointsCoords.length - 1; i++) {
      const curr = pointsCoords[i];
      const next = pointsCoords[i + 1];
      const cpX = curr.x + (next.x - curr.x) / 2;
      stroke += ` C ${cpX.toFixed(1)},${curr.y.toFixed(1)} ${cpX.toFixed(1)},${next.y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
    }
    return {
      chartStrokePath: stroke,
      chartAreaPath: `${stroke} L ${svgW},${svgH} L 0,${svgH} Z`,
    };
  }, [pointsCoords, plotH]);

  // Smooth Bezier curve (Comparison Baseline)
  const compareStrokePath = useMemo(() => {
    if (comparePointsCoords.length === 0) return "";
    if (comparePointsCoords.length === 1) {
      return `M 0,${comparePointsCoords[0].y.toFixed(1)} L ${svgW},${comparePointsCoords[0].y.toFixed(1)}`;
    }
    let stroke = `M ${comparePointsCoords[0].x.toFixed(1)},${comparePointsCoords[0].y.toFixed(1)}`;
    for (let i = 0; i < comparePointsCoords.length - 1; i++) {
      const curr = comparePointsCoords[i];
      const next = comparePointsCoords[i + 1];
      const cpX = curr.x + (next.x - curr.x) / 2;
      stroke += ` C ${cpX.toFixed(1)},${curr.y.toFixed(1)} ${cpX.toFixed(1)},${next.y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
    }
    return stroke;
  }, [comparePointsCoords]);

  const activePoint =
    hoveredPointIdx !== null && hoveredPointIdx >= 0 && hoveredPointIdx < pointsCoords.length
      ? pointsCoords[hoveredPointIdx]
      : null;

  const activeComparePoint =
    compareDate !== "none" &&
    hoveredPointIdx !== null &&
    hoveredPointIdx >= 0 &&
    hoveredPointIdx < comparePointsCoords.length
      ? comparePointsCoords[hoveredPointIdx]
      : null;

  const compareLabel =
    compareDate === "yesterday"
      ? "Kemarin"
      : compareDate === "7d"
        ? "7 Hari Lalu"
        : compareDate === "30d"
          ? "30 Hari Lalu"
          : "";

  const deltaPct = useMemo(() => {
    if (!activePoint || !activeComparePoint) return null;
    const curr = activePoint.val;
    const comp = activeComparePoint.val;
    if (comp === 0) {
      return curr > 0 ? 100 : 0;
    }
    return Math.round(((curr - comp) / comp) * 100);
  }, [activePoint, activeComparePoint]);

  // Sumbu Y ticks
  const yTicks = useMemo(() => {
    if (maxChartVal <= 1) return ["1", "0"];
    if (maxChartVal === 2) return ["2", "1", "0"];
    return [String(maxChartVal), String(Math.round(maxChartVal * 0.5)), "0"];
  }, [maxChartVal]);

  // Sumbu X ticks
  const xTicks = useMemo(() => {
    if (!timeline || !timeline.length) return [];
    if (timeRange === "today" || timeRange === "yesterday") {
      const targetHours = [0, 4, 8, 12, 16, 20, 23];
      return targetHours.map((h) => ({
        timelineIdx: h,
        label: `${String(h).padStart(2, "0")}:00`,
      }));
    }
    if (timeRange === "7d") {
      return timeline.map((pt, i) => ({
        timelineIdx: i,
        label: pt.sublabel ? `${pt.label} (${pt.sublabel})` : pt.label,
      }));
    }
    if (timeRange === "30d") {
      const indices = [0, 6, 12, 18, 24, timeline.length - 1];
      return indices.map((idx) => {
        const i = Math.min(idx, timeline.length - 1);
        return {
          timelineIdx: i,
          label: timeline[i]?.label || "",
        };
      });
    }
    // "all"
    if (timeline.length <= 7) {
      return timeline.map((pt, i) => ({
        timelineIdx: i,
        label: pt.label,
      }));
    }
    const step = Math.floor((timeline.length - 1) / 5);
    const indices = [0, step, step * 2, step * 3, step * 4, timeline.length - 1];
    return indices.map((i) => ({
      timelineIdx: i,
      label: timeline[i]?.label || "",
    }));
  }, [timeline, timeRange]);

  const handlePointerMove = (clientX: number, rect: DOMRect) => {
    if (!pointsCoords.length) return;
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = relX / rect.width;
    const nearestIdx = Math.min(
      pointsCoords.length - 1,
      Math.max(0, Math.round(ratio * (pointsCoords.length - 1)))
    );
    setHoveredPointIdx(nearestIdx);
  };

  const activeModeToken = getModeColorToken(chartMode);
  const pitchModeToken = getModeColorToken("pitch");
  const alumniModeToken = getModeColorToken("alumni");
  const comparisonModeToken = getModeColorToken("comparison");

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANSITION_STAGGER(5)}
      className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs flex flex-col justify-between"
    >
      {/* Chart Header & Metric Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm sm:text-base font-display font-black tracking-tight text-[#141412]">
              Trafik Konsultasi & Penggunaan Asisten
            </h2>
            {isLoading && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#8A8A84] px-1.5 py-0.5 rounded-md bg-[#F5F5F2] border border-[#E8E8E4]/70">
                <RefreshCw className="size-2.5 animate-spin text-[#A15C00]" />
                <span>Sinkron...</span>
              </span>
            )}
            <span className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-md ${activeModeToken.totalBadgeClass}`}>
              Total: <AnimatedCounter value={totalChartModeSum} duration={200} />{" "}
              {chartMode === "pitch"
                ? "Pitch"
                : chartMode === "alumni"
                  ? "Alumni"
                  : chartMode === "comparison"
                    ? "Komparasi"
                    : "Aktivitas"}
              {compareDate !== "none" && (
                <>
                  {" "}vs <AnimatedCounter value={totalCompareSum} duration={200} /> ({compareLabel})
                </>
              )}
              {selectedUserData
                ? ` · ${selectedUserData.name} (${selectedUserData.role})`
                : roleFilter === "ac"
                  ? " · Tim AC"
                  : roleFilter === "bm"
                    ? " · Tim BM"
                    : " · AC & BM"}
            </span>
          </div>
          <p className="text-xs text-[#7A7A74] mt-0.5">
            Tren {timeRange === "today" ? "per jam hari ini (WIB)" : timeRange === "yesterday" ? "per jam kemarin (WIB)" : timeRange === "7d" ? "7 hari terakhir" : timeRange === "30d" ? "30 hari terakhir" : "seluruh riwayat tanggal aktif"}
            {selectedUserData
              ? ` untuk konselor ${selectedUserData.name} (${selectedUserData.role})`
              : roleFilter === "ac"
                ? " seluruh konselor AC"
                : roleFilter === "bm"
                  ? " seluruh konselor BM"
                  : " seluruh konselor (AC & BM)"}
          </p>
        </div>

        {/* Segmented Activity Mode Toggle Control */}
        <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-bold self-start sm:self-auto overflow-x-auto scrollbar-none max-w-full">
          {[
            { id: "all", label: `Semua Aktivitas (${selectedUserData ? selectedUserData.count : totalAcBmEvents})` },
            { id: "pitch", label: `Create Pitch (${selectedUserData ? (selectedUserData.pitch ?? 0) : totalAcBmPitch})` },
            { id: "alumni", label: `Alumni Checker (${selectedUserData ? (selectedUserData.alumni ?? 0) : totalAcBmAlumni})` },
            { id: "comparison", label: `Table Comparison (${selectedUserData ? (selectedUserData.comparison ?? 0) : totalAcBmComp})` },
          ].map((seg) => {
            const isSelected = chartMode === seg.id;
            const segToken = getModeColorToken(seg.id);
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => setChartMode(seg.id as any)}
                className={`relative px-2.5 py-1 rounded-lg transition-all active:scale-95 duration-150 cursor-pointer z-10 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"}`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="chartMetricActivePill"
                    className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                    transition={SPRING_PILL}
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

      {/* Role Filter & Searchable Counselor Combobox Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 pb-2 mb-2 border-t border-[#F0F0EC]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A7A74]">
            <Users className="w-3.5 h-3.5 text-[#0E62FE]" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#4B4B46]">
              Filter Role:
            </span>
          </div>

          {/* Role Toggle: Semua --- AC --- BM */}
          <div className="relative inline-flex p-0.5 rounded-lg bg-[#F5F5F2] border border-[#E8E8E4] text-[10.5px] font-mono font-bold">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-all active:scale-95 duration-150 z-10 ${roleFilter === "all" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {roleFilter === "all" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={SPRING_PILL}
                />
              )}
              Semua ({allAvailableUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("ac")}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-all active:scale-95 duration-150 z-10 ${roleFilter === "ac" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {roleFilter === "ac" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={SPRING_PILL}
                />
              )}
              AC ({allAvailableUsers.filter((u) => u.role === "AC").length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("bm")}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-all active:scale-95 duration-150 z-10 ${roleFilter === "bm" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {roleFilter === "bm" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={SPRING_PILL}
                />
              )}
              BM ({allAvailableUsers.filter((u) => u.role === "BM").length})
            </button>
          </div>

          {/* Date Comparison Segmented Controls */}
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
            <div className="flex items-center gap-1 text-xs font-bold text-[#7A7A74]">
              <GitCompare className="w-3.5 h-3.5 text-[#A15C00]" />
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#4B4B46]">
                Bandingkan:
              </span>
            </div>
            <div
              role="group"
              aria-label="Komparasi tanggal grafik"
              className="relative inline-flex p-0.5 rounded-lg bg-[#F5F5F2] border border-[#E8E8E4] text-[10.5px] font-mono font-bold"
            >
              {[
                { id: "none", label: "Off" },
                { id: "yesterday", label: "Kemarin" },
                { id: "7d", label: "7 Hari" },
                { id: "30d", label: "30 Hari" },
              ].map((opt) => {
                const isActive = (compareDate || "none") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onCompareDateChange?.(opt.id as any)}
                    className={cn(
                      "relative px-2 py-0.5 rounded-md cursor-pointer transition-all active:scale-95 duration-150 z-10",
                      isActive ? "text-[#141412] font-black" : "text-[#7A7A74] hover:text-[#141412]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="chartCompareDateActivePill"
                        className="absolute inset-0 bg-[#FFD84D] rounded-md -z-10 shadow-xs"
                        transition={SPRING_PILL}
                      />
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Searchable Counselor Combobox / Dropdown */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto" ref={comboboxRef}>
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsComboboxOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isComboboxOpen}
              className="inline-flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-xl bg-[#F5F5F2] hover:bg-[#ECECE7] border border-[#E8E8E4] text-xs font-bold text-[#141412] transition-colors duration-150 cursor-pointer w-full sm:w-auto sm:min-w-[220px]"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <Users className="w-3.5 h-3.5 text-[#0E62FE] shrink-0" />
                {selectedUserData ? (
                  <>
                    <span className="truncate">{selectedUserData.name}</span>
                    <span
                      className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${getRoleColorToken(selectedUserData.role).badgeLightClass}`}
                    >
                      {selectedUserData.role}
                    </span>
                    <span className="font-mono text-[10px] text-[#7A7A74] shrink-0">
                      (
                      {chartMode === "all"
                        ? selectedUserData.count
                        : chartMode === "pitch"
                          ? selectedUserData.pitch || 0
                          : chartMode === "alumni"
                            ? selectedUserData.alumni || 0
                            : selectedUserData.comparison || 0}
                      )
                    </span>
                  </>
                ) : (
                  <>
                    <span className="truncate">
                      Semua {roleFilter === "ac" ? "Konselor AC" : roleFilter === "bm" ? "Konselor BM" : "Konselor"}
                    </span>
                    <span className="font-mono text-[10px] text-[#7A7A74] shrink-0">
                      (
                      {chartMode === "all"
                        ? totalAcBmEvents
                        : chartMode === "pitch"
                          ? totalAcBmPitch
                          : chartMode === "alumni"
                            ? totalAcBmAlumni
                            : totalAcBmComp}
                      )
                    </span>
                  </>
                )}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#7A7A74] shrink-0 transition-transform ${isComboboxOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isComboboxOpen && (
                <motion.div
                  role="listbox"
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: TRANSITION_POPOVER }}
                  exit={{ opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.15, ease: EASE_OUT } }}
                  style={{ transformOrigin: "top right" }}
                  className="absolute right-0 mt-1.5 w-full sm:w-72 max-w-[calc(100vw-2.5rem)] rounded-xl bg-white border border-[#E8E8E4] shadow-xl z-40 p-2 space-y-1.5"
                >
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#7A7A74] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Cari nama konselor..."
                    autoFocus
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#F5F5F2] border border-[#E8E8E4] text-xs text-[#141412] placeholder:text-[#7A7A74] focus:outline-none focus:border-[#141412]"
                  />
                  {userSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setUserSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] cursor-pointer"
                      aria-label="Hapus pencarian"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-[#F5F5F2]">
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeSelectedUser === "all"}
                    onClick={() => {
                      setSelectedUser("all");
                      setIsComboboxOpen(false);
                      setUserSearchQuery("");
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      activeSelectedUser === "all"
                        ? "bg-[#FFF6D1]/80 font-bold text-[#141412]"
                        : "hover:bg-[#FAFAF8] text-[#141412]"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#141412] shrink-0" />
                      <span className="truncate">
                        Semua {roleFilter === "ac" ? "Konselor AC" : roleFilter === "bm" ? "Konselor BM" : "Konselor (AC & BM)"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[10px] text-[#7A7A74]">
                        {chartMode === "all"
                          ? totalAcBmEvents
                          : chartMode === "pitch"
                            ? totalAcBmPitch
                            : chartMode === "alumni"
                              ? totalAcBmAlumni
                              : totalAcBmComp}
                      </span>
                      {activeSelectedUser === "all" && <Check className="w-3.5 h-3.5 text-[#A15C00]" />}
                    </span>
                  </button>

                  {filteredComboboxUsers.length === 0 ? (
                    <div className="py-4 text-center text-[11px] text-[#7A7A74]">
                      Konselor tidak ditemukan.
                    </div>
                  ) : (
                    filteredComboboxUsers.map((u) => {
                      const isSelected = activeSelectedUser === u.name;
                      const roleToken = getRoleColorToken(u.role);
                      const metricVal =
                        chartMode === "all"
                          ? u.count
                          : chartMode === "pitch"
                            ? u.pitch || 0
                            : chartMode === "alumni"
                              ? u.alumni || 0
                              : u.comparison || 0;
                      return (
                        <button
                          key={u.name}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedUser(u.name);
                            setIsComboboxOpen(false);
                            setUserSearchQuery("");
                          }}
                          className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#FFF6D1]/80 font-bold text-[#141412]"
                              : "hover:bg-[#FAFAF8] text-[#141412]"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleToken.dotClass}`} />
                            <span className="truncate">{u.name}</span>
                            <span
                              className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${roleToken.badgeLightClass}`}
                            >
                              {u.role}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[10px] text-[#7A7A74]">{metricVal}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#A15C00]" />}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {activeSelectedUser !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedUser("all")}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#A15C00] bg-[#FFF6D1] hover:bg-[#FFD84D] px-2.5 py-1.5 rounded-xl border border-[#FFD84D]/70 transition-colors cursor-pointer"
              title="Tampilkan Semua Konselor"
            >
              <span>✕ Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Plot Canvas Area with Pure Isolated Re-render */}
      <div className="w-full pt-1">
        <div className="flex items-stretch gap-2.5">
          {/* HTML Y-Axis Column */}
          <div className="w-7 flex flex-col justify-between text-right font-mono text-[10px] font-semibold text-[#7A7A74] py-1 select-none shrink-0">
            {yTicks.map((val, i) => (
              <span key={i} className="leading-none">
                {val}
              </span>
            ))}
          </div>

          {/* Plot Canvas */}
          <div
            className="flex-1 h-32 sm:h-36 relative border-b border-l border-[#E8E8E4] bg-[#FAFAF8]/50 rounded-tr-lg cursor-crosshair select-none"
            onMouseEnter={(e) => handlePointerMove(e.clientX, e.currentTarget.getBoundingClientRect())}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.currentTarget.getBoundingClientRect())}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
            }}
            onMouseLeave={() => setHoveredPointIdx(null)}
            onTouchEnd={() => setTimeout(() => setHoveredPointIdx(null), 3000)}
          >
            {/* Horizontal Dashed Reference Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2">
              <div className="border-b border-dashed border-[#E8E8E4]" />
              <div className="border-b border-dashed border-[#E8E8E4]" />
              <div />
            </div>

            {/* Proportional SVG Curve with Hardware-Accelerated Left-to-Right Reveal */}
            <motion.div
              key={`chart-layer-${timeRange}-${chartMode}-${roleFilter}-${selectedUser}-${timeline.length}`}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "w-full h-full absolute inset-0 pointer-events-none transition-opacity duration-200",
                isLoading && "opacity-40"
              )}
            >
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${svgW} ${svgH}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`whiteRevouChartGrad-${chartMode}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={activeModeToken.gradient} stopOpacity="0.42" />
                    <stop offset="100%" stopColor={activeModeToken.gradient} stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {chartAreaPath && (
                  <path
                    d={chartAreaPath}
                    fill={`url(#whiteRevouChartGrad-${chartMode})`}
                    className="chart-draw-area"
                  />
                )}

                {/* Comparison Baseline Curve (Dashed, High Contrast Neutral) */}
                {compareDate !== "none" && compareStrokePath && (
                  <path
                    d={compareStrokePath}
                    fill="none"
                    stroke="#8A8A84"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="chart-draw-line opacity-80"
                  />
                )}

                {/* Primary Active Curve (Solid) */}
                {chartStrokePath && (
                  <path
                    d={chartStrokePath}
                    fill="none"
                    stroke={activeModeToken.stroke}
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chart-draw-line"
                  />
                )}
              </svg>
            </motion.div>

            {/* Interactive Tooltip & Point Guideline */}
            <AnimatePresence>
              {activePoint && (hasChartData || hasCompareData) && (
                <motion.div
                  key="chart-hover-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }}
                  className="pointer-events-none"
                >
                  <div
                    className={`absolute top-0 bottom-0 w-px border-l border-dashed pointer-events-none z-10 ${activeModeToken.guideLineClass}`}
                    style={{ left: `${activePoint.pctX}%` }}
                  />

                  {/* Primary Curve Active Dot */}
                  <div
                    className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 shadow-md ${activeModeToken.activeDotClass}`}
                    style={{
                      left: `${activePoint.pctX}%`,
                      top: `${activePoint.pctY}%`,
                    }}
                  />

                  {/* Comparison Curve Active Dot */}
                  {compareDate !== "none" && activeComparePoint && (
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 bg-white border-2 border-[#8A8A84] shadow-xs"
                      style={{
                        left: `${activeComparePoint.pctX}%`,
                        top: `${activeComparePoint.pctY}%`,
                      }}
                    />
                  )}

                  <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                      left: `${Math.max(8, Math.min(92, activePoint.pctX))}%`,
                      top: `${activePoint.pctY}%`,
                      transform:
                        activePoint.pctY < 42
                          ? activePoint.pctX > 60
                            ? "translate(-100%, 14px)"
                            : activePoint.pctX < 40
                              ? "translate(0%, 14px)"
                              : "translate(-50%, 14px)"
                          : activePoint.pctX > 60
                            ? "translate(-100%, -108%)"
                            : activePoint.pctX < 40
                              ? "translate(0%, -108%)"
                              : "translate(-50%, -108%)",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        transformOrigin: activePoint.pctY < 42 ? "top center" : "bottom center",
                      }}
                      transition={TRANSITION_POPOVER}
                      className="p-2.5 rounded-xl bg-[#141412] text-white shadow-xl border border-white/10 min-w-[190px] sm:min-w-[210px] max-w-[calc(100vw-2.5rem)] sm:max-w-[290px]"
                    >
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#FFD84D]">
                      <Clock className="w-3 h-3 text-[#FFD84D] shrink-0" />
                      <span>
                        {timeRange === "today" || timeRange === "yesterday"
                          ? `Pukul ${activePoint.label} WIB`
                          : `${activePoint.label}${activePoint.sublabel ? ` (${activePoint.sublabel})` : ""}`}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-white">
                      {activePoint.val}{" "}
                      {chartMode === "pitch"
                        ? "Pitch"
                        : chartMode === "alumni"
                          ? "Alumni"
                          : chartMode === "comparison"
                            ? "Komparasi"
                            : "Aksi"}
                    </span>
                  </div>

                  {/* Comparison Baseline Row in Tooltip */}
                  {compareDate !== "none" && activeComparePoint && (
                    <div className="flex items-center justify-between gap-2 py-1 px-2 mb-1.5 rounded-lg bg-white/5 border border-white/10 text-[10.5px]">
                      <span className="text-white/70 flex items-center gap-1.5 font-mono">
                        <span className="w-2.5 h-0.5 border-t border-dashed border-[#8A8A84]" />
                        vs {compareLabel}:
                      </span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-[#E8E8E4]">{activeComparePoint.val}</span>
                        {deltaPct !== null && (
                          <span
                            className={cn(
                              "text-[9.5px] font-black px-1.5 py-0.2 rounded",
                              deltaPct > 0
                                ? "bg-[#1F7A4D]/40 text-[#4ADE80]"
                                : deltaPct < 0
                                  ? "bg-amber-900/40 text-amber-300"
                                  : "bg-white/10 text-white/60"
                            )}
                          >
                            {deltaPct > 0 ? `+${deltaPct}%` : `${deltaPct}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {/* Rincian Sesuai Filter Metrik Aktif */}
                    {chartMode === "all" ? (
                      <div className="flex items-center gap-2 text-[10px] text-white/80 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className={`w-2.5 h-2.5 ${pitchModeToken.darkIconClass}`} />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.pitch ?? 0) : (activePoint.rawPt?.pitch ?? 0))} Pitch
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className={`w-2.5 h-2.5 ${alumniModeToken.darkIconClass}`} />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.alumni ?? 0) : (activePoint.rawPt?.alumni ?? 0))} Alumni
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Scale className={`w-2.5 h-2.5 ${comparisonModeToken.darkIconClass}`} />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.comparison ?? 0) : (activePoint.rawPt?.comparison ?? 0))} Komparasi
                        </span>
                      </div>
                    ) : chartMode === "pitch" ? (
                      <div className={`flex items-center gap-1.5 text-[10px] font-medium ${pitchModeToken.darkTextClass}`}>
                        <Sparkles className={`w-3 h-3 shrink-0 ${pitchModeToken.darkIconClass}`} />
                        <span>{activePoint.val} aktivitas Create Pitch</span>
                      </div>
                    ) : chartMode === "alumni" ? (
                      <div className={`flex items-center gap-1.5 text-[10px] font-medium ${alumniModeToken.darkTextClass}`}>
                        <GraduationCap className={`w-3 h-3 shrink-0 ${alumniModeToken.darkIconClass}`} />
                        <span>{activePoint.val} aktivitas Alumni Checker</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-[10px] font-medium ${comparisonModeToken.darkTextClass}`}>
                        <Scale className={`w-3 h-3 shrink-0 ${comparisonModeToken.darkIconClass}`} />
                        <span>{activePoint.val} aktivitas Table Comparison</span>
                      </div>
                    )}

                    {/* Rincian Aktivitas Spesifik yang Dilakukan (Nama Konselor, Aksi, dan Topik) */}
                    {(() => {
                      const filteredActs = (activePoint.rawPt?.actions || []).filter((act: any) => {
                        if (act.role === "Owner") return false;
                        if (activeSelectedUser !== "all" && act.user !== activeSelectedUser) return false;
                        if (chartMode !== "all" && act.mode && act.mode !== chartMode) return false;
                        return true;
                      });

                      if (filteredActs.length > 0) {
                        return (
                          <div className="space-y-1 pt-1.5 border-t border-white/10 max-h-40 overflow-y-auto">
                            {filteredActs.slice(0, 4).map((act: any, idx: number) => {
                              const actModeToken = getModeColorToken(act.mode || "pitch");
                              return (
                                <div
                                  key={idx}
                                  className="text-[10px] leading-tight bg-white/5 p-1.5 rounded-lg flex items-start gap-1.5"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${actModeToken.darkDotClass}`}
                                  />
                                  <div className="truncate">
                                    <div className="text-white">
                                      <strong className="font-bold">{act.user}</strong>{" "}
                                      <span className="text-white/60">({act.role})</span> •{" "}
                                      <span className={`font-medium ${actModeToken.darkTextClass}`}>
                                        {act.actionLabel}
                                      </span>
                                    </div>
                                    {act.topic && (
                                      <div className="text-[9.5px] text-[#D4D4CE] truncate mt-0.5 font-mono">
                                        {act.topic}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      if (activePoint.val > 0) {
                        return (
                          <div className="text-[10px] text-white/70 pt-1 border-t border-white/10">
                            {activePoint.val} aktivitas {chartMode === "all" ? "" : chartMode} tercatat pada waktu ini.
                          </div>
                        );
                      }

                      return (
                        <p className="text-[10.5px] text-white/50 py-0.5 border-t border-white/10">
                          Tidak ada aktivitas{" "}
                          {chartMode === "pitch"
                            ? "Create Pitch"
                            : chartMode === "alumni"
                              ? "Alumni Checker"
                              : chartMode === "comparison"
                                ? "Table Comparison"
                                : "konsultasi"}{" "}
                          pada waktu ini.
                        </p>
                      );
                    })()}
                  </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            {!hasChartData && !hasCompareData && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-white/90 border border-[#E8E8E4] text-[#7A7A74] font-mono text-[11px]">
                  Belum ada aktivitas pada rentang waktu ini
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend when Date Comparison is Active */}
        {compareDate !== "none" && (
          <div className="flex items-center gap-4 pl-[38px] pt-2 pb-0.5 text-[10.5px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-[#141412] font-bold">
              <span className="w-3.5 h-0.5 rounded-full" style={{ backgroundColor: activeModeToken.stroke }} />
              Periode Aktif ({totalChartModeSum})
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#5C5C56] font-medium">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#8A8A84]" />
              {compareLabel} ({totalCompareSum})
            </span>
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="pl-[38px] pt-1.5 text-[10px] font-mono text-[#7A7A74] select-none">
          <div className="relative h-5 w-full">
            {xTicks.map((tick, idx) => {
              const isPeakLabel = hasChartData && peakVal > 0 && tick.timelineIdx === peakIdx;
              const leftPct =
                timeline && timeline.length > 1
                  ? (tick.timelineIdx / (timeline.length - 1)) * 100
                  : 50;
              const isFirst = leftPct <= 2;
              const isLast = leftPct >= 98;
              return (
                <span
                  key={idx}
                  style={{
                    left: `${leftPct}%`,
                    transform: isFirst
                      ? "translateX(0%)"
                      : isLast
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                  }}
                  className={`absolute top-0 whitespace-nowrap ${
                    isPeakLabel ? activeModeToken.peakTickClass : "font-medium"
                  }`}
                >
                  {tick.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom 3 Summary Sub-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 mt-3.5 border-t border-[#F0F0EC]">
        <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4]/70">
          <p className="text-[10px] font-mono uppercase text-[#7A7A74]">
            {selectedUserData
              ? `Respon AI (${selectedUserData.name.split(" ")[0]})`
              : "Waktu Respon AI Rata-Rata (AC & BM)"}
          </p>
          <p className="text-sm font-black text-[#141412] font-mono mt-0.5">
            {selectedUserData
              ? selectedUserData.avgResponseTimeSec !== null && selectedUserData.avgResponseTimeSec !== undefined
                ? `${selectedUserData.avgResponseTimeSec} detik`
                : "-"
              : kpis.avgResponseTimeSec !== null && kpis.avgResponseTimeSec !== undefined
                ? `${kpis.avgResponseTimeSec} detik`
                : "Menunggu pengukuran"}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4]/70">
          <p className="text-[10px] font-mono uppercase text-[#7A7A74]">
            {selectedUserData
              ? `Topik Utama (${selectedUserData.name.split(" ")[0]})`
              : "Topik Utama (Tim AC & BM)"}
          </p>
          <p
            className="text-sm font-black text-[#141412] font-mono mt-0.5 truncate"
            title={
              selectedUserData
                ? selectedUserData.topTopic
                  ? `${selectedUserData.topTopic.name} (${selectedUserData.topTopic.count}x)`
                  : `Belum ada data topik untuk ${selectedUserData.name}`
                : topTopics[0]
                  ? `${topTopics[0].name} (${topTopics[0].count}x) - Tim AC & BM`
                  : "Belum ada data topik"
            }
          >
            {selectedUserData
              ? selectedUserData.topTopic
                ? `${selectedUserData.topTopic.name} (${selectedUserData.topTopic.count})`
                : "-"
              : topTopics[0]
                ? `${topTopics[0].name} (${topTopics[0].count})`
                : "-"}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4]/70">
          <p className="text-[10px] font-mono uppercase text-[#7A7A74]">
            {selectedUserData
              ? `Interaksi (${selectedUserData.name.split(" ")[0]})`
              : "Total Interaksi Tercatat (AC & BM)"}
          </p>
          <p className="text-sm font-black text-[#1F7A4D] font-mono mt-0.5">
            {selectedUserData ? `${selectedUserData.count} aktivitas` : `${totalAcBmEvents} aktivitas`}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

const ActivityAreaChart = memo(ActivityAreaChartInner);
export default ActivityAreaChart;
