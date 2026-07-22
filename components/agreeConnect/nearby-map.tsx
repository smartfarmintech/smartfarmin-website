"use client"

import { motion } from "motion/react"
import { Crosshair, Navigation, Plus, Minus } from "lucide-react"
import { AVAILABILITY_META, iconFor, type Service } from "@/lib/agreeConnect/nearby"
import { cn } from "@/lib/utils"

export function NearbyMap({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/70 bg-[oklch(0.92_0.02_150)] dark:bg-[oklch(0.24_0.02_155)]">
      {/* ---- stylized Apple-Maps-like base (decorative, not real geography) ---- */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* green field / park patches */}
        <g className="text-[oklch(0.82_0.08_150)] dark:text-[oklch(0.3_0.05_150)]" fill="currentColor">
          <rect x="10" y="14" width="118" height="82" rx="14" />
          <rect x="268" y="236" width="126" height="150" rx="16" />
          <rect x="16" y="286" width="96" height="72" rx="12" />
          <rect x="300" y="10" width="96" height="70" rx="12" />
        </g>
        {/* water body */}
        <path
          d="M300 -10 C 340 40, 300 90, 350 130 C 400 170, 380 210, 410 240 L 410 -10 Z"
          className="text-[oklch(0.78_0.07_230)] dark:text-[oklch(0.4_0.06_235)]"
          fill="currentColor"
        />
        {/* road casings then road fill */}
        <g
          className="text-[oklch(0.82_0.01_150)] dark:text-[oklch(0.32_0.01_155)]"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M-10 150 H 410" strokeWidth="20" />
          <path d="M-10 270 H 410" strokeWidth="16" />
          <path d="M150 -10 V 410" strokeWidth="20" />
          <path d="M260 -10 V 410" strokeWidth="14" />
          <path d="M60 -10 V 410" strokeWidth="12" />
          <path d="M-10 60 L 200 60 L 260 120" strokeWidth="10" />
        </g>
        <g
          className="text-[oklch(0.98_0_0)] dark:text-[oklch(0.42_0.01_155)]"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M-10 150 H 410" strokeWidth="13" />
          <path d="M-10 270 H 410" strokeWidth="10" />
          <path d="M150 -10 V 410" strokeWidth="13" />
          <path d="M260 -10 V 410" strokeWidth="8" />
          <path d="M60 -10 V 410" strokeWidth="7" />
          <path d="M-10 60 L 200 60 L 260 120" strokeWidth="6" />
        </g>
      </svg>

      {/* subtle vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(0,0,0,0.08)]"
      />

      {/* ---- proximity radius rings around user ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(0.55_0.15_255)]/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(0.55_0.15_255)]/25"
      />

      {/* ---- current location (user) ---- */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-4 animate-ping rounded-full bg-[oklch(0.55_0.15_255)]/25" />
        <span className="relative flex size-4 items-center justify-center rounded-full bg-[oklch(0.55_0.15_255)] ring-4 ring-background">
          <span className="size-1.5 rounded-full bg-background" />
        </span>
      </div>

      {/* ---- service pins ---- */}
      {services.map((sv) => {
        const Icon = iconFor(sv.category)
        const active = sv.id === selectedId
        const avail = AVAILABILITY_META[sv.availability]
        return (
          <motion.button
            key={sv.id}
            type="button"
            onClick={() => onSelect(sv.id)}
            aria-label={`${sv.name} — ${sv.category}`}
            initial={{ opacity: 0, scale: 0.5, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="absolute -translate-x-1/2 -translate-y-full focus:outline-none"
            style={{ left: `${sv.x}%`, top: `${sv.y}%`, zIndex: active ? 30 : 10 }}
          >
            <span
              className={cn(
                "relative flex flex-col items-center transition-transform",
                active ? "scale-110" : "hover:scale-105",
              )}
            >
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full border py-1 pl-1 shadow-lg backdrop-blur-sm",
                  active
                    ? "border-primary bg-primary pr-2 text-primary-foreground"
                    : "border-border/70 bg-card pr-1 text-foreground",
                )}
              >
                <span className="flex size-6 items-center justify-center rounded-full">
                  <Icon className="size-4" />
                </span>
                {active && <span className="text-xs font-semibold">{sv.distanceKm} km</span>}
              </span>
              {/* pin stem */}
              <span
                className={cn(
                  "-mt-0.5 size-2 rotate-45 rounded-[2px]",
                  active ? "bg-primary" : "bg-card",
                )}
              />
              {/* availability dot */}
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-card",
                  avail.dot,
                )}
              />
            </span>
          </motion.button>
        )
      })}

      {/* ---- zoom + recenter controls ---- */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-lg backdrop-blur">
          <button
            type="button"
            aria-label="Zoom in"
            className="flex size-10 items-center justify-center text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="size-5" />
          </button>
          <span className="h-px bg-border/70" />
          <button
            type="button"
            aria-label="Zoom out"
            className="flex size-10 items-center justify-center text-foreground transition-colors hover:bg-muted"
          >
            <Minus className="size-5" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Recenter map"
          className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/90 text-primary shadow-lg backdrop-blur transition-colors hover:bg-card"
        >
          <Crosshair className="size-5" />
        </button>
      </div>

      {/* ---- location label chip ---- */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
        <Navigation className="size-3.5 text-primary" />
        Warangal, Telangana
      </div>
    </div>
  )
}
