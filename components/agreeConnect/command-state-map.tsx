"use client"

import { motion } from "motion/react"
import type { StateRegion } from "@/lib/agreeConnect/command"

export function CommandStateMap({
  regions,
  activeId,
  onSelect,
}: {
  regions: StateRegion[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const max = Math.max(...regions.map((r) => r.share))

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-[oklch(0.22_0.03_250)]">
      {/* dark ops-console base */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <radialGradient id="cmdGlow" cx="46%" cy="50%" r="62%">
            <stop offset="0%" stopColor="oklch(0.28 0.05 250)" />
            <stop offset="100%" stopColor="oklch(0.2 0.03 250)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#cmdGlow)" />
        <path
          d="M30 14 L46 12 L58 18 L60 30 L66 40 L60 56 L52 78 L46 90 L40 74 L34 58 L28 44 L26 28 Z"
          fill="oklch(0.3 0.05 250)"
          stroke="oklch(0.42 0.08 250)"
          strokeWidth="0.6"
        />
        {[20, 40, 60, 80].map((g) => (
          <line key={`h${g}`} x1="0" y1={g} x2="100" y2={g} stroke="oklch(0.4 0.03 250)" strokeWidth="0.2" strokeDasharray="1 2" />
        ))}
        {[25, 50, 75].map((g) => (
          <line key={`v${g}`} x1={g} y1="0" x2={g} y2="100" stroke="oklch(0.4 0.03 250)" strokeWidth="0.2" strokeDasharray="1 2" />
        ))}
      </svg>

      {regions.map((r) => {
        const active = r.id === activeId
        const size = 26 + (r.share / max) * 30
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            aria-label={`${r.name}: ${r.share}% of national GMV`}
          >
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30"
              style={{ width: size, height: size }}
              animate={active ? { scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] } : { scale: 1, opacity: 0.3 }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <span
              className={`relative flex items-center justify-center rounded-full font-semibold tabular-nums shadow-lg ring-2 transition-colors ${
                active
                  ? "bg-primary text-primary-foreground ring-primary/50"
                  : "bg-card/90 text-foreground ring-border/60 backdrop-blur"
              }`}
              style={{ width: size, height: size, fontSize: size / 3.4 }}
            >
              {r.share}
            </span>
          </button>
        )
      })}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
        <span className="size-2 rounded-full bg-primary" />
        National GMV share (%)
      </div>
    </div>
  )
}
