"use client";

import { useEffect, useRef } from "react";

// Batas tanpa interaksi (mouse/keyboard/scroll/touch) sebelum status berubah menjadi "idle".
export const IDLE_AFTER_MS = 2 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 20 * 1000;
const IDLE_CHECK_INTERVAL_MS = 15 * 1000;
const ACTIVITY_THROTTLE_MS = 5 * 1000;

export interface PresenceHeartbeatOptions {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  mode?: string | null;
  page: "assistant" | "analytics";
  /** true = server cukup balas {success}, tanpa daftar user lain (untuk halaman konselor) */
  silent?: boolean;
  enabled?: boolean;
}

function createSessionId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {}
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Mengirim heartbeat presence per tab:
 * - sessionId unik per page-load => multi-tab aman, refresh hanya mengganti sesi tab itu.
 * - Status "active"/"idle" berdasarkan interaksi & visibilitas tab.
 * - Mode fitur yang sedang dibuka dikirim ulang segera saat berubah.
 * - Saat tab ditutup (pagehide) hanya sesi tab ini yang dihapus via sendBeacon.
 */
export function usePresenceHeartbeat({
  userName,
  userRole,
  userEmail,
  mode,
  page,
  silent = false,
  enabled = true,
}: PresenceHeartbeatOptions) {
  const sessionIdRef = useRef<string | null>(null);
  if (sessionIdRef.current === null && typeof window !== "undefined") {
    sessionIdRef.current = createSessionId();
  }

  const lastActiveAtRef = useRef<number>(Date.now());
  const statusRef = useRef<"active" | "idle">("active");
  const modeRef = useRef<string | null | undefined>(mode);
  const sendRef = useRef<() => void>(() => {});

  // Kirim ulang segera ketika mode berubah (tanpa me-reset interval)
  useEffect(() => {
    modeRef.current = mode;
    sendRef.current();
  }, [mode]);

  useEffect(() => {
    if (!enabled || !userName) return;
    const sessionId = sessionIdRef.current;

    const computeStatus = (): "active" | "idle" => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return "idle";
      return Date.now() - lastActiveAtRef.current > IDLE_AFTER_MS ? "idle" : "active";
    };

    const send = () => {
      statusRef.current = computeStatus();
      fetch("/api/auth/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          sessionId,
          userName,
          userRole: userRole || "AC",
          userEmail: userEmail || null,
          status: statusRef.current,
          mode: modeRef.current || null,
          page,
          lastActiveAt: lastActiveAtRef.current,
          silent,
        }),
      }).catch(() => {});
    };
    sendRef.current = send;

    // Interaksi user => perbarui lastActiveAt (di-throttle). Jika sebelumnya idle, kirim langsung.
    let lastMark = 0;
    const markActive = () => {
      const now = Date.now();
      if (now - lastMark < ACTIVITY_THROTTLE_MS) return;
      lastMark = now;
      lastActiveAtRef.current = now;
      if (statusRef.current === "idle" && document.visibilityState === "visible") send();
    };

    const activityEvents: (keyof WindowEventMap)[] = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"];
    activityEvents.forEach((ev) => window.addEventListener(ev, markActive, { passive: true }));

    const handleVisibility = () => {
      if (document.visibilityState === "visible") lastActiveAtRef.current = Date.now();
      send();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Deteksi transisi active -> idle tanpa menunggu heartbeat berikutnya
    const idleCheck = setInterval(() => {
      if (computeStatus() !== statusRef.current) send();
    }, IDLE_CHECK_INTERVAL_MS);

    const handlePageHide = () => {
      try {
        const payload = JSON.stringify({ sessionId, userName, userEmail: userEmail || null });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/auth/logout", new Blob([payload], { type: "application/json" }));
        } else {
          fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };
    window.addEventListener("pagehide", handlePageHide);

    send();
    const interval = setInterval(send, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearInterval(idleCheck);
      activityEvents.forEach((ev) => window.removeEventListener(ev, markActive));
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      sendRef.current = () => {};
    };
  }, [enabled, userName, userRole, userEmail, page, silent]);

  return sessionIdRef.current;
}

