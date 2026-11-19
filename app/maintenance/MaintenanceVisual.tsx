export default function MaintenanceVisual() {
  return (
    <div className="maint-rig relative flex flex-col overflow-hidden rounded-2xl border border-[#E6E6E0] bg-white shadow-[0_14px_36px_-22px_rgba(20,20,18,0.12)]">
      {/* Architectural Drafting Stage */}
      <div className="maintenance-dot-grid relative flex min-h-[250px] sm:min-h-[300px] lg:min-h-[370px] flex-1 items-center justify-center p-6 sm:p-8">
        {/* Corner Registration Marks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-[#D9D9D4]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-[#D9D9D4]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-[#D9D9D4]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-[#D9D9D4]"
        />

        {/* Animated RevoU Repair Rig */}
        <div
          className="relative flex h-[220px] w-[220px] sm:h-[256px] sm:w-[256px] items-center justify-center"
          role="img"
          aria-label="Ilustrasi logo RevoU yang sedang diperbaiki dengan kunci pas dan roda gigi"
        >
          {/* Precision Mechanical SVG Layer */}
          <svg
            viewBox="0 0 260 260"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            {/* Outer Dashed Calibration Track */}
            <circle
              cx="130"
              cy="130"
              r="108"
              stroke="#E6E6E0"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* Main Rotating Gear Ring */}
            <g className="maint-gear-spin">
              <circle
                cx="130"
                cy="130"
                r="88"
                stroke="#D9D9D4"
                strokeWidth="2"
              />
              <circle
                cx="130"
                cy="130"
                r="76"
                stroke="#FFD84D"
                strokeWidth="2"
                strokeDasharray="18 14"
                strokeLinecap="round"
              />
              {/* 12 Gear Teeth around r=88 */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x="126"
                  y="34"
                  width="8"
                  height="11"
                  rx="2"
                  fill="#E6E6E0"
                  stroke="#D0D0C8"
                  strokeWidth="1"
                  transform={`rotate(${i * 30} 130 130)`}
                />
              ))}
            </g>

            {/* Secondary Interlocking Mini Cog (Bottom-Left) */}
            <g transform="translate(54, 198)">
              <g className="maint-gear-counter">
                <circle
                  cx="0"
                  cy="0"
                  r="19"
                  fill="#FAF9F5"
                  stroke="#141412"
                  strokeWidth="2"
                />
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect
                    key={i}
                    x="-2.5"
                    y="-24"
                    width="5"
                    height="6"
                    rx="1.2"
                    fill="#141412"
                    transform={`rotate(${i * 45})`}
                  />
                ))}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#FFD84D"
                  stroke="#141412"
                  strokeWidth="2"
                />
              </g>
            </g>

            {/* Calibration Micro-Sparks near Wrench Contact (Top-Right) */}
            <g className="maint-spark">
              <line
                x1="184"
                y1="62"
                x2="194"
                y2="52"
                stroke="#FFCC1A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="196"
                y1="74"
                x2="208"
                y2="71"
                stroke="#141412"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g className="maint-spark maint-spark-delay">
              <line
                x1="172"
                y1="52"
                x2="175"
                y2="41"
                stroke="#FFCC1A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Articulated Wrench Acting on the Emblem Bezel */}
            <g className="maint-wrench-turn">
              {/* Wrench Handle & Open-End Jaw */}
              <path
                d="M170 86 L214 42 C218 38 225 38 229 42 C233 46 233 53 229 57 L185 101"
                fill="#141412"
                stroke="#141412"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Yellow Handle Grip Accent */}
              <line
                x1="195"
                y1="76"
                x2="215"
                y2="56"
                stroke="#FFD84D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Open Jaw Gripping the Bezel Bolt */}
              <path
                d="M174 82 C167 78 158 79 152 85 C147 90 146 98 150 104 L158 96 C157 93 158 90 160 88 C162 86 165 85 168 86 L176 94 C177 97 176 100 174 102 C172 104 169 105 166 104 L158 112 C164 116 172 115 177 110 C183 104 184 95 180 88 Z"
                fill="#141412"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          {/* Center RevoU Emblem Hub with Synchronized Micro-Recoil */}
          <div className="maint-hub-recoil relative z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[24px] border-2 border-[#FFD84D] bg-[#141412] p-3.5 sm:p-4 shadow-[0_14px_28px_-10px_rgba(20,20,18,0.35)]">
            <img
              src="/revou-logo.png"
              alt="Logo RevoU"
              className="h-full w-full object-contain"
            />
            {/* Hex Bolt Cap on Top-Right Corner of Emblem */}
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#141412] bg-[#FFD84D]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#141412]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
