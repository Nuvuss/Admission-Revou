"use client";

import React from "react";
import { Layers, Copy, Check } from "lucide-react";
import { renderFormattedTextWithLinks } from "../utils/formatText";

interface PitchScriptItem {
  badge: string;
  text: string;
}

interface PitchScriptsProps {
  scripts: PitchScriptItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
  onCopySingle: (text: string, index: number) => void;
  copiedIndex: number | null;
}

export default function PitchScripts({
  scripts,
  activeTab,
  onTabChange,
  onCopySingle,
  copiedIndex,
}: PitchScriptsProps) {
  if (!scripts || scripts.length === 0) return null;

  const currentScript = scripts[activeTab] || scripts[0];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8A8A84] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#8A8A84]" />
          <span>Suggested response ({scripts.length} Variasi)</span>
        </span>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-[#E8E8E4] gap-1 overflow-x-auto pb-px">
        {scripts.map((s, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onTabChange(idx)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#F5F5F2] text-[#141412] border-[#FFD84D] font-bold"
                  : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2]/60 border-transparent"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-[#FFCC1A]" : "bg-[#D9D9D4]"
                }`}
              />
              <span>{s.badge.split("—")[0].trim() || `Variasi ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Active Script Blockquote Card */}
      {currentScript && (
        <div className="relative rounded-[12px] bg-[#F5F5F2] border border-[#E8E8E4] p-4 sm:p-5 text-[15px] leading-relaxed card-interactive">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A84] mb-2 font-semibold flex items-center justify-between">
            <span>{currentScript.badge}</span>
            {currentScript.text && (
              <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E8E4] text-[#4B4B46] font-medium">
                {currentScript.text.trim().split(/\s+/).length} kata
              </span>
            )}
          </div>

          <blockquote className="whitespace-pre-line text-[#141412] font-normal leading-relaxed pb-8">
            {renderFormattedTextWithLinks(currentScript.text)}
          </blockquote>

          {/* Floating Copy Button */}
          <button
            type="button"
            onClick={() => onCopySingle(currentScript.text, activeTab)}
            className="absolute right-3 bottom-3 font-mono text-[11px] tracking-wide font-bold px-2.5 py-1 rounded-[6px] bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A] transition-all cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1"
          >
            {copiedIndex === activeTab ? (
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
  );
}
