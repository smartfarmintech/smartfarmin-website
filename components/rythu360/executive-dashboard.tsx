"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Brain,
  CreditCard,
  Crown,
  Globe,
  IndianRupee,
  Layers,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
  Tractor,
  TrendingUp,
  Users,
} from "lucide-react"
import { GlassCard } from "@/components/rythu360/glass-card"
import {
  AiUsageChart,
  DonutProgress,
  RevenueGmvChart,
  RevenueStreamChart,
  Sparkline,
} from "@/components/rythu360/charts"
import { ExecutiveMap } from "@/components/rythu360/executive-map"
import {
  AI_METRICS,
  AI_USAGE,
  CATEGORY_SHARE,
  KPIS,
  MARKETPLACE,
  REGIONS,
  REVENUE_GMV,
  REVENUE_STREAMS,
  SUBSCRIPTIONS,
  TOP_OPERATORS,
} from "@/lib/rythu360/executive"

const ICONS: Record<string, typeof IndianRupee> = {
  revenue: IndianRupee,
  gmv: ShoppingBag,
  users: Users,
  operators: Tractor,
  orders: Package,
  churn: CreditCard,
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function ExecutiveDashboard() {
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
          <ChartCard
            title="Revenue vs GMV"
            subtitle="Net revenue against gross merchandise value · 8 mo"
            className="lg:col-span-2"
          >
            <RevenueGmvChart data={REVENUE_GMV} />
          </ChartCard>
          <RevenueSummary />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <ChartCard title="Revenue Streams" subtitle="Marketplace · Subscriptions · Commissions" className="lg:col-span-2">
            <RevenueStreamChart data={REVENUE_STREAMS} />
          </ChartCard>
          <MarketplaceCard />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <GeoCard />
          <AiCard />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <SubscriptionsCard />
          <OperatorsCard />
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
        <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Executive Dashboard</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" /> Company-wide performance · Q3 FY26
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-2 text-sm text-muted-foreground backdrop-blur sm:flex">
          <Activity className="size-4 text-chart-1" /> Live
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur">
          <Globe className="size-4 text-primary" /> All India
        </div>
      </div>
    </motion.header>
  )
}

function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k, i) => {
        const Icon = ICONS[k.id] ?? IndianRupee
        const up = k.trend === "up"
        // For churn, "down" delta is good (green)
        const positive = k.id === "churn" ? k.trend === "down" : up
        return (
          <motion.div key={k.id} {...fade} transition={{ delay: i * 0.04 }}>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <span className={`flex size-9 items-center justify-center rounded-xl ${k.tint}`}>
                  <Icon className="size-4.5" />
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    positive ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl font-semibold tabular-nums">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-[11px] text-muted-foreground/70">{k.sub}</p>
              <div className="mt-2 h-8">
                <Sparkline data={k.spark} up={positive} />
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
        <div className="mb-3">
          <h2 className="font-serif text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
      </GlassCard>
    </motion.div>
  )
}

