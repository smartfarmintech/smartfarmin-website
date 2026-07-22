"use client"

import { motion } from "motion/react"
import type { Region } from "@/lib/agreeConnect/executive"

export function ExecutiveMap({
  regions,
  activeId,
  onSelect,
}: {
  regions: Region[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const max = Math.max(...regions.map((r) => r.gmvShare))

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-[oklch(0.96_0.02_150)]">
      {/* soft landmass base */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <radialGradient id="landGlow" cx="48%" cy="52%" r="60%">
            <stop offset="0%" stopColor="oklch(0.93 0.05 150)" />
            <stop offset="100%" stopColor="oklch(0.96 0.02 150)" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#landGlow)" />
        {/* stylized peninsula silhouette */}
        <path
          d="M30 14 L46 12 L58 18 L60 30 L66 40 L60 56 L52 78 L46 90 L40 74 L34 58 L28 44 L26 28 Z"
          fill="oklch(0.9 0.06 150)"
          stroke="oklch(0.82 0.06 150)"
          strokeWidth="0.6"
        />
        {/* graticule */}
        {[20, 40, 60, 80].map((g) => (
          <line key={`h${g}`} x1="0" y1={g} x2="100" y2={g} stroke="oklch(0.86 0.03 150)" strokeWidth="0.25" strokeDasharray="1 2" />
        ))}
        {[25, 50, 75].map((g) => (
          <line key={`v${g}`} x1={g} y1="0" x2={g} y2="100" stroke="oklch(0.86 0.03 150)" strokeWidth="0.25" strokeDasharray="1 2" />
        ))}
      </svg>

      {/* region markers */}
      {regions.map((r) => {
        const active = r.id === activeId
        const size = 26 + (r.gmvShare / max) * 30
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            aria-label={`${r.name}: ${r.gmvShare}% of GMV`}
          >
            {/* halo */}
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25"
              style={{ width: size, height: size }}
              animate={active ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0.35 }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <span
              className={`relative flex items-center justify-center rounded-full font-semibold tabular-nums shadow-lg ring-2 transition-colors ${
                active
                  ? "bg-primary text-primary-foreground ring-primary/40"
                  : "bg-card/90 text-foreground ring-border/70 backdrop-blur"
              }`}
              style={{ width: size, height: size, fontSize: size / 3.4 }}
            >
              {r.gmvShare}
            </span>
          </button>
        )
      })}

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
        <span className="size-2 rounded-full bg-primary" />
        GMV share by state (%)
      </div>
    </div>
  )
}
