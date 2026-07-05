"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Star,
  X,
} from "lucide-react"
import {
  AVAILABILITY_META,
  CATEGORY_META,
  formatINR,
  type MachineryCategory,
  type Operator,
  OPERATORS,
} from "@/lib/rythu360/machinery"
import { MachineryMap } from "@/components/rythu360/machinery-map"
import { GlassCard } from "@/components/rythu360/glass-card"
import { ThemeToggle } from "@/components/rythu360/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function MachineryBooking() {
  const [category, setCategory] = useState<MachineryCategory>("Tractor")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [booking, setBooking] = useState<Operator | null>(null)

  const operators = useMemo(
    () =>
      OPERATORS.filter((o) => o.category === category).sort(
        (a, b) => a.distanceKm - b.distanceKm,
      ),
    [category],
  )

  // keep a valid selection for the current category
  const activeId = selectedId && operators.some((o) => o.id === selectedId) ? selectedId : operators[0]?.id ?? null

  const meta = CATEGORY_META.find((c) => c.key === category)!

  return (
    <div className="relative min-h-dvh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ---------- Header ---------- */}
        <header className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Book Machinery
            </h1>
            <p className="text-sm text-muted-foreground">On-demand equipment near you · Warangal</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" /> {operators.length} nearby
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* ---------- Category selector ---------- */}
        <motion.div {...fade} className="mt-5">
          <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_META.map((c) => {
              const Icon = c.icon
              const active = c.key === category
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    setCategory(c.key)
                    setSelectedId(null)
                  }}
                  className={cn(
                    "group flex min-w-[104px] flex-1 flex-col items-center gap-2 rounded-3xl border p-3 text-center transition-colors",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border/70 bg-card/70 hover:bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                      active ? "bg-primary text-primary-foreground" : c.tint,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight">{c.key}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ---------- Map + operator list ---------- */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-5">
          {/* map */}
          <motion.div {...fade} transition={{ delay: 0.05 }} className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              <div className="h-[340px] sm:h-[420px] lg:h-[560px]">
                <MachineryMap operators={operators} selectedId={activeId} onSelect={setSelectedId} />
              </div>
              <p className="mt-2 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-chart-1" /> Available</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-accent" /> Soon</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground" /> Busy</span>
                <span className="ml-auto flex items-center gap-1"><span className="size-2 rounded-full bg-[oklch(0.55_0.15_255)]" /> You</span>
              </p>
            </div>
          </motion.div>

          {/* list */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold tracking-tight">
                Nearby {meta.key.toLowerCase()} operators
              </h2>
              <span className="text-sm text-muted-foreground">{operators.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {operators.map((op, i) => (
                  <motion.div
                    key={op.id}
                    layout
                    {...fade}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <OperatorCard
                      op={op}
                      active={op.id === activeId}
                      onSelect={() => setSelectedId(op.id)}
                      onBook={() => setBooking(op)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {booking && (
          <BookingSheet operator={booking} onClose={() => setBooking(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function OperatorCard({
  op,
  active,
  onSelect,
  onBook,
}: {
  op: Operator
  active: boolean
  onSelect: () => void
  onBook: () => void
}) {
  const avail = AVAILABILITY_META[op.availability]
  return (
    <GlassCard
      className={cn(
        "cursor-pointer p-4 transition-all",
        active ? "ring-2 ring-primary" : "hover:border-primary/40",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-sm font-semibold">
          {op.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold tracking-tight">{op.name}</p>
            {op.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
          </div>
          <p className="truncate text-sm text-muted-foreground">{op.machine}</p>
          <p className="truncate text-xs text-muted-foreground">{op.specs}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold tracking-tight">{formatINR(op.price)}</p>
          <p className="text-xs text-muted-foreground">{op.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="flex items-center gap-1 font-medium">
          <Star className="size-3.5 fill-accent text-accent" />
          {op.rating.toFixed(1)}
          <span className="text-muted-foreground">({op.reviews})</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3.5" />
          {op.distanceKm} km
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3.5" />
          {op.etaMin} min
        </span>
        <span className={cn("flex items-center gap-1.5 font-medium", avail.text)}>
          <span className={cn("size-1.5 rounded-full", avail.dot)} />
          {avail.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          className="flex-1 rounded-full"
          disabled={op.availability === "busy"}
          onClick={(e) => {
            e.stopPropagation()
            onBook()
          }}
        >
          {op.availability === "busy" ? "Unavailable" : "Book Now"}
        </Button>
      </div>
    </GlassCard>
  )
}

function BookingSheet({ operator, onClose }: { operator: Operator; onClose: () => void }) {
  const isHourly = operator.unit === "/hour"
  const [qty, setQty] = useState(isHourly ? 4 : 2)
  const [confirmed, setConfirmed] = useState(false)

  const platformFee = 40
  const subtotal = operator.price * qty
  const total = subtotal + platformFee
  const qtyLabel = isHourly ? "hours" : "acres"

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${operator.name}`}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:bottom-4 sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />

        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Check className="size-8" />
              </span>
              <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight">Booking confirmed</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {operator.name} will arrive in about {operator.etaMin} minutes.
              </p>
              <div className="mt-4 flex w-full items-center justify-between rounded-2xl bg-muted/50 p-3.5 text-sm">
                <span className="flex items-center gap-2">
                  <Navigation className="size-4 text-primary" /> Tracking your operator
                </span>
                <span className="font-semibold">{formatINR(total)}</span>
              </div>
              <Button onClick={onClose} className="mt-4 w-full rounded-full">
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-sm font-semibold">
                    {operator.initials}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold tracking-tight">
                      {operator.name}
                      {operator.verified && <BadgeCheck className="size-4 text-primary" />}
                    </p>
                    <p className="text-xs text-muted-foreground">{operator.machine}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* quantity stepper */}
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 p-3.5">
                <div>
                  <p className="text-sm font-medium capitalize">{qtyLabel} needed</p>
                  <p className="text-xs text-muted-foreground">
                    {formatINR(operator.price)} {operator.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Decrease ${qtyLabel}`}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex size-9 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-muted"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center text-lg font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${qtyLabel}`}
                    onClick={() => setQty((q) => Math.min(24, q + 1))}
                    className="flex size-9 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-muted"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* address */}
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 p-3.5">
                <MapPin className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">North field · 6.5 acres</p>
                  <p className="truncate text-xs text-muted-foreground">Warangal, Telangana</p>
                </div>
                <button type="button" className="ml-auto text-xs font-medium text-primary">
                  Change
                </button>
              </div>

              {/* price summary */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {formatINR(operator.price)} × {qty} {qtyLabel}
                  </span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform fee</span>
                  <span>{formatINR(platformFee)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <Button onClick={() => setConfirmed(true)} className="mt-4 h-12 w-full rounded-full text-sm">
                Confirm booking · {formatINR(total)}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Pay after the job is completed
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
