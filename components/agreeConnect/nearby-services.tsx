"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Clock,
  Navigation,
  Phone,
  Route,
  Search,
  SlidersHorizontal,
  Star,
  Timer,
  X,
} from "lucide-react"
import {
  AVAILABILITY_META,
  CATEGORY_META,
  iconFor,
  SERVICES,
  TRACKING_STEPS,
  type Service,
  type ServiceCategory,
} from "@/lib/agreeConnect/nearby"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { NearbyMap } from "@/components/agreeConnect/nearby-map"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
}

type SortKey = "distance" | "rating"

export function NearbyServices() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ServiceCategory | "All">("All")
  const [sort, setSort] = useState<SortKey>("distance")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = SERVICES.filter((s) => {
      const matchesCategory = category === "All" || s.category === category
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
    list = [...list].sort((a, b) =>
      sort === "distance" ? a.distanceKm - b.distanceKm : b.rating - a.rating,
    )
    return list
  }, [query, category, sort])

  const detail = detailId ? SERVICES.find((s) => s.id === detailId) ?? null : null
  const openCount = SERVICES.filter((s) => s.availability === "open").length

  return (
    <div className="min-h-svh bg-background">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header {...fade} className="mb-5 flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Nearby Services
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Navigation className="size-4 text-primary" /> {openCount} open near Warangal
            </p>
          </div>
        </motion.header>

        {/* Search + sort */}
        <motion.div {...fade} transition={{ delay: 0.04 }} className="mb-4 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores, labs, vets, mandis…"
              className="h-12 w-full rounded-2xl border border-border/70 bg-card/60 pl-11 pr-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={() => setSort((s) => (s === "distance" ? "rating" : "distance"))}
            className="flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">{sort === "distance" ? "Nearest" : "Top rated"}</span>
          </button>
        </motion.div>

        {/* Category chips */}
        <motion.div
          {...fade}
          transition={{ delay: 0.08 }}
          className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <FilterChip active={category === "All"} onClick={() => setCategory("All")}>
            All
          </FilterChip>
          {CATEGORY_META.map((c) => {
            const Icon = c.icon
            return (
              <FilterChip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>
                <Icon className="size-4" />
                {c.key}
              </FilterChip>
            )
          })}
        </motion.div>

        {/* Map + list */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Map */}
          <motion.div {...fade} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <div className="sticky top-6 h-[320px] sm:h-[440px] lg:h-[calc(100svh-8rem)]">
              <NearbyMap services={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </motion.div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              {filtered.map((s, i) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  index={i}
                  highlighted={s.id === selectedId}
                  onHover={() => setSelectedId(s.id)}
                  onOpen={() => setDetailId(s.id)}
                />
              ))}
              {filtered.length === 0 && (
                <GlassCard className="p-8 text-center text-sm text-muted-foreground">
                  No services match your search.
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail sheet */}
      <AnimatePresence>
        {detail && <ServiceDetail service={detail} onClose={() => setDetailId(null)} />}
      </AnimatePresence>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/70 bg-card/60 text-foreground hover:bg-card",
      )}
    >
      {children}
    </button>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      <Star className="size-3.5 fill-accent text-accent" />
      <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
    </span>
  )
}

