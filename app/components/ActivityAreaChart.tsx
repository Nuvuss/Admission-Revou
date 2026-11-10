"use client";

import React, { memo, useState, useMemo } from "react";
import { motion } from "motion/react";
import { Users, Clock, Sparkles, GraduationCap, Scale } from "lucide-react";

export interface ActivityAreaChartProps {
  timeline: any[];
  timeRange: string;
  rawLeaderboard: any[];
  kpis: any;
  topTopics: any[];
  chartMode?: "all" | "pitch" | "alumni" | "comparison";
  onChartModeChange?: (mode: "all" | "pitch" | "alumni" | "comparison") => void;
  selectedUser?: string;
  onSelectUser?: (user: string) => void;
}

function ActivityAreaChartInner({
  timeline,
  timeRange,
  rawLeaderboard,
  kpis,
  topTopics,
  chartMode: controlledChartMode,
  onChartModeChange,
  selectedUser: controlledSelectedUser,
  onSelectUser,
}: ActivityAreaChartProps) {
  const [internalChartMode, setInternalChartMode] = useState<"all" | "pitch" | "alumni" | "comparison">("all");
  const [chartRoleFilter, setChartRoleFilter] = useState<"all" | "ac" | "bm">("all");
  const [internalSelectedUser, setInternalSelectedUser] = useState<string>("all");
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  const chartMode = controlledChartMode !== undefined ? controlledChartMode : internalChartMode;
  const setChartMode = (m: "all" | "pitch" | "alumni" | "comparison") => {
    if (onChartModeChange) onChartModeChange(m);
    else setInternalChartMode(m);
  };

  const selectedUser = controlledSelectedUser !== undefined ? controlledSelectedUser : internalSelectedUser;
  const setSelectedUser = (u: string) => {
    if (onSelectUser) onSelectUser(u);
    else setInternalSelectedUser(u);
  };

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
    if (chartRoleFilter === "ac") return allAvailableUsers.filter((u) => u.role === "AC");
    if (chartRoleFilter === "bm") return allAvailableUsers.filter((u) => u.role === "BM");
    return allAvailableUsers;
  }, [allAvailableUsers, chartRoleFilter]);

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
      if (chartRoleFilter === "ac" || chartRoleFilter === "bm") {
        return availableUsers.reduce((sum, u) => sum + Number(pt.byUser?.[u.name]?.[key] || 0), 0);
      }
      return Number(pt[key] || 0);
    });
  }, [timeline, chartMode, activeSelectedUser, chartRoleFilter, availableUsers]);

  const maxChartVal = useMemo(() => Math.max(...currentModeValues, 1), [currentModeValues]);
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

  // Smooth Bezier curve
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

  const activePoint =
    hoveredPointIdx !== null && hoveredPointIdx >= 0 && hoveredPointIdx < pointsCoords.length
      ? pointsCoords[hoveredPointIdx]
      : null;

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E8E4] shadow-2xs flex flex-col justify-between card-interactive"
    >
      {/* Chart Header & Metric Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-display font-black tracking-tight text-[#141412]">
              Trafik Konsultasi & Penggunaan Asisten
            </h2>
            <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D]/60">
              Total: {totalChartModeSum}{" "}
              {chartMode === "pitch"
                ? "Pitch"
                : chartMode === "alumni"
                  ? "Alumni"
                  : chartMode === "comparison"
                    ? "Komparasi"
                    : "Aktivitas"}
              {selectedUserData
                ? ` · ${selectedUserData.name} (${selectedUserData.role})`
                : chartRoleFilter === "ac"
                  ? " · Tim AC"
                  : chartRoleFilter === "bm"
                    ? " · Tim BM"
                    : " · AC & BM"}
            </span>
          </div>
          <p className="text-xs text-[#7A7A74] mt-0.5">
            Tren {timeRange === "today" ? "per jam hari ini (WIB)" : timeRange === "yesterday" ? "per jam kemarin (WIB)" : timeRange === "7d" ? "7 hari terakhir" : timeRange === "30d" ? "30 hari terakhir" : "seluruh riwayat tanggal aktif"}
            {selectedUserData
              ? ` untuk konselor ${selectedUserData.name} (${selectedUserData.role})`
              : chartRoleFilter === "ac"
                ? " seluruh konselor AC"
                : chartRoleFilter === "bm"
                  ? " seluruh konselor BM"
                  : " seluruh konselor (AC & BM)"}
          </p>
        </div>

        {/* Segmented Toggle Control */}
        <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-bold self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: "all", label: `Semua Aktivitas (${selectedUserData ? selectedUserData.count : totalAcBmEvents})` },
            { id: "pitch", label: `Create Pitch (${selectedUserData ? (selectedUserData.pitch ?? 0) : totalAcBmPitch})` },
            { id: "alumni", label: `Alumni Checker (${selectedUserData ? (selectedUserData.alumni ?? 0) : totalAcBmAlumni})` },
            { id: "comparison", label: `Table Comparison (${selectedUserData ? (selectedUserData.comparison ?? 0) : totalAcBmComp})` },
          ].map((seg) => {
            const isSelected = chartMode === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setChartMode(seg.id as any)}
                className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer z-10 whitespace-nowrap shrink-0 ${isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"}`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="chartMetricActivePill"
                    className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                {seg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Filter Tabs Row */}
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
              onClick={() => {
                setChartRoleFilter("all");
                setSelectedUser("all");
              }}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${chartRoleFilter === "all" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {chartRoleFilter === "all" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              Semua ({allAvailableUsers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setChartRoleFilter("ac");
                setSelectedUser("all");
              }}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${chartRoleFilter === "ac" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {chartRoleFilter === "ac" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              AC ({allAvailableUsers.filter((u) => u.role === "AC").length})
            </button>
            <button
              type="button"
              onClick={() => {
                setChartRoleFilter("bm");
                setSelectedUser("all");
              }}
              className={`relative px-2 py-0.5 rounded-md cursor-pointer transition-colors z-10 ${chartRoleFilter === "bm" ? "text-[#FFD84D]" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {chartRoleFilter === "bm" && (
                <motion.span
                  layoutId="chartRoleFilterActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-md -z-10 shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              BM ({allAvailableUsers.filter((u) => u.role === "BM").length})
            </button>
          </div>

          {/* User Tab pills */}
          <div className="relative inline-flex p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-xs font-bold gap-1 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSelectedUser("all")}
              className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer z-10 flex items-center gap-1.5 shrink-0 ${activeSelectedUser === "all" ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"}`}
            >
              {activeSelectedUser === "all" && (
                <motion.span
                  layoutId="chartUserActivePill"
                  className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span>Semua {chartRoleFilter === "ac" ? "AC" : chartRoleFilter === "bm" ? "BM" : "Konselor"}</span>
              <span className="font-mono text-[10px] opacity-80">
                ({chartMode === "all"
                  ? totalAcBmEvents
                  : chartMode === "pitch"
                    ? totalAcBmPitch
                    : chartMode === "alumni"
                      ? totalAcBmAlumni
                      : totalAcBmComp})
              </span>
            </button>

            {availableUsers.map((u) => {
              const isSelected = activeSelectedUser === u.name;
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
                  onClick={() => setSelectedUser(u.name)}
                  className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer z-10 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"}`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="chartUserActivePill"
                      className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-2xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isSelected
                      ? "bg-[#FFD84D]"
                      : u.role === "BM"
                        ? "bg-[#9333EA]"
                        : "bg-[#1F7A4D]"
                      }`}
                  />
                  <span>{u.name}</span>
                  <span
                    className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded ${u.role === "BM"
                      ? isSelected
                        ? "bg-purple-900/60 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                      : isSelected
                        ? "bg-emerald-900/60 text-emerald-200"
                        : "bg-emerald-100 text-emerald-700"
                      }`}
                  >
                    {u.role}
                  </span>
                  <span className="font-mono text-[10px] opacity-80">({metricVal})</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeSelectedUser !== "all" && (
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#A15C00] bg-[#FFF6D1] px-2.5 py-1 rounded-lg border border-[#FFD84D]/70 shadow-2xs">
            <span>
              Fokus: <strong>{activeSelectedUser}</strong> {selectedUserData?.role ? `(${selectedUserData.role})` : ""}
            </span>
            <button
              type="button"
              onClick={() => setSelectedUser("all")}
              className="text-[#141412] hover:bg-[#FFD84D] px-1.5 py-0.2 rounded transition-colors font-bold cursor-pointer"
              title="Tampilkan Semua Konselor AC & BM"
            >
              ✕ Reset
            </button>
          </div>
        )}
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

            {/* Proportional SVG Curve */}
            <svg
              key={`${timeRange}-${chartMode}-${activeSelectedUser}-${timeline.length}`}
              className="w-full h-full"
              viewBox={`0 0 ${svgW} ${svgH}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="whiteRevouChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD84D" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#FFD84D" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {chartAreaPath && (
                <path
                  d={chartAreaPath}
                  fill="url(#whiteRevouChartGrad)"
                  className="chart-draw-area"
                />
              )}

              {chartStrokePath && (
                <path
                  d={chartStrokePath}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2.2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-draw-line"
                />
              )}
            </svg>

            {/* Interactive Tooltip & Point Guideline */}
            {activePoint && hasChartData && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-px border-l border-dashed border-[#D97706]/70 pointer-events-none z-10"
                  style={{ left: `${activePoint.pctX}%` }}
                />

                <div
                  className="absolute w-3 h-3 rounded-full bg-[#D97706] ring-4 ring-[#FFD84D]/70 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 shadow-md"
                  style={{
                    left: `${activePoint.pctX}%`,
                    top: `${activePoint.pctY}%`,
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.12 }}
                  className="absolute p-2.5 rounded-xl bg-[#141412] text-white shadow-xl border border-white/10 z-30 pointer-events-none min-w-[210px] max-w-[290px]"
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

                  <div className="space-y-1.5">
                    {/* Rincian Sesuai Filter Metrik Aktif */}
                    {chartMode === "all" ? (
                      <div className="flex items-center gap-2 text-[10px] text-white/80 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#FFD84D]" />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.pitch ?? 0) : (activePoint.rawPt?.pitch ?? 0))} Pitch
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-2.5 h-2.5 text-[#60A5FA]" />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.alumni ?? 0) : (activePoint.rawPt?.alumni ?? 0))} Alumni
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Scale className="w-2.5 h-2.5 text-[#34D399]" />
                          {Number(activeSelectedUser !== "all" ? (activePoint.rawPt?.byUser?.[activeSelectedUser]?.comparison ?? 0) : (activePoint.rawPt?.comparison ?? 0))} Komparasi
                        </span>
                      </div>
                    ) : chartMode === "pitch" ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#FFD84D] font-medium">
                        <Sparkles className="w-3 h-3 text-[#FFD84D] shrink-0" />
                        <span>{activePoint.val} aktivitas Create Pitch</span>
                      </div>
                    ) : chartMode === "alumni" ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#93C5FD] font-medium">
                        <GraduationCap className="w-3 h-3 text-[#60A5FA] shrink-0" />
                        <span>{activePoint.val} aktivitas Alumni Checker</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6EE7B7] font-medium">
                        <Scale className="w-3 h-3 text-[#34D399] shrink-0" />
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
                            {filteredActs.slice(0, 4).map((act: any, idx: number) => (
                              <div
                                key={idx}
                                className="text-[10px] leading-tight bg-white/5 p-1.5 rounded-lg flex items-start gap-1.5"
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${act.mode === "comparison"
                                      ? "bg-[#34D399]"
                                      : act.mode === "alumni"
                                        ? "bg-[#60A5FA]"
                                        : "bg-[#FFD84D]"
                                    }`}
                                />
                                <div className="truncate">
                                  <div className="text-white">
                                    <strong className="font-bold">{act.user}</strong>{" "}
                                    <span className="text-white/60">({act.role})</span> •{" "}
                                    <span
                                      className={`font-medium ${act.mode === "comparison"
                                          ? "text-[#34D399]"
                                          : act.mode === "alumni"
                                            ? "text-[#60A5FA]"
                                            : "text-[#FFD84D]"
                                        }`}
                                    >
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
                            ))}
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
              </>
            )}

            {!hasChartData && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-white/90 border border-[#E8E8E4] text-[#7A7A74] font-mono text-[11px]">
                  Belum ada aktivitas pada rentang waktu ini
                </span>
              </div>
            )}
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between pl-9 pt-1.5 text-[10px] font-mono text-[#7A7A74] select-none">
          {xTicks.map((tick, idx) => {
            const isPeakLabel = hasChartData && peakVal > 0 && tick.timelineIdx === peakIdx;
            return (
              <span
                key={idx}
                className={
                  isPeakLabel
                    ? "font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FDE68A]"
                    : "font-medium"
                }
              >
                {tick.label}
              </span>
            );
          })}
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
