"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  FileText,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { FaqItemResult, FaqResponsePayload } from "../types";

interface FaqResultCardProps {
  faqResult: FaqResponsePayload;
  onCopyAnswer?: (text: string, item: FaqItemResult, isPartialWarning: boolean) => void;
  onSwitchToPitch?: () => void;
}

const PLACEHOLDER_SPLIT_REGEX =
  /(\[HARI & JAM\]|\[DETAIL CICILAN\]|\[LINK BOOKING\]|\[BELUM ADA JAWABAN RESMI\]|\bNAMA\b|\bXXXXXX\b|\bxxxxx\b)/g;

const PLACEHOLDER_TEST_REGEX =
  /^(\[HARI & JAM\]|\[DETAIL CICILAN\]|\[LINK BOOKING\]|\[BELUM ADA JAWABAN RESMI\]|NAMA|XXXXXX|xxxxx)$/;

const URL_REGEX = /(https?:\/\/[^\s<>)]+)/g;

/**
 * Render verbatim WhatsApp text while:
 * 1. Highlighting unresolved placeholders ([HARI & JAM], NAMA, XXXXXX, etc.) as amber attention chips
 * 2. Rendering clickable URLs and WhatsApp *bold* / _italic_ cleanly
 * Note: Copy button ALWAYS copies the raw verbatim text untouched.
 */
function renderVerbatimWhatsAppText(rawText: string): React.ReactNode {
  const lines = rawText.split("\n");
  return lines.map((line, lineIdx) => {
    const segments = line.split(PLACEHOLDER_SPLIT_REGEX);
    return (
      <React.Fragment key={lineIdx}>
        {segments.map((seg, segIdx) => {
          if (!seg) return null;
          if (PLACEHOLDER_TEST_REGEX.test(seg)) {
            return (
              <mark
                key={segIdx}
                className="inline-block px-1.5 py-0.2 mx-0.5 rounded bg-[#FFF6D1] text-[#A15C00] border border-[#F59E0B]/50 font-mono text-[13px] font-semibold align-baseline"
                title="Bagian ini perlu diisi atau dikonfirmasi sebelum dikirim ke prospek"
              >
                {seg}
              </mark>
            );
          }

          // Linkify URLs inside non-placeholder segments
          const urlParts = seg.split(URL_REGEX);
          return urlParts.map((part, partIdx) => {
            if (/^https?:\/\//.test(part)) {
              return (
                <a
                  key={`${segIdx}-${partIdx}`}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] underline decoration-[#0F766E]/40 hover:decoration-[#0F766E] break-all transition-colors duration-[var(--dur-fast)]"
                >
                  {part}
                </a>
              );
            }
            // Render WhatsApp *bold* inline while keeping text legible
            const boldParts = part.split(/(\*[^*\n]+\*)/g);
            return boldParts.map((bp, bpIdx) => {
              if (bp.startsWith("*") && bp.endsWith("*") && bp.length > 2) {
                return (
                  <strong key={`${segIdx}-${partIdx}-${bpIdx}`} className="font-semibold text-[#141412]">
                    {bp.slice(1, -1)}
                  </strong>
                );
              }
              return <React.Fragment key={`${segIdx}-${partIdx}-${bpIdx}`}>{bp}</React.Fragment>;
            });
          });
        })}
        {lineIdx < lines.length - 1 && "\n"}
      </React.Fragment>
    );
  });
}