function ServiceCard({
  service,
  index,
  highlighted,
  onHover,
  onOpen,
}: {
  service: Service
  index: number
  highlighted: boolean
  onHover: () => void
  onOpen: () => void
}) {
  const Icon = iconFor(service.category)
  const avail = AVAILABILITY_META[service.availability]
  const meta = CATEGORY_META.find((c) => c.key === service.category)
  return (
    <motion.div {...fade} transition={{ delay: 0.1 + index * 0.03 }}>
      <GlassCard
        onMouseEnter={onHover}
        onClick={onOpen}
        className={cn(
          "cursor-pointer p-4 transition-all",
          highlighted && "ring-2 ring-primary/60",
        )}
      >
        <div className="flex gap-3.5">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              meta?.tint ?? "bg-primary/12 text-primary",
            )}
          >
            <Icon className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="flex items-center gap-1 truncate font-semibold tracking-tight">
                  {service.name}
                  {service.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
                </h3>
                <p className="truncate text-xs text-muted-foreground">{service.tagline}</p>
              </div>
              <Stars rating={service.rating} />
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="flex items-center gap-1 font-medium">
                <Navigation className="size-3.5 text-primary" /> {service.distanceKm} km
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Timer className="size-3.5" /> {service.etaMin} min
              </span>
              <span className={cn("flex items-center gap-1 font-medium", avail.text)}>
                <span className={cn("size-1.5 rounded-full", avail.dot)} /> {avail.label}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
          <div className="text-sm">
            <span className="font-semibold">{service.price}</span>{" "}
            <span className="text-xs text-muted-foreground">{service.priceNote}</span>
          </div>
          <span className="flex items-center gap-0.5 text-sm font-medium text-primary">
            View <ChevronRight className="size-4" />
          </span>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ServiceDetail({ service, onClose }: { service: Service; onClose: () => void }) {
  const [booked, setBooked] = useState(false)
  const [trackStep, setTrackStep] = useState(0)
  const Icon = iconFor(service.category)
  const avail = AVAILABILITY_META[service.availability]
  const meta = CATEGORY_META.find((c) => c.key === service.category)

  function handleBook() {
    setBooked(true)
    setTrackStep(0)
    // simulate live tracking progression
    const timers = TRACKING_STEPS.map((_, i) =>
      setTimeout(() => setTrackStep(i), i * 1600),
    )
    return () => timers.forEach(clearTimeout)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92svh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl border border-border/70 bg-card p-5 shadow-2xl sm:bottom-6 sm:rounded-3xl"
      >
        {/* grabber */}
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />

        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl",
              meta?.tint ?? "bg-primary/12 text-primary",
            )}
          >
            <Icon className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="flex items-center gap-1.5 font-serif text-xl font-semibold tracking-tight">
                {service.name}
                {service.verified && <BadgeCheck className="size-5 shrink-0 text-primary" />}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{service.tagline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <Stars rating={service.rating} />
              <span className="text-muted-foreground">({service.reviews} reviews)</span>
              <span className={cn("flex items-center gap-1 font-medium", avail.text)}>
                <span className={cn("size-1.5 rounded-full", avail.dot)} /> {avail.label}
              </span>
            </div>
          </div>
        </div>

        {/* quick stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <Stat icon={Navigation} label="Distance" value={`${service.distanceKm} km`} />
          <Stat icon={Timer} label="ETA" value={`${service.etaMin} min`} />
          <Stat icon={Clock} label="Hours" value={service.hours} small />
        </div>

        {/* pricing */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted/50 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Pricing</p>
            <p className="text-lg font-semibold tracking-tight">
              {service.price}{" "}
              <span className="text-xs font-normal text-muted-foreground">{service.priceNote}</span>
            </p>
          </div>
          <a
            href={`tel:${service.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Phone className="size-4 text-primary" /> Call
          </a>
        </div>

        {/* live tracking (after booking) */}
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Route className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Live tracking</h3>
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium text-primary">
                    <span className="size-1.5 animate-pulse rounded-full bg-primary" /> Live
                  </span>
                </div>
                <ol className="relative ml-1.5 flex flex-col gap-3.5 border-l border-border pl-5">
                  {TRACKING_STEPS.map((step, i) => {
                    const done = i <= trackStep
                    const current = i === trackStep
                    return (
                      <li key={step.key} className="relative">
                        <span
                          className={cn(
                            "absolute -left-[26px] flex size-5 items-center justify-center rounded-full ring-4 ring-card transition-colors",
                            done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {done ? (
                            <Check className="size-3" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-current" />
                          )}
                        </span>
                        <p
                          className={cn(
                            "text-sm font-medium leading-none",
                            current && "text-primary",
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{step.note}</p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* actions */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-2xl border border-border/70 bg-card text-sm font-semibold transition-colors hover:bg-muted"
          >
            Close
          </button>
          {booked ? (
            <div className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-chart-1/15 text-sm font-semibold text-chart-1">
              <CircleCheck className="size-5" /> Request confirmed
            </div>
          ) : (
            <button
              type="button"
              onClick={handleBook}
              disabled={service.availability === "closed"}
              className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {service.availability === "closed" ? "Currently closed" : "Book & Track"}
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: typeof Navigation
  label: string
  value: string
  small?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-muted/50 p-3 text-center">
      <Icon className="size-4 text-primary" />
      <p className={cn("font-semibold tracking-tight", small ? "text-xs" : "text-sm")}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
