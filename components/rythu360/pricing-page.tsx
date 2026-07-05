"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Building2,
  Check,
  Crown,
  Leaf,
  Minus,
  Repeat,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import {
  FEATURE_MATRIX,
  MRR_TREND,
  PLAN_MIX,
  PLANS,
  SUB_KPIS,
  formatINR,
  planPrice,
  type Plan,
  type PlanId,
} from "@/lib/rythu360/pricing"
import { GlassCard } from "@/components/rythu360/glass-card"
import { MrrTrendChart } from "@/components/rythu360/charts"
import { Button } from "@/components/ui/button"

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
}

const ICONS = { leaf: Leaf, zap: Zap, crown: Crown, building: Building2 } as const

const CURRENT_PLAN: PlanId = "free"

export function PricingPage() {
  const [yearly, setYearly] = useState(true)
  const [activePlan, setActivePlan] = useState<PlanId>(CURRENT_PLAN)

  const sections = useMemo(() => {
    const map = new Map<string, typeof FEATURE_MATRIX>()
    for (const row of FEATURE_MATRIX) {
      const arr = map.get(row.section) ?? []
      arr.push(row)
      map.set(row.section, arr)
    }
    return [...map.entries()]
  }, [])

  const maxSubs = Math.max(...PLAN_MIX.map((p) => p.subscribers))

  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header {...fade} className="mb-8 flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Plans &amp; Pricing</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-accent" /> Choose the plan that grows with you
            </p>
          </div>
        </motion.header>

        {/* Hero + billing toggle */}
        <motion.div {...fade} className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Farming intelligence, for every scale
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            From your first harvest to a full agri-business. Upgrade, downgrade, or cancel anytime.
          </p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !yearly ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                yearly ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  yearly ? "bg-background/20 text-background" : "bg-primary/12 text-primary"
                }`}
              >
                −16%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              index={i}
              isCurrent={activePlan === plan.id}
              onSelect={() => setActivePlan(plan.id)}
            />
          ))}
        </div>

        {/* Feature comparison */}
        <motion.section {...fade} className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Award className="size-5 text-accent" />
            <h2 className="font-serif text-xl font-semibold tracking-tight">Compare every feature</h2>
          </div>

          <GlassCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border/70">
                    <th className="sticky left-0 bg-card/80 px-4 py-4 text-left font-medium text-muted-foreground backdrop-blur">
                      Features
                    </th>
                    {PLANS.map((p) => (
                      <th key={p.id} className="px-4 py-4 text-center">
                        <span
                          className={`font-serif text-base font-semibold ${
                            p.popular ? "text-accent" : "text-foreground"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          {p.price === 0 ? "Free" : `${formatINR(planPrice(p, yearly))}/mo`}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map(([section, rows]) => (
                    <FeatureSection key={section} section={section} rows={rows} />
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        {/* Subscription analytics */}
        <motion.section {...fade} className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold tracking-tight">Subscription analytics</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SUB_KPIS.map((k) => (
              <GlassCard key={k.label} className="p-4">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-serif text-xl font-semibold tabular-nums">{k.value}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
                      k.up ? "bg-primary/12 text-primary" : "bg-destructive/12 text-destructive"
                    }`}
                  >
                    {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {k.delta}%
                  </span>
                  <span className="text-muted-foreground">{k.hint}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
            {/* Recurring revenue chart */}
            <GlassCard className="p-5 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Repeat className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">Recurring revenue</h3>
                    <p className="text-xs text-muted-foreground">Monthly recurring revenue (MRR)</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary">
                  <TrendingUp className="size-3" /> +13.9%
                </span>
              </div>
              <div className="mt-4">
                <MrrTrendChart data={MRR_TREND} />
              </div>
            </GlassCard>

            {/* Plan mix */}
            <GlassCard className="p-5 lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Users className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">Plan mix</h3>
                  <p className="text-xs text-muted-foreground">Paid subscribers by tier</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {PLAN_MIX.map((p) => (
                  <div key={p.plan}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{p.plan}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {p.subscribers.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(p.subscribers / maxSubs) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: p.accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Avg. revenue per paid user</p>
                <p className="mt-0.5 font-serif text-lg font-semibold tabular-nums">₹108 / mo</p>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Prices in INR, inclusive of taxes. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  )
}

function PlanCard({
  plan,
  yearly,
  index,
  isCurrent,
  onSelect,
}: {
  plan: Plan
  yearly: boolean
  index: number
  isCurrent: boolean
  onSelect: () => void
}) {
  const Icon = ICONS[plan.icon]
  const price = planPrice(plan, yearly)
  const [upgraded, setUpgraded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="h-full"
    >
      <GlassCard
        className={`relative flex h-full flex-col p-6 ${
          plan.popular ? "border-accent/50 ring-1 ring-accent/30" : ""
        }`}
      >
        {plan.popular ? (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
            Most popular
          </span>
        ) : null}

        <div className="flex items-center gap-2.5">
          <span
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `color-mix(in oklch, ${plan.accent} 15%, transparent)`, color: plan.accent }}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-tight">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">{plan.tagline}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-end gap-1">
            <span className="font-serif text-3xl font-semibold tabular-nums">{formatINR(price)}</span>
            {plan.price > 0 ? <span className="mb-1 text-sm text-muted-foreground">/mo</span> : null}
          </div>
          <p className="mt-1 h-4 text-xs text-muted-foreground">
            {plan.price > 0 && yearly ? `Billed ${formatINR(price * 12)} yearly` : plan.price > 0 ? "Billed monthly" : "Free forever"}
          </p>
        </div>

        <Button
          onClick={() => {
            onSelect()
            if (plan.id !== "free" && plan.id !== "enterprise") {
              setUpgraded(true)
              setTimeout(() => setUpgraded(false), 2200)
            }
          }}
          disabled={isCurrent && plan.id === "free"}
          variant={plan.popular ? "default" : "outline"}
          className="mt-5 w-full rounded-full"
        >
          {upgraded ? (
            <>
              <Check className="size-4" /> Upgraded
            </>
          ) : isCurrent && plan.id === "free" ? (
            "Current plan"
          ) : (
            <>
              {plan.ctaLabel}
              {plan.id !== "enterprise" ? <ArrowUpRight className="size-4" /> : null}
            </>
          )}
        </Button>

        <ul className="mt-6 space-y-2.5">
          {plan.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm">
              <span
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `color-mix(in oklch, ${plan.accent} 18%, transparent)`, color: plan.accent }}
              >
                <Check className="size-3" />
              </span>
              <span className="text-pretty leading-relaxed text-muted-foreground">{h}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}

function FeatureSection({
  section,
  rows,
}: {
  section: string
  rows: typeof FEATURE_MATRIX
}) {
  return (
    <>
      <tr>
        <td
          colSpan={5}
          className="sticky left-0 bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {section}
        </td>
      </tr>
      {rows.map((row) => (
        <tr key={row.label} className="border-b border-border/50 last:border-0">
          <td className="sticky left-0 bg-card/80 px-4 py-3 font-medium backdrop-blur">{row.label}</td>
          {(["free", "basic", "premium", "enterprise"] as PlanId[]).map((pid) => {
            const val = row.values[pid]
            return (
              <td key={pid} className="px-4 py-3 text-center">
                {val === true ? (
                  <Check className="mx-auto size-4 text-primary" />
                ) : val === false ? (
                  <Minus className="mx-auto size-4 text-muted-foreground/40" />
                ) : (
                  <span className="text-xs font-medium text-foreground">{val}</span>
                )}
              </td>
            )
          })}
        </tr>
      ))}
    </>
  )
}
