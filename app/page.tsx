"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Info,
  ChevronRight,
  Layers,
  Send,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Cpu,
  UserCheck,
  ShieldCheck,
  Lightbulb,
  AlertCircle,
  ExternalLink,
  Bookmark,
  Star,
  Clock,
  Trash2,
  Search,
  X,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  Scale,
  Award
} from "lucide-react";
import ComparisonView from "./components/ComparisonView";

// Helper to render text with clickable hyperlinks, markdown bold, highlights, and italics
function renderFormattedTextWithLinks(
  text: string,
  options?: { isSummary?: boolean }
) {
  if (!text) return null;

  // Regex matching:
  // 1 & 2: Markdown links [label](url)
  // 3: Raw URLs https://...
  // 4: Highlight ==text==
  // 5: Highlight <mark>text</mark>
  // 6: Bold **text**
  // 7: Bold __text__
  // 8: Italic *text*
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"'{}|\\^`[\]()]+)|==([^=]+)==|<mark>([\s\S]*?)<\/mark>|\*\*([^*]+)\*\*|__([^_]+)__|(?<!\*)\*([^*]+)\*(?!\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let counter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      const rawLabel = match[1];
      const url = match[2];
      const cleanLabel = rawLabel.replace(/\*\*/g, "").replace(/__/g, "");
      elements.push(
        <a
          key={`link-${counter++}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0E62FE] hover:text-[#0043CE] underline font-semibold inline-flex items-center gap-0.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{cleanLabel}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    } else if (match[3]) {
      const url = match[3];
      elements.push(
        <a
          key={`rawurl-${counter++}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0E62FE] hover:text-[#0043CE] underline font-semibold break-all inline-flex items-center gap-0.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{url}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    } else if (match[4] || match[5]) {
      const content = match[4] || match[5];
      elements.push(
        <mark
          key={`mark-${counter++}-${match.index}`}
          className="bg-[#FEF08A]/90 text-[#141412] font-semibold px-1 py-0.5 rounded"
        >
          {content}
        </mark>
      );
    } else if (match[6] || match[7]) {
      const content = match[6] || match[7];
      elements.push(
        <strong
          key={`bold-${counter++}-${match.index}`}
          className="font-bold text-[#141412]"
        >
          {content}
        </strong>
      );
    } else if (match[8]) {
      const content = match[8];
      elements.push(
        <em key={`em-${counter++}-${match.index}`} className="italic">
          {content}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

type ModeKey = "pitch" | "alumni" | "comparison";

interface ModeConfig {
  title: string;
  lead: string;
  template: string;
  placeholder: string;
  examples: string[];
}

const MODES: Record<ModeKey, ModeConfig> = {
  pitch: {
    title: "Create a Pitch",
    lead: "Jelaskan profil prospect & konteksnya. AI menyusun pitch personal yang menghubungkan modul program ke masalah riil harian prospect (bukan sekadar daftar fitur), ringkas dengan CTA santai.",
    template: "Tulis: profil prospect (pekerjaan, pengalaman, minat)",
    placeholder: "Contoh: HR Manager at a 500-person company. Interested in AI upskilling but says she needs to discuss with management first...",
    examples: [
      "HR Manager at a 500-person company, mau pakai AI & automation untuk screening & reporting.",
      "Digital Marketer 3 tahun di e-commerce, ingin scale up ke AI & marketing analytics.",
      "Team leader di perusahaan konsultan, mau pakai AI untuk analisa project & keputusan.",
      "Staf dinas koperasi & UKM yang handle program UMKM, tertarik AI for Leaders.",
      "Fresh graduate ekonomi manajemen, sudah sering pakai ChatGPT & Claude.",
      "Akuntan lulusan Ilmu Komputer, mau career switch ke Data Analytics.",
    ],
  },
  alumni: {
    title: "Checking Alumni",
    lead: "Cari data alumni RevoU & generate summary perjalanan karir mereka ke kisah lengkap sebagai bukti nyata.",
    template: "Tulis: latar belakang/profesi/keraguan leads atau profil alumni yang dicari",
    placeholder: "Contoh: Prospect seorang Dokter/Guru/Lulusan SMA yang ragu apakah bisa switch karir ke Tech/Data/Digital Marketing. Ada profil alumni relevan?",
    examples: [
      "Cari alumni mantan Atlet atau lulusan Non-IT yang sukses beralih ke Digital Marketing.",
      "Alumni lulusan SMA tanpa pengalaman kerja yang sukses jadi Meta Ads Specialist.",
      "Alumni ibu rumah tangga usia 30+ atau yang pernah career break dan sukses bekerja remote.",
      "Ada alumni atau peserta program dari perusahaan BUMN, Pertamina, atau Industri Migas?",
      "Cari alumni dengan kenaikan gaji (salary increase) di atas 100% di bidang Data Analytics.",
    ],
  },
  comparison: {
    title: "Comparison Table",
    lead: "Battlecards kompetitor (Hacktiv8, Purwadhika, Dibimbing, IT Lab) & tabel komparasi general & bootcamp untuk menjawab keraguan prospect secara elegan tanpa menjelekkan kompetitor.",
    template: "Tulis: nama kompetitor (Hacktiv8 / Purwadhika / Dibimbing / IT Lab) & apa yang membuat leads tertarik atau ragu",
    placeholder: "Contoh: Lead bilang tertarik daftar Dibimbing karena harganya lebih murah dan ada program cicilan, tapi masih bingung kualitas karir dan mentornya...",
    examples: [
      "Lead tertarik Purwadhika karena ada opsi kelas offline tatap muka di BSD/Jakarta.",
      "Lead membandingkan RevoU dengan Hacktiv8 karena tertarik opsi ISA (Income Share Agreement).",
      "Lead bilang Dibimbing Digital Marketing lebih terjangkau, apakah worth it ambil RevoU?",
      "Lead ragu apakah RevoU punya jaminan kerja refund dan sertifikasi resmi seperti kompetitor.",
      "Lead membandingkan kurikulum Data Analytics RevoU dengan bootcamp lain yang lebih singkat (3 bulan)."
    ],
  },
};

const availableModels = [
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Paling Stabil & Cepat - Rekomendasi)" },
  { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite (Respon Singkat & Ringan)" },
  { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Tinggi Akurasi)" },
  { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash (Experimental)" },
];

export default function DashboardPage() {
  const [mode, setMode] = useState<ModeKey>("pitch");
  const [selectedModel, setSelectedModel] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gemini-3.5-flash"
  );
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clarification Chat State
  interface ClarificationItem {
    id: string;
    role: "user" | "ai";
    text: string;
    data?: any;
    timestamp?: string;
  }

  // History & Favorites State
  interface HistoryItem {
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

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"favorites" | "all">("favorites");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const [historyToast, setHistoryToast] = useState<string | null>(null);

  // ── 5 API Keys Round Robin & Quota Management State ──
  const [customApiKeys, setCustomApiKeys] = useState<string[]>(["", "", "", "", ""]);
  const [showKeySecret, setShowKeySecret] = useState<boolean[]>([false, false, false, false, false]);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiPoolStatus, setApiPoolStatus] = useState<any | null>(null);
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [quotaAlertBanner, setQuotaAlertBanner] = useState<string | null>(null);

  // Load history & API keys from localStorage and fetch server pool status
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("revou_admission_history_v1");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistoryList(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }

    try {
      const savedKeys = localStorage.getItem("revou_admission_custom_api_keys_v2");
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys);
        if (Array.isArray(parsedKeys)) {
          // ensure 5 slots
          const normalized = [...parsedKeys, "", "", "", "", ""].slice(0, 5);
          setCustomApiKeys(normalized);
        }
      }
    } catch (e) {
      console.error("Failed to load custom keys from localStorage:", e);
    }

    // Fetch initial API pool status
    fetchApiPoolStatus();
  }, []);

  const fetchApiPoolStatus = async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setApiPoolStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch API keys status:", err);
    }
  };

  const handleTestKeys = async () => {
    setIsTestingKeys(true);
    setTestResults(null);
    try {
      const activeCustom = customApiKeys.filter((k) => k && k.trim().length > 10);
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          customKeys: activeCustom.length > 0 ? activeCustom : null,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setTestResults(data.results);
        showToast(`Uji kuota selesai: ${data.availableKeys}/${data.totalTested} Key aktif!`);
      } else {
        showToast(data.message || "Gagal menguji API Keys.");
      }
      fetchApiPoolStatus();
    } catch (err: any) {
      console.error("Test keys error:", err);
      showToast("Gagal melakukan ping uji ke Google AI Studio.");
    } finally {
      setIsTestingKeys(false);
    }
  };

  const handleSaveCustomKeys = async () => {
    try {
      localStorage.setItem("revou_admission_custom_api_keys_v2", JSON.stringify(customApiKeys));
      const activeCustom = customApiKeys.filter((k) => k && k.trim().length > 10);
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "status",
          customKeys: activeCustom.length > 0 ? activeCustom : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApiPoolStatus(data);
      }
      showToast("Konfigurasi 5 API Key berhasil disimpan & siap digunakan!");
    } catch (err) {
      console.error("Failed to save custom keys:", err);
      showToast("Gagal menyimpan API Keys ke penyimpanan lokal.");
    }
  };

  const handleResetKeysToDefault = async () => {
    try {
      localStorage.removeItem("revou_admission_custom_api_keys_v2");
      setCustomApiKeys(["", "", "", "", ""]);
      setTestResults(null);
      await fetchApiPoolStatus();
      showToast("Berhasil direset ke default API Keys server (.env.local).");
    } catch (err) {
      console.error("Failed to reset keys:", err);
    }
  };

  // Listen to Escape key to close drawer or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isKeyModalOpen) setIsKeyModalOpen(false);
        if (isHistoryDrawerOpen) setIsHistoryDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHistoryDrawerOpen, isKeyModalOpen]);

  const showToast = (msg: string) => {
    setHistoryToast(msg);
    setTimeout(() => setHistoryToast(null), 2500);
  };

  const saveHistoryToStorage = (newList: HistoryItem[]) => {
    setHistoryList(newList);
    try {
      localStorage.setItem("revou_admission_history_v1", JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [chatInput, setChatInput] = useState("");
  const [chatThread, setChatThread] = useState<ClarificationItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [clarificationTabs, setClarificationTabs] = useState<Record<string, number>>({});
  const [copiedClarificationKey, setCopiedClarificationKey] = useState<string | null>(null);

  const curConfig = MODES[mode];

  const handleClear = () => {
    setInputText("");
    setResponseResult(null);
    setCurrentSessionId(null);
    setErrorMessage(null);
    setChatThread([]);
    setClarificationTabs({});
    setActiveScriptTab(0);
  };

  const handleModeChange = (newMode: ModeKey) => {
    if (newMode === mode) return;
    setMode(newMode);
    setInputText("");
    setResponseResult(null);
    setCurrentSessionId(null);
    setErrorMessage(null);
    setChatThread([]);
    setClarificationTabs({});
    setActiveScriptTab(0);
  };

  // Generate POST to /api/generate
  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResponseResult(null);
    setErrorMessage(null);
    setActiveScriptTab(0);
    setChatThread([]);
    setClarificationTabs({});

    try {
      const activeCustom = customApiKeys.filter((k) => k && k.trim().length > 10);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: inputText,
          model: selectedModel,
          tab: mode,
          customKeys: activeCustom.length > 0 ? activeCustom : null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResponseResult(data);

      // Handle Round Robin key quota info & notifications
      if (data.apiKeyInfo) {
        if (data.apiKeyInfo.poolStatus) {
          setApiPoolStatus(data.apiKeyInfo.poolStatus);
        }
        if (Array.isArray(data.apiKeyInfo.quotaNotifications) && data.apiKeyInfo.quotaNotifications.length > 0) {
          setQuotaAlertBanner(data.apiKeyInfo.quotaNotifications.join(" • "));
        } else if (data.apiKeyInfo.wasRotatedDueToQuota) {
          setQuotaAlertBanner(`Rotasi Kuota: API Key berhasil dialihkan ke Key #${data.apiKeyInfo.activeKeyIndex} via Round Robin.`);
        }
      }

      // Auto-save to History in LocalStorage
      const newSessionId = `hist-${Date.now()}`;
      setCurrentSessionId(newSessionId);
      const newItem: HistoryItem = {
        id: newSessionId,
        timestamp: Date.now(),
        dateFormatted: formatDate(new Date()),
        mode,
        inputText,
        model: selectedModel,
        responseResult: data,
        chatThread: [],
        isFavorite: false,
      };

      setHistoryList((prev) => {
        const updated = [newItem, ...prev.filter((i) => i.id !== newSessionId)].slice(0, 30);
        try {
          localStorage.setItem("revou_admission_history_v1", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save history:", e);
        }
        return updated;
      });
    } catch (err: any) {
      console.error("Generate error:", err);
      setErrorMessage(err.message || "Gagal memanggil AI. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clarification / Follow-up chat handler (Preserves initial generation result)
  const handleSendClarification = async (customText?: string) => {
    const q = (customText || chatInput).trim();
    if (!q || isChatLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ClarificationItem = {
      id: userMsgId,
      role: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newThread = [...chatThread, userMsg];
    setChatThread(newThread);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Collect all previously shown alumni names across the session
      const previouslyShownAlumni: string[] = [];
      const addAlumniName = (name?: string) => {
        if (!name) return;
        const trimmed = name.trim();
        if (trimmed && !previouslyShownAlumni.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) {
          previouslyShownAlumni.push(trimmed);
        }
      };

      if (responseResult?.featured_alumni_summary?.name) {
        addAlumniName(responseResult.featured_alumni_summary.name);
      }
      if (Array.isArray(responseResult?.alumni_matches)) {
        responseResult.alumni_matches.forEach((a: any) => addAlumniName(a?.name));
      }

      chatThread.forEach((msg) => {
        if (msg.role === "ai" && msg.data) {
          if (msg.data.featured_alumni_summary?.name) {
            addAlumniName(msg.data.featured_alumni_summary.name);
          }
          if (Array.isArray(msg.data.alumni_matches)) {
            msg.data.alumni_matches.forEach((a: any) => addAlumniName(a?.name));
          }
        }
      });

      // Build full conversation context including initial result + chat history
      const initialResultSummary = responseResult ? JSON.stringify({
        persona: responseResult.persona,
        program_match: responseResult.program_match,
        ai_relevancy_statement: responseResult.ai_relevancy_statement,
        program_overview_short: responseResult.program_overview_short,
        whats_happening: responseResult.whats_happening,
        recommended_approach: responseResult.recommended_approach,
        featured_alumni_summary: responseResult.featured_alumni_summary,
        alumni_matches: responseResult.alumni_matches?.map((a: any) => ({
          name: a.name,
          program_batch: a.program_batch,
          previous_role: a.previous_role,
          current_role: a.current_role,
          company: a.company,
          achievement: a.achievement,
          profile_url: a.profile_url,
        })),
        scripts: responseResult.scripts?.map((s: any) => ({ badge: s.badge, text: s.text?.slice(0, 200) + "..." })),
      }, null, 2) : "";

      // Build chat history context with details of what was previously discussed and shown
      const chatHistoryContext = newThread
        .filter((msg) => msg.id !== userMsgId) // exclude current message
        .map((msg) => {
          if (msg.role === "user") {
            return `[Sales]: ${msg.text}`;
          }
          const shownAlumni = msg.data?.alumni_matches?.map((a: any) => a.name).filter(Boolean).join(", ");
          const alumniNote = shownAlumni ? ` (Alumni yang telah ditampilkan: ${shownAlumni})` : "";
          return `[AI]: ${msg.text}${alumniNote}`;
        })
        .join("\n");

      const promptCombined = `Situasi Awal dari Tim Sales:
"""
${inputText}
"""

=== HASIL GENERATE SEBELUMNYA (REFERENSI KONTEKS) ===
${initialResultSummary}

${chatHistoryContext ? `=== RIWAYAT PERCAKAPAN SEBELUMNYA ===
${chatHistoryContext}

` : ""}${previouslyShownAlumni.length > 0 ? `=== DAFTAR ALUMNI YANG SUDAH PERNAH DITAMPILKAN (DILARANG DIULANG KEMBALI) ===
Berikut adalah nama/profil alumni yang SUDAH ditampilkan pada sesi ini:
${previouslyShownAlumni.map((name) => `- ${name}`).join("\n")}

⚠️ ATURAN MUTLAK ANTI-DUPLIKASI ALUMNI:
Jika tim Sales meminta contoh alumni lainnya / alumni baru / profil berbeda / nama lain (seperti "contoh alumni lainnya", "ada alumni lain?", "profil lain", "siapa lagi?", dsb.):
1. DILARANG KERAS menampilkan kembali nama/profil alumni yang sudah terdaftar di atas!
2. AI WAJIB menggali database knowledge base untuk mencari profil alumni BARU & BERBEDA dari yang sudah pernah ditampilkan.
3. Seluruh 'alumni_matches' dan 'featured_alumni_summary' WAJIB diisi dengan nama alumni baru yang belum pernah muncul sebelumnya.
4. Tuliskan di 'revision_summary' secara jelas nama-nama alumni baru yang disajikan ini untuk memperkaya referensi tim Sales.

` : ""}=== INSTRUKSI REVISI/KLARIFIKASI TERBARU DARI SALES ===
"""
${q}
"""

INSTRUKSI PENTING:
1. Jika Sales mengklarifikasi atau mencari alumni bidang/program/profesi tertentu (misal: Software Engineering, Data Analytics, Digital Marketing, atau profil khusus), cari data alumni yang relevan dari knowledge base dan WAJIB sertakan 'featured_alumni_summary' dan 'alumni_matches' yang sesuai.
2. Pada menu 'alumni': JANGAN buat pitch WhatsApp dan KOSONGKAN scripts ([]). Fokus tampilkan data alumni RevoU dengan ringkasan singkat serta rangkuman perjalanan karirnya (WAJIB cetak tebal **bold** pemicu aksi dan highlight bagian penting perjalanan karir).
3. Jika Sales meminta contoh alumni lainnya atau profil berbeda, pastikan 100% profil yang ditampilkan adalah figur BARU yang belum pernah ditampilkan di giliran sebelumnya.
4. Pada menu 'pitch': Sesuaikan draf script pesan sesuai masukan Sales dengan tetap mengikuti aturan wajib minimal 120 kata (rentang 120–300 kata per variasi draf), empati spesifik, penyambungan USP + kurikulum konkret + framing AI force multiplier, pilihan 1 CTA ajakan, gaya chat WhatsApp santai (boleh singkatan: utk, yg, sdh, bgt, krn), 1 emoji per paragraf (maks 3 per pesan), dan tanpa placeholder nama.
5. KHUSUS alumni profile pada 'Applied AI, Analytics & Automation' dan 'Data-Driven Decision Making': Datanya TIDAK memiliki nama orang siapapun dan TIDAK ADA informasi posisi sebelumnya di knowledge base (HANYA Posisi/Job Title, Perusahaan, dan Industri/Kategori). JANGAN PERNAH mengada-ada/mengarang nama orang atau posisi sebelumnya; gunakan format '[Job Title] — [Perusahaan]' dan tampilkan informasi summary murni berdasarkan posisi, perusahaan, dan kategori industri yang ada.
6. VALIDASI MUTLAK KRITERIA (CAREER SWITCHER VS UPSKILLING — NO MISMATCH): Jika Sales meminta kriteria spesifik (misal: "3 orang career switcher"), seluruh profil yang ditampilkan WAJIB 100% murni Career Switcher sejati (terbukti beralih dari profesi/bidang yang berbeda nyata). DILARANG KERAS menyelipkan profil Upskilling (yang sebelumnya sudah di bidang serupa) ke dalam permintaan Career Switcher!
7. ATURAN FILTER BIDANG & INDUSTRI (ZERO TOLERANCE SALAH INDUSTRI): Jika Sales mencari bidang/industri tertentu (misal: "Manufaktur / Manufacture"): Seluruh alumni yang ditampilkan WAJIB 100% murni berasal dari industri tersebut (contoh Manufaktur: PT Karcher, APP, PT Trias Sentosa Tbk, Komatsu Remanufacturing Asia, Gatra Mapan). DILARANG KERAS memberikan profil dari industri lain seperti Oil & Gas (Pertamina) saat diminta Manufaktur!`;
      const activeCustom = customApiKeys.filter((k) => k && k.trim().length > 10);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: promptCombined,
          model: selectedModel,
          tab: mode,
          excluded_alumni: previouslyShownAlumni,
          customKeys: activeCustom.length > 0 ? activeCustom : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Handle Round Robin key quota info & notifications
        if (data.apiKeyInfo) {
          if (data.apiKeyInfo.poolStatus) {
            setApiPoolStatus(data.apiKeyInfo.poolStatus);
          }
          if (Array.isArray(data.apiKeyInfo.quotaNotifications) && data.apiKeyInfo.quotaNotifications.length > 0) {
            setQuotaAlertBanner(data.apiKeyInfo.quotaNotifications.join(" • "));
          }
        }

        const aiMsgId = `ai-${Date.now()}`;
        const aiMessageText =
          data.revision_summary ||
          (data.recommended_approach
            ? `Penyesuaian strategi: ${data.recommended_approach}`
            : "Berikut draf script dan rekomendasi yang telah disesuaikan dengan klarifikasimu.");

        const aiMsg: ClarificationItem = {
          id: aiMsgId,
          role: "ai",
          text: aiMessageText,
          data: data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Initialize active script tab for this clarification response
        setClarificationTabs((prev) => ({ ...prev, [aiMsgId]: 0 }));
        const updatedChatThread = [...newThread, aiMsg];
        setChatThread(updatedChatThread);
        // NOTE: setResponseResult(data) is intentionally NOT called to keep initial answer intact!

        // Save updated chatThread to history item in localStorage
        if (currentSessionId) {
          setHistoryList((prev) => {
            const updated = prev.map((item) => {
              if (item.id === currentSessionId) {
                return { ...item, chatThread: updatedChatThread };
              }
              return item;
            });
            try {
              localStorage.setItem("revou_admission_history_v1", JSON.stringify(updated));
            } catch (e) { }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Clarification error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Copy helpers for initial generation
  const handleCopyAll = () => {
    if (!responseResult?.scripts) return;
    const allText = responseResult.scripts.map((s: any) => `${s.badge}\n${s.text}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy helpers for clarification responses
  const handleCopyClarificationSingle = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClarificationKey(key);
    setTimeout(() => setCopiedClarificationKey(null), 2000);
  };

  const handleCopyClarificationAll = (scripts: any[], msgId: string) => {
    if (!scripts || scripts.length === 0) return;
    const allText = scripts.map((s: any) => `${s.badge}\n${s.text}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedClarificationKey(`${msgId}-all`);
    setTimeout(() => setCopiedClarificationKey(null), 2000);
  };

  // History & Favorites Action Handlers
  const toggleFavorite = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let isNowFav = false;
    const updated = historyList.map((item) => {
      if (item.id === itemId) {
        isNowFav = !item.isFavorite;
        return { ...item, isFavorite: isNowFav };
      }
      return item;
    });
    saveHistoryToStorage(updated);
    showToast(isNowFav ? "Ditambahkan ke Favorit ⭐" : "Dihapus dari Favorit");
  };

  const isCurrentFavorite = Boolean(
    currentSessionId && historyList.find((h) => h.id === currentSessionId)?.isFavorite
  );

  const toggleCurrentSessionFavorite = () => {
    if (!responseResult) return;
    if (currentSessionId) {
      toggleFavorite(currentSessionId);
    } else {
      const newId = `hist-${Date.now()}`;
      setCurrentSessionId(newId);
      const newItem: HistoryItem = {
        id: newId,
        timestamp: Date.now(),
        dateFormatted: formatDate(new Date()),
        mode,
        inputText,
        model: selectedModel,
        responseResult,
        chatThread,
        isFavorite: true,
      };
      saveHistoryToStorage([newItem, ...historyList].slice(0, 30));
      showToast("Ditambahkan ke Favorit ⭐");
    }
  };

  const handleLoadSession = (item: HistoryItem) => {
    setMode(item.mode);
    setInputText(item.inputText);
    setSelectedModel(item.model || "gemini-3.5-flash-lite");
    setResponseResult(item.responseResult);
    setChatThread(item.chatThread || []);
    setActiveScriptTab(0);
    setCurrentSessionId(item.id);
    setIsHistoryDrawerOpen(false);
    showToast(`Sesi "${item.mode === "pitch" ? "Pitch" : item.mode === "alumni" ? "Alumni" : "Comparison"}" berhasil dimuat!`);
  };

  const handleDeleteItem = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = historyList.filter((item) => item.id !== itemId);
    saveHistoryToStorage(updated);
    if (currentSessionId === itemId) {
      setCurrentSessionId(null);
    }
    showToast("Item riwayat dihapus");
  };

  const handleClearHistory = () => {
    if (window.confirm("Hapus semua riwayat yang tidak difavoritkan?")) {
      const updated = historyList.filter((item) => item.isFavorite);
      saveHistoryToStorage(updated);
      showToast("Riwayat dibersihkan (Favorit tetap tersimpan)");
    }
  };

  const handleQuickCopyHistory = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = "";
    if (item.responseResult?.scripts && item.responseResult.scripts.length > 0) {
      textToCopy = item.responseResult.scripts
        .map((s: any) => `${s.badge}\n${s.text}`)
        .join("\n\n---\n\n");
    } else if (item.responseResult?.featured_alumni_summary?.career_journey_summary) {
      textToCopy = `${item.responseResult.featured_alumni_summary.name}\n${item.responseResult.featured_alumni_summary.career_journey_summary}`;
    } else if (item.responseResult?.alumni_matches && item.responseResult.alumni_matches.length > 0) {
      textToCopy = item.responseResult.alumni_matches
        .map((a: any) => `${a.name} (${a.current_role})\n${a.career_journey_summary || a.why_relevant || ""}`)
        .join("\n\n---\n\n");
    } else {
      textToCopy = item.inputText;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedHistoryId(item.id);
    setTimeout(() => setCopiedHistoryId(null), 2000);
    showToast("Tersalin ke clipboard!");
  };

  const favoritesCount = historyList.filter((i) => i.isFavorite).length;
  const filteredHistory = historyList.filter((item) => {
    const matchesTab = drawerTab === "favorites" ? item.isFavorite : true;
    if (!matchesTab) return false;
    if (!searchHistoryQuery.trim()) return true;
    const q = searchHistoryQuery.toLowerCase();
    const matchInput = item.inputText?.toLowerCase().includes(q);
    const matchPersona = item.responseResult?.persona?.toLowerCase().includes(q);
    const matchAlumni = item.responseResult?.alumni_matches?.some((a: any) =>
      a?.name?.toLowerCase().includes(q) || a?.current_role?.toLowerCase().includes(q)
    );
    const matchApproach = item.responseResult?.recommended_approach?.toLowerCase().includes(q);
    return Boolean(matchInput || matchPersona || matchAlumni || matchApproach);
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#141412] font-sans antialiased px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-[820px] mx-auto">
        {/* ========================================================= */}
        {/* 1. TOPBAR & EDITORIAL MASTHEAD                            */}
        {/* ========================================================= */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          {/* Masthead Utility Navigation Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-[#E8E8E4]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-[#E8E8E4] bg-white p-1 flex items-center justify-center">
                <img
                  src="/revou-logo.png"
                  alt="RevoU Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#141412] m-0 flex items-center gap-1.5">
                  <span>RevoU Admission Copilot</span>
                  <span className="font-mono text-[9px] bg-[#FFD84D] text-[#141412] font-black px-1.5 py-0.2 rounded">
                    INTERNAL
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#1F7A4D]" />
                  <span className="text-[11px] font-mono text-[#7A7A74]">
                    Verified Data &middot; Knowledge Base 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 5 API Keys Round Robin Button */}
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] hover:border-[#141412] text-xs font-bold text-[#141412] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none"
                title="Kelola 5 API Keys & Pantau Status Kuota (Round Robin)"
              >
                <Key className="w-3.5 h-3.5 text-[#0E62FE]" />
                <span className="hidden sm:inline">5 API Keys</span>
                <span className="flex items-center gap-1 font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-[#F5F5F2] text-[#4B4B46] border border-[#E8E8E4]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${apiPoolStatus?.quotaHealth === "optimal"
                      ? "bg-[#1F7A4D]"
                      : apiPoolStatus?.quotaHealth === "partial_warning"
                        ? "bg-[#D97706] animate-pulse"
                        : apiPoolStatus?.quotaHealth === "all_exhausted"
                          ? "bg-[#DA1E28] animate-pulse"
                          : "bg-[#1F7A4D]"
                      }`}
                  />
                  <span>
                    {apiPoolStatus?.activeRoundRobinIndex
                      ? `API ${apiPoolStatus.activeRoundRobinIndex}/${apiPoolStatus.totalKeys || 5}`
                      : "Round Robin"}
                  </span>
                </span>
              </button>

              {/* Favorit & Riwayat Button */}
              <button
                type="button"
                onClick={() => {
                  setDrawerTab("favorites");
                  setIsHistoryDrawerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] hover:border-[#141412] text-xs font-bold text-[#141412] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 select-none"
                title="Lihat riwayat percakapan dan skrip tersimpan"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#A15C00]" />
                <span>Favorit &amp; Riwayat</span>
                {favoritesCount > 0 ? (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FFD84D] text-[#141412]">
                    ★ {favoritesCount}
                  </span>
                ) : historyList.length > 0 ? (
                  <span className="flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded-full bg-[#F5F5F2] text-[#8A8A84] border border-[#E8E8E4]">
                    {historyList.length}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-2xl sm:text-3xl md:text-[34px] tracking-tight leading-[1.18] text-[#141412] mb-2"
          >
            Turn prospect context into a{" "}
            <span className="relative inline-block px-2 py-0.5 rounded-lg bg-[#FFD84D] text-[#141412] shadow-2xs">
              high-converting pitch
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#4B4B46] text-sm sm:text-[15px] leading-relaxed max-w-[68ch]"
          >
            Asisten penjualan cerdas Admission RevoU: rancang pitch WhatsApp personal (<strong className="text-[#141412] font-semibold">Create a Pitch</strong>), temukan bukti nyata kisah alumni (<strong className="text-[#141412] font-semibold">Checking Alumni</strong>), dan bedah komparasi kurikulum head-to-head vs kompetitor (<strong className="text-[#141412] font-semibold">Comparison Table</strong>) secara faktual.
          </motion.p>


        </motion.header>

        {/* Real-time Quota Notification Banner */}
        {quotaAlertBanner && (
          <div className="mb-4 p-3 bg-[#FFF6D1] border border-[#FFD84D] rounded-xl flex items-start justify-between gap-3 text-xs sm:text-sm text-[#141412] shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#A15C00] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#A15C00] text-xs uppercase tracking-wider mb-0.5">
                  Pemberitahuan Kuota &amp; Rotasi API Key (Round Robin)
                </p>
                <p className="text-[#4B4B46] leading-relaxed">{quotaAlertBanner}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuotaAlertBanner(null)}
              className="text-[#8A8A84] hover:text-[#141412] p-1 rounded-md hover:bg-[#FFD84D]/40 transition-colors cursor-pointer shrink-0"
              title="Tutup pemberitahuan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. MAIN CARD WORKSPACE (.card.work)                       */}
        {/* ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#E8E8E4] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6"
        >
          {/* Segmented Control Pill Navigation Bar (Animated layoutId) */}
          <div className="p-1 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] flex gap-1 overflow-x-auto">
            {[
              { key: "pitch", label: "Create a Pitch", icon: Sparkles },
              { key: "alumni", label: "Checking Alumni", icon: UserCheck },
              { key: "comparison", label: "Comparison Table", icon: Scale }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mode === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleModeChange(tab.key as ModeKey)}
                  className={`relative px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer select-none flex items-center gap-2 shrink-0 ${
                    isActive ? "text-[#141412]" : "text-[#7A7A74] hover:text-[#141412]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeModeTab"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-[#FFD84D] rounded-lg shadow-2xs border border-[#E5B500]/60"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#141412]" : "text-[#8A8A84]"}`} />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dedicated Comparison Table Explorer (Battlecards, General Table, Bootcamp Table) */}
          {mode === "comparison" && (
            <div className="pt-1">
              <ComparisonView />
            </div>
          )}

          {/* Form and AI Copilot - only rendered for Pitch and Alumni */}
          {mode !== "comparison" && (
            <>
              {/* Describe Your Situation Section */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <label
                    htmlFor="situation-input"
                    className="font-bold text-[14.5px] text-[#141412] block"
                  >
                    {mode === "pitch"
                      ? "Describe your situation"
                      : "Cari data alumni / latar belakang leads"}
                  </label>

                  {/* Model Selector Pill */}
                  <div className="dropdown-wrapper group inline-flex items-center gap-1.5 bg-[#F5F5F2] hover:bg-white px-3 py-1 rounded-full border border-[#E8E8E4] hover:border-[#FFD84D] transition-all self-start sm:self-auto shadow-2xs hover:shadow-xs">
                    <Cpu className="w-3.5 h-3.5 text-[#8A8A84] group-hover:text-[#A15C00] transition-colors" />
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="font-mono text-[11px] text-[#4B4B46] group-hover:text-[#141412] bg-transparent focus:outline-none cursor-pointer pr-1"
                    >
                      {availableModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mode Line: Pill + Lead */}
                <div key={mode} className="flex flex-wrap gap-2 items-baseline animate-tab-content">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFD84D] text-[#141412] font-bold shadow-2xs">
                    {curConfig.title}
                  </span>
                  <span className="text-[13px] text-[#8A8A84] leading-relaxed">
                    {curConfig.lead}
                  </span>
                </div>

                {/* Textarea Input */}
                <div className="relative">
                  <textarea
                    id="situation-input"
                    rows={5}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder={curConfig.placeholder}
                    className="w-full text-[14.5px] text-[#141412] bg-white border border-[#D9D9D4] rounded-xl p-3.5 focus:outline-none focus:border-[#141412] focus:ring-2 focus:ring-[#FFD84D]/40 transition-all resize-y min-h-[120px] leading-relaxed placeholder:text-[#8A8A84]"
                  />
                  {inputText.length > 0 && (
                    <span className="absolute bottom-2.5 right-3 font-mono text-[11px] text-[#8A8A84] bg-white/90 px-1.5 py-0.5 rounded border border-[#E8E8E4]">
                      {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} kata &middot; ⌘+Enter
                    </span>
                  )}
                </div>


              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <motion.button
                  type="button"
                  disabled={isLoading || !inputText.trim()}
                  onClick={handleGenerate}
                  whileHover={!isLoading && inputText.trim() ? { y: -1 } : {}}
                  whileTap={!isLoading && inputText.trim() ? { scale: 0.98 } : {}}
                  className={`inline-flex items-center gap-2 font-display font-bold text-sm sm:text-base px-6 py-3 rounded-xl select-none transition-all duration-150 ${
                    !inputText.trim() || isLoading
                      ? "bg-[#E8E8E4] text-[#8A8A84] cursor-not-allowed border border-[#D9D9D4]"
                      : "bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] border border-[#E5B500] shadow-xs cursor-pointer active:bg-[#E5B500]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#141412] border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="font-semibold">Menganalisis dengan RevoU Copilot…</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#141412]" />
                      <span>Generate Rekomendasi Script</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center font-display font-semibold text-sm px-4 py-3 rounded-xl border border-[#D9D9D4] bg-white text-[#4B4B46] hover:text-[#141412] hover:bg-[#F5F5F2] hover:border-[#8A8A84] transition-all cursor-pointer shadow-2xs active:scale-98"
                >
                  Clear
                </button>
              </div>

              {/* Autonote status */}
              <p className="text-[12px] text-[#8A8A84] m-0 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#1F7A4D] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#1F7A4D]" />
                  AI siap
                </span>
                <span>&middot;</span>
                <span>AI memetakan program RevoU yang paling relevan secara otomatis dari knowledge base.</span>
              </p>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#B42318] text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              {/* ========================================================= */}
              {/* D. REVISED STRUCTURED RESULTS AREA (.out)                 */}
              {/* ========================================================= */}
              {responseResult && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-[#E8E8E4] pt-5 mt-6 space-y-6"
                >
                  {/* Output Header */}
                  <div className="flex flex-wrap justify-between items-center gap-2.5 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5F5F2] text-[#4B4B46] font-semibold">
                        {curConfig.title}
                      </span>
                      {responseResult.apiKeyInfo && (
                        <span
                          className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-medium flex items-center gap-1.5"
                          title="API Key yang memproses jawaban ini dalam pool Round Robin"
                        >
                          <Key className="w-3 h-3 text-[#2563EB]" />
                          <span>
                            API {responseResult.apiKeyInfo.activeKeyIndex || 1}/{responseResult.apiKeyInfo.totalKeys || 5}
                          </span>
                          {responseResult.apiKeyInfo.wasRotatedDueToQuota && (
                            <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-1 rounded font-bold">
                              Auto-Rotated (429)
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap items-center">
                      <button
                        type="button"
                        onClick={toggleCurrentSessionFavorite}
                        className={`font-sans text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 select-none active:scale-95 ${isCurrentFavorite
                          ? "bg-[#FFF6D1] text-[#A15C00] border-[#FFD84D] shadow-2xs font-bold"
                          : "bg-white text-[#141412] border-[#D9D9D4] hover:bg-[#F5F5F2]"
                          }`}
                        title={isCurrentFavorite ? "Hapus dari Favorit" : "Simpan draf ini ke koleksi Favorit"}
                      >
                        <Star
                          className={`w-3.5 h-3.5 transition-colors ${isCurrentFavorite ? "fill-[#FFCC1A] text-[#A15C00]" : "text-[#8A8A84]"
                            }`}
                        />
                        <span>{isCurrentFavorite ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
                      </button>

                      {responseResult.scripts && responseResult.scripts.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCopyAll}
                          className="font-sans text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#141412] transition-all cursor-pointer"
                        >
                          {copiedAll ? "Tersalin ✓" : "Salin semua script"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleGenerate}
                        className="font-sans text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#141412] transition-all cursor-pointer"
                      >
                        Buat ulang
                      </button>
                    </div>
                  </div>

                  {/* ===================================================== */}
                  {/* SPECIFIC STRUCTURE BY ACTIVE MENU                     */}
                  {/* ===================================================== */}

                  {/* SECTION: OUTPUT CONTENT */}
                  <div className="space-y-4">

                    {/* ALUMNI MATCHES CARDS GRID (Hanya untuk menu alumni) */}
                    {mode === "alumni" && responseResult.alumni_matches && responseResult.alumni_matches.length > 0 && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                            <UserCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
                            <span>Data Alumni & Bukti Nyata ({responseResult.alumni_matches.length} Profil Ditemukan)</span>
                          </div>
                          <a
                            href="https://www.revou.co/alumni"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-[#0E62FE] hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <span>Direktori Lengkap Alumni</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {responseResult.alumni_matches.map((alumni: any, i: number) => (
                            <div
                              key={i}
                              className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8E8E4] space-y-3.5 shadow-2xs card-interactive flex flex-col justify-between"
                            >
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E8E8E4] pb-2.5">
                                  <div>
                                    <h4 className="font-bold text-[15.5px] text-[#141412] leading-tight">
                                      {alumni.name}
                                    </h4>
                                    <p className="text-xs text-[#8A8A84] font-medium mt-0.5">
                                      {alumni.program_batch}
                                    </p>
                                  </div>
                                  {alumni.achievement && (
                                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#1F7A4D] font-bold shrink-0 border border-[#D4EDDA]">
                                      {alumni.achievement}
                                    </span>
                                  )}
                                </div>

                                <div className="text-xs text-[#4B4B46] space-y-1 bg-[#F5F5F2] p-3 rounded-lg border border-[#E8E8E4]/70">
                                  {alumni.previous_role && alumni.previous_role !== "-" && alumni.previous_role.toLowerCase() !== "tidak ada" && (
                                    <div>
                                      <span className="text-[#8A8A84] font-medium">Latar Belakang / Profesi Sebelumnya: </span>
                                      <span className="font-semibold text-[#141412]">{alumni.previous_role}</span>
                                    </div>
                                  )}
                                  {alumni.current_role && (
                                    <div>
                                      <span className="text-[#8A8A84] font-medium">Posisi & Perusahaan Sekarang: </span>
                                      <span className="font-semibold text-[#1F7A4D]">{alumni.current_role}</span>
                                      {alumni.company && <span className="text-[#4B4B46]"> · {alumni.company}</span>}
                                    </div>
                                  )}
                                  {alumni.industry && (
                                    <div>
                                      <span className="text-[#8A8A84] font-medium">Kategori / Industri: </span>
                                      <span className="font-semibold text-[#141412]">{alumni.industry}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Detailed Career Journey Summary (min 250 words) */}
                                {alumni.career_journey_summary && (
                                  <div className="space-y-1.5 pt-1">
                                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F7A4D] font-bold flex items-center gap-1.5">
                                      <Sparkles className="w-3 h-3 text-[#1F7A4D]" />
                                      <span>Summary Perjalanan Karir & Transformasi:</span>
                                    </div>
                                    <div className="text-[13.5px] text-[#141412] leading-relaxed whitespace-pre-line bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E8E8E4]/80">
                                      {renderFormattedTextWithLinks(alumni.career_journey_summary, { isSummary: true })}
                                    </div>
                                  </div>
                                )}

                                {alumni.why_relevant && (
                                  <p className="text-xs text-[#4B4B46] leading-relaxed bg-[#FFF6D1]/40 p-2.5 rounded-md border border-[#FFD84D]/40">
                                    💡 <span className="text-[#8A8A84] font-semibold">Relevansi untuk Leads: </span>
                                    <span className="font-medium text-[#141412]">{alumni.why_relevant}</span>
                                  </p>
                                )}
                              </div>

                              {alumni.profile_url && (
                                <div className="pt-2.5 border-t border-[#E8E8E4] flex items-center justify-between">
                                  <a
                                    href={alumni.profile_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-[#0E62FE] hover:text-[#0043CE] inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <span>Baca Kisah & Bukti Nyata Alumni di RevoU</span>
                                    <ExternalLink className="w-3.5 h-3.5 inline" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Recommended approach */}
                    {mode === "pitch" && responseResult.recommended_approach && (
                      <div className="bg-[#FFF6D1]/60 p-4 sm:p-5 rounded-xl border border-[#FFD84D]/60 space-y-1.5 card-interactive">
                        <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                          <Lightbulb className="w-3.5 h-3.5 text-[#A15C00]" />
                          <span>Recommended approach for Sales</span>
                        </div>
                        <p className="text-sm text-[#141412] leading-relaxed">
                          {responseResult.recommended_approach}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. SUGGESTED RESPONSE (TAB UI SYSTEM — UNTUK MENU PITCH) */}
                  {mode === "pitch" && responseResult.scripts && responseResult.scripts.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8A8A84] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#8A8A84]" />
                          <span>Suggested response ({responseResult.scripts.length} Variasi)</span>
                        </span>
                      </div>

                      {/* Tabs bar */}
                      <div className="flex border-b border-[#E8E8E4] gap-1 overflow-x-auto pb-px">
                        {responseResult.scripts.map((s: any, idx: number) => {
                          const isActive = activeScriptTab === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveScriptTab(idx)}
                              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${isActive
                                ? "bg-[#F5F5F2] text-[#141412] border-[#FFD84D] font-bold"
                                : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2]/60 border-transparent"
                                }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#FFCC1A]" : "bg-[#D9D9D4]"}`} />
                              <span>{s.badge.split("—")[0].trim() || `Variasi ${idx + 1}`}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Script Blockquote Card */}
                      {responseResult.scripts[activeScriptTab] && (
                        <div className="relative rounded-[12px] bg-[#F5F5F2] border border-[#E8E8E4] p-4 sm:p-5 text-[15px] leading-relaxed card-interactive">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A84] mb-2 font-semibold flex items-center justify-between">
                            <span>{responseResult.scripts[activeScriptTab].badge}</span>
                            {responseResult.scripts[activeScriptTab]?.text && (
                              <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E8E4] text-[#4B4B46] font-medium">
                                {responseResult.scripts[activeScriptTab].text.trim().split(/\s+/).length} kata
                              </span>
                            )}
                          </div>

                          <blockquote className="whitespace-pre-line text-[#141412] font-normal leading-relaxed pb-8">
                            {renderFormattedTextWithLinks(responseResult.scripts[activeScriptTab].text)}
                          </blockquote>

                          {/* Floating Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleCopySingle(responseResult.scripts[activeScriptTab].text, activeScriptTab)}
                            className="absolute right-3 bottom-3 font-mono text-[11px] tracking-wide font-bold px-2.5 py-1 rounded-[6px] bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A] transition-all cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1"
                          >
                            {copiedIndex === activeScriptTab ? (
                              <>
                                <Check className="w-3 h-3 text-[#141412]" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#141412]" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ===================================================== */}
                  {/* Revision / Clarification Section (.chat)             */}
                  {/* ===================================================== */}
                  <div className="border-t border-[#E8E8E4] pt-5 mt-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label
                          htmlFor="chat-input"
                          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#8A8A84]"
                        >
                          Kurang pas? Klarifikasi ke AI
                        </label>
                        <p className="text-[12.5px] text-[#8A8A84] mt-0.5">
                          Kirim pertanyaan atau instruksi revisi. Jawaban dan draf baru akan ditampilkan di bawah tanpa mengubah hasil awal di atas.
                        </p>
                      </div>

                      {chatThread.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setChatThread([]);
                            setClarificationTabs({});
                          }}
                          className="text-xs font-mono text-[#8A8A84] hover:text-[#B42318] hover:underline transition-all cursor-pointer"
                        >
                          Hapus riwayat klarifikasi
                        </button>
                      )}
                    </div>

                    {/* Clarification Input Box */}
                    <div className="flex gap-2 items-end">
                      <textarea
                        id="chat-input"
                        rows={2}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendClarification();
                          }
                        }}
                        placeholder={
                          mode === "alumni"
                            ? "Contoh: Ada contoh alumni lainnya? / Berikan profil alumni yang berbeda dari sebelumnya..."
                            : "Contoh: prospect ini sebenarnya sudah kerja 5 tahun, bukan fresh grad. Tolong sesuaikan scriptnya."
                        }
                        className="flex-1 text-sm text-[#141412] bg-white border border-[#D9D9D4] rounded-[10px] p-2.5 focus:outline-none focus:border-[#141412] focus:ring-2 focus:ring-[#FFF6D1] resize-none"
                      />
                      <button
                        type="button"
                        disabled={isChatLoading || !chatInput.trim()}
                        onClick={() => handleSendClarification()}
                        className="font-display font-bold text-sm px-4 py-2.5 rounded-[10px] bg-[#FFD84D] hover:bg-[#FFCC1A] hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:bg-[#E5B500] text-[#141412] border border-[#FFD84D] transition-all duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none"
                      >
                        {isChatLoading ? "..." : "Kirim"}
                      </button>
                    </div>

                    {/* Quick clarification chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {mode === "alumni" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Berikan contoh alumni lainnya yang berbeda dari yang sudah ditampilkan sebelumnya.")}
                            className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#FFD84D] text-[#141412] font-semibold cursor-pointer hover:bg-[#FFCC1A] active:scale-95 active:bg-[#E5B500] transition-all select-none flex items-center gap-1.5 shadow-2xs"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#141412]" />
                            <span>Contoh alumni lainnya</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Cari contoh alumni yang murni Career Switcher dari latar belakang non-IT.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Career Switcher non-IT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Cari alumni yang mendapatkan kenaikan gaji (salary increase) tinggi.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Kenaikan gaji tinggi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Cari alumni yang Hired Before Graduation (diterima kerja sebelum lulus).")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Hired Before Graduation
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Cari alumni dari industri Manufaktur, BUMN, atau Korporasi besar.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Manufaktur / BUMN
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Buat use case konkret pemetaan AI framework")}
                            className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#FFD84D] text-[#141412] font-semibold cursor-pointer hover:bg-[#FFCC1A] active:scale-95 active:bg-[#E5B500] transition-all select-none"
                          >
                            Buat use case
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Program yang direkomendasikan kurang tepat. Tolong beri alternatif program lain.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Program kurang tepat
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Persona yang kamu tebak salah. Tolong sesuaikan.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Persona salah
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Buat script-nya lebih singkat dan to the point.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Lebih singkat
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Buat nadanya lebih formal dan sopan.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Lebih formal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendClarification("Buat 2 variasi baru dengan angle yang berbeda.")}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#D9D9D4] text-[#4B4B46] hover:text-[#141412] hover:border-[#8A8A84] hover:bg-[#F5F5F2] active:scale-95 active:bg-[#E8E8E4] bg-white transition-all cursor-pointer select-none"
                          >
                            Variasi lain
                          </button>
                        </>
                      )}
                    </div>

                    {/* Loading indicator while waiting for clarification response */}
                    {isChatLoading && (
                      <div className="p-4 bg-[#FFF6D1]/50 border border-[#FFD84D]/60 rounded-xl flex items-center gap-3 animate-pulse">
                        <div className="w-4 h-4 border-2 border-[#141412] border-t-transparent rounded-full animate-spin shrink-0" />
                        <span className="text-sm font-medium text-[#141412]">
                          AI sedang memproses klarifikasi dan menyesuaikan draf script...
                        </span>
                      </div>
                    )}

                    {/* Clarification Responses List (Placed Below the Box) */}
                    {chatThread.length > 0 && (
                      <div className="pt-2 space-y-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FFCC1A]" />
                          <h3 className="font-display font-bold text-sm text-[#141412]">
                            Hasil & Riwayat Klarifikasi ({Math.ceil(chatThread.length / 2)} sesi)
                          </h3>
                        </div>

                        {chatThread.map((msg, i) => {
                          if (msg.role === "user") {
                            return (
                              <div key={msg.id || i} className="flex justify-end pt-1">
                                <div className="max-w-[85%] bg-[#141412] text-white px-4 py-2.5 rounded-[14px_14px_4px_14px] text-sm shadow-2xs">
                                  <div className="flex items-center justify-between gap-3 font-mono text-[10.5px] text-[#D9D9D4] mb-1">
                                    <span>💬 Klarifikasi Kamu</span>
                                    {msg.timestamp && <span>{msg.timestamp}</span>}
                                  </div>
                                  <p className="leading-relaxed font-normal">{msg.text}</p>
                                </div>
                              </div>
                            );
                          }

                          // AI Response Card
                          const currentTab = clarificationTabs[msg.id] ?? 0;
                          const scripts = msg.data?.scripts || [];

                          return (
                            <div
                              key={msg.id || i}
                              className="bg-[#FFFFFF] border-2 border-[#FFD84D]/80 rounded-[14px] p-4 sm:p-5 shadow-[0_2px_8px_rgba(255,216,77,0.15)] space-y-4"
                            >
                              {/* Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E8E4] pb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#FFD84D] bg-[#FFD84D] shrink-0 flex items-center justify-center">
                                    <img
                                      src="/revou-logo.png"
                                      alt="RevoU AI"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="font-display font-bold text-sm text-[#141412]">
                                    Tanggapan & Penyesuaian AI
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {scripts.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyClarificationAll(scripts, msg.id)}
                                      className="font-sans text-[11.5px] font-semibold px-2.5 py-1 rounded-md border border-[#D9D9D4] bg-[#F5F5F2] hover:bg-[#E8E8E4] text-[#141412] transition-all cursor-pointer"
                                    >
                                      {copiedClarificationKey === `${msg.id}-all`
                                        ? "Semua Tersalin ✓"
                                        : "Salin Semua Variasi Revisi"}
                                    </button>
                                  )}
                                  {msg.timestamp && (
                                    <span className="font-mono text-[11px] text-[#8A8A84]">
                                      {msg.timestamp}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* AI Explanation Text */}
                              <div className="bg-[#FFF6D1]/70 p-3.5 rounded-xl border border-[#FFD84D]/50 text-sm text-[#141412] leading-relaxed">
                                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#A15C00] block mb-1">
                                  💡 Catatan Penyesuaian:
                                </span>
                                <p className="font-medium">{msg.text}</p>
                              </div>

                              {/* Recommended Approach if available and in pitch mode */}
                              {mode === "pitch" && msg.data?.recommended_approach && msg.data.recommended_approach !== msg.text && (
                                <div className="p-3 bg-[#F5F5F2] rounded-xl border border-[#E8E8E4] text-xs leading-relaxed space-y-1">
                                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#8A8A84] block">
                                    🎯 Saran Pendekatan Revisi:
                                  </span>
                                  <p className="text-[#141412] font-medium">{msg.data.recommended_approach}</p>
                                </div>
                              )}



                              {/* ALUMNI MATCHES CARDS GRID (From Clarification - Hanya untuk menu alumni) */}
                              {mode === "alumni" && msg.data?.alumni_matches && msg.data.alumni_matches.length > 0 && (
                                <div className="space-y-3 pt-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                                      <UserCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
                                      <span>Data Alumni Hasil Klarifikasi ({msg.data.alumni_matches.length} Profil Ditemukan)</span>
                                    </div>
                                    <a
                                      href="https://www.revou.co/alumni"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-mono text-[11px] text-[#0E62FE] hover:underline inline-flex items-center gap-1 font-semibold"
                                    >
                                      <span>Direktori Lengkap Alumni</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    {msg.data.alumni_matches.map((alumni: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8E8E4] space-y-3.5 shadow-2xs hover:border-[#D9D9D4] transition-all flex flex-col justify-between"
                                      >
                                        <div className="space-y-3">
                                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E8E8E4] pb-2.5">
                                            <div>
                                              <h4 className="font-bold text-[15.5px] text-[#141412] leading-tight">
                                                {alumni.name}
                                              </h4>
                                              <p className="text-xs text-[#8A8A84] font-medium mt-0.5">
                                                {alumni.program_batch}
                                              </p>
                                            </div>
                                            {alumni.achievement && (
                                              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#1F7A4D] font-bold shrink-0 border border-[#D4EDDA]">
                                                {alumni.achievement}
                                              </span>
                                            )}
                                          </div>

                                          <div className="text-xs text-[#4B4B46] space-y-1 bg-[#F5F5F2] p-3 rounded-lg border border-[#E8E8E4]/70">
                                            {alumni.previous_role && alumni.previous_role !== "-" && alumni.previous_role.toLowerCase() !== "tidak ada" && (
                                              <div>
                                                <span className="text-[#8A8A84] font-medium">Latar Belakang / Profesi Sebelumnya: </span>
                                                <span className="font-semibold text-[#141412]">{alumni.previous_role}</span>
                                              </div>
                                            )}
                                            {alumni.current_role && (
                                              <div>
                                                <span className="text-[#8A8A84] font-medium">Posisi & Perusahaan Sekarang: </span>
                                                <span className="font-semibold text-[#1F7A4D]">{alumni.current_role}</span>
                                                {alumni.company && <span className="text-[#4B4B46]"> · {alumni.company}</span>}
                                              </div>
                                            )}
                                            {alumni.industry && (
                                              <div>
                                                <span className="text-[#8A8A84] font-medium">Kategori / Industri: </span>
                                                <span className="font-semibold text-[#141412]">{alumni.industry}</span>
                                              </div>
                                            )}
                                          </div>

                                          {/* Detailed Career Journey Summary (min 250 words) */}
                                          {alumni.career_journey_summary && (
                                            <div className="space-y-1.5 pt-1">
                                              <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F7A4D] font-bold flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3 text-[#1F7A4D]" />
                                                <span>Summary Perjalanan Karir & Transformasi:</span>
                                              </div>
                                              <div className="text-[13.5px] text-[#141412] leading-relaxed whitespace-pre-line bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E8E8E4]/80">
                                                {renderFormattedTextWithLinks(alumni.career_journey_summary, { isSummary: true })}
                                              </div>
                                            </div>
                                          )}

                                          {alumni.why_relevant && (
                                            <p className="text-xs text-[#4B4B46] leading-relaxed bg-[#FFF6D1]/40 p-2.5 rounded-md border border-[#FFD84D]/40">
                                              💡 <span className="text-[#8A8A84] font-semibold">Relevansi untuk Leads: </span>
                                              <span className="font-medium text-[#141412]">{alumni.why_relevant}</span>
                                            </p>
                                          )}
                                        </div>

                                        {alumni.profile_url && (
                                          <div className="pt-2.5 border-t border-[#E8E8E4] flex items-center justify-between">
                                            <a
                                              href={alumni.profile_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs font-semibold text-[#0E62FE] hover:text-[#0043CE] inline-flex items-center gap-1.5 transition-colors"
                                            >
                                              <span>Baca Kisah & Bukti Nyata Alumni di RevoU</span>
                                              <ExternalLink className="w-3.5 h-3.5 inline" />
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Revised Script Variations (for pitch mode) */}
                              {mode === "pitch" && scripts.length > 0 && (
                                <div className="space-y-2.5 pt-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8A8A84] flex items-center gap-1.5">
                                      <Layers className="w-3.5 h-3.5 text-[#8A8A84]" />
                                      <span>Draf Script Hasil Klarifikasi ({scripts.length} Variasi)</span>
                                    </span>
                                  </div>

                                  {/* Tabs Bar */}
                                  <div className="flex border-b border-[#E8E8E4] gap-1 overflow-x-auto pb-px">
                                    {scripts.map((s: any, idx: number) => {
                                      const isActive = currentTab === idx;
                                      return (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() =>
                                            setClarificationTabs((prev) => ({ ...prev, [msg.id]: idx }))
                                          }
                                          className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${isActive
                                            ? "bg-[#F5F5F2] text-[#141412] border-[#FFD84D] font-bold"
                                            : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2]/60 border-transparent"
                                            }`}
                                        >
                                          <span
                                            className={`w-2 h-2 rounded-full ${isActive ? "bg-[#FFCC1A]" : "bg-[#D9D9D4]"
                                              }`}
                                          />
                                          <span>{s.badge?.split("—")[0]?.trim() || `Variasi ${idx + 1}`}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Active Script Content */}
                                  {scripts[currentTab] && (
                                    <div className="relative rounded-[12px] bg-[#F5F5F2] border border-[#E8E8E4] p-4 text-[14.5px] leading-relaxed">
                                      <div className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A84] mb-2 font-semibold flex items-center justify-between">
                                        <span>{scripts[currentTab].badge}</span>
                                        {scripts[currentTab]?.text && (
                                          <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E8E4] text-[#4B4B46] font-medium">
                                            {scripts[currentTab].text.trim().split(/\s+/).length} kata
                                          </span>
                                        )}
                                      </div>

                                      <blockquote className="whitespace-pre-line text-[#141412] font-normal leading-relaxed pb-8">
                                        {renderFormattedTextWithLinks(scripts[currentTab].text)}
                                      </blockquote>

                                      {/* Copy Button */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopyClarificationSingle(
                                            scripts[currentTab].text,
                                            `${msg.id}-${currentTab}`
                                          )
                                        }
                                        className="absolute right-3 bottom-3 font-mono text-[11px] tracking-wide font-bold px-2.5 py-1 rounded-[6px] bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A] transition-all cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1"
                                      >
                                        {copiedClarificationKey === `${msg.id}-${currentTab}` ? (
                                          <>
                                            <Check className="w-3 h-3 text-[#141412]" />
                                            <span>Tersalin</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3 text-[#141412]" />
                                            <span>Salin</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.section>

        {/* ========================================================= */}
        {/* 3. FOOTER                                                 */}
        {/* ========================================================= */}
        <footer className="mt-5 text-xs text-[#8A8A84] leading-relaxed text-center sm:text-left">
          <strong>Jawaban AI adalah draf. Cek ulang harga dan tanggal batch terbaru sebelum dikirim ke prospect.</strong> grounded on<code className="font-mono text-[11px] bg-[#F5F5F2] px-1 py-0.5 rounded">/knowledge/</code>.
        </footer>
      </div>

      {/* ========================================================= */}
      {/* 4. HISTORY & FAVORITES DRAWER                             */}
      {/* ========================================================= */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
            onClick={() => setIsHistoryDrawerOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#E8E8E4] animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#E8E8E4] flex items-center justify-between bg-[#FAFAF8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF6D1] border border-[#FFD84D] flex items-center justify-center text-[#A15C00] shadow-2xs">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#141412] leading-tight">
                      Favorit & Riwayat
                    </h3>
                    <p className="text-xs text-[#8A8A84] mt-0.5">
                      Tersimpan di perangkat lokal (LocalStorage)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHistoryDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg border border-[#E8E8E4] hover:bg-[#F5F5F2] hover:border-[#D9D9D4] flex items-center justify-center text-[#8A8A84] hover:text-[#141412] transition-all cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-Tabs: Favorit vs Semua Riwayat */}
              <div className="px-4 sm:px-5 pt-3 border-b border-[#E8E8E4] flex gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setDrawerTab("favorites")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer select-none ${drawerTab === "favorites"
                    ? "border-[#FFD84D] text-[#141412] bg-[#FFF6D1]/60 rounded-t-lg font-bold"
                    : "border-transparent text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] rounded-t-lg"
                    }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${drawerTab === "favorites" ? "fill-[#FFCC1A] text-[#A15C00]" : "text-[#8A8A84]"
                      }`}
                  />
                  <span>Favorit</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-mono bg-[#E8E8E4] text-[#4B4B46]">
                    {favoritesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerTab("all")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer select-none ${drawerTab === "all"
                    ? "border-[#FFD84D] text-[#141412] bg-[#FFF6D1]/60 rounded-t-lg font-bold"
                    : "border-transparent text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] rounded-t-lg"
                    }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#8A8A84]" />
                  <span>Semua Riwayat</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-mono bg-[#E8E8E4] text-[#4B4B46]">
                    {historyList.length}
                  </span>
                </button>
              </div>

              {/* Search bar inside drawer */}
              <div className="p-3 sm:px-5 sm:py-3 border-b border-[#E8E8E4] bg-white">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8A8A84] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    placeholder="Cari situasi, persona, nama alumni..."
                    className="w-full text-xs text-[#141412] bg-[#F5F5F2] border border-[#E8E8E4] rounded-lg pl-8 pr-7 py-2 focus:outline-none focus:border-[#141412] focus:bg-white transition-all placeholder:text-[#8A8A84]"
                  />
                  {searchHistoryQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchHistoryQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A84] hover:text-[#141412]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#F5F5F2] border border-[#E8E8E4] flex items-center justify-center mx-auto text-[#8A8A84]">
                      {drawerTab === "favorites" ? (
                        <Star className="w-5 h-5 text-[#8A8A84]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#8A8A84]" />
                      )}
                    </div>
                    <p className="font-bold text-sm text-[#141412]">
                      {drawerTab === "favorites"
                        ? "Belum ada skrip yang difavoritkan"
                        : "Belum ada riwayat tercatat"}
                    </p>
                    <p className="text-xs text-[#8A8A84] max-w-xs mx-auto leading-relaxed">
                      {drawerTab === "favorites"
                        ? "Klik tombol ⭐ Simpan ke Favorit pada hasil draf atau di daftar riwayat untuk menyimpannya di sini."
                        : "Setiap draf respon yang kamu buat akan otomatis tersimpan di sini."}
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const isSelectedCurrent = currentSessionId === item.id;
                    const hasClarifications = item.chatThread && item.chatThread.length > 0;
                    const scriptCount = item.responseResult?.scripts?.length || 0;
                    const alumniMatchesCount = item.responseResult?.alumni_matches?.length || 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-2.5 bg-white hover:border-[#D9D9D4] hover:shadow-2xs ${isSelectedCurrent
                          ? "border-[#FFD84D] bg-[#FFF6D1]/20 ring-1 ring-[#FFD84D]"
                          : "border-[#E8E8E4]"
                          }`}
                      >
                        {/* Item Top: Mode Badge, Date, Star & Trash */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`font-mono text-[10.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${item.mode === "pitch"
                                ? "bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D]/60"
                                : item.mode === "alumni"
                                  ? "bg-[#EBF7EE] text-[#1F7A4D] border border-[#D4EDDA]"
                                  : "bg-[#EDF5FF] text-[#0E62FE] border border-[#B3D4FF]"
                                }`}
                            >
                              {item.mode === "pitch" ? "Pitch" : item.mode === "alumni" ? "Alumni" : "Comparison"}
                            </span>
                            <span className="text-[11px] font-mono text-[#8A8A84]">
                              {item.dateFormatted}
                            </span>
                            {hasClarifications && (
                              <span className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F2] text-[#4B4B46] border border-[#E8E8E4]">
                                +klarifikasi
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${item.isFavorite
                                ? "text-[#A15C00] hover:bg-[#FFF6D1]"
                                : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2]"
                                }`}
                              title={item.isFavorite ? "Hapus dari Favorit" : "Tandai sebagai Favorit"}
                            >
                              <Star
                                className={`w-4 h-4 ${item.isFavorite ? "fill-[#FFCC1A] text-[#A15C00]" : ""
                                  }`}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(item.id, e)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8A84] hover:text-[#B42318] hover:bg-red-50 transition-all cursor-pointer"
                              title="Hapus dari riwayat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Situation Input Snippet */}
                        <div>
                          <p className="text-[13px] font-semibold text-[#141412] line-clamp-2 leading-snug">
                            "{item.inputText}"
                          </p>
                        </div>

                        {/* Result Context summary */}
                        <div className="text-xs text-[#4B4B46] bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E8E8E4]/80 space-y-1">
                          {item.mode === "pitch" && item.responseResult?.persona && (
                            <div className="line-clamp-1">
                              <span className="text-[#8A8A84] font-medium">Persona: </span>
                              <span className="font-semibold text-[#141412]">
                                {item.responseResult.persona}
                              </span>
                            </div>
                          )}
                          {item.mode === "alumni" && item.responseResult?.alumni_matches?.[0] && (
                            <div className="line-clamp-1">
                              <span className="text-[#8A8A84] font-medium">Alumni: </span>
                              <span className="font-semibold text-[#1F7A4D]">
                                {item.responseResult.alumni_matches[0].name} (
                                {item.responseResult.alumni_matches[0].current_role})
                              </span>
                            </div>
                          )}
                          {item.mode === "comparison" && item.responseResult?.competitor_analysis?.competitor_name && (
                            <div className="line-clamp-1">
                              <span className="text-[#8A8A84] font-medium">Kompetitor: </span>
                              <span className="font-semibold text-[#0E62FE]">
                                {item.responseResult.competitor_analysis.competitor_name}
                              </span>
                            </div>
                          )}
                          <div className="text-[11px] text-[#8A8A84] font-mono flex items-center gap-2">
                            {scriptCount > 0 && <span>{scriptCount} variasi script</span>}
                            {alumniMatchesCount > 0 && (
                              <span>{alumniMatchesCount} profil alumni</span>
                            )}
                            <span>·</span>
                            <span>{item.model?.includes("lite") ? "Flash Lite" : "Flash"}</span>
                          </div>
                        </div>

                        {/* Action Buttons row */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleLoadSession(item)}
                            className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${isSelectedCurrent
                              ? "bg-[#141412] text-white"
                              : "bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] active:scale-97 shadow-2xs"
                              }`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isSelectedCurrent ? "Sedang Dibuka" : "Muat Sesi Ini"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleQuickCopyHistory(item, e)}
                            className="text-xs font-semibold py-2 px-3 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#141412] flex items-center gap-1.5 transition-all cursor-pointer active:scale-97"
                            title="Salin isi script langsung ke clipboard"
                          >
                            {copiedHistoryId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#1F7A4D]" />
                                <span className="text-[#1F7A4D]">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#8A8A84]" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {historyList.length > 0 && (
                <div className="p-3.5 sm:px-5 sm:py-3.5 border-t border-[#E8E8E4] bg-[#FAFAF8] flex items-center justify-between text-xs">
                  <span className="text-[#8A8A84] font-mono text-[11px]">
                    Total: {historyList.length} sesi ({favoritesCount} favorit)
                  </span>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[#8A8A84] hover:text-[#B42318] hover:underline font-mono text-[11.5px] transition-all cursor-pointer"
                  >
                    Bersihkan non-favorit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL MANAJEMEN 5 API KEYS & MONITOR KUOTA             */}
      {/* ========================================================= */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setIsKeyModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E8E4] overflow-hidden my-6 z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8E8E4] flex items-center justify-between bg-[#FAFAF8] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF6D1] border border-[#FFD84D] flex items-center justify-center text-[#A15C00] shadow-2xs shrink-0">
                  <Key className="w-5 h-5 text-[#A15C00]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#141412] leading-tight flex items-center gap-2">
                    <span>Pool 5 API Key · Rotasi Round Robin</span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#1F7A4D]/10 text-[#1F7A4D] font-bold">
                      Otomatis
                    </span>
                  </h3>
                  <p className="text-xs text-[#8A8A84] mt-0.5">
                    Merotasi 5 API Key secara bergiliran dan otomatis failover jika kuota habis (429 Rate Limit)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-[#E8E8E4] hover:bg-[#F5F5F2] hover:border-[#D9D9D4] flex items-center justify-center text-[#8A8A84] hover:text-[#141412] transition-all cursor-pointer shrink-0"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">


              {/* Status Overview Card */}
              {apiPoolStatus && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-center">
                    <p className="text-[11px] text-[#8A8A84] font-medium">Total Key di Pool</p>
                    <p className="font-mono font-bold text-lg text-[#141412]">
                      {apiPoolStatus.totalKeys || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-center">
                    <p className="text-[11px] text-[#8A8A84] font-medium">Giliran Saat Ini</p>
                    <p className="font-mono font-bold text-lg text-[#0E62FE]">
                      API {apiPoolStatus.activeRoundRobinIndex || 1}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-center">
                    <p className="text-[11px] text-[#8A8A84] font-medium">Key Sehat / Siap</p>
                    <p className="font-mono font-bold text-lg text-[#1F7A4D]">
                      {apiPoolStatus.summary?.healthy ?? apiPoolStatus.totalKeys}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] text-center">
                    <p className="text-[11px] text-[#8A8A84] font-medium">Status Kuota</p>
                    <p className="font-mono font-bold text-xs mt-1 text-[#A15C00] uppercase tracking-wider">
                      {apiPoolStatus.quotaHealth === "optimal"
                        ? "🟢 Optimal"
                        : apiPoolStatus.quotaHealth === "partial_warning"
                          ? "🟡 Sebagian Cooldown"
                          : "🔴 Habis"}
                    </p>
                  </div>
                </div>
              )}

              {/* 5 API Key Slots Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#141412] flex items-center gap-1.5">
                    <span>Daftar 5 API Key</span>
                  </h4>
                  <span className="text-[11px] font-mono text-[#8A8A84]">
                    Tersimpan aman di browser &amp; .env.local
                  </span>
                </div>

                {[0, 1, 2, 3, 4].map((idx) => {
                  const keyNumber = idx + 1;
                  const testRes = testResults?.find((t) => t.index === keyNumber);
                  const poolRec = apiPoolStatus?.keys?.[idx];
                  const hasCustom = Boolean(customApiKeys[idx] && customApiKeys[idx].trim().length > 10);
                  const isCurrentActive = apiPoolStatus?.activeRoundRobinIndex === keyNumber;

                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl p-3 sm:p-3.5 transition-all ${isCurrentActive
                        ? "border-[#FFD84D] bg-[#FFF6D1]/20 shadow-2xs"
                        : "border-[#E8E8E4] bg-[#FAFAF8]"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#141412] px-2.5 py-0.5 rounded-md bg-white border border-[#D9D9D4] shadow-2xs">
                            API {keyNumber}
                          </span>
                          {isCurrentActive && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#FFD84D] text-[#141412]">
                              ⚡ Giliran Berikutnya
                            </span>
                          )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-1.5">
                          {testRes ? (
                            testRes.quotaAvailable ? (
                              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#1F7A4D]/10 text-[#1F7A4D] border border-[#1F7A4D]/20">
                                🟢 Siap ({testRes.latencyMs}ms)
                              </span>
                            ) : testRes.statusCode === 429 ? (
                              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
                                🟡 Kuota Habis (429)
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#DA1E28]/10 text-[#DA1E28] border border-[#DA1E28]/20">
                                🔴 Tidak Valid
                              </span>
                            )
                          ) : poolRec?.status === "rate_limited" ? (
                            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
                              🟡 Cooldown ({poolRec.cooldownSeconds}s)
                            </span>
                          ) : poolRec?.usageCount ? (
                            <span className="text-[11px] font-mono text-[#4B4B46] px-2 py-0.5 rounded-md bg-white border border-[#E8E8E4]">
                              {poolRec.usageCount} request diproses
                            </span>
                          ) : hasCustom ? (
                            <span className="text-[11px] font-mono text-[#1F7A4D] px-2 py-0.5 rounded-md bg-[#1F7A4D]/10">
                              Siap Digunakan
                            </span>
                          ) : poolRec?.isConfigured ? (
                            <span className="text-[11px] font-mono text-[#4B4B46] px-2 py-0.5 rounded-md bg-white border border-[#E8E8E4]">
                              Server Terkonfigurasi
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-[#8A8A84]">
                              Belum Diisi
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Input Box */}
                      <div className="relative flex items-center">
                        <input
                          type={showKeySecret[idx] ? "text" : "password"}
                          value={customApiKeys[idx]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomApiKeys((prev) => {
                              const updated = [...prev];
                              updated[idx] = val;
                              return updated;
                            });
                          }}
                          placeholder={
                            hasCustom
                              ? "••••••••••••••••••••••••••••••••••••"
                              : poolRec?.isConfigured
                                ? "Terkonfigurasi di server (Ketik untuk mengganti)"
                                : `Masukkan API ${keyNumber}...`
                          }
                          className="w-full text-xs font-mono px-3 py-2 pr-16 bg-white border border-[#D9D9D4] rounded-lg text-[#141412] focus:outline-none focus:border-[#0E62FE] focus:ring-1 focus:ring-[#0E62FE] placeholder:text-[#A8A8A2]"
                        />

                        <div className="absolute right-1.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setShowKeySecret((prev) => {
                                const updated = [...prev];
                                updated[idx] = !updated[idx];
                                return updated;
                              });
                            }}
                            className="p-1 text-[#8A8A84] hover:text-[#141412] transition-colors cursor-pointer"
                            title={showKeySecret[idx] ? "Sembunyikan" : "Tampilkan API Key"}
                          >
                            {showKeySecret[idx] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {customApiKeys[idx] && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomApiKeys((prev) => {
                                  const updated = [...prev];
                                  updated[idx] = "";
                                  return updated;
                                });
                              }}
                              className="p-1 text-[#8A8A84] hover:text-[#B42318] transition-colors cursor-pointer"
                              title="Hapus key ini"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>


            </div>

            {/* Modal Actions Footer */}
            <div className="p-3.5 sm:px-5 sm:py-3.5 border-t border-[#E8E8E4] bg-[#FAFAF8] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestKeys}
                  disabled={isTestingKeys}
                  className="font-sans text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#141412] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  title="Ping dan periksa sisa kuota ke-5 API Key di Google AI Studio"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#0E62FE] ${isTestingKeys ? "animate-spin" : ""}`} />
                  <span>{isTestingKeys ? "Menguji Kuota..." : "Test & Cek Kuota Semua Key"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetKeysToDefault}
                  className="font-sans text-xs text-[#8A8A84] hover:text-[#141412] px-2 py-2 hover:underline cursor-pointer"
                >
                  Reset ke Server
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="font-sans text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#4B4B46] cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomKeys}
                  className="font-sans text-xs font-bold px-4 py-2 rounded-xl bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {historyToast && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 bg-[#141412] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#2B2B28] flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#FFD84D]" />
          <span>{historyToast}</span>
        </div>
      )}
    </div>
  );
}
