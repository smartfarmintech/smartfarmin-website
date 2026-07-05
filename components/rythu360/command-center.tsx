"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Bell,
  BellRing,
  Building2,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Cpu,
  Database,
  HardDrive,
  IndianRupee,
  Server,
  Shield,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react"
import { GlassCard } from "@/components/rythu360/glass-card"
import { Sparkline } from "@/components/rythu360/charts"
import { CommandStateMap } from "@/components/rythu360/command-state-map"
import {
  approvals as approvalsData,
  capabilities,
  districts,
  formatCompact,
  kpis,
  notifications,
  permissionRoles,
  resources,
  roleRows,
  services,
  stateRegions,
  totalUsers,
  type ApprovalType,
  type KpiId,
  type NotifKind,
  type ServiceStatus,
} from "@/lib/rythu360/command"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const kpiIcon: Record<KpiId, typeof Users> = {
  users: Users,
  revenue: IndianRupee,
  approvals: BellRing,
  uptime: Activity,
}

const resourceIcon: Record<string, typeof Cpu> = {
  cpu: Cpu,
  mem: HardDrive,
  db: Database,
  net: Wifi,
}

function SectionTitle({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: typeof Users
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Icon className="size-4.5" />
        </span>
        <div>
          <h2 className="font-serif text-lg font-semibold tracking-tight">{title}</h2>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

const statusStyle: Record<ServiceStatus, { dot: string; label: string; text: string }> = {
  operational: { dot: "bg-primary", label: "Operational", text: "text-primary" },
  degraded: { dot: "bg-accent", label: "Degraded", text: "text-accent" },
  down: { dot: "bg-destructive", label: "Down", text: "text-destructive" },
}

const notifStyle: Record<NotifKind, { icon: typeof Bell; tint: string }> = {
  alert: { icon: CircleAlert, tint: "bg-destructive/12 text-destructive" },
  success: { icon: CircleCheck, tint: "bg-primary/12 text-primary" },
  info: { icon: Bell, tint: "bg-accent/12 text-accent" },
}

const approvalTint: Record<ApprovalType, string> = {
  KYC: "bg-chart-2/15 text-chart-2",
  Payout: "bg-primary/12 text-primary",
  Content: "bg-accent/15 text-accent",
  Refund: "bg-destructive/12 text-destructive",
}

export function CommandCenter() {
  const [activeState, setActiveState] = useState(stateRegions[0].id)
  const [queue, setQueue] = useState(approvalsData)
  const [resolved, setResolved] = useState(0)

  const state = useMemo(
    () => stateRegions.find((s) => s.id === activeState) ?? stateRegions[0],
    [activeState],
  )

  function resolveApproval(id: string) {
    setQueue((q) => q.filter((a) => a.id !== id))
    setResolved((r) => r + 1)
  }

  const maxDistrictUsers = Math.max(...districts.map((d) => d.users))

  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-primary/8 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header {...fade} className="mb-6 flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Command Center
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              All systems monitored · Live
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur sm:flex">
            <Shield className="size-4 text-primary" /> Super Admin
          </div>
        </motion.header>

        {/* KPIs */}
        <motion.section {...fade} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = kpiIcon[k.id]
            const good = k.invert ? k.trend === "down" : k.trend === "up"
            const TrendIcon = k.trend === "up" ? ArrowUpRight : ArrowDownRight
            return (
              <GlassCard key={k.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      good ? "bg-primary/12 text-primary" : "bg-destructive/12 text-destructive"
                    }`}
                  >
                    <TrendIcon className="size-3" />
                    {k.delta}
                    {k.id === "uptime" ? "" : "%"}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{k.value}</p>
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <div className="mt-2 h-11">
                  <Sparkline data={k.spark} up={good} />
                </div>
                <p className="text-[11px] text-muted-foreground">{k.hint}</p>
              </GlassCard>
            )
          })}
        </motion.section>

        {/* Users + Permissions */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <motion.div {...fade} className="lg:col-span-2">
            <GlassCard className="h-full p-5">
              <SectionTitle
                icon={Users}
                title="Users"
                hint={`${formatCompact(totalUsers)} total accounts`}
              />
              <div className="space-y-3">
                {roleRows.map((r) => {
                  const pct = (r.users / totalUsers) * 100
                  return (
                    <div key={r.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{r.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {formatCompact(r.users)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: r.color }}
                        />
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {r.active}% active now
                      </p>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-3">
            <GlassCard className="h-full p-5">
              <SectionTitle icon={Shield} title="Roles & Permissions" hint="Role-based access control" />
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Role</th>
                      {capabilities.map((c) => (
                        <th key={c} className="px-1.5 pb-2 text-center font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionRoles.map((role) => (
                      <tr key={role.id} className="border-t border-border/50">
                        <td className="py-2 pr-3 font-medium whitespace-nowrap">{role.name}</td>
                        {capabilities.map((c) => (
                          <td key={c} className="px-1.5 py-2 text-center">
                            {role.perms[c] ? (
                              <Check className="mx-auto size-4 text-primary" />
                            ) : (
                              <Ban className="mx-auto size-3.5 text-muted-foreground/40" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Server status + Platform health */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <motion.div {...fade} className="lg:col-span-3">
            <GlassCard className="h-full p-5">
              <SectionTitle
                icon={Server}
                title="Server Status"
                hint="Realtime service monitors"
                action={
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                    <span className="size-1.5 rounded-full bg-primary" /> 5/6 healthy
                  </span>
                }
              />
              <div className="grid gap-2.5 sm:grid-cols-2">
                {services.map((s) => {
                  const st = statusStyle[s.status]
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-3.5 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex size-2.5">
                          {s.status !== "operational" && (
                            <span className={`absolute inline-flex size-full animate-ping rounded-full ${st.dot} opacity-70`} />
                          )}
                          <span className={`relative inline-flex size-2.5 rounded-full ${st.dot}`} />
                        </span>
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className={`text-[11px] font-medium ${st.text}`}>{st.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">{s.latency}</p>
                        <p className="text-[11px] text-muted-foreground">{s.uptime}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-2">
            <GlassCard className="h-full p-5">
              <SectionTitle icon={Cpu} title="Platform Health" hint="Cluster utilization" />
              <div className="space-y-4">
                {resources.map((r) => {
                  const Icon = resourceIcon[r.id] ?? Cpu
                  const hot = r.value >= 70
                  return (
                    <div key={r.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="size-4 text-muted-foreground" />
                          {r.label}
                        </span>
                        <span className="tabular-nums text-muted-foreground">{r.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${hot ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${r.value}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{r.detail}</p>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Approvals + Notifications */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <motion.div {...fade} className="lg:col-span-3">
            <GlassCard className="h-full p-5">
              <SectionTitle
                icon={CircleCheck}
                title="Approvals"
                hint={`${queue.length} pending · ${resolved} resolved today`}
              />
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <CircleCheck className="size-6" />
                  </span>
                  <p className="font-medium">Queue cleared</p>
                  <p className="text-sm text-muted-foreground">All approvals handled. Nice work.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {queue.map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-3.5 py-3"
                    >
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${approvalTint[a.type]}`}>
                        {a.type.slice(0, 3)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.meta}
                          {a.amount ? ` · ${a.amount}` : ""}
                        </p>
                      </div>
                      {a.priority === "high" && (
                        <span className="hidden rounded-full bg-destructive/12 px-2 py-0.5 text-[10px] font-semibold text-destructive sm:inline">
                          High
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => resolveApproval(a.id)}
                          aria-label={`Approve ${a.subject}`}
                          className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveApproval(a.id)}
                          aria-label={`Reject ${a.subject}`}
                          className="flex size-8 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground transition-colors hover:bg-muted"
                        >
                          <Ban className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-2">
            <GlassCard className="h-full p-5">
              <SectionTitle icon={Bell} title="Notifications" hint="System & ops feed" />
              <div className="space-y-2.5">
                {notifications.map((n) => {
                  const st = notifStyle[n.kind]
                  const Icon = st.icon
                  return (
                    <div key={n.id} className="flex gap-3">
                      <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl ${st.tint}`}>
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1 border-b border-border/40 pb-2.5">
                        <p className="text-sm font-medium leading-snug">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.detail}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
                          <Clock className="size-3" /> {n.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* State + District analytics */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <motion.div {...fade} className="lg:col-span-2">
            <GlassCard className="h-full p-5">
              <SectionTitle icon={Building2} title="State Analytics" hint="National footprint" />
              <CommandStateMap regions={stateRegions} activeId={activeState} onSelect={setActiveState} />
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{state.name}</p>
                  <p className="text-xs text-muted-foreground">{state.users} active users</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums text-primary">{state.share}%</p>
                  <p className="text-[11px] text-muted-foreground">of national GMV</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-3">
            <GlassCard className="h-full p-5">
              <SectionTitle
                icon={TrendingUp}
                title="District Analytics"
                hint="Top performing districts"
              />
              <div className="space-y-2.5">
                {districts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-3.5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{d.name}</span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{d.revenue}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(d.users / maxDistrictUsers) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{formatCompact(d.users)} users</span>
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 text-primary">
                            <ArrowUpRight className="size-3" />
                            {d.growth}%
                          </span>
                          <span>health {d.health}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
