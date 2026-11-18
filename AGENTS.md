<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Dashboard motion rules

Stack: Next.js (App Router), Tailwind, CSS. Do not add animation libraries (Framer Motion, GSAP, etc.). `motion/react` already exists in this project; do not add new usages, prefer CSS, and migrate existing usage only when explicitly asked.

- Use these skills: transitions-dev, animate, remove-animations, animation-performance, accessible-animation.
- Animate only transform and opacity. Never animate width, height, top, or left.
- Durations: 120ms for hover/press feedback, 200ms for dropdowns/tabs/fades, 300ms for panels/entrances. Never exceed 400ms.
- Use the tokens from app/motion.css (--ease-out, --dur-fast, --dur-base, --dur-slow). Do not hardcode durations.
- Staggered entrance animations run only on the first page load, not on every navigation or data refresh.
- Do not animate: keyboard actions, frequently repeated table sort/filter, or real-time data that refreshes every second.
- Every animation must have a prefers-reduced-motion fallback.
- Use tabular-nums for numbers. Skeletons must match the final content size exactly (no layout shift).
- Never communicate status through color alone; add a sign or icon.
