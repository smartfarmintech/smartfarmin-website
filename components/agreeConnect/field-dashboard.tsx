"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Award,
  Camera,
  CheckCircle2,
  Circle,
  Clock,
  Coins,
  Fingerprint,
  LogOut,
  MapPin,
  Navigation,
  Route,
  Wallet,
} from "lucide-react"
import {
  ATTENDANCE,
  FIELD_KPIS,
  GEO_PHOTOS,
  INCENTIVE_SUMMARY,
  INCENTIVES,
  ROUTE_STOPS,
  STATUS_META,
  TASK_ICON,
  TASKS,
  type Task,
} from "@/lib/agreeConnect/field"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { FieldRouteMap } from "@/components/agreeConnect/field-route-map"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export function FieldDashboard() {
  const [selectedStop, setSelectedStop] = useState<string | null>("s3")
  const [tasks, setTasks] = useState<Task[]>(TASKS)

  const doneCount = tasks.filter((t) => t.done).length
  const active = useMemo(() => ROUTE_STOPS.find((s) => s.id === selectedStop) ?? null, [selectedStop])

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <div className="min-h-svh bg-background">
      <div aria-hidden className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl" />

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
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Field Agent</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Navigation className="size-4 text-primary" /> Kiran Kumar · Warangal Rural cluster
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-chart-1/30 bg-chart-1/10 px-3 py-1.5 text-xs font-semibold text-chart-1">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-1/60" />
              <span className="relative inline-flex size-2 rounded-full bg-chart-1" />
            </span>
            On duty
          </span>
        </motion.header>

        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FIELD_KPIS.map((k, i) => {
            const Icon = k.icon
            return (
              <motion.div key={k.id} {...fade} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className={cn("flex size-9 items-center justify-center rounded-2xl", k.tint)}>
                      <Icon className="size-4.5" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{k.sub}</span>
                  </div>
                  <p className="mt-3 font-serif text-2xl font-semibold tabular-nums">{k.value}</p>
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${k.progress}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* LEFT: Live map + route */}
          <div className="space-y-5 lg:col-span-2">
            {/* Live Map */}
            <motion.div {...fade}>
              <GlassCard className="overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Route className="size-4.5 text-primary" />
                    <h2 className="font-serif text-lg font-semibold">Today&apos;s Route</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">27.5 / 45 km</span>
                </div>
                <div className="h-[340px] p-3 sm:h-[400px]">
                  <FieldRouteMap selectedId={selectedStop} onSelect={setSelectedStop} />
                </div>
                {active && (
                  <div className="flex items-center gap-3 border-t border-border/60 px-5 py-3.5">
                    <span className={cn("flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white", STATUS_META[active.status].dot)}>
                      {active.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{active.village}</p>
                      <p className="truncate text-xs text-muted-foreground">{active.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{active.eta}</p>
                      <p className={cn("text-xs font-medium", STATUS_META[active.status].text)}>{STATUS_META[active.status].label}</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Village Visits list */}
            <motion.div {...fade}>
              <GlassCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold">Village Visits</h2>
                  <span className="text-sm text-muted-foreground">{ROUTE_STOPS.filter((s) => s.status === "done").length}/{ROUTE_STOPS.length} done</span>
                </div>
                <ol className="relative space-y-1">
                  <span aria-hidden className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                  {ROUTE_STOPS.map((s) => {
                    const meta = STATUS_META[s.status]
                    const isActive = s.id === selectedStop
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedStop(s.id)}
                          className={cn(
                            "relative flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors",
                            isActive ? "bg-muted/70" : "hover:bg-muted/40",
                          )}
                        >
                          <span
                            className={cn(
                              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-card",
                              s.status === "done" && "bg-chart-1 text-white",
                              s.status === "current" && "bg-accent text-accent-foreground",
                              s.status === "upcoming" && "border border-border bg-card text-muted-foreground",
                            )}
                          >
                            {s.status === "done" ? <CheckCircle2 className="size-4" /> : s.order}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold">{s.village}</p>
                              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", meta.text, "bg-muted")}>{meta.label}</span>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">{s.purpose}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold tabular-nums">{s.eta}</p>
                            <p className="text-[11px] text-muted-foreground">{s.farmers} farmers</p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </GlassCard>
            </motion.div>

            {/* Geo-tagged Photos */}
            <motion.div {...fade}>
              <GlassCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="size-4.5 text-primary" />
                    <h2 className="font-serif text-lg font-semibold">Geo-tagged Photos</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">{GEO_PHOTOS.length} today</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {GEO_PHOTOS.map((p) => (
                    <div key={p.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                      <div
                        className="relative flex h-24 items-end p-2"
                        style={{
                          background: `linear-gradient(150deg, oklch(0.72 0.1 ${p.hue}), oklch(0.5 0.12 ${p.hue}))`,
                        }}
                      >
                        <span className="flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                          <MapPin className="size-2.5" /> Geo-tagged
                        </span>
                        <span className="absolute right-2 top-2 rounded-full bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                          {p.time}
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="truncate text-xs font-semibold">{p.label}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{p.village}</p>
                        <p className="mt-0.5 truncate text-[10px] tabular-nums text-muted-foreground">{p.lat} · {p.lng}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                >
                  <Camera className="size-4" /> Capture new geo-tagged photo
                </button>
              </GlassCard>
            </motion.div>
          </div>

          {/* RIGHT: attendance, tasks, incentives */}
          <div className="space-y-5">
            {/* Attendance */}
            <motion.div {...fade}>
              <GlassCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Fingerprint className="size-4.5 text-primary" />
                  <h2 className="font-serif text-lg font-semibold">Attendance</h2>
                </div>
                <div className="rounded-2xl border border-chart-1/25 bg-chart-1/8 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Checked in</span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-chart-1">
                      <CheckCircle2 className="size-4" /> {ATTENDANCE.checkInTime}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" /> {ATTENDANCE.location}
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="font-serif text-2xl font-semibold tabular-nums">{ATTENDANCE.hours}</p>
                      <p className="text-xs text-muted-foreground">on duty today</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-chart-1/15 px-2.5 py-1 text-xs font-semibold text-chart-1">
                      <Clock className="size-3.5" /> {ATTENDANCE.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/8 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
                >
                  <LogOut className="size-4" /> Check out
                </button>
              </GlassCard>
            </motion.div>

            {/* Tasks */}
            <motion.div {...fade}>
              <GlassCard className="p-5">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold">Tasks</h2>
                  <span className="text-sm text-muted-foreground tabular-nums">{doneCount}/{tasks.length}</span>
                </div>
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    animate={{ width: `${(doneCount / tasks.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <ul className="space-y-1.5">
                  {tasks.map((t) => {
                    const Icon = TASK_ICON[t.kind]
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => toggleTask(t.id)}
                          className="flex w-full items-start gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-muted/50"
                        >
                          {t.done ? (
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-chart-1" />
                          ) : (
                            <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-sm font-medium leading-snug", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Icon className="size-3" /> {t.village} · {t.time}
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </GlassCard>
            </motion.div>

            {/* Incentives */}
            <motion.div {...fade}>
              <GlassCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="size-4.5 text-accent" />
                  <h2 className="font-serif text-lg font-semibold">Incentives</h2>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-4 text-primary-foreground">
                  <p className="flex items-center gap-1.5 text-xs font-medium opacity-90">
                    <Coins className="size-3.5" /> Earned today
                  </p>
                  <p className="mt-1 font-serif text-3xl font-semibold tabular-nums">{INCENTIVE_SUMMARY.todayEarned}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="opacity-90">Month: {INCENTIVE_SUMMARY.monthEarned} / {INCENTIVE_SUMMARY.monthTarget}</span>
                    <span className="font-semibold">{INCENTIVE_SUMMARY.monthProgress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary-foreground/25">
                    <motion.div
                      className="h-full rounded-full bg-primary-foreground"
                      initial={{ width: 0 }}
                      animate={{ width: `${INCENTIVE_SUMMARY.monthProgress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
                <ul className="mt-4 space-y-3">
                  {INCENTIVES.map((inc) => {
                    const Icon = inc.icon
                    const pct = Math.round((inc.earned / inc.target) * 100)
                    return (
                      <li key={inc.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="flex size-7 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                              <Icon className="size-3.5" />
                            </span>
                            {inc.label}
                          </span>
                          <span className="font-semibold tabular-nums">{inc.amount}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className="h-full rounded-full bg-accent"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                          <span className="text-[11px] tabular-nums text-muted-foreground">{inc.earned}/{inc.target}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                  <Wallet className="size-4 text-primary" />
                  Incentives are credited to your Rythu360 wallet every Friday.
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
