"use client";

import React, { useEffect } from "react";
import { MotionConfig } from "motion/react";

/**
 * Global guard to suppress third-party browser extension errors (such as MetaMask inpage.js)
 * from bubbling up to the Next.js development error overlay.
 */
function useExtensionErrorGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isExtensionError = (msg?: string, stack?: string, filename?: string) => {
      const combined = `${msg || ""} ${stack || ""} ${filename || ""}`.toLowerCase();
      return (
        combined.includes("chrome-extension://") ||
        combined.includes("moz-extension://") ||
        combined.includes("metamask") ||
        combined.includes("inpage.js") ||
        combined.includes("failed to connect to metamask")
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = typeof reason === "string" ? reason : reason?.message || "";
      const stack = reason?.stack || "";
      if (isExtensionError(message, stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      const stack = event.error?.stack || "";
      const filename = event.filename || "";
      if (isExtensionError(message, stack, filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Use capture phase to intercept before Next.js dev error overlay
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);
    window.addEventListener("error", handleError, true);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
      window.removeEventListener("error", handleError, true);
    };
  }, []);
}

/**
 * Respects the OS-level `prefers-reduced-motion` setting for every Motion
 * component in the app: transform/layout movement is disabled while opacity
 * crossfades are preserved.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  useExtensionErrorGuard();
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
