"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  ShieldCheck,
  UserCheck,
  Crown,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Check,
} from "lucide-react";
import { UserSession, UserRole } from "../types/auth";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  onSessionUpdate?: (updatedSession: UserSession) => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  userSession,
  onSessionUpdate,
}: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "password">("email");

  const [email, setEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [emailConfirmPassword, setEmailConfirmPassword] = useState<string>("");
  const [showEmailConfirmPassword, setShowEmailConfirmPassword] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState<boolean>(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize email from session or search in localStorage
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setNewEmail("");
      setEmailConfirmPassword("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsNewPasswordFocused(false);
      setIsConfirmPasswordFocused(false);

      if (userSession?.email) {
        setEmail(userSession.email);
      } else {
        // Fallback check
        try {
          const saved = localStorage.getItem("revou_admission_user_session_v1");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.email) setEmail(parsed.email);
          }
        } catch (e) {}
      }
    }
  }, [isOpen, userSession]);

  const handleTabChange = (tab: "email" | "password") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Real-time strength checks (triggered when user focuses or types password)
  const isPasswordTriggered =
    isNewPasswordFocused ||
    isConfirmPasswordFocused ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9]/.test(newPassword) || /[^a-zA-Z0-9]/.test(newPassword);
  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const confirmStarted = confirmPassword.length > 0;

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasMixedCase ? 1 : 0) +
    (hasNumberOrSymbol ? 1 : 0) +
    (isMatch ? 1 : 0);

  const handleChangeEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedCurrentEmail = email.trim().toLowerCase();
    const trimmedNewEmail = newEmail.trim().toLowerCase();
    const trimmedPwd = emailConfirmPassword.trim();

    if (!trimmedCurrentEmail) {
      setErrorMessage("Email saat ini wajib diisi.");
      return;
    }

    if (!trimmedNewEmail) {
      setErrorMessage("Silakan masukkan email baru.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedNewEmail)) {
      setErrorMessage("Format email baru tidak valid.");
      return;
    }

    if (trimmedNewEmail === trimmedCurrentEmail) {
      setErrorMessage("Email baru tidak boleh sama dengan email saat ini.");
      return;
    }

    if (!trimmedPwd) {
      setErrorMessage("Masukkan password Anda saat ini untuk konfirmasi perubahan email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: trimmedCurrentEmail,
          newEmail: trimmedNewEmail,
          password: trimmedPwd,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Gagal memperbarui email.");
        return;
      }

      const updatedEmail = data.email || trimmedNewEmail;
      setEmail(updatedEmail);
      setNewEmail("");
      setEmailConfirmPassword("");
      setSuccessMessage(data.message || "Email akun berhasil diperbarui!");

      if (userSession && onSessionUpdate) {
        onSessionUpdate({ ...userSession, email: updatedEmail });
      }
    } catch (err: any) {
      setErrorMessage("Terjadi gangguan koneksi. Silakan periksa koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOld = oldPassword.trim();
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedEmail) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (!trimmedOld) {
      setErrorMessage("Silakan masukkan password Anda saat ini.");
      return;
    }

    if (!trimmedNew) {
      setErrorMessage("Silakan masukkan password baru.");
      return;
    }

    if (trimmedNew.length < 6) {
      setErrorMessage("Password baru minimal 6 karakter.");
      return;
    }

    if (trimmedNew === trimmedOld) {
      setErrorMessage("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setErrorMessage("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          oldPassword: trimmedOld,
          newPassword: trimmedNew,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Gagal mengubah password.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(data.message || "Password berhasil diubah!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Update session with email if missing
      if (userSession && onSessionUpdate) {
        const updated = { ...userSession, email: trimmedEmail };
        onSessionUpdate(updated);
      }
    } catch (err: any) {
      setErrorMessage("Terjadi gangguan koneksi. Silakan periksa koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case "Owner":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141412] text-[#FFD84D] text-xs font-bold border border-[#FFD84D]/30">
            <Crown className="w-3.5 h-3.5 text-[#FFD84D]" />
            Owner (Lead Admission)
          </span>
        );
      case "BM":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold border border-[#E9D5FF]">
            <UserCheck className="w-3.5 h-3.5 text-[#7E22CE]" />
            Business Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold border border-[#DBEAFE]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
            Admission Counselor (AC)
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } }}
            className="relative w-full max-w-md bg-white rounded-[28px] border border-[#EAEAE6] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F0F0EC]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#F5F5F2] border border-[#EAEAE6] flex items-center justify-center text-[#141412]">
                <User className="w-5 h-5 text-[#141412]" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#141412]">
                  Profil Akun
                </h2>
                <p className="text-xs text-[#7A7A74] font-medium">
                  Kelola profil, ganti email &amp; perbarui kata sandi Anda
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F5F2] hover:bg-[#EAEAE6] text-[#7A7A74] hover:text-[#141412] flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 space-y-6">
            {/* User Info Card */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EAEAE6] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A7A74]">Role Pengguna</span>
                {getRoleBadge(userSession?.role)}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#F0F0EC]">
                <span className="text-xs font-semibold text-[#7A7A74]">Nama Pengguna</span>
                <span className="text-xs font-black text-[#141412]">
                  {userSession?.name || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#F0F0EC]">
                <span className="text-xs font-semibold text-[#7A7A74]">Email Terdaftar</span>
                <span className="text-xs font-mono font-medium text-[#141412]">
                  {email || userSession?.email || "(Isi pada form di bawah)"}
                </span>
              </div>
            </div>

            {/* Action Selector: Ganti Email / Ganti Password */}
            <div className="relative grid grid-cols-2 p-1 rounded-xl bg-[#F5F5F2] border border-[#EAEAE6]">
              {[
                { id: "email" as const, label: "Ganti Email", icon: Mail },
                { id: "password" as const, label: "Ganti Password", icon: Key },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer z-10 ${
                      isSelected ? "text-white" : "text-[#7A7A74] hover:text-[#141412]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="accountModalTabPill"
                        className="absolute inset-0 bg-[#141412] rounded-lg -z-10 shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#FFD84D]" : ""}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === "email" ? (
              <form onSubmit={handleChangeEmailSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#141412]">
                  <Mail className="w-4 h-4 text-[#141412]" />
                  <span>Ganti Email Akun</span>
                </div>

                {/* Current Email */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                    Email Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email.lama@revou.co"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-medium"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* New Email */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                    Email Baru
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email.baru@revou.co"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-medium"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Confirmation */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                    Password Saat Ini (Verifikasi)
                  </label>
                  <div className="relative">
                    <input
                      type={showEmailConfirmPassword ? "text" : "password"}
                      value={emailConfirmPassword}
                      onChange={(e) => setEmailConfirmPassword(e.target.value)}
                      placeholder="Masukkan password untuk verifikasi"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-mono"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowEmailConfirmPassword(!showEmailConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] p-0.5 cursor-pointer"
                    >
                      {showEmailConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-[#FFF1F1] border border-[#FFD0D0] text-[#DA1E28] text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#141412] hover:bg-[#2D2D2A] active:bg-[#FFD84D] active:text-[#141412] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan Email...</span>
                    </>
                  ) : (
                    <span>Perbarui Email</span>
                  )}
                </button>
              </form>
            ) : (
            /* Change Password Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#141412]">
                <Key className="w-4 h-4 text-[#141412]" />
                <span>Ganti Password</span>
              </div>

              {/* Email Field (editable if not found in session) */}
              <div>
                <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                  Email Akun
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@revou.co"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-medium"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Old Password */}
              <div>
                <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                  Password Saat Ini (Lama)
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-mono"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] p-0.5 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsNewPasswordFocused(true)}
                    onBlur={() => setIsNewPasswordFocused(false)}
                    placeholder="Minimal 8 karakter unik"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-mono"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] p-0.5 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[12px] font-semibold text-[#141412] mb-1">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    placeholder="Ketik ulang password baru"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F5F5F2] text-xs text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-mono"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-[#7A7A74] absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] p-0.5 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Interactive Real-Time Password Health & Anti-Breach Checklist */}
              <AnimatePresence>
                {isPasswordTriggered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#EAEAE6] space-y-3 shadow-xs">
                      {/* Strength Header & Meter Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[#141412] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                            Kekuatan Sandi:
                          </span>
                          <span
                            className={`text-[10.5px] font-black uppercase tracking-wider ${
                              strengthScore === 4
                                ? "text-[#059669]"
                                : strengthScore === 3
                                ? "text-[#10B981]"
                                : strengthScore === 2
                                ? "text-[#D97706]"
                                : newPassword.length > 0
                                ? "text-[#DC2626]"
                                : "text-[#9E9E98]"
                            }`}
                          >
                            {strengthScore === 4
                              ? "Sangat Aman (Anti-Breach) ✨"
                              : strengthScore === 3
                              ? "Kuat 👍"
                              : strengthScore === 2
                              ? "Sedang"
                              : newPassword.length > 0
                              ? "Terlalu Lemah"
                              : "Mulai Mengetik..."}
                          </span>
                        </div>

                        {/* 4-Segment Interactive Strength Meter Bar */}
                        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                          <div
                            className={`rounded-full transition-colors duration-200 ${
                              strengthScore >= 1
                                ? strengthScore === 1
                                  ? "bg-[#EF4444]"
                                  : strengthScore === 2
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#10B981]"
                                : "bg-[#EAEAE6]"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-colors duration-200 ${
                              strengthScore >= 2
                                ? strengthScore === 2
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#10B981]"
                                : "bg-[#EAEAE6]"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-colors duration-200 ${
                              strengthScore >= 3 ? "bg-[#10B981]" : "bg-[#EAEAE6]"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-colors duration-200 ${
                              strengthScore === 4 ? "bg-[#059669]" : "bg-[#EAEAE6]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Interactive Checklist Items */}
                      <div className="space-y-2 text-[11px] pt-1 border-t border-[#F0F0EC]">
                        {/* 1. Min 8 Chars */}
                        <div className="flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ scale: hasMinLength ? [1, 1.25, 1] : 1 }}
                              transition={{ duration: 0.2 }}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                hasMinLength
                                  ? "bg-[#10B981] text-white shadow-xs"
                                  : "bg-[#E5E5DF] text-[#7A7A74]"
                              }`}
                            >
                              {hasMinLength ? (
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              ) : (
                                "•"
                              )}
                            </motion.span>
                            <span
                              className={
                                hasMinLength
                                  ? "text-[#065F46] font-bold"
                                  : "text-[#7A7A74] font-medium"
                              }
                            >
                              Minimal 8 karakter
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              hasMinLength ? "text-[#10B981]" : "text-[#9E9E98]"
                            }`}
                          >
                            {newPassword.length}/8
                          </span>
                        </div>

                        {/* 2. Mixed Case (A-Z & a-z) */}
                        <div className="flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ scale: hasMixedCase ? [1, 1.25, 1] : 1 }}
                              transition={{ duration: 0.2 }}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                hasMixedCase
                                  ? "bg-[#10B981] text-white shadow-xs"
                                  : "bg-[#E5E5DF] text-[#7A7A74]"
                              }`}
                            >
                              {hasMixedCase ? (
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              ) : (
                                "•"
                              )}
                            </motion.span>
                            <span
                              className={
                                hasMixedCase
                                  ? "text-[#065F46] font-bold"
                                  : "text-[#7A7A74] font-medium"
                              }
                            >
                              Kombinasi huruf besar & kecil (A-z)
                            </span>
                          </div>
                          {hasMixedCase && (
                            <span className="text-[10px] font-mono font-bold text-[#10B981]">
                              OK
                            </span>
                          )}
                        </div>

                        {/* 3. Number or Symbol */}
                        <div className="flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ scale: hasNumberOrSymbol ? [1, 1.25, 1] : 1 }}
                              transition={{ duration: 0.2 }}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                hasNumberOrSymbol
                                  ? "bg-[#10B981] text-white shadow-xs"
                                  : "bg-[#E5E5DF] text-[#7A7A74]"
                              }`}
                            >
                              {hasNumberOrSymbol ? (
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              ) : (
                                "•"
                              )}
                            </motion.span>
                            <span
                              className={
                                hasNumberOrSymbol
                                  ? "text-[#065F46] font-bold"
                                  : "text-[#7A7A74] font-medium"
                              }
                            >
                              Mengandung angka atau simbol (0-9, !@#$)
                            </span>
                          </div>
                          {hasNumberOrSymbol && (
                            <span className="text-[10px] font-mono font-bold text-[#10B981]">
                              OK
                            </span>
                          )}
                        </div>

                        {/* 4. Confirmation Match */}
                        <div className="flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ scale: isMatch ? [1, 1.25, 1] : 1 }}
                              transition={{ duration: 0.2 }}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                isMatch
                                  ? "bg-[#10B981] text-white shadow-xs"
                                  : confirmStarted
                                  ? "bg-[#EF4444] text-white"
                                  : "bg-[#E5E5DF] text-[#7A7A74]"
                              }`}
                            >
                              {isMatch ? (
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              ) : confirmStarted ? (
                                "✕"
                              ) : (
                                "•"
                              )}
                            </motion.span>
                            <span
                              className={
                                isMatch
                                  ? "text-[#065F46] font-bold"
                                  : confirmStarted
                                  ? "text-[#DC2626] font-semibold"
                                  : "text-[#7A7A74] font-medium"
                              }
                            >
                              {isMatch
                                ? "Konfirmasi password cocok"
                                : confirmStarted
                                ? "Konfirmasi belum cocok"
                                : "Konfirmasi password cocok"}
                            </span>
                          </div>
                          {isMatch && (
                            <span className="text-[10px] font-mono font-bold text-[#10B981]">
                              COCOK
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Anti-Data Breach Browser Safe Banner */}
                      {strengthScore === 4 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10.5px] font-semibold flex items-center gap-2 shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>
                            Sandi sangat kuat! Bebas dari peringatan data breach Google Chrome.
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-[#FFF1F1] border border-[#FFD0D0] text-[#DA1E28] text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (newPassword.length > 0 && !isMatch)}
                className="w-full py-3 px-4 rounded-xl bg-[#141412] hover:bg-[#2D2D2A] active:bg-[#FFD84D] active:text-[#141412] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan Password...</span>
                  </>
                ) : (
                  <span>Perbarui Password</span>
                )}
              </button>
            </form>
            )}
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

