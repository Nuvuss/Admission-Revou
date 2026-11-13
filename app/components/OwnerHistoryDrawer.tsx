"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Loader2, Clock, User, MessageSquare, ChevronRight } from "lucide-react";
import PitchScripts from "./PitchScripts";
import AlumniCardList from "./AlumniCardList";

interface OwnerHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  token?: string;
  topic?: string | null; // filter topik (nama topik yang diklik)
  user?: string | null; // filter user (opsional)
}

interface HistoryListItem {
  id: string;
  created_at: string;
  user_name: string;
  user_role: string;
  mode: string;
  model_used: string | null;
  topic: string | null;
  input_text: string;
  duration_ms: number | null;
}

interface HistoryDetail extends HistoryListItem {
  result_json: any;
  chat_thread: any[];
}

const MODE_LABEL: Record<string, string> = {
  pitch: "Create a Pitch",
  alumni: "Checking Alumni",
  comparison: "Comparison Table",
};

const MODE_COLOR: Record<string, string> = {
  pitch: "bg-[#FFD84D] text-[#141412]",
  alumni: "bg-[#60A5FA] text-[#141412]",
  comparison: "bg-[#34D399] text-[#141412]",
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function asText(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

/** Renderer hasil (defensif): scripts, alumni_matches, comparison_points, dan field teks ringkasan. */
function ResultBody({ result }: { result: any }) {
  const [tab, setTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!result || typeof result !== "object") {
    return <p className="text-xs text-[#7A7A74]">Hasil tidak tersimpan.</p>;
  }

  const scripts = Array.isArray(result.scripts) ? result.scripts : [];
  const alumni = Array.isArray(result.alumni_matches) ? result.alumni_matches : [];
  const comparison = Array.isArray(result.comparison_points) ? result.comparison_points : [];
  const textFields: { key: string; label: string }[] = [
    { key: "persona", label: "Persona" },
    { key: "program_match", label: "Program Match" },
    { key: "whats_happening", label: "What's Happening" },
    { key: "recommended_approach", label: "Recommended Approach" },
    { key: "featured_alumni_summary", label: "Featured Alumni" },
  ];
  const visibleText = textFields.filter((f) => result[f.key]);
  const hasAnything = scripts.length || alumni.length || comparison.length || visibleText.length;

  return (
    <div className="space-y-4">
      {visibleText.map((f) => (
        <div key={f.key} className="space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A74]">{f.label}</div>
          <div className="text-xs text-[#141412] whitespace-pre-wrap leading-relaxed">{asText(result[f.key])}</div>
        </div>
      ))}

      {scripts.length > 0 && (
        <PitchScripts
          scripts={scripts}
          activeTab={Math.min(tab, scripts.length - 1)}
          onTabChange={setTab}
          copiedIndex={copiedIndex}
          onCopySingle={(text, index) => {
            navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
          }}
        />
      )}

      {alumni.length > 0 && <AlumniCardList matches={alumni} />}

      {comparison.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A74]">
            Poin Perbandingan ({comparison.length})
          </div>
          <ul className="space-y-1.5">
            {comparison.map((p: any, i: number) => (
              <li key={i} className="text-xs bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 whitespace-pre-wrap">
                {asText(p)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasAnything && (
        <pre className="text-[10.5px] bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg p-3 overflow-auto max-h-80">
          {asText(result)}
        </pre>
      )}
    </div>
  );
}

export default function OwnerHistoryDrawer({ open, onClose, token, topic, user }: OwnerHistoryDrawerProps) {
  const [items, setItems] = useState<HistoryListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("");
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const authHeaders = useCallback(
    (): HeadersInit => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const loadList = useCallback(
    async (cursor?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: "20" });
        if (topic) params.set("topic", topic);
        const effectiveUser = userFilter.trim() || user || "";
        if (effectiveUser) params.set("user", effectiveUser);
        if (modeFilter !== "all") params.set("mode", modeFilter);
        if (cursor) params.set("cursor", cursor);
        const res = await fetch(`/api/analytics/history?${params.toString()}`, {
          headers: authHeaders(),
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Gagal memuat riwayat.");
        setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
        setNextCursor(data.nextCursor || null);
      } catch (e: any) {
        setError(e?.message || "Gagal memuat riwayat.");
      } finally {
        setLoading(false);
      }
    },
    [topic, user, userFilter, modeFilter, authHeaders]
  );

  useEffect(() => {
    if (!open) return;
    setDetail(null);
    loadList(null);
  }, [open, loadList]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/history?id=${encodeURIComponent(id)}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Gagal memuat detail.");
      setDetail(data.item);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Riwayat Generate"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#E8E8E4]">
              <div className="flex items-center gap-2 min-w-0">
                {detail && (
                  <button
                    onClick={() => setDetail(null)}
                    className="p-1 rounded-md hover:bg-[#F5F5F2] cursor-pointer"
                    aria-label="Kembali ke daftar"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-sm font-display font-black uppercase tracking-wider truncate">
                  Riwayat Generate{topic ? `: ${topic}` : ""}
                </h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-[#F5F5F2] cursor-pointer" aria-label="Tutup">
                <X className="w-4 h-4" />
              </button>
            </header>

            {error && <div className="mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

            {!detail ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#F0F0EC]">
                  <select
                    value={modeFilter}
                    onChange={(e) => setModeFilter(e.target.value)}
                    className="text-xs border border-[#E8E8E4] rounded-md px-2 py-1 bg-white"
                    aria-label="Filter mode"
                  >
                    <option value="all">Semua mode</option>
                    <option value="pitch">Create a Pitch</option>
                    <option value="alumni">Checking Alumni</option>
                    <option value="comparison">Comparison Table</option>
                  </select>
                  <input
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    placeholder={user ? `User (default: ${user})` : "Filter nama user (persis)"}
                    className="flex-1 text-xs border border-[#E8E8E4] rounded-md px-2 py-1"
                    aria-label="Filter user"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {items.length === 0 && !loading && !error && (
                    <p className="py-10 text-center text-xs text-[#7A7A74]">
                      Belum ada riwayat tersimpan untuk filter ini. Data terkumpul sejak fitur ini dirilis.
                    </p>
                  )}
                  {items.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => openDetail(it.id)}
                      className="w-full text-left rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] hover:bg-white hover:border-[#D9D9D4] px-3 py-2.5 space-y-1.5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10.5px]">
                        <span className={`px-1.5 py-0.5 rounded-md font-bold ${MODE_COLOR[it.mode] || "bg-[#E8E8E4]"}`}>
                          {MODE_LABEL[it.mode] || it.mode}
                        </span>
                        <span className="font-mono text-[#7A7A74] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(it.created_at)}
                        </span>
                      </div>
                      <div className="text-xs text-[#141412] line-clamp-2">{it.input_text}</div>
                      <div className="flex items-center justify-between text-[10.5px] text-[#7A7A74]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <strong className="text-[#141412]">{it.user_name}</strong> ({it.user_role})
                        </span>
                        <span className="flex items-center gap-1">
                          {it.model_used || "-"}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                  {loading && (
                    <div className="py-4 flex justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-[#7A7A74]" />
                    </div>
                  )}
                  {nextCursor && !loading && (
                    <button
                      onClick={() => loadList(nextCursor)}
                      className="w-full text-xs font-bold py-2 rounded-lg border border-[#E8E8E4] hover:bg-[#F5F5F2] cursor-pointer"
                    >
                      Muat lebih banyak
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
                    <span className={`px-1.5 py-0.5 rounded-md font-bold ${MODE_COLOR[detail.mode] || "bg-[#E8E8E4]"}`}>
                      {MODE_LABEL[detail.mode] || detail.mode}
                    </span>
                    {detail.topic && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#141412] text-[#FFD84D] font-bold">{detail.topic}</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#7A7A74]">
                    <strong className="text-[#141412]">{detail.user_name}</strong> ({detail.user_role}) •{" "}
                    {formatDateTime(detail.created_at)}
                  </div>
                </div>

                <section className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A74]">Input Prospek</div>
                  <div className="text-xs bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 whitespace-pre-wrap">
                    {detail.input_text}
                  </div>
                </section>

                <ResultBody result={detail.result_json} />

                {Array.isArray(detail.chat_thread) && detail.chat_thread.length > 0 && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A74]">
                      <MessageSquare className="w-3 h-3" />
                      Klarifikasi / Follow-up ({detail.chat_thread.length})
                    </div>
                    {detail.chat_thread.map((m: any, i: number) => (
                      <div
                        key={m?.id || i}
                        className={`rounded-lg border px-3 py-2 space-y-2 ${
                          m?.role === "user" ? "bg-[#FFF9DB] border-[#F3E6A0]" : "bg-white border-[#E8E8E4]"
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase text-[#7A7A74]">
                          {m?.role === "user" ? "Sales" : "AI"} {m?.timestamp ? `• ${m.timestamp}` : ""}
                        </div>
                        <div className="text-xs whitespace-pre-wrap">{asText(m?.text)}</div>
                        {m?.role === "ai" && m?.data && <ResultBody result={m.data} />}
                      </div>
                    ))}
                  </section>
                )}

                <footer className="pt-2 border-t border-[#F0F0EC] text-[10.5px] font-mono text-[#7A7A74] flex flex-wrap gap-x-4 gap-y-1">
                  <span>Model: {detail.model_used || "-"}</span>
                  <span>Durasi: {detail.duration_ms != null ? `${detail.duration_ms} ms` : "-"}</span>
                  <span>Waktu: {formatDateTime(detail.created_at)}</span>
                </footer>
              </div>
            )}

            {detailLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

