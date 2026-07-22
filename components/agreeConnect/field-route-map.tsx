"use client"

import { motion } from "motion/react"
import { Crosshair, Navigation, Plus, Minus } from "lucide-react"
import { ROUTE_STOPS, STATUS_META, type RouteStop } from "@/lib/agreeConnect/field"
import { cn } from "@/lib/utils"

/* build a smooth-ish polyline through the ordered stops */
function routePath(stops: RouteStop[]) {
  if (!stops.length) return ""
  return stops
    .map((s, i) => `${i === 0 ? "M" : "L"} ${s.x * 4} ${s.y * 4}`)
    .join(" ")
}

export function FieldRouteMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const stops = ROUTE_STOPS
  const done = stops.filter((s) => s.status !== "upcoming")
  const path = routePath(stops)
  const donePath = routePath(done)
  // agent sits at the current stop
  const agent = stops.find((s) => s.status === "current") ?? stops[0]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/70 bg-[oklch(0.92_0.02_150)] dark:bg-[oklch(0.24_0.02_155)]">
      {/* stylized Apple-Maps-like base (decorative, not real geography) */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <g className="text-[oklch(0.82_0.08_150)] dark:text-[oklch(0.3_0.05_150)]" fill="currentColor">
          <rect x="8" y="220" width="150" height="172" rx="16" />
          <rect x="250" y="10" width="150" height="120" rx="16" />
          <rect x="300" y="250" width="96" height="90" rx="12" />
          <rect x="12" y="16" width="90" height="70" rx="12" />
        </g>
        <path
          d="M-10 -10 C 60 30, 40 90, 90 120 C 150 150, 120 200, 60 210 L -10 210 Z"
          className="text-[oklch(0.78_0.07_230)] dark:text-[oklch(0.4_0.06_235)]"
          fill="currentColor"
          opacity={0.5}
        />
        <g className="text-[oklch(0.82_0.01_150)] dark:text-[oklch(0.32_0.01_155)]" stroke="currentColor" fill="none" strokeLinecap="round">
          <path d="M-10 200 H 410" strokeWidth="20" />
          <path d="M120 -10 V 410" strokeWidth="18" />
          <path d="M-10 310 H 410" strokeWidth="14" />
          <path d="M280 -10 V 410" strokeWidth="14" />
        </g>
        <g className="text-[oklch(0.98_0_0)] dark:text-[oklch(0.42_0.01_155)]" stroke="currentColor" fill="none" strokeLinecap="round">
          <path d="M-10 200 H 410" strokeWidth="13" />
          <path d="M120 -10 V 410" strokeWidth="12" />
          <path d="M-10 310 H 410" strokeWidth="9" />
          <path d="M280 -10 V 410" strokeWidth="8" />
        </g>

        {/* planned route (dashed) then completed route (solid accent) */}
        <path d={path} fill="none" stroke="var(--primary)" strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 10" />
        <motion.path
          d={donePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(0,0,0,0.08)]" />

      {/* route stop pins */}
      {stops.map((s) => {
        const meta = STATUS_META[s.status]
        const active = s.id === selectedId
        return (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-label={`Stop ${s.order}: ${s.village} — ${meta.label}`}
            initial={{ opacity: 0, scale: 0.5, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 20, delay: s.order * 0.06 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: active ? 30 : 10 }}
          >
            <span className={cn("relative flex items-center justify-center transition-transform", active ? "scale-110" : "hover:scale-105")}>
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold shadow-lg ring-4",
                  s.status === "done" && "border-chart-1 bg-chart-1 text-white ring-chart-1/20",
                  s.status === "current" && "border-accent bg-accent text-accent-foreground ring-accent/25",
                  s.status === "upcoming" && "border-border bg-card text-foreground ring-background",
                  active && "ring-primary/40",
                )}
              >
                {s.order}
              </span>
              {s.status === "current" && (
                <span className="absolute -inset-1 animate-ping rounded-full bg-accent/30" />
              )}
            </span>
          </motion.button>
        )
      })}

      {/* live agent marker at current stop */}
      {agent && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${agent.x}%`, top: `${agent.y}%`, zIndex: 40 }}>
          <span className="absolute -inset-5 animate-ping rounded-full bg-[oklch(0.55_0.15_255)]/25" />
          <span className="relative flex size-4 items-center justify-center rounded-full bg-[oklch(0.55_0.15_255)] ring-4 ring-background">
            <Navigation className="size-2.5 text-background" />
          </span>
        </div>
      )}

      {/* zoom + recenter controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-lg backdrop-blur">
          <button type="button" aria-label="Zoom in" className="flex size-10 items-center justify-center text-foreground transition-colors hover:bg-muted">
            <Plus className="size-5" />
          </button>
          <span className="h-px bg-border/70" />
          <button type="button" aria-label="Zoom out" className="flex size-10 items-center justify-center text-foreground transition-colors hover:bg-muted">
            <Minus className="size-5" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Recenter on my location"
          className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/90 text-primary shadow-lg backdrop-blur transition-colors hover:bg-card"
        >
          <Crosshair className="size-5" />
        </button>
      </div>

      {/* live GPS chip */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-1/60" />
          <span className="relative inline-flex size-2 rounded-full bg-chart-1" />
        </span>
        Live GPS · Warangal rural
      </div>
    </div>
  )
}
