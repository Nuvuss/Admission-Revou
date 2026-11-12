"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { UserRole, UserSession } from "../types/auth";

function MinimalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/";

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotHint, setShowForgotHint] = useState<boolean>(false);

  // Load existing session if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem("revou_admission_user_session_v1");
      if (saved) {
        const parsed: UserSession = JSON.parse(saved);
        if (parsed.name) setIdentifier(parsed.name);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier) {
      setErrorMessage("Silakan masukkan Email Anda.");
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage("Silakan masukkan Password Anda.");
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate via Supabase admission_users API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedIdentifier,
          password: trimmedPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Email atau password salah.");
        setIsLoading(false);
        return;
      }

      const session: UserSession = {
        name: data.user.name,
        role: data.user.role,
        email: data.user.email,
        savedAt: Date.now(),
      };

      // Clean up previous user from online tracker if different
      try {
        const prevSaved = localStorage.getItem("revou_admission_user_session_v1");
        if (prevSaved) {
          const prevSession = JSON.parse(prevSaved);
          if (prevSession?.name && prevSession.name !== data.user.name) {
            fetch("/api/auth/logout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userName: prevSession.name, userEmail: prevSession.email, allSessions: true }),
            }).catch(() => {});
          }
        }
      } catch (e) {}

      localStorage.setItem("revou_admission_user_session_v1", JSON.stringify(session));

      // Online presence didaftarkan otomatis oleh usePresenceHeartbeat di halaman utama (per tab)

      // Log login event asynchronously
      fetch("/api/analytics/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: data.user.name,
          userRole: data.user.role,
          userEmail: data.user.email,
          actionType: "login",
          mode: "pitch",
          metadata: { timestamp: new Date().toISOString() },
        }),
      }).catch(() => {});

      // Set flag for welcome toast on main page
      try {
        sessionStorage.setItem("revou_just_logged_in", "true");
      } catch (e) {}

      // Redirect
      if (data.user.role === "Owner" && redirectTarget === "/analytics") {
        router.push("/analytics");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage("Terjadi gangguan koneksi. Silakan periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#EAEAE6] rounded-[32px] p-8 sm:p-9 shadow-xl shadow-black/[0.03] text-[#141412]">
      {/* 1. App Icon Squircle */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#181816] border border-[#2D2D2A] flex items-center justify-center p-2.5 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD84D]/20 to-transparent pointer-events-none" />
          <img
            src="/revou-logo.png"
            alt="RevoU"
            className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* 2. Welcome Headline */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#141412]">
          Welcome Back!
        </h1>
        <p className="text-xs sm:text-[13px] text-[#7A7A74] mt-1 font-medium">
          Please enter your login details.
        </p>
      </div>

      {/* 3. Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[13px] font-semibold text-[#141412] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="johnwick123@gmail.com"
            className="w-full px-4 py-3 rounded-2xl bg-[#EFEFED] text-sm text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-medium"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[13px] font-semibold text-[#141412]">
              Password
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#EFEFED] text-sm text-[#141412] placeholder-[#9E9E98] border border-transparent focus:border-[#181816] focus:bg-white focus:outline-none transition-all font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A7A74] hover:text-[#141412] transition-colors p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={() => setShowForgotHint(!showForgotHint)}
            className="text-[12.5px] font-medium text-[#4B4B46] hover:text-[#181816] transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Forgot Password Helper Popover */}
        <AnimatePresence>
          {showForgotHint && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs space-y-1"
            >
              <p className="font-bold">Bantuan Akun:</p>
              <p>
                Akun dibuat dan dikelola secara manual oleh Team Lead di database Supabase (tabel <code>admission_users</code>).
              </p>
              <p>
                Jika Anda lupa password atau belum dibuatkan akun, hubungi Team Lead Admission RevoU.
              </p>
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

        {/* 4. Dark Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#2D2D2A] hover:bg-[#181816] active:bg-[#FFD84D] active:text-[#141412] text-white text-[13.5px] font-bold transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#141412] flex flex-col justify-center items-center p-4 sm:p-6 antialiased selection:bg-[#FFD84D] selection:text-[#141412]">
      <Suspense
        fallback={
          <div className="w-full max-w-[400px] bg-white rounded-[32px] p-8 text-center flex flex-col items-center gap-3 shadow-xl">
            <div className="w-8 h-8 border-3 border-[#FFD84D] border-t-[#141412] rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#141412]">Loading Login...</p>
          </div>
        }
      >
        <MinimalLoginForm />
      </Suspense>

      {/* Discreet footer */}
      <footer className="mt-6 text-center text-[11px] font-mono text-[#8A8A84]">
        <span>RevoU Admission Assistant &bull; Internal Access</span>
      </footer>
    </div>
  );
}
