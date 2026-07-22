"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "motion/react"
import {
  Award,
  ArrowLeft,
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Fingerprint,
  Gift,
  Globe,
  Landmark,
  Lock,
  LogOut,
  Moon,
  Pencil,
  Plus,
  ShieldCheck,
  Sun,
  Upload,
  User,
} from "lucide-react"
import {
  ACHIEVEMENTS,
  BANK_ACCOUNTS,
  DOCUMENTS,
  KYC,
  LANGUAGES,
  PERSONAL_INFO,
  PROFILE,
  REWARDS,
  UPI,
  statusColor,
} from "@/lib/agreeConnect/profile"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 px-1 font-serif text-lg font-semibold tracking-tight">
      {children}
    </h2>
  )
}

export function ProfileScreen() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  const [lang, setLang] = useState("en")
  const [copied, setCopied] = useState<string | null>(null)
  const [points, setPoints] = useState(PROFILE.loyaltyPoints)
  const [redeemed, setRedeemed] = useState<string[]>([])
  const [toggles, setToggles] = useState({
    push: true,
    sms: true,
    biometric: true,
    priceAlerts: true,
    marketing: false,
  })

  function copy(value: string, id: string) {
    navigator.clipboard?.writeText(value)
    setCopied(id)
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500)
  }

  function redeem(id: string, cost: number) {
    if (redeemed.includes(id) || points < cost) return
    setRedeemed((r) => [...r, id])
    setPoints((p) => p - cost)
  }

  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length
  const tierProgress = Math.round(
    (points / (points + PROFILE.pointsToNextTier)) * 100,
  )

  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
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
              Profile
            </h1>
            <p className="text-sm text-muted-foreground">Manage your account &amp; preferences</p>
          </div>
        </motion.header>

        {/* Hero */}
        <motion.div {...fade}>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative h-28 bg-gradient-to-br from-primary to-chart-2 sm:h-32">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,.25), transparent 45%)",
                }}
              />
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-start justify-between">
                <div className="relative -mt-12">
                  <span className="flex size-24 items-center justify-center rounded-3xl border-4 border-card bg-primary text-3xl font-semibold text-primary-foreground shadow-lg">
                    {PROFILE.initials}
                  </span>
                  <button
                    type="button"
                    aria-label="Change photo"
                    className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
                <Button variant="outline" className="mt-3 rounded-full">
                  <Pencil className="size-4" /> Edit profile
                </Button>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-semibold tracking-tight">
                    {PROFILE.name}
                  </h2>
                  {PROFILE.verified && (
                    <BadgeCheck className="size-5 text-primary" aria-label="Verified" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {PROFILE.location} · {PROFILE.land}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Member since {PROFILE.memberSince}
                </p>
              </div>

              {/* quick stats */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "Loyalty points", value: points.toLocaleString("en-IN"), icon: Coins },
                  { label: "Tier", value: PROFILE.loyaltyTier, icon: Crown },
                  { label: "Achievements", value: `${unlocked}/${ACHIEVEMENTS.length}`, icon: Award },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border/70 bg-card/50 px-3 py-2.5 text-center"
                  >
                    <s.icon className="mx-auto size-4 text-accent" />
                    <p className="mt-1 font-serif text-base font-semibold tabular-nums">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <section>
            <SectionTitle>
              <User className="size-5 text-primary" /> Personal Information
            </SectionTitle>
            <GlassCard className="divide-y divide-border/60 p-0">
              {PERSONAL_INFO.map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="truncate text-sm font-medium">{f.value}</p>
                  </div>
                  {f.editable && (
                    <button
                      type="button"
                      aria-label={`Edit ${f.label}`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </GlassCard>
          </section>

          {/* KYC */}
          <section>
            <SectionTitle>
              <ShieldCheck className="size-5 text-primary" /> KYC Verification
            </SectionTitle>
            <GlassCard>
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary">
                    <BadgeCheck className="size-3.5" /> {KYC.level}
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your identity is verified for payouts &amp; loans.
                  </p>
                </div>
                <div className="relative grid size-16 shrink-0 place-items-center">
                  <svg viewBox="0 0 36 36" className="size-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--muted)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(KYC.progress / 100) * 97.4} 97.4`}
                    />
                  </svg>
                  <span className="absolute text-sm font-semibold tabular-nums">{KYC.progress}%</span>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {KYC.steps.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full",
                        s.done ? "bg-primary text-primary-foreground" : "border border-border bg-card",
                      )}
                    >
                      {s.done ? <Check className="size-3" /> : <Clock className="size-3 text-muted-foreground" />}
                    </span>
                    <span className={cn("text-sm", s.done ? "font-medium" : "text-muted-foreground")}>
                      {s.label}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{s.hint}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Documents */}
          <section>
            <SectionTitle>
              <CreditCard className="size-5 text-primary" /> Documents
            </SectionTitle>
            <GlassCard className="p-0">
              <div className="divide-y divide-border/60">
                {DOCUMENTS.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                      <d.icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.meta}</p>
                    </div>
                    {d.status === "missing" ? (
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Upload className="size-3.5" /> Upload
                      </Button>
                    ) : (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                          statusColor(d.status),
                        )}
                      >
                        {d.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Bank Details */}
          <section>
            <SectionTitle>
              <Landmark className="size-5 text-primary" /> Bank Details
            </SectionTitle>
            <GlassCard className="space-y-3">
              {BANK_ACCOUNTS.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-border/70 bg-card/50 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Landmark className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{b.bank}</p>
                        <p className="text-xs text-muted-foreground">{b.branch}</p>
                      </div>
                    </div>
                    {b.primary && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-sm">
                    <span className="font-mono tabular-nums">{b.masked}</span>
                    {b.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        <BadgeCheck className="size-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">IFSC · {b.ifsc}</p>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/50 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                  <p className="truncate font-mono text-sm">{UPI.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(UPI.id, "upi")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {copied === "upi" ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                  {copied === "upi" ? "Copied" : "Copy"}
                </button>
              </div>

              <Button variant="outline" className="w-full rounded-full">
                <Plus className="size-4" /> Add bank account
              </Button>
            </GlassCard>
          </section>
        </div>

        {/* Membership */}
        <section className="mt-6">
          <SectionTitle>
            <Crown className="size-5 text-accent" /> Membership &amp; Loyalty
          </SectionTitle>
          <GlassCard className="overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <Crown className="size-6" />
                </span>
                <div>
                  <p className="font-serif text-lg font-semibold">{PROFILE.plan} Member</p>
                  <p className="text-sm text-muted-foreground">Renews on {PROFILE.planRenews}</p>
                </div>
              </div>
              <Button render={<Link href="/app/pricing" />} nativeButton={false} className="rounded-full">
                Manage plan <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-card/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Coins className="size-4 text-accent" /> {PROFILE.loyaltyTier} tier
                </span>
                <span className="text-muted-foreground">
                  {PROFILE.pointsToNextTier.toLocaleString("en-IN")} pts to {PROFILE.nextTier}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Achievements */}
        <section className="mt-6">
          <SectionTitle>
            <Award className="size-5 text-accent" /> Achievements
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <GlassCard
                key={a.id}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 text-center",
                  !a.unlocked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    a.unlocked ? "bg-accent/12" : "bg-muted",
                  )}
                >
                  <a.icon className={cn("size-6", a.accent)} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-balance">{a.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground text-pretty">
                    {a.desc}
                  </p>
                </div>
                {a.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                    <Check className="size-3" /> Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Lock className="size-3" /> Locked
                  </span>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Rewards */}
        <section className="mt-6">
          <SectionTitle>
            <Gift className="size-5 text-accent" /> Rewards Store
          </SectionTitle>
          <GlassCard>
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-accent/12 to-primary/10 px-4 py-3">
              <span className="text-sm font-medium">Available balance</span>
              <span className="inline-flex items-center gap-1.5 font-serif text-lg font-semibold tabular-nums">
                <Coins className="size-5 text-accent" /> {points.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {REWARDS.map((r) => {
                const done = redeemed.includes(r.id)
                const affordable = points >= r.cost
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/50 p-3.5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <r.icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold">{r.title}</p>
                        {r.tag && (
                          <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                            {r.tag}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{r.desc}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-accent">
                        <Coins className="size-3" /> {r.cost.toLocaleString("en-IN")} pts
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={done ? "outline" : "default"}
                      disabled={done || !affordable}
                      onClick={() => redeem(r.id, r.cost)}
                      className="shrink-0 rounded-full"
                    >
                      {done ? (
                        <>
                          <Check className="size-3.5" /> Redeemed
                        </>
                      ) : (
                        "Redeem"
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </section>

        {/* Settings */}
        <section className="mt-6">
          <SectionTitle>
            <Bell className="size-5 text-primary" /> Settings
          </SectionTitle>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Preferences */}
            <GlassCard className="p-0">
              {/* Dark mode */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted">
                    {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      {isDark ? "On" : "Off"} · easier on the eyes
                    </p>
                  </div>
                </div>
                <Toggle checked={isDark} onChange={() => setTheme(isDark ? "light" : "dark")} label="Dark mode" />
              </div>

              <div className="border-t border-border/60" />

              {[
                { key: "push", icon: Bell, label: "Push notifications", hint: "Order & price updates" },
                { key: "sms", icon: Bell, label: "SMS alerts", hint: "Critical account alerts" },
                { key: "priceAlerts", icon: Bell, label: "Mandi price alerts", hint: "Daily at 7:00 AM" },
                { key: "biometric", icon: Fingerprint, label: "Biometric login", hint: "Fingerprint / Face" },
                { key: "marketing", icon: Bell, label: "Marketing emails", hint: "Offers & newsletters" },
              ].map((row, i) => (
                <div key={row.key}>
                  {i > 0 && <div className="border-t border-border/60" />}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-muted">
                        <row.icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{row.label}</p>
                        <p className="text-xs text-muted-foreground">{row.hint}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={toggles[row.key as keyof typeof toggles]}
                      onChange={() =>
                        setToggles((t) => ({
                          ...t,
                          [row.key]: !t[row.key as keyof typeof toggles],
                        }))
                      }
                      label={row.label}
                    />
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* Language + account */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
                  <Globe className="size-4" /> Language
                </p>
                <GlassCard>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {LANGUAGES.map((l) => {
                      const active = lang === l.code
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => setLang(l.code)}
                          aria-pressed={active}
                          className={cn(
                            "flex flex-col items-start rounded-2xl border px-3 py-2.5 text-left transition-colors",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border/70 bg-card/50 hover:bg-muted",
                          )}
                        >
                          <span className="flex w-full items-center justify-between">
                            <span className="text-sm font-medium">{l.label}</span>
                            {active && <Check className="size-4 text-primary" />}
                          </span>
                          <span className="text-xs text-muted-foreground">{l.native}</span>
                        </button>
                      )
                    })}
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-0">
                {[
                  { icon: Lock, label: "Change password", hint: "Last changed 3 months ago" },
                  { icon: ShieldCheck, label: "Privacy & security", hint: "Manage data & sessions" },
                ].map((row, i) => (
                  <div key={row.label}>
                    {i > 0 && <div className="border-t border-border/60" />}
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
                    >
                      <span className="flex size-9 items-center justify-center rounded-xl bg-muted">
                        <row.icon className="size-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{row.label}</p>
                        <p className="text-xs text-muted-foreground">{row.hint}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </GlassCard>

              <Button
                variant="outline"
                className="w-full rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          AgreeConnect · v2.4.0 · Made for Indian farmers
        </p>
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 transform rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  )
}
