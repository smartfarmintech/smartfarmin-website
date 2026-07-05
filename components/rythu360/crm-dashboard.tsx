"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Crown,
  IndianRupee,
  Medal,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  Search,
  Sparkles,
  Target,
  Tractor,
  Trophy,
  Users,
} from "lucide-react"
import { GlassCard } from "@/components/rythu360/glass-card"
import {
  CallsTrendChart,
  DonutProgress,
  RegistrationsBarChart,
  RevenueTargetChart,
  Sparkline,
} from "@/components/rythu360/charts"
import {
  CAL_DAYS,
  CAL_EVENTS,
  CAL_FIRST_WEEKDAY,
  CAL_MONTH,
  CAL_TODAY,
  CALL_STATS,
  CALLS_TREND,
  FOLLOWUPS,
  KPIS,
  LEADERBOARD,
  LEADS,
  pct,
  priorityColor,
  REGISTRATIONS,
  REVENUE_TREND,
  TARGET,
  intentColor,
  type FollowUp,
} from "@/lib/rythu360/crm"

const ICONS: Record<string, typeof PhoneCall> = {
  PhoneCall,
  CalendarClock,
  Users,
  Tractor,
  IndianRupee,
  Target,
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function CrmDashboard() {
  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <Header />
        <KpiGrid />

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <TargetCard />
          <CallAnalytics />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <ChartCard title="Call Volume" subtitle="Calls vs connected · 7 days" className="lg:col-span-2">
            <CallsTrendChart data={CALLS_TREND} />
          </ChartCard>
          <ChartCard title="Registrations" subtitle="Farmers vs operators">
            <RegistrationsBarChart data={REGISTRATIONS} />
          </ChartCard>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <ChartCard title="Revenue vs Target" subtitle="Monthly performance" className="lg:col-span-2">
            <RevenueTargetChart data={REVENUE_TREND} />
          </ChartCard>
          <LegendCard />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <LeadScoreCard />
          <FollowUpsCard />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <CalendarCard />
          <LeaderboardCard />
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <motion.header {...fade} className="mb-5 flex flex-wrap items-center gap-3">
      <Link
        href="/app/dashboard"
        aria-label="Back to dashboard"
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
      >
        <ArrowLeft className="size-5" />
      </Link>
      <div className="min-w-0">
        <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">CRM Dashboard</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" /> Sales command center · Live
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-2 text-sm text-muted-foreground backdrop-blur sm:flex">
          <Search className="size-4" />
          <span>Search leads, agents…</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur">
          <CalendarClock className="size-4 text-primary" /> 5 Jul 2026
        </div>
      </div>
    </motion.header>
  )
}

function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k, i) => {
        const Icon = ICONS[k.icon] ?? Target
        const up = k.trend === "up"
        return (
          <motion.div key={k.id} {...fade} transition={{ delay: i * 0.04 }}>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <span className={`flex size-9 items-center justify-center rounded-xl bg-muted ${k.tint}`}>
                  <Icon className="size-4.5" />
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    up ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl font-semibold tabular-nums">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <div className="mt-2 h-8">
                <Sparkline data={k.spark} up={up} />
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div {...fade} className={className}>
      <GlassCard className="p-5">
        <div className="mb-2">
          <h2 className="font-medium">{title}</h2>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
      </GlassCard>
    </motion.div>
  )
}

