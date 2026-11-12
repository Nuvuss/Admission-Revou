export type AnalyticsModeKey = "all" | "pitch" | "alumni" | "comparison";
export type CounselorRoleKey = "AC" | "BM";

export interface ModeColorToken {
  stroke: string;
  gradient: string;
  totalBadgeClass: string;
  dotClass: string;
  darkDotClass: string;
  lightTextClass: string;
  barBgClass: string;
  darkTextClass: string;
  darkIconClass: string;
  guideLineClass: string;
  activeDotClass: string;
  peakTickClass: string;
}

export interface RoleColorToken {
  dotClass: string;
  badgeLightClass: string;
  badgeSelectedClass: string;
}

export const MODE_COLOR_TOKENS: Record<AnalyticsModeKey, ModeColorToken> = {
  all: {
    stroke: "#D97706",
    gradient: "#FFD84D",
    totalBadgeClass: "bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D]/60",
    dotClass: "bg-[#D97706]",
    darkDotClass: "bg-[#FFD84D]",
    lightTextClass: "text-[#A15C00]",
    barBgClass: "bg-[#FFD84D]",
    darkTextClass: "text-[#FFD84D]",
    darkIconClass: "text-[#FFD84D]",
    guideLineClass: "border-[#D97706]/70",
    activeDotClass: "bg-[#D97706] ring-4 ring-[#FFD84D]/70",
    peakTickClass: "font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FDE68A]",
  },
  pitch: {
    stroke: "#D97706",
    gradient: "#FFD84D",
    totalBadgeClass: "bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D]/60",
    dotClass: "bg-[#D97706]",
    darkDotClass: "bg-[#FFD84D]",
    lightTextClass: "text-[#A15C00]",
    barBgClass: "bg-[#FFD84D]",
    darkTextClass: "text-[#FFD84D]",
    darkIconClass: "text-[#FFD84D]",
    guideLineClass: "border-[#D97706]/70",
    activeDotClass: "bg-[#D97706] ring-4 ring-[#FFD84D]/70",
    peakTickClass: "font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FDE68A]",
  },
  alumni: {
    stroke: "#2563EB",
    gradient: "#60A5FA",
    totalBadgeClass: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
    dotClass: "bg-[#2563EB]",
    darkDotClass: "bg-[#60A5FA]",
    lightTextClass: "text-[#1D4ED8]",
    barBgClass: "bg-[#3B82F6]",
    darkTextClass: "text-[#93C5FD]",
    darkIconClass: "text-[#60A5FA]",
    guideLineClass: "border-[#2563EB]/70",
    activeDotClass: "bg-[#2563EB] ring-4 ring-[#93C5FD]/70",
    peakTickClass: "font-bold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]",
  },
  comparison: {
    stroke: "#9333EA",
    gradient: "#C084FC",
    totalBadgeClass: "bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]",
    dotClass: "bg-[#9333EA]",
    darkDotClass: "bg-[#C084FC]",
    lightTextClass: "text-[#7E22CE]",
    barBgClass: "bg-[#9333EA]",
    darkTextClass: "text-[#D8B4FE]",
    darkIconClass: "text-[#C084FC]",
    guideLineClass: "border-[#9333EA]/70",
    activeDotClass: "bg-[#9333EA] ring-4 ring-[#D8B4FE]/70",
    peakTickClass: "font-bold text-[#7E22CE] bg-[#FAF5FF] px-1.5 py-0.5 rounded border border-[#E9D5FF]",
  },
};

export const ROLE_COLOR_TOKENS: Record<CounselorRoleKey, RoleColorToken> = {
  AC: {
    dotClass: "bg-[#2563EB]",
    badgeLightClass: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]",
    badgeSelectedClass: "bg-blue-900/60 text-blue-200",
  },
  BM: {
    dotClass: "bg-[#9333EA]",
    badgeLightClass: "bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]",
    badgeSelectedClass: "bg-purple-900/60 text-purple-200",
  },
};

export function getModeColorToken(mode?: string): ModeColorToken {
  if (mode === "pitch" || mode === "alumni" || mode === "comparison" || mode === "all") {
    return MODE_COLOR_TOKENS[mode];
  }
  return MODE_COLOR_TOKENS.all;
}

export function getRoleColorToken(role?: string): RoleColorToken {
  if (role === "BM") {
    return ROLE_COLOR_TOKENS.BM;
  }
  return ROLE_COLOR_TOKENS.AC;
}

