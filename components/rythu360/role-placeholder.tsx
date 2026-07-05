"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight, LayoutDashboard, Sparkles } from "lucide-react"
import type { Role, RoleId } from "@/lib/rythu360/roles"
import { GlassCard } from "@/components/rythu360/glass-card"
import { Button } from "@/components/ui/button"

// Roles that have a fully built workspace, with their destination + copy.
const WORKSPACE: Partial<
  Record<RoleId, { href: string; title: string; blurb: string; cta: string }>
> = {
  "field-agent": {
    href: "/app/field",
    title: "Your GPS field dashboard is ready",
    blurb:
      "Launch your on-ground workspace — today's route, village visits, live map, attendance, geo-tagged photos, tasks, mileage and incentives.",
    cta: "Open Field Dashboard",
  },
  telecaller: {
    href: "/app/crm",
    title: "Your enterprise CRM is ready",
    blurb:
      "Launch the Telecaller command center — call analytics, AI lead scoring, registrations, targets, follow-ups, and the team leaderboard in one place.",
    cta: "Open CRM Dashboard",
  },
  admin: {
    href: "/app/command",
    title: "Your command center is ready",
    blurb:
      "Launch the enterprise command center — users, roles & permissions, server status, approvals, notifications, platform health, and district & state analytics.",
    cta: "Open Command Center",
  },
  "super-admin": {
    href: "/app/executive",
    title: "Your executive dashboard is ready",
    blurb:
      "Launch the company-wide command center — revenue & GMV, marketplace economics, users, operators, regional maps, AI usage, and subscriptions in one place.",
    cta: "Open Executive Dashboard",
  },
}

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

// Lightweight, role-specific KPIs so each workspace feels distinct.
const roleStats: Record<RoleId, { label: string; value: string; delta: string }[]> = {
  farmer: [],
  operator: [
    { label: "Jobs today", value: "12", delta: "+3" },
    { label: "Fleet active", value: "8 / 10", delta: "80%" },
    { label: "Earnings (wk)", value: "₹48,200", delta: "+12%" },
  ],
  delivery: [
    { label: "Deliveries", value: "34", delta: "+6" },
    { label: "On-time rate", value: "96%", delta: "+2%" },
    { label: "Earnings (wk)", value: "₹18,900", delta: "+9%" },
  ],
  dealer: [
    { label: "Open orders", value: "27", delta: "+5" },
    { label: "Low stock SKUs", value: "6", delta: "-2" },
    { label: "Revenue (mo)", value: "₹4.2L", delta: "+15%" },
  ],
  buyer: [
    { label: "Active lots", value: "19", delta: "+4" },
    { label: "Procured (wk)", value: "212 qtl", delta: "+8%" },
    { label: "Spend (mo)", value: "₹9.6L", delta: "+11%" },
  ],
  expert: [
    { label: "Open queries", value: "23", delta: "+7" },
    { label: "Resolved (wk)", value: "58", delta: "+14%" },
    { label: "Rating", value: "4.9", delta: "+0.1" },
  ],
  telecaller: [
    { label: "Calls today", value: "84", delta: "+11" },
    { label: "Connect rate", value: "72%", delta: "+4%" },
    { label: "Leads (wk)", value: "39", delta: "+6" },
  ],
  "field-agent": [
    { label: "Visits today", value: "9", delta: "+2" },
    { label: "Farmers onboarded", value: "146", delta: "+12" },
    { label: "Verifications", value: "31", delta: "+5" },
  ],
  admin: [
    { label: "Active users", value: "12,480", delta: "+3.2%" },
    { label: "Open tickets", value: "42", delta: "-8" },
    { label: "Uptime", value: "99.98%", delta: "+0.01%" },
  ],
  "super-admin": [
    { label: "Organisations", value: "38", delta: "+2" },
    { label: "GMV (mo)", value: "₹6.4Cr", delta: "+18%" },
    { label: "Regions live", value: "11", delta: "+1" },
  ],
}

export function RolePlaceholder({ role, active }: { role: Role; active: string }) {
  const Icon = role.icon
  const stats = roleStats[role.id] ?? []
  const workspace = WORKSPACE[role.id]

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div {...fade} className="mb-6 flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {role.label} workspace
          </h1>
          <p className="text-muted-foreground">{active} · {role.description}</p>
        </div>
      </motion.div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fade} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <ArrowUpRight className="size-3" />
                    {s.delta}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div {...fade} transition={{ delay: 0.15 }} className="mt-4">
        <GlassCard className="relative overflow-hidden p-8 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative">
            <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-accent/15 text-accent">
              {workspace ? <LayoutDashboard className="size-7" /> : <Sparkles className="size-7" />}
            </span>
            {workspace ? (
              <>
                <h2 className="mt-4 text-balance font-serif text-xl font-semibold tracking-tight">
                  {workspace.title}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
                  {workspace.blurb}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <Button asChild className="rounded-full">
                    <Link href={workspace.href}>
                      {workspace.cta}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-balance font-serif text-xl font-semibold tracking-tight">
                  The full {role.label} experience is on its way
                </h2>
                <p className="mx-auto mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
                  The Farmer workspace is fully built in this preview. {role.label} modules —
                  including {role.nav.slice(1, 4).map((n) => n.label).join(", ")} — are being
                  crafted with the same premium experience.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <Button className="rounded-full">Notify me</Button>
                  <Button variant="outline" className="rounded-full">
                    Explore Farmer demo
                  </Button>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