function TargetCard() {
  const rings = [
    { label: "Calls", value: pct(TARGET.callsDone, TARGET.callsGoal), sub: `${TARGET.callsDone}/${TARGET.callsGoal}` },
    { label: "Revenue", value: pct(TARGET.revenueDone, TARGET.revenueGoal), sub: "₹1.86L/2.5L" },
    { label: "Signups", value: pct(TARGET.signupsDone, TARGET.signupsGoal), sub: `${TARGET.signupsDone}/${TARGET.signupsGoal}` },
  ]
  return (
    <motion.div {...fade} className="lg:col-span-1">
      <GlassCard className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <Target className="size-4.5 text-primary" />
          <h2 className="font-medium">Today&apos;s Target</h2>
        </div>
        <p className="mb-2 text-xs text-muted-foreground">Team progress toward daily goals</p>
        <div className="grid grid-cols-3 gap-2">
          {rings.map((r) => (
            <div key={r.label} className="flex flex-col items-center">
              <DonutProgress value={r.value} />
              <p className="-mt-1 text-sm font-medium">{r.label}</p>
              <p className="text-xs tabular-nums text-muted-foreground">{r.sub}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function CallAnalytics() {
  const stats = [
    { label: "Connected", value: CALL_STATS.connected, icon: PhoneIncoming, tint: "text-chart-1 bg-chart-1/10" },
    { label: "Missed", value: CALL_STATS.missed, icon: PhoneMissed, tint: "text-destructive bg-destructive/10" },
    { label: "Scheduled", value: CALL_STATS.scheduled, icon: CalendarClock, tint: "text-accent bg-accent/10" },
  ]
  return (
    <motion.div {...fade} className="lg:col-span-2">
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <PhoneCall className="size-4.5 text-primary" />
          <h2 className="font-medium">Call Analytics</h2>
          <span className="ml-auto text-xs text-muted-foreground">Avg {CALL_STATS.avgDuration}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-card/50 p-4">
                <span className={`flex size-9 items-center justify-center rounded-xl ${s.tint}`}>
                  <Icon className="size-4.5" />
                </span>
                <p className="mt-3 font-serif text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-4 rounded-2xl border border-border/60 bg-card/50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Answer rate</span>
            <span className="font-medium tabular-nums">{CALL_STATS.answerRate}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-chart-2 to-chart-1"
              style={{ width: `${CALL_STATS.answerRate}%` }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function LegendCard() {
  const items = [
    { c: "bg-chart-1", label: "Revenue achieved", value: "₹18.6L" },
    { c: "bg-accent", label: "Target line", value: "₹25.0L" },
  ]
  return (
    <motion.div {...fade}>
      <GlassCard className="flex h-full flex-col justify-center p-5">
        <h2 className="mb-1 font-medium">Performance Summary</h2>
        <p className="mb-4 text-xs text-muted-foreground">Month to date</p>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <span className={`size-3 rounded-full ${it.c}`} />
              <span className="text-sm text-muted-foreground">{it.label}</span>
              <span className="ml-auto font-serif text-lg font-semibold tabular-nums">{it.value}</span>
            </div>
          ))}
          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">Goal completion</p>
            <p className="font-serif text-2xl font-semibold text-chart-1">74.4%</p>
            <p className="text-xs text-muted-foreground">On track to close ₹25L by month end</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function LeadScoreCard() {
  return (
    <motion.div {...fade} className="lg:col-span-2">
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-4.5 text-primary" />
          <h2 className="font-medium">AI Lead Score</h2>
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Ranked by intent
          </span>
        </div>
        <div className="space-y-2">
          {LEADS.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3 transition-colors hover:bg-card"
            >
              <ScoreRing score={l.score} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{l.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${intentColor(l.intent)}`}>
                    {l.intent}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {l.location} · {l.crop}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{l.reason}</p>
              </div>
              <div className="text-right">
                <p className="font-serif font-semibold tabular-nums text-chart-1">{l.value}</p>
                <p className="text-[10px] text-muted-foreground">est. value</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 85 ? "text-destructive" : score >= 70 ? "text-accent" : "text-muted-foreground"
  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center">
      <svg viewBox="0 0 36 36" className="size-12 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--muted)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          className={tone}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 94.2} 94.2`}
        />
      </svg>
      <span className={`absolute text-sm font-semibold tabular-nums ${tone}`}>{score}</span>
    </div>
  )
}

function FollowUpsCard() {
  const [items, setItems] = useState<FollowUp[]>(FOLLOWUPS)
  const toggle = (id: string) =>
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, done: !f.done } : f)))
  const remaining = items.filter((f) => !f.done).length
  return (
    <motion.div {...fade}>
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="size-4.5 text-primary" />
          <h2 className="font-medium">Follow-ups</h2>
          <span className="ml-auto text-xs text-muted-foreground">{remaining} pending</span>
        </div>
        <div className="space-y-2">
          {items.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-card/50 p-3 text-left transition-colors hover:bg-card"
            >
              {f.done ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-chart-1" />
              ) : (
                <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm font-medium ${f.done ? "text-muted-foreground line-through" : ""}`}>
                    {f.name}
                  </p>
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{f.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{f.note}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {f.type}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${priorityColor(f.priority)}`}>
                    {f.priority}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function CalendarCard() {
  const cells = useMemo(() => {
    const arr: (number | null)[] = []
    for (let i = 0; i < CAL_FIRST_WEEKDAY; i++) arr.push(null)
    for (let d = 1; d <= CAL_DAYS; d++) arr.push(d)
    return arr
  }, [])
  const intensityBg = ["", "bg-chart-1/20", "bg-chart-1/45", "bg-chart-1/80 text-primary-foreground"]
  return (
    <motion.div {...fade} className="lg:col-span-2">
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="size-4.5 text-primary" />
          <h2 className="font-medium">Activity Calendar</h2>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <button type="button" aria-label="Previous month" className="rounded-lg p-1 hover:bg-muted">
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-medium">{CAL_MONTH}</span>
            <button type="button" aria-label="Next month" className="rounded-lg p-1 hover:bg-muted">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="pb-1 text-[11px] font-medium text-muted-foreground">
              {d}
            </span>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <span key={i} />
            const ev = CAL_EVENTS[d]
            const isToday = d === CAL_TODAY
            return (
              <div
                key={i}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm tabular-nums transition-colors ${
                  ev ? intensityBg[ev.intensity] : "bg-card/40"
                } ${isToday ? "border-primary ring-1 ring-primary" : "border-border/50"}`}
              >
                <span className={ev && ev.intensity === 3 ? "font-semibold" : ""}>{d}</span>
                {ev ? <span className="text-[9px] leading-none opacity-80">{ev.count}</span> : null}
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <span className="size-3 rounded bg-card/40 ring-1 ring-border/50" />
          <span className="size-3 rounded bg-chart-1/20" />
          <span className="size-3 rounded bg-chart-1/45" />
          <span className="size-3 rounded bg-chart-1/80" />
          <span>More</span>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function LeaderboardCard() {
  const rankIcon = (i: number) => {
    if (i === 0) return <Crown className="size-4 text-accent" />
    if (i === 1) return <Trophy className="size-4 text-muted-foreground" />
    if (i === 2) return <Medal className="size-4 text-chart-3" />
    return <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
  }
  return (
    <motion.div {...fade}>
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="size-4.5 text-primary" />
          <h2 className="font-medium">Leaderboard</h2>
          <span className="ml-auto text-xs text-muted-foreground">This month</span>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${
                i === 0 ? "border-accent/30 bg-accent/5" : "border-border/60 bg-card/50"
              }`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                {rankIcon(i)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.calls} calls · {a.conversions} conv.
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif font-semibold tabular-nums">{a.revenue}</p>
                <p
                  className={`flex items-center justify-end gap-0.5 text-[10px] ${
                    a.change > 0 ? "text-chart-1" : a.change < 0 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {a.change > 0 ? <ArrowUpRight className="size-3" /> : a.change < 0 ? <ArrowDownRight className="size-3" /> : null}
                  score {a.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}
