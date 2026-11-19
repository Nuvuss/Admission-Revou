"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function ReloadButton() {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleReload}
      disabled={isReloading}
      className="maintenance-btn inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#141412] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2A2A26] active:bg-[#FFD84D] active:text-[#141412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F4] disabled:opacity-60 cursor-pointer"
    >
      <RefreshCw
        className={`h-4 w-4 shrink-0 ${isReloading ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span>{isReloading ? "Memeriksa status..." : "Muat Ulang Halaman"}</span>
    </button>
  );
}
