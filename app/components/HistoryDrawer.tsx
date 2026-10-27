"use client";

import React, { useState } from "react";
import {
  Bookmark,
  X,
  Star,
  Clock,
  Search,
  Trash2,
  RotateCcw,
  Check,
  Copy,
} from "lucide-react";
import { HistoryItem } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: HistoryItem[];
  currentSessionId: string | null;
  drawerTab: "favorites" | "all";
  setDrawerTab: (tab: "favorites" | "all") => void;
  onLoadSession: (item: HistoryItem) => void;
  onToggleFavorite: (itemId: string, e?: React.MouseEvent) => void;
  onDeleteItem: (itemId: string, e?: React.MouseEvent) => void;
  onClearHistory: () => void;
  onQuickCopy: (item: HistoryItem, e: React.MouseEvent) => void;
  copiedHistoryId: string | null;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  historyList,
  currentSessionId,
  drawerTab,
  setDrawerTab,
  onLoadSession,
  onToggleFavorite,
  onDeleteItem,
  onClearHistory,
  onQuickCopy,
  copiedHistoryId,
}: HistoryDrawerProps) {
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");

  if (!isOpen) return null;

  const favoritesCount = historyList.filter((i) => i.isFavorite).length;

  const filteredHistory = historyList.filter((item) => {
    const matchesTab = drawerTab === "favorites" ? item.isFavorite : true;
    if (!matchesTab) return false;
    if (!searchHistoryQuery.trim()) return true;
    const q = searchHistoryQuery.toLowerCase();
    const matchInput = item.inputText?.toLowerCase().includes(q);
    const matchPersona = item.responseResult?.persona?.toLowerCase().includes(q);
    const matchAlumni = item.responseResult?.alumni_matches?.some(
      (a: any) =>
        a?.name?.toLowerCase().includes(q) ||
        a?.current_role?.toLowerCase().includes(q)
    );
    const matchApproach = item.responseResult?.recommended_approach
      ?.toLowerCase()
      .includes(q);
    return Boolean(matchInput || matchPersona || matchAlumni || matchApproach);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
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
              onClick={onClose}
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
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer select-none ${
                drawerTab === "favorites"
                  ? "border-[#FFD84D] text-[#141412] bg-[#FFF6D1]/60 rounded-t-lg font-bold"
                  : "border-transparent text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] rounded-t-lg"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  drawerTab === "favorites"
                    ? "fill-[#FFCC1A] text-[#A15C00]"
                    : "text-[#8A8A84]"
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
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer select-none ${
                drawerTab === "all"
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
                const hasClarifications =
                  item.chatThread && item.chatThread.length > 0;
                const scriptCount = item.responseResult?.scripts?.length || 0;
                const alumniMatchesCount =
                  item.responseResult?.alumni_matches?.length || 0;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-2.5 bg-white hover:border-[#D9D9D4] hover:shadow-2xs ${
                      isSelectedCurrent
                        ? "border-[#FFD84D] bg-[#FFF6D1]/20 ring-1 ring-[#FFD84D]"
                        : "border-[#E8E8E4]"
                    }`}
                  >
                    {/* Item Top: Mode Badge, Date, Star & Trash */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-mono text-[10.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            item.mode === "pitch"
                              ? "bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D]/60"
                              : item.mode === "alumni"
                                ? "bg-[#EBF7EE] text-[#1F7A4D] border border-[#D4EDDA]"
                                : "bg-[#EDF5FF] text-[#0E62FE] border border-[#B3D4FF]"
                          }`}
                        >
                          {item.mode === "pitch"
                            ? "Pitch"
                            : item.mode === "alumni"
                              ? "Alumni"
                              : "Comparison"}
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
                          onClick={(e) => onToggleFavorite(item.id, e)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            item.isFavorite
                              ? "text-[#A15C00] hover:bg-[#FFF6D1]"
                              : "text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2]"
                          }`}
                          title={
                            item.isFavorite
                              ? "Hapus dari Favorit"
                              : "Tandai sebagai Favorit"
                          }
                        >
                          <Star
                            className={`w-4 h-4 ${
                              item.isFavorite
                                ? "fill-[#FFCC1A] text-[#A15C00]"
                                : ""
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => onDeleteItem(item.id, e)}
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
                          <span className="text-[#8A8A84] font-medium">
                            Persona:{" "}
                          </span>
                          <span className="font-semibold text-[#141412]">
                            {item.responseResult.persona}
                          </span>
                        </div>
                      )}
                      {item.mode === "alumni" &&
                        item.responseResult?.alumni_matches?.[0] && (
                          <div className="line-clamp-1">
                            <span className="text-[#8A8A84] font-medium">
                              Alumni:{" "}
                            </span>
                            <span className="font-semibold text-[#1F7A4D]">
                              {item.responseResult.alumni_matches[0].name} (
                              {item.responseResult.alumni_matches[0].current_role}
                              )
                            </span>
                          </div>
                        )}
                      {item.mode === "comparison" &&
                        item.responseResult?.competitor_analysis
                          ?.competitor_name && (
                          <div className="line-clamp-1">
                            <span className="text-[#8A8A84] font-medium">
                              Kompetitor:{" "}
                            </span>
                            <span className="font-semibold text-[#0E62FE]">
                              {
                                item.responseResult.competitor_analysis
                                  .competitor_name
                              }
                            </span>
                          </div>
                        )}
                      <div className="text-[11px] text-[#8A8A84] font-mono flex items-center gap-2">
                        {scriptCount > 0 && (
                          <span>{scriptCount} variasi script</span>
                        )}
                        {alumniMatchesCount > 0 && (
                          <span>{alumniMatchesCount} profil alumni</span>
                        )}
                        <span>·</span>
                        <span>
                          {item.model?.includes("lite")
                            ? "Flash Lite"
                            : "Flash"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons row */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onLoadSession(item)}
                        className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                          isSelectedCurrent
                            ? "bg-[#141412] text-white"
                            : "bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] active:scale-97 shadow-2xs"
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {isSelectedCurrent ? "Sedang Dibuka" : "Muat Sesi Ini"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onQuickCopy(item, e)}
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
                onClick={onClearHistory}
                className="text-[#8A8A84] hover:text-[#B42318] hover:underline font-mono text-[11.5px] transition-all cursor-pointer"
              >
                Bersihkan non-favorit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
