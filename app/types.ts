export type ModeKey = "pitch" | "alumni" | "comparison";

export interface ClarificationItem {
  id: string;
  role: "user" | "ai";
  text: string;
  data?: any;
  timestamp?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateFormatted: string;
  mode: ModeKey;
  inputText: string;
  model: string;
  responseResult: any;
  chatThread?: ClarificationItem[];
  isFavorite: boolean;
}

export interface ApiPoolStatus {
  totalKeys?: number;
  activeRoundRobinIndex?: number;
  quotaHealth?: "optimal" | "partial_warning" | "all_exhausted";
  summary?: {
    healthy?: number;
  };
  keys?: Array<{
    status?: string;
    cooldownSeconds?: number;
    usageCount?: number;
    isConfigured?: boolean;
  }>;
}

export interface ApiKeyTestResult {
  index: number;
  quotaAvailable: boolean;
  statusCode?: number;
  latencyMs?: number;
}
