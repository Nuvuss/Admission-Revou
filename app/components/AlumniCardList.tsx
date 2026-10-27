"use client";

import React from "react";
import { UserCheck, Sparkles, ExternalLink } from "lucide-react";
import { renderFormattedTextWithLinks } from "../utils/formatText";

interface AlumniMatch {
  name: string;
  program_batch?: string;
  achievement?: string;
  previous_role?: string;
  current_role?: string;
  company?: string;
  industry?: string;
  career_journey_summary?: string;
  why_relevant?: string;
  profile_url?: string;
}

interface AlumniCardListProps {
  matches: AlumniMatch[];
  title?: string;
}

export default function AlumniCardList({
  matches,
  title = "Data Alumni & Bukti Nyata",
}: AlumniCardListProps) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
          <UserCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
          <span>
            {title} ({matches.length} Profil Ditemukan)
          </span>
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
        {matches.map((alumni, i) => (
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
                  {alumni.program_batch && (
                    <p className="text-xs text-[#8A8A84] font-medium mt-0.5">
                      {alumni.program_batch}
                    </p>
                  )}
                </div>
                {alumni.achievement && (
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#1F7A4D] font-bold shrink-0 border border-[#D4EDDA]">
                    {alumni.achievement}
                  </span>
                )}
              </div>

              <div className="text-xs text-[#4B4B46] space-y-1 bg-[#F5F5F2] p-3 rounded-lg border border-[#E8E8E4]/70">
                {alumni.previous_role &&
                  alumni.previous_role !== "-" &&
                  alumni.previous_role.toLowerCase() !== "tidak ada" && (
                    <div>
                      <span className="text-[#8A8A84] font-medium">
                        Latar Belakang / Profesi Sebelumnya:{" "}
                      </span>
                      <span className="font-semibold text-[#141412]">
                        {alumni.previous_role}
                      </span>
                    </div>
                  )}
                {alumni.current_role && (
                  <div>
                    <span className="text-[#8A8A84] font-medium">
                      Posisi & Perusahaan Sekarang:{" "}
                    </span>
                    <span className="font-semibold text-[#1F7A4D]">
                      {alumni.current_role}
                    </span>
                    {alumni.company && (
                      <span className="text-[#4B4B46]"> · {alumni.company}</span>
                    )}
                  </div>
                )}
                {alumni.industry && (
                  <div>
                    <span className="text-[#8A8A84] font-medium">
                      Kategori / Industri:{" "}
                    </span>
                    <span className="font-semibold text-[#141412]">
                      {alumni.industry}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed Career Journey Summary */}
              {alumni.career_journey_summary && (
                <div className="space-y-1.5 pt-1">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F7A4D] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#1F7A4D]" />
                    <span>Summary Perjalanan Karir & Transformasi:</span>
                  </div>
                  <div className="text-[13.5px] text-[#141412] leading-relaxed whitespace-pre-line bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E8E8E4]/80">
                    {renderFormattedTextWithLinks(
                      alumni.career_journey_summary,
                      { isSummary: true }
                    )}
                  </div>
                </div>
              )}

              {alumni.why_relevant && (
                <p className="text-xs text-[#4B4B46] leading-relaxed bg-[#FFF6D1]/40 p-2.5 rounded-md border border-[#FFD84D]/40">
                  💡{" "}
                  <span className="text-[#8A8A84] font-semibold">
                    Relevansi untuk Leads:{" "}
                  </span>
                  <span className="font-medium text-[#141412]">
                    {alumni.why_relevant}
                  </span>
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
  );
}
