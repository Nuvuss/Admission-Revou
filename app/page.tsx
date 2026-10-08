"use client";

import React, { useState } from "react";
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
  ExternalLink
} from "lucide-react";

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

type ModeKey = "pitch" | "alumni";

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
};

const availableModels = [
  { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite (Super Cepat & Stabil - Rekomendasi)" },
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Standar)" },
];

export default function DashboardPage() {
  const [mode, setMode] = useState<ModeKey>("pitch");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite");
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

  const [chatInput, setChatInput] = useState("");
  const [chatThread, setChatThread] = useState<ClarificationItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [clarificationTabs, setClarificationTabs] = useState<Record<string, number>>({});
  const [copiedClarificationKey, setCopiedClarificationKey] = useState<string | null>(null);

  const curConfig = MODES[mode];

  const handleClear = () => {
    setInputText("");
    setResponseResult(null);
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: inputText,
          model: selectedModel,
          tab: mode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResponseResult(data);
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

      // Build chat history context
      const chatHistoryContext = newThread
        .filter((msg) => msg.id !== userMsgId) // exclude current message
        .map((msg) => `[${msg.role === "user" ? "Sales" : "AI"}]: ${msg.text}`)
        .join("\n");

      const promptCombined = `Situasi Awal dari Tim Sales:
"""
${inputText}
"""

=== HASIL GENERATE PERTAMA (JADIKAN ACUAN UTAMA) ===
${initialResultSummary}

${chatHistoryContext ? `=== RIWAYAT PERCAKAPAN SEBELUMNYA ===
${chatHistoryContext}

` : ""}=== INSTRUKSI REVISI/KLARIFIKASI TERBARU DARI SALES ===
"""
${q}
"""

INSTRUKSI PENTING:
1. Jika Sales mengklarifikasi atau mencari alumni bidang/program/profesi tertentu (misal: Software Engineering, Data Analytics, Digital Marketing, atau profil khusus), cari data alumni yang relevan dari knowledge base dan WAJIB sertakan 'featured_alumni_summary' dan 'alumni_matches' yang sesuai.
2. Pada menu 'alumni': JANGAN buat pitch WhatsApp dan KOSONGKAN scripts ([]). Fokus tampilkan data alumni RevoU dengan ringkasan singkat serta rangkuman perjalanan karirnya (WAJIB cetak tebal **bold** pemicu aksi dan highlight bagian penting perjalanan karir).
3. Pada menu 'pitch': Sesuaikan draf script pesan sesuai masukan Sales.
4. KHUSUS alumni profile pada 'Applied AI, Analytics & Automation' dan 'Data-Driven Decision Making': Datanya TIDAK memiliki nama orang siapapun dan TIDAK ADA informasi posisi sebelumnya di knowledge base (HANYA Posisi/Job Title, Perusahaan, dan Industri/Kategori). JANGAN PERNAH mengada-ada/mengarang nama orang atau posisi sebelumnya; gunakan format '[Job Title] — [Perusahaan]' dan tampilkan informasi summary murni berdasarkan posisi, perusahaan, dan kategori industri yang ada.
5. VALIDASI MUTLAK KRITERIA (CAREER SWITCHER VS UPSKILLING — NO MISMATCH): Jika Sales meminta kriteria spesifik (misal: "3 orang career switcher"), seluruh profil yang ditampilkan WAJIB 100% murni Career Switcher sejati (terbukti beralih dari profesi/bidang yang berbeda nyata). DILARANG KERAS menyelipkan profil Upskilling (yang sebelumnya sudah di bidang serupa) ke dalam permintaan Career Switcher!
6. ATURAN FILTER BIDANG & INDUSTRI (ZERO TOLERANCE SALAH INDUSTRI): Jika Sales mencari bidang/industri tertentu (misal: "Manufaktur / Manufacture"): Seluruh alumni yang ditampilkan WAJIB 100% murni berasal dari industri tersebut (contoh Manufaktur: PT Karcher, APP, PT Trias Sentosa Tbk, Komatsu Remanufacturing Asia, Gatra Mapan). DILARANG KERAS memberikan profil dari industri lain seperti Oil & Gas (Pertamina) saat diminta Manufaktur!`;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: promptCombined,
          model: selectedModel,
          tab: mode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
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
        setChatThread([...newThread, aiMsg]);
        // NOTE: setResponseResult(data) is intentionally NOT called to keep initial answer intact!
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

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#141412] font-sans antialiased px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-[820px] mx-auto">
        {/* ========================================================= */}
        {/* 1. TOPBAR & HEADER                                        */}
        {/* ========================================================= */}
        <header className="mb-6">
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm shrink-0 border border-[#FFD84D] bg-[#FFD84D] flex items-center justify-center">
              <img
                src="/revou-logo.png"
                alt="RevoU Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-mono text-xs tracking-wider uppercase text-[#8A8A84] m-0">
                RevoU Admission Team · AI Sales Assistant
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#1F7A4D]" />
                <span className="text-xs font-mono text-[#8A8A84]">Grounded on /knowledge/</span>
              </div>
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-[34px] tracking-tight leading-[1.15] text-[#141412] mb-2">
            Turn prospect context into a better pitch.
          </h1>
          <p className="text-[#4B4B46] text-sm sm:text-[15px] leading-relaxed max-w-[62ch]">
            Describe your situation. The assistant identifies the persona, intent, likely concern, and suggested angle.
          </p>

          {/* Greeting Bubble Section */}
          <div className="flex gap-2.5 items-start mt-4 mb-5">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-2xs shrink-0 mt-0.5 border border-[#FFD84D] bg-[#FFD84D] flex items-center justify-center">
              <img
                src="/revou-logo.png"
                alt="RevoU Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#FFF6D1] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] rounded-tl-[4px] p-3 sm:px-4 sm:py-2.5 max-w-[620px] text-sm text-[#141412] shadow-2xs">
              <p className="font-bold mb-0.5">Hi! Aku Admission Assistant 👋</p>
              <p className="leading-relaxed">
                Aku siap bantu kamu menyusun <strong>pitch personal</strong> yang menghubungkan modul program RevoU ke kebutuhan riil dan konteks harian prospect dan juga <strong>mencari data alumni</strong> RevoU untuk dijadikan social proof faktual.
              </p>
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. MAIN CARD WORKSPACE (.card.work)                       */}
        {/* ========================================================= */}
        <section className="bg-white border border-[#E8E8E4] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(20,20,18,0.05),0_4px_16px_rgba(20,20,18,0.04)] space-y-6">
          {/* Start Menu Tabs (Create a Pitch vs Checking Alumni) */}
          <div className="flex border-b border-[#E8E8E4] pb-px gap-2.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleModeChange("pitch")}
              className={`group flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all duration-200 border-b-2 cursor-pointer shrink-0 active:scale-95 select-none ${mode === "pitch"
                ? "bg-[#FFF6D1] text-[#141412] border-[#FFD84D] shadow-[0_2px_8px_rgba(255,216,77,0.35)] animate-tab-active"
                : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] hover:scale-[1.02] border-transparent"
                }`}
            >
              <Sparkles className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-12 ${mode === "pitch" ? "text-[#A15C00] animate-icon-pop" : "text-[#8A8A84]"}`} />
              <span className="transition-colors">Create a Pitch</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("alumni")}
              className={`group flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all duration-200 border-b-2 cursor-pointer shrink-0 active:scale-95 select-none ${mode === "alumni"
                ? "bg-[#FFF6D1] text-[#141412] border-[#FFD84D] shadow-[0_2px_8px_rgba(255,216,77,0.35)] animate-tab-active"
                : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] hover:scale-[1.02] border-transparent"
                }`}
            >
              <UserCheck className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${mode === "alumni" ? "text-[#A15C00] animate-icon-pop" : "text-[#8A8A84]"}`} />
              <span className="transition-colors">Checking Alumni</span>
            </button>
          </div>

          {/* Describe Your Situation Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="situation-input"
                className="font-bold text-[14.5px] text-[#141412] block"
              >
                {mode === "pitch" ? "Describe your situation" : "Cari data alumni / latar belakang leads"}
              </label>

              {/* Model Selector Pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#F5F5F2] px-2.5 py-1 rounded-full border border-[#E8E8E4] self-start sm:self-auto">
                <Cpu className="w-3.5 h-3.5 text-[#8A8A84]" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="font-mono text-[11px] text-[#4B4B46] bg-transparent focus:outline-none cursor-pointer"
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
            <div key={mode} className="flex flex-wrap gap-2 items-baseline mb-2 animate-tab-content">
              <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFD84D] text-[#141412] font-semibold shadow-2xs">
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
                className="w-full text-[15px] text-[#141412] bg-white border border-[#D9D9D4] rounded-[12px] p-3.5 focus:outline-none focus:border-[#141412] focus:ring-3 focus:ring-[#FFF6D1] transition-all resize-y min-h-[120px] leading-relaxed placeholder:text-[#8A8A84]"
              />
              {inputText.length > 0 && (
                <span className="absolute bottom-2.5 right-3 font-mono text-[11px] text-[#8A8A84] bg-white/90 px-1.5 py-0.5 rounded">
                  {inputText.length} kata · ⌘+Enter
                </span>
              )}
            </div>
          </div>

          {/* C. Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={isLoading || !inputText.trim()}
              onClick={handleGenerate}
              className={`inline-flex items-center gap-2 font-display font-bold text-base px-5 py-3 rounded-[10px] select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] focus-visible:ring-offset-2 ${!inputText.trim() || isLoading
                ? "bg-[#FFD84D]/70 text-[#141412]/60 cursor-not-allowed border border-transparent shadow-none"
                : "bg-[#FFD84D] hover:bg-[#FFD84D] hover:brightness-105 hover:border-[#FFE27A] hover:shadow-[0_0_22px_rgba(255,216,77,0.8),0_0_45px_rgba(255,204,26,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.97] active:bg-[#E5B500] active:border-[#D4A300] active:shadow-inner text-[#141412] border border-[#FFD84D] shadow-sm cursor-pointer"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#141412] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="animate-pulse font-medium">Analyzing with Gemini…</span>
                </>
              ) : (
                <>
                  <span>Generate personalized response</span>
                  <span>→</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center font-display font-bold text-base px-4 py-3 rounded-[10px] border border-[#D9D9D4] bg-white text-[#141412] hover:border-[#141412] hover:bg-white hover:shadow-[0_0_20px_rgba(20,20,18,0.18),0_0_35px_rgba(255,216,77,0.38)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.97] active:bg-[#E5E5DF] active:border-[#666660] active:shadow-inner select-none transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9D9D4] focus-visible:ring-offset-2"
            >
              Clear
            </button>
          </div>

          {/* Autonote status */}
          <p className="text-[12.5px] text-[#8A8A84] m-0 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#1F7A4D]">
              <span className="w-2 h-2 rounded-full bg-[#1F7A4D]" />
              AI siap
            </span>
            <span>·</span>
            <span>AI memilih program yang paling cocok dari knowledge base.</span>
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
            <div className="border-t border-[#E8E8E4] pt-5 mt-6 space-y-6 animate-in fade-in duration-300">
              {/* Output Header */}
              <div className="flex flex-wrap justify-between items-center gap-2.5 pb-2">
                <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5F5F2] text-[#4B4B46] font-semibold">
                  {curConfig.title}
                </span>

                <div className="flex gap-2 flex-wrap">
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

                {/* 2. Recommended approach */}
                {mode === "pitch" && responseResult.recommended_approach && (
                  <div className="bg-[#FFF6D1]/60 p-4 sm:p-5 rounded-xl border border-[#FFD84D]/60 space-y-1.5">
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

              {/* 3. SUGGESTED RESPONSE (TAB UI SYSTEM — HANYA UNTUK MENU PITCH) */}
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
                    <div className="relative rounded-[12px] bg-[#F5F5F2] border border-[#E8E8E4] p-4 sm:p-5 text-[15px] leading-relaxed">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A84] mb-2 font-semibold">
                        {responseResult.scripts[activeScriptTab].badge}
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
                    placeholder="Contoh: prospect ini sebenarnya sudah kerja 5 tahun, bukan fresh grad. Tolong sesuaikan scriptnya."
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

                          {/* Revised Script Variations (ONLY for pitch mode) */}
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
                                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A84] mb-2 font-semibold">
                                    {scripts[currentTab].badge}
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
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* 3. FOOTER                                                 */}
        {/* ========================================================= */}
        <footer className="mt-5 text-xs text-[#8A8A84] leading-relaxed text-center sm:text-left">
          <strong>Jawaban AI adalah draf. Cek ulang harga dan tanggal batch terbaru sebelum dikirim ke prospect.</strong> grounded on<code className="font-mono text-[11px] bg-[#F5F5F2] px-1 py-0.5 rounded">/knowledge/</code>.
        </footer>
      </div>
    </div>
  );
}
