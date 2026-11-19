"use client";

import React, { useEffect, useRef } from "react";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

/**
 * Smooth Count-Up Ticker with Tabular Numerals (Initial non-zero value only + Prefers-Reduced-Motion).
 * Writes directly to `spanRef.current.textContent` inside `requestAnimationFrame` to avoid React state
 * re-renders on every animation frame.
 */
export default function AnimatedCounter({ value, duration = 200 }: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const targetVal = Number.isFinite(value) ? value : 0;
    const el = spanRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasAnimatedRef.current || prefersReduced || targetVal === 0) {
      el.textContent = targetVal.toLocaleString("id-ID");
      if (targetVal > 0) hasAnimatedRef.current = true;
      return;
    }

    hasAnimatedRef.current = true;
    let startTime: number | null = null;
    let frameId: number;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = Math.min((now - startTime) / duration, 1);
      const progress = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(targetVal * progress);
      if (spanRef.current) {
        spanRef.current.textContent = current.toLocaleString("id-ID");
      }

      if (elapsed < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span ref={spanRef} className="tabular-numbers tabular-nums">
      {(Number.isFinite(value) ? value : 0).toLocaleString("id-ID")}
    </span>
  );
}