function RevenueSummary() {
  return (
    <motion.div {...fade}>
      <GlassCard className="flex h-full flex-col p-5">
        <h2 className="font-serif text-lg font-semibold tracking-tight">Quarter to date</h2>
        <p className="text-sm text-muted-foreground">Blended performance</p>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-5 text-primary-foreground">
          <p className="text-sm/none opacity-80">Net revenue</p>
          <p className="mt-2 font-serif text-3xl font-semibold tabular-nums">₹4.82 Cr</p>
          <p className="mt-1 flex items-center gap-1 text-sm opacity-90">
            <TrendingUp className="size-4" /> +18.4% QoQ · ₹21.6 Cr GMV
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { label: "Gross margin", value: "42.6%" },
            { label: "EBITDA margin", value: "11.8%" },
            { label: "CAC payback", value: "4.2 mo" },
            { label: "LTV : CAC", value: "5.6x" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-semibold tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function MarketplaceCard() {
  return (
    <motion.div {...fade}>
      <GlassCard className="flex h-full flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-chart-1/12 text-chart-1">
            <Store className="size-4.5" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold tracking-tight">Marketplace</h2>
            <p className="text-xs text-muted-foreground">Unit economics</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {MARKETPLACE.map((m) => (
            <div key={m.label} className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <p className="font-serif text-xl font-semibold tabular-nums">{m.value}</p>
              <p className="text-xs font-medium">{m.label}</p>
              <p className="text-[11px] text-muted-foreground">{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">GMV by category</p>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full">
            {CATEGORY_SHARE.map((c) => (
              <span key={c.name} className={c.tint} style={{ width: `${c.share}%` }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {CATEGORY_SHARE.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className={`size-2.5 rounded-full ${c.tint}`} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium tabular-nums">{c.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function GeoCard() {
  const [active, setActive] = useState(REGIONS[0].id)
  const region = REGIONS.find((r) => r.id === active) ?? REGIONS[0]
  return (
    <motion.div {...fade} className="lg:col-span-3">
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Globe className="size-4.5" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold tracking-tight">Regional Performance</h2>
            <p className="text-xs text-muted-foreground">GMV distribution across states</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ExecutiveMap regions={REGIONS} activeId={active} onSelect={setActive} />

          <div className="flex flex-col">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg font-semibold">{region.name}</p>
                <span className="flex items-center gap-0.5 text-xs font-medium text-chart-1">
                  <ArrowUpRight className="size-3.5" /> {region.growth}%
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-serif text-xl font-semibold tabular-nums">{region.gmvShare}%</p>
                  <p className="text-[11px] text-muted-foreground">GMV share</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-semibold tabular-nums">
                    {(region.users / 1000).toFixed(1)}K
                  </p>
                  <p className="text-[11px] text-muted-foreground">Users</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-semibold tabular-nums">{region.operators}</p>
                  <p className="text-[11px] text-muted-foreground">Operators</p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActive(r.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                    r.id === active ? "border-primary/40 bg-primary/5" : "border-border/50 hover:bg-muted/40"
                  }`}
                >
                  <span className="w-24 truncate text-sm font-medium">{r.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${(r.gmvShare / 24) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold tabular-nums">{r.gmvShare}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function AiCard() {
  return (
    <motion.div {...fade} className="lg:col-span-2">
      <GlassCard className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Brain className="size-4.5" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold tracking-tight">AI Usage</h2>
            <p className="text-xs text-muted-foreground">Akanksha AI · 7 days</p>
          </div>
        </div>

        <AiUsageChart data={AI_USAGE} />

        <div className="mt-4 space-y-3">
          {AI_METRICS.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-semibold tabular-nums">{m.value}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function SubscriptionsCard() {
  return (
    <motion.div {...fade} className="lg:col-span-1">
      <GlassCard className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-chart-2/15 text-chart-2">
            <Layers className="size-4.5" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold tracking-tight">Subscriptions</h2>
            <p className="text-xs text-muted-foreground">₹1.36 Cr MRR</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DonutProgress value={41} label="Paid mix" />
          <div className="flex flex-col justify-center">
            <p className="font-serif text-2xl font-semibold tabular-nums">51.8 K</p>
            <p className="text-xs text-muted-foreground">Paying members</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-chart-1">
              <ArrowUpRight className="size-3.5" /> +7.2% MoM
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {SUBSCRIPTIONS.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground tabular-nums">{p.members}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span className={`block h-full rounded-full ${p.tint}`} style={{ width: `${p.share}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-medium tabular-nums">{p.mrr}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function OperatorsCard() {
  return (
    <motion.div {...fade} className="lg:col-span-2">
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Crown className="size-4.5" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold tracking-tight">Top Operators</h2>
            <p className="text-xs text-muted-foreground">By GMV contribution</p>
          </div>
        </div>

        <div className="space-y-2">
          {TOP_OPERATORS.map((o) => (
            <div
              key={o.rank}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums ${
                  o.rank === 1
                    ? "bg-accent/20 text-accent"
                    : o.rank === 2
                      ? "bg-chart-2/15 text-chart-2"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {o.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{o.name}</p>
                <p className="truncate text-xs text-muted-foreground">{o.region}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{o.gmv}</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {o.jobs} jobs · ★ {o.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}
