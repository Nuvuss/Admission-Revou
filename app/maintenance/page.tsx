import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ShieldCheck, Wrench } from "lucide-react";
import { getMaintenanceConfig } from "../../lib/maintenance";
import MaintenanceVisual from "./MaintenanceVisual";
import ReloadButton from "./ReloadButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sedang Pemeliharaan · RevoU Admission Assistant",
  description:
    "RevoU Admission Assistant sedang dalam pemeliharaan sistem terjadwal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  const { eta, hasCustomEta, message } = getMaintenanceConfig();

  return (
    <div className="min-h-[100dvh] bg-[#F7F7F4] text-[#141412] flex flex-col selection:bg-[#FFD84D] selection:text-[#141412]">
      {/* RevoU Signature Top Rail */}
      <div className="h-1.5 w-full bg-[#FFD84D]" aria-hidden="true" />

      {/* Minimal Top Bar */}
      <header className="w-full border-b border-[#E6E6E0] bg-[#F7F7F4]/90">
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2D2D2A] bg-[#141412] p-1.5">
              <img
                src="/revou-logo.png"
                alt="Logo RevoU"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm sm:text-base font-bold tracking-tight text-[#141412]">
                RevoU
              </p>
              <p className="text-xs font-medium text-[#575752]">
                Admission Assistant
              </p>
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 rounded-full border border-[#EED06B] bg-[#FFF6D1] px-3.5 py-1.5 text-xs font-semibold text-[#7A4500]"
          >
            <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Pemeliharaan Sistem</span>
          </div>
        </div>
      </header>

      {/* Main Responsive Asymmetric Editorial Stage */}
      <main className="flex flex-1 items-center">
        <section
          aria-labelledby="maintenance-heading"
          className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-16"
        >
          {/* Visual Column: First on mobile so the RevoU repair animation opens the page; Right on desktop */}
          <div className="maintenance-reveal-delayed order-1 lg:order-2 lg:col-span-5">
            <MaintenanceVisual />
          </div>

          {/* Editorial Copy & Actions Column */}
          <div className="maintenance-reveal order-2 space-y-7 sm:space-y-8 lg:order-1 lg:col-span-7">
            <div className="space-y-4">
              <h1
                id="maintenance-heading"
                className="font-display text-3xl sm:text-[42px] lg:text-[48px] font-black tracking-[-0.03em] leading-[1.08] text-[#141412]"
              >
                Admission Assistant sedang dalam pemeliharaan.
              </h1>

              <p className="max-w-[54ch] text-[15px] sm:text-base leading-relaxed text-[#4B4B46]">
                {message}
              </p>
            </div>

            {/* Hairline-Ruled ETA Strip */}
            <div className="border-y border-[#E6E6E0] py-5">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E6E6E0] bg-white text-[#141412]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-semibold text-[#575752]">
                    Estimasi waktu selesai
                  </p>
                  <p
                    className={`font-display text-xl sm:text-2xl font-bold tracking-tight text-[#141412] ${hasCustomEta ? "tabular-nums" : ""
                      }`}
                  >
                    {eta} <span aria-hidden="true">😔🙏</span>
                  </p>
                  <p className="pt-0.5 text-xs sm:text-[13px] leading-relaxed text-[#575752]">
                    Anda dapat memuat ulang halaman ini secara berkala. Layanan
                    Admission Assistant akan otomatis kembali normal setelah
                    pemeliharaan selesai.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5">
              <ReloadButton />

              <Link
                href="/login"
                className="maintenance-btn inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#575752] hover:text-[#141412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F4]"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Kembali ke Login</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Discreet Technical Footer */}
      <footer className="w-full border-t border-[#E6E6E0]">
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-8 text-xs text-[#575752]">
          <span>RevoU Admission Team</span>
          <span className="tabular-numbers text-[11px]">
            HTTP 503 · Service Unavailable
          </span>
        </div>
      </footer>
    </div>
  );
}
