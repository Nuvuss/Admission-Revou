"use client";

import React, { useState } from "react";
import { Key, X, Eye, EyeOff, RefreshCw } from "lucide-react";
import { ApiPoolStatus, ApiKeyTestResult } from "../types";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customApiKeys: string[];
  setCustomApiKeys: React.Dispatch<React.SetStateAction<string[]>>;
  apiPoolStatus: ApiPoolStatus | null;
  testResults: ApiKeyTestResult[] | null;
  isTestingKeys: boolean;
  onTestKeys: () => Promise<void>;
  onSaveCustomKeys: () => Promise<void>;
  onResetKeysToDefault: () => Promise<void>;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  customApiKeys,
  setCustomApiKeys,
  apiPoolStatus,
  testResults,
  isTestingKeys,
  onTestKeys,
  onSaveCustomKeys,
  onResetKeysToDefault,
}: ApiKeyModalProps) {
  const [showKeySecret, setShowKeySecret] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

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
            onClick={onClose}
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
                  className={`border rounded-xl p-3 sm:p-3.5 transition-all ${
                    isCurrentActive
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
              onClick={onTestKeys}
              disabled={isTestingKeys}
              className="font-sans text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#141412] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Ping dan periksa sisa kuota ke-5 API Key di Google AI Studio"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#0E62FE] ${
                  isTestingKeys ? "animate-spin" : ""
                }`}
              />
              <span>{isTestingKeys ? "Menguji Kuota..." : "Test & Cek Kuota Semua Key"}</span>
            </button>

            <button
              type="button"
              onClick={onResetKeysToDefault}
              className="font-sans text-xs text-[#8A8A84] hover:text-[#141412] px-2 py-2 hover:underline cursor-pointer"
            >
              Reset ke Server
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9D9D4] bg-white hover:bg-[#F5F5F2] text-[#4B4B46] cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={onSaveCustomKeys}
              className="font-sans text-xs font-bold px-4 py-2 rounded-xl bg-[#FFD84D] hover:bg-[#FFCC1A] text-[#141412] shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