function FaqSheetCard({
  item,
  compact,
  onCopyAnswer,
}: {
  item: FaqItemResult;
  compact: boolean;
  onCopyAnswer?: (text: string, item: FaqItemResult, isPartialWarning: boolean) => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const needsCaution = Boolean(item.unconfirmed || item.stale_date);
  const hasPlaceholders = Array.isArray(item.placeholders) && item.placeholders.length > 0;
  const isMultiBubble = Array.isArray(item.bubbles) && item.bubbles.length > 1;
  const bubbles =
    Array.isArray(item.bubbles) && item.bubbles.length > 0
      ? item.bubbles
      : [{ label: null, text: item.answer_verbatim }];

  const railColor = needsCaution ? "border-l-[#A15C00]" : "border-l-[#1F7A4D]";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
    if (onCopyAnswer) {
      onCopyAnswer(text, item, needsCaution || hasPlaceholders);
    }
  };

  return (
    <article
      className={`bg-white border border-[#E8E8E4] border-l-[3px] ${railColor} rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)]`}
    >
      <div className="space-y-3.5">
        {/* Header: Program name + Verification badge (icon + text, never color alone) */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-[#141412] leading-snug">
              {item.program_label}
            </p>
            <p className="text-xs text-[#60605B] mt-0.5">{item.category}</p>
          </div>

          {item.unconfirmed ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#A15C00] border border-[#FDE68A] text-xs font-semibold shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Perlu konfirmasi tim admission</span>
            </span>
          ) : item.stale_date ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#A15C00] border border-[#FDE68A] text-xs font-semibold shrink-0">
              <CalendarClock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Cek tanggal batch terbaru</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#1F7A4D] border border-[#BBF7D0] text-xs font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Terverifikasi · Siap kirim</span>
            </span>
          )}
        </div>

        {/* Matched Question */}
        <div className="border-t border-[#E8E8E4] pt-3">
          <p className="text-xs text-[#60605B] mb-0.5">Pertanyaan cocok</p>
          <h3 className="font-display font-bold text-[15px] sm:text-base text-[#141412] leading-snug">
            {item.question}
          </h3>
        </div>

        {/* AC Caution Banner for unconfirmed / stale / AC note */}
        {(item.unconfirmed || item.stale_date || item.ac_note) && (
          <div
            role="note"
            className={`rounded-lg px-3.5 py-2.5 text-xs leading-relaxed flex items-start gap-2.5 border ${
              needsCaution
                ? "bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]"
                : "bg-[#F5F5F2] border-[#E8E8E4] text-[#4B4B46]"
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 shrink-0 mt-0.5 ${needsCaution ? "text-[#A15C00]" : "text-[#60605B]"}`}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-semibold text-[#141412]">
                {item.unconfirmed
                  ? "Catatan AC (belum final)"
                  : item.stale_date
                    ? "Periksa tanggal sebelum kirim"
                    : "Catatan AC"}
              </p>
              {item.ac_note && <p>{item.ac_note}</p>}
              {item.unconfirmed && (
                <p>
                  Jangan menjanjikan detail yang masih belum pasti atau bertanda kurung siku kepada calon peserta sebelum dikonfirmasi tim admission.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Verbatim WhatsApp Script Bubble(s) */}
        <div className="space-y-2.5">
          {bubbles.map((bubble, bIdx) => {
            const bubbleKey = `${item.id}-b-${bIdx}`;
            const bubbleLabel = bubble.label || (isMultiBubble ? `Bubble ${bIdx + 1}` : null);
            return (
              <div
                key={bubbleKey}
                className="rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] p-3.5 sm:p-4 space-y-2.5"
              >
                {bubbleLabel && (
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E8E4]">
                    <span className="text-xs font-semibold text-[#4B4B46]">{bubbleLabel}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bubble.text, bubbleKey)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#FFD84D] border border-[#D9D9D4] hover:border-[#E5B500] text-xs font-semibold text-[#141412] transition-[background-color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-95 cursor-pointer"
                    >
                      {copiedKey === bubbleKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1F7A4D]" aria-hidden="true" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Salin bagian ini</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div
                  className={`whitespace-pre-wrap text-[14.5px] sm:text-[15px] leading-[1.6] text-[#141412] ${
                    compact ? "" : "max-w-[68ch]"
                  }`}
                >
                  {renderVerbatimWhatsAppText(bubble.text)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Placeholder hint footer if placeholders detected */}
        {hasPlaceholders && (
          <p className="text-xs text-[#A15C00] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              Terdapat placeholder yang perlu diisi sebelum kirim:{" "}
              <span className="font-mono font-semibold">{item.placeholders?.join(", ")}</span>
            </span>
          </p>
        )}
      </div>

      {/* Footer: Source file citation + Primary Copy CTA */}
      <div className="pt-3 border-t border-[#E8E8E4] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#60605B] min-w-0">
          <FileText className="w-3.5 h-3.5 shrink-0 text-[#60605B]" aria-hidden="true" />
          <span className="truncate" title={item.source_file}>
            {item.source_file}
          </span>
          {item.same_as && (
            <span className="text-[#8A8A84] hidden sm:inline">({item.same_as})</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleCopy(item.answer_verbatim, `${item.id}-all`)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-[background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-95 cursor-pointer shrink-0 ${
            needsCaution
              ? "bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#A15C00] border border-[#F59E0B]/60"
              : "bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] border border-[#E5B500]/60"
          }`}
        >
          {copiedKey === `${item.id}-all` ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Skrip tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {needsCaution
                  ? "Salin (belum final)"
                  : isMultiBubble
                    ? `Salin semua (${bubbles.length})`
                    : "Salin skrip"}
              </span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default function FaqResultCard({
  faqResult,
  onCopyAnswer,
  onSwitchToPitch,
}: FaqResultCardProps) {
  if (!faqResult) return null;

  const items = Array.isArray(faqResult.items) ? faqResult.items : [];
  const missingPrograms = Array.isArray(faqResult.missing_programs)
    ? faqResult.missing_programs
    : [];
  const comparisonDraft =
    typeof faqResult.comparison_draft === "string" && faqResult.comparison_draft.trim()
      ? faqResult.comparison_draft.trim()
      : null;
  const [copiedDraft, setCopiedDraft] = useState(false);

  // State: Not Found at all
  if (!faqResult.found || items.length === 0) {
    return (
      <div className="animate-tab-content bg-white border border-[#E8E8E4] border-l-[3px] border-l-[#60605B] rounded-xl p-5 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#4B4B46] border border-[#E8E8E4] text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Belum ada di FAQ</span>
        </div>

        <div className="space-y-1 max-w-[65ch]">
          <h3 className="font-display font-bold text-base text-[#141412]">
            {faqResult.fallback_message || "Belum ada di FAQ, konfirmasi tim admission."}
          </h3>
          <p className="text-sm text-[#4B4B46] leading-relaxed">
            Pertanyaan ini belum tercatat di file FAQ program terkait. Hindari mengarang jawaban — konfirmasi dulu ke tim admission atau tim program.
          </p>
        </div>

        {onSwitchToPitch && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onSwitchToPitch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-xs font-semibold text-[#141412] transition-colors duration-[var(--dur-fast)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A15C00]" aria-hidden="true" />
              <span>Buka di Create a Pitch</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Decide single-column vs 2-column comparison layout
  const uniqueProgramsCount = new Set(items.map((i) => i.program)).size;
  const totalCards = items.length + missingPrograms.length;
  const useTwoColumns = uniqueProgramsCount >= 2 || (items.length >= 1 && missingPrograms.length >= 1);
  const anySourceNeedsCaution = items.some((i) => i.unconfirmed || i.stale_date);

  const handleCopyDraft = () => {
    if (!comparisonDraft) return;
    navigator.clipboard.writeText(comparisonDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 1800);
    if (onCopyAnswer && items[0]) {
      onCopyAnswer(comparisonDraft, items[0], anySourceNeedsCaution);
    }
  };

  return (
    <div className="animate-tab-content space-y-4">
      {/* Stage 2 Output: Synthesized WhatsApp Comparison Draft (when 2+ programs compiled) */}
      {comparisonDraft && (
        <article
          className={`bg-white border border-[#E8E8E4] border-l-[3px] ${
            anySourceNeedsCaution ? "border-l-[#A15C00]" : "border-l-[#1F7A4D]"
          } rounded-xl p-4 sm:p-5 space-y-3.5`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-[15px] sm:text-base text-[#141412] leading-snug">
                Draf perbandingan siap kirim (WhatsApp)
              </h3>
              <p className="text-xs text-[#60605B] mt-0.5 tabular-nums">
                Disusun otomatis dari {items.length} sumber FAQ verbatim di bawah
              </p>
            </div>

            {anySourceNeedsCaution ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#A15C00] border border-[#FDE68A] text-xs font-semibold shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Cek poin belum final</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#1F7A4D] border border-[#BBF7D0] text-xs font-semibold shrink-0">
                <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Hasil compile &amp; improvisasi</span>
              </span>
            )}
          </div>

          <div className="rounded-xl bg-[#F5F5F2] border border-[#E8E8E4] p-4 sm:p-4.5">
            <div className="whitespace-pre-wrap text-[14.5px] sm:text-[15px] leading-[1.6] text-[#141412] max-w-[68ch]">
              {renderVerbatimWhatsAppText(comparisonDraft)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-mono text-[#60605B]">
              Grounded 100% pada sumber FAQ verbatim di bawah
            </span>
            <button
              type="button"
              onClick={handleCopyDraft}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-[background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-95 cursor-pointer ${
                anySourceNeedsCaution
                  ? "bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#A15C00] border border-[#F59E0B]/60"
                  : "bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] border border-[#E5B500]/60"
              }`}
            >
              {copiedDraft ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Draf tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{anySourceNeedsCaution ? "Salin draf (cek catatan)" : "Salin draf perbandingan"}</span>
                </>
              )}
            </button>
          </div>
        </article>
      )}

      {/* Subtle result summary bar (sentence case, tabular-nums) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B4B46]">
        <span className="tabular-nums">
          {comparisonDraft ? (
            <>
              Sumber FAQ verbatim referensi (<strong className="text-[#141412]">{items.length}</strong> entri)
            </>
          ) : useTwoColumns ? (
            <>
              Tersedia di <strong className="text-[#141412]">{uniqueProgramsCount}</strong> program — pilih skrip sesuai program yang diminati prospek
            </>
          ) : (
            <>
              Ditemukan <strong className="text-[#141412]">{items.length}</strong> jawaban verbatim dari file FAQ
            </>
          )}
        </span>
      </div>

      <div
        className={
          useTwoColumns
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
            : "space-y-4"
        }
      >
        {items.map((item) => (
          <FaqSheetCard
            key={item.id}
            item={item}
            compact={useTwoColumns && totalCards >= 2}
            onCopyAnswer={onCopyAnswer}
          />
        ))}

        {missingPrograms.map((progName) => (
          <div
            key={progName}
            className="bg-white border border-[#E8E8E4] border-l-[3px] border-l-[#60605B] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display font-bold text-sm text-[#141412]">{progName}</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5F5F2] text-[#4B4B46] border border-[#E8E8E4] text-xs font-semibold shrink-0">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Belum ada di FAQ</span>
                </span>
              </div>
              <p className="text-sm text-[#4B4B46] leading-relaxed">
                Belum ada di FAQ, konfirmasi tim admission.
              </p>
            </div>
            <p className="text-[11px] font-mono text-[#60605B] pt-2 border-t border-[#E8E8E4]">
              Tidak ditemukan entri FAQ yang cocok untuk program ini.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
