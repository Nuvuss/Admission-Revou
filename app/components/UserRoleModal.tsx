"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, UserCheck, Crown, Key, AlertCircle, CheckCircle2, X } from "lucide-react";
import { UserRole, UserSession } from "../types/auth";

interface UserRoleModalProps {
  isOpen: boolean;
  currentSession: UserSession | null;
  allowClose?: boolean;
  onClose?: () => void;
  onSaveSession: (session: UserSession) => void;
}

export default function UserRoleModal({
  isOpen,
  currentSession,
  allowClose = false,
  onClose,
  onSaveSession,
}: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentSession?.role || "AC");
  const [name, setName] = useState<string>(currentSession?.name || "");
  const [pin, setPin] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Nama tidak boleh kosong.");
      return;
    }

    if (selectedRole === "Owner") {
      if (!pin.trim()) {
        setErrorMessage("PIN Rahasia Owner wajib diisi.");
        return;
      }

      setIsVerifying(true);
      try {
        const res = await fetch("/api/auth/verify-owner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: pin.trim() }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMessage(data.message || "PIN Owner salah. Akses ditolak.");
          setIsVerifying(false);
          return;
        }

        const session: UserSession = {
          name: trimmedName,
          role: "Owner",
          token: data.token,
          savedAt: Date.now(),
        };
        onSaveSession(session);
      } catch (err) {
        setErrorMessage("Gagal memverifikasi PIN. Silakan coba lagi.");
      } finally {
        setIsVerifying(false);
      }
    } else {
      // Role AC or BM
      const session: UserSession = {
        name: trimmedName,
        role: selectedRole,
        savedAt: Date.now(),
      };
      onSaveSession(session);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white border border-[#E8E8E4] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-[#141412]"
        >
          {/* Close button if allowed */}
          {allowClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8A8A84] hover:text-[#141412] hover:bg-[#F5F5F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFD84D]/30 border border-[#FFD84D] text-[#141412] mb-3 shadow-xs">
              <UserCheck className="w-6 h-6 text-[#141412]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#141412]">
              Identitas & Role Pengguna
            </h2>
            <p className="text-xs text-[#7A7A74] mt-1 max-w-xs mx-auto">
              Pilih peran Anda untuk menyesuaikan hak akses dan pencatatan aktivitas di Admission Assistant.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector Tabs */}
            <div>
              <label className="block text-[11.5px] font-mono font-bold uppercase tracking-wider text-[#7A7A74] mb-2">
                Pilih Role Anda:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("AC");
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === "AC"
                      ? "border-[#141412] bg-[#141412] text-white shadow-xs font-bold"
                      : "border-[#E8E8E4] bg-[#FAFAF8] text-[#141412] hover:bg-white hover:border-[#D9D9D4]"
                  }`}
                >
                  <ShieldCheck className={`w-5 h-5 mb-1 ${selectedRole === "AC" ? "text-[#FFD84D]" : "text-[#4B4B46]"}`} />
                  <span className="text-xs font-black">AC</span>
                  <span className={`text-[10px] ${selectedRole === "AC" ? "text-gray-300" : "text-[#8A8A84]"}`}>
                    Counselor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("BM");
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === "BM"
                      ? "border-[#141412] bg-[#141412] text-white shadow-xs font-bold"
                      : "border-[#E8E8E4] bg-[#FAFAF8] text-[#141412] hover:bg-white hover:border-[#D9D9D4]"
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mb-1 ${selectedRole === "BM" ? "text-[#FFD84D]" : "text-[#4B4B46]"}`} />
                  <span className="text-xs font-black">BM</span>
                  <span className={`text-[10px] ${selectedRole === "BM" ? "text-gray-300" : "text-[#8A8A84]"}`}>
                    Manager
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("Owner");
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === "Owner"
                      ? "border-[#141412] bg-[#141412] text-white shadow-xs font-bold"
                      : "border-[#E8E8E4] bg-[#FAFAF8] text-[#141412] hover:bg-white hover:border-[#D9D9D4]"
                  }`}
                >
                  <Crown className={`w-5 h-5 mb-1 ${selectedRole === "Owner" ? "text-[#FFD84D]" : "text-[#D97706]"}`} />
                  <span className="text-xs font-black">Owner</span>
                  <span className={`text-[10px] ${selectedRole === "Owner" ? "text-gray-300" : "text-[#8A8A84]"}`}>
                    Lead/Admin
                  </span>
                </button>
              </div>
            </div>

            {/* Input Name */}
            <div>
              <label className="block text-[11.5px] font-mono font-bold uppercase tracking-wider text-[#7A7A74] mb-1.5">
                Nama Lengkap / Inisial:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  selectedRole === "Owner"
                    ? "Contoh: Rizky (Lead Admission)"
                    : selectedRole === "AC"
                    ? "Contoh: Budi - Squad A"
                    : "Contoh: Anita - Business Manager"
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D9D4] bg-white text-sm text-[#141412] placeholder-[#A0A09A] focus:outline-none focus:border-[#141412] focus:ring-1 focus:ring-[#141412] transition-all font-medium"
                required
              />
            </div>

            {/* Owner PIN input (only shown if Owner) */}
            {selectedRole === "Owner" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-[11.5px] font-mono font-bold uppercase tracking-wider text-[#7A7A74]">
                    PIN Rahasia Owner:
                  </label>
                  <span className="text-[10px] font-mono text-[#8A8A84]">
                    (Khusus Lead & Admin)
                  </span>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A74]" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN Owner..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D9D9D4] bg-white text-sm text-[#141412] placeholder-[#A0A09A] focus:outline-none focus:border-[#141412] focus:ring-1 focus:ring-[#141412] transition-all"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Role Permissions Description */}
            <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] text-[11px] text-[#4B4B46] space-y-1.5">
              <p className="font-bold text-[#141412] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                {selectedRole === "Owner"
                  ? "Hak Akses Role Owner:"
                  : `Hak Akses Role ${selectedRole}:`}
              </p>
              {selectedRole === "Owner" ? (
                <ul className="list-disc pl-4 space-y-0.5 text-[#5C5C56]">
                  <li>Akses seluruh 3 fitur Admission Assistant</li>
                  <li>Akses eksklusif **Traffic Analytics Dashboard**</li>
                  <li>Akses kelola 5 API Keys & rotasi kuota</li>
                </ul>
              ) : (
                <ul className="list-disc pl-4 space-y-0.5 text-[#5C5C56]">
                  <li>Akses penuh ke **Create a Pitch**</li>
                  <li>Akses penuh ke **Checking Alumni**</li>
                  <li>Akses penuh ke **Comparison Table**</li>
                  <li className="text-[#8A8A84]">Dashboard analitik & API keys disembunyikan</li>
                </ul>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#FFF1F1] border border-[#FFD0D0] text-[#DA1E28] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141412] hover:bg-[#2D2D2A] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi PIN...</span>
                </>
              ) : (
                <span>
                  {selectedRole === "Owner"
                    ? "Masuk Sebagai Owner"
                    : `Lanjutkan Sebagai ${selectedRole}`}
                </span>
              )}
            </button>

            <div className="text-center pt-1">
              <Link
                href="/login"
                onClick={onClose}
                className="text-[11px] text-[#7A7A74] hover:text-[#141412] transition-colors underline decoration-dotted"
              >
                Buka Portal Login Penuh &rarr;
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

