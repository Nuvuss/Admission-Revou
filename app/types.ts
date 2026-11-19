export type ModeKey = "pitch" | "alumni" | "comparison" | "faq";

export interface FaqBubble {
  label: string | null;
  text: string;
}

export interface FaqItemResult {
  id: string;
  program: string;
  program_label: string;
  category: string;
  source_file: string;
  question: string;
  bubbles: FaqBubble[];
  answer_verbatim: string;
  same_as?: string | null;
  status: string;
  unconfirmed: boolean;
  stale_date?: boolean;
  ac_note?: string | null;
  placeholders?: string[];
}

export interface FaqResponsePayload {
  found: boolean;
  items: FaqItemResult[];
  missing_programs: string[];
  matched_programs?: string[];
  fallback_message: string | null;
  comparison_draft?: string | null;
  matchType?: string;
}

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
  isRedisEnabled?: boolean;
  storageEngine?: string;
  isSupabaseVectorEnabled?: boolean;
  knowledgeEngine?: string;
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
