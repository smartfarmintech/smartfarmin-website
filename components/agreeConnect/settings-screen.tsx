"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  Download,
  KeyRound,
  LogOut,
  Moon,
  Search,
  Smartphone,
  Sun,
  Trash2,
  X,
} from "lucide-react"
import {
  ABOUT_LINKS,
  HELP_TOPICS,
  LOGIN_HISTORY,
  NOTIFICATION_TOGGLES,
  PRIVACY_TOGGLES,
  SECURITY_TOGGLES,
  SETTINGS_CATEGORIES,
  type SettingsCategory,
  type SettingsCategoryId,
  type ToggleSetting,
} from "@/lib/agreeConnect/settings"
import { LANGUAGES, PERSONAL_INFO, PROFILE } from "@/lib/agreeConnect/profile"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export function SettingsScreen() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<SettingsCategoryId | null>(null)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [lang, setLang] = useState("en")

  const [security, setSecurity] = useState(toDefaults(SECURITY_TOGGLES))
  const [privacy, setPrivacy] = useState(toDefaults(PRIVACY_TOGGLES))
  const [notifications, setNotifications] = useState(toDefaults(NOTIFICATION_TOGGLES))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SETTINGS_CATEGORIES
    return SETTINGS_CATEGORIES.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
  }, [query])

  const groups = useMemo(() => {
    const map = new Map<number, SettingsCategory[]>()
    for (const c of filtered) {
      const arr = map.get(c.group) ?? []
      arr.push(c)
      map.set(c.group, arr)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [filtered])

  const activeCategory = SETTINGS_CATEGORIES.find((c) => c.id === open) ?? null
  const activeLang = LANGUAGES.find((l) => l.code === lang)?.label ?? "English"

  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[720px] px-4 py-6 sm:px-6">
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
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your account &amp; app preferences
            </p>
          </div>
        </motion.header>

        {/* Search */}
        <motion.div {...fade} className="mb-5">
          <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3.5 py-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings"
              aria-label="Search settings"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Apple ID-style banner */}
        {!query && (
          <motion.div {...fade} className="mb-6">
            <Link href="/app/profile" className="block">
              <GlassCard className="flex items-center gap-4 p-4 transition-colors hover:bg-card">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
                  {PROFILE.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-serif text-lg font-semibold tracking-tight">
                      {PROFILE.name}
                    </p>
                    {PROFILE.verified && (
                      <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified" />
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {PROFILE.location} · {PROFILE.loyaltyTier} member
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </GlassCard>
            </Link>
          </motion.div>
        )}

        {/* Appearance quick row */}
        {!query && (
          <motion.div {...fade} className="mb-6">
            <GroupLabel>Appearance</GroupLabel>
            <GlassCard className="p-0">
              <Row
                icon={
                  <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
                    {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  </span>
                }
                label="Dark Mode"
                description={mounted ? (isDark ? "On" : "Off") : "System"}
                trailing={
                  <Toggle
                    checked={isDark}
                    onChange={() => setTheme(isDark ? "light" : "dark")}
                    label="Dark mode"
                  />
                }
              />
            </GlassCard>
          </motion.div>
        )}

        {/* Grouped categories */}
        {groups.map(([groupId, items]) => (
          <motion.div key={groupId} {...fade} className="mb-6">
            <GlassCard className="p-0">
              {items.map((c, i) => (
                <div key={c.id}>
                  {i > 0 && <div className="ml-[3.75rem] border-t border-border/60" />}
                  <button
                    type="button"
                    onClick={() => setOpen(c.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        c.tint,
                      )}
                    >
                      <c.icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.label}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.description}
                      </p>
                    </div>
                    {c.value && (
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {c.id === "language" ? activeLang : c.value}
                      </span>
                    )}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No settings match &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Logout */}
        {!query && (
          <motion.div {...fade} className="mb-10">
            <GlassCard className="p-0">
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" /> Log Out
              </button>
            </GlassCard>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              SmartFarmin v3.2.0 · Made for Indian farmers
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeCategory && (
          <DetailPanel
            category={activeCategory}
            onClose={() => setOpen(null)}
            lang={lang}
            setLang={setLang}
            security={security}
            setSecurity={setSecurity}
            privacy={privacy}
            setPrivacy={setPrivacy}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}
      </AnimatePresence>

      {/* Logout confirm */}
      <AnimatePresence>
        {confirmLogout && (
          <ConfirmLogout onCancel={() => setConfirmLogout(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------ Detail panel ------------------------------ */

type ToggleState = Record<string, boolean>

function DetailPanel({
  category,
  onClose,
  lang,
  setLang,
  security,
  setSecurity,
  privacy,
  setPrivacy,
  notifications,
  setNotifications,
}: {
  category: SettingsCategory
  onClose: () => void
  lang: string
  setLang: (v: string) => void
  security: ToggleState
  setSecurity: React.Dispatch<React.SetStateAction<ToggleState>>
  privacy: ToggleState
  setPrivacy: React.Dispatch<React.SetStateAction<ToggleState>>
  notifications: ToggleState
  setNotifications: React.Dispatch<React.SetStateAction<ToggleState>>
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col border-l border-border/70 bg-background shadow-2xl"
        role="dialog"
        aria-label={category.label}
      >
        <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              category.tint,
            )}
          >
            <category.icon className="size-4" />
          </span>
          <h2 className="font-serif text-lg font-semibold tracking-tight">
            {category.label}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {category.id === "account" && <AccountPanel />}
          {category.id === "security" && (
            <TogglePanel
              toggles={SECURITY_TOGGLES}
              state={security}
              setState={setSecurity}
              footer={<SecurityExtras />}
            />
          )}
          {category.id === "privacy" && (
            <TogglePanel
              toggles={PRIVACY_TOGGLES}
              state={privacy}
              setState={setPrivacy}
              footer={<PrivacyExtras />}
            />
          )}
          {category.id === "language" && <LanguagePanel lang={lang} setLang={setLang} />}
          {category.id === "notifications" && (
            <TogglePanel
              toggles={NOTIFICATION_TOGGLES}
              state={notifications}
              setState={setNotifications}
            />
          )}
          {category.id === "subscription" && <SubscriptionPanel />}
          {category.id === "help" && <HelpPanel />}
          {category.id === "about" && <AboutPanel />}
        </div>
      </motion.aside>
    </>
  )
}

function AccountPanel() {
  return (
    <div className="space-y-5">
      <p className="px-1 text-sm text-muted-foreground">
        Your personal details, used across SmartFarmin.
      </p>
      <GlassCard className="divide-y divide-border/60 p-0">
        {PERSONAL_INFO.map((f) => (
          <div key={f.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">{f.label}</span>
            <span className="text-sm font-medium">{f.value}</span>
          </div>
        ))}
      </GlassCard>
      <Button variant="outline" className="w-full rounded-full">
        Edit account details
      </Button>
    </div>
  )
}

function TogglePanel({
  toggles,
  state,
  setState,
  footer,
}: {
  toggles: ToggleSetting[]
  state: ToggleState
  setState: React.Dispatch<React.SetStateAction<ToggleState>>
  footer?: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      <GlassCard className="p-0">
        {toggles.map((t, i) => (
          <div key={t.key}>
            {i > 0 && <div className="border-t border-border/60" />}
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
              <Toggle
                checked={state[t.key]}
                onChange={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))}
                label={t.label}
              />
            </div>
          </div>
        ))}
      </GlassCard>
      {footer}
    </div>
  )
}

function SecurityExtras() {
  return (
    <div className="space-y-5">
      <Button variant="outline" className="w-full justify-start rounded-2xl">
        <KeyRound className="size-4" /> Change password
      </Button>
      <div>
        <GroupLabel>Recent activity</GroupLabel>
        <GlassCard className="p-0">
          {LOGIN_HISTORY.map((e, i) => (
            <div key={e.device}>
              {i > 0 && <div className="border-t border-border/60" />}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Smartphone className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.device}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.location}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    e.current ? "font-medium text-primary" : "text-muted-foreground",
                  )}
                >
                  {e.time}
                </span>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  )
}

function PrivacyExtras() {
  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full justify-start rounded-2xl">
        <Download className="size-4" /> Download my data
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Delete my account
      </Button>
    </div>
  )
}

function LanguagePanel({ lang, setLang }: { lang: string; setLang: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <p className="px-1 text-sm text-muted-foreground">
        Choose the language for the app interface.
      </p>
      <GlassCard className="p-0">
        {LANGUAGES.map((l, i) => (
          <div key={l.code}>
            {i > 0 && <div className="border-t border-border/60" />}
            <button
              type="button"
              onClick={() => setLang(l.code)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="text-sm font-medium">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.native}</p>
              </div>
              {lang === l.code && <Check className="size-4 text-primary" />}
            </button>
          </div>
        ))}
      </GlassCard>
    </div>
  )
}

function SubscriptionPanel() {
  return (
    <div className="space-y-5">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold tracking-tight">
              Premium
            </p>
          </div>
          <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-medium text-primary">
            Active
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          ₹499 / month · renews on 14 Mar 2025
        </p>
      </GlassCard>
      <Button
        render={<Link href="/app/pricing" />}
        nativeButton={false}
        className="w-full rounded-full"
      >
        Manage subscription
      </Button>
      <Button variant="outline" className="w-full rounded-full">
        View billing history
      </Button>
    </div>
  )
}

function HelpPanel() {
  return (
    <div className="space-y-5">
      <GlassCard className="p-0">
        {HELP_TOPICS.map((t, i) => (
          <div key={t.label}>
            {i > 0 && <div className="border-t border-border/60" />}
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </div>
        ))}
      </GlassCard>
      <Button className="w-full rounded-full">Contact support</Button>
    </div>
  )
}

function AboutPanel() {
  return (
    <div className="space-y-5">
      <GlassCard className="flex flex-col items-center gap-2 p-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
          SF
        </span>
        <p className="mt-1 font-serif text-lg font-semibold tracking-tight">
          SmartFarmin
        </p>
        <p className="text-sm text-muted-foreground">Version 3.2.0 (build 214)</p>
      </GlassCard>
      <GlassCard className="p-0">
        {ABOUT_LINKS.map((l, i) => (
          <div key={l}>
            {i > 0 && <div className="border-t border-border/60" />}
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
            >
              <span className="text-sm font-medium">{l}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </div>
        ))}
      </GlassCard>
      <p className="text-center text-xs text-muted-foreground">
        © 2025 SmartFarmin Technologies Pvt. Ltd.
      </p>
    </div>
  )
}

/* ------------------------------ Logout dialog ----------------------------- */

function ConfirmLogout({ onCancel }: { onCancel: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          role="alertdialog"
          aria-label="Confirm log out"
          className="w-full max-w-sm rounded-3xl border border-border/70 bg-card p-6 text-center shadow-2xl"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
            <LogOut className="size-6" />
          </span>
          <h3 className="mt-4 font-serif text-lg font-semibold tracking-tight">
            Log out of SmartFarmin?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;ll need to sign in again to access your farm dashboard.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              className="w-full rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Log Out
            </Button>
            <Button variant="ghost" onClick={onCancel} className="w-full rounded-full">
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/* -------------------------------- Helpers --------------------------------- */

function toDefaults(list: ToggleSetting[]): ToggleState {
  return Object.fromEntries(list.map((t) => [t.key, t.default]))
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

function Row({
  icon,
  label,
  description,
  trailing,
}: {
  icon: React.ReactNode
  label: string
  description?: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {trailing}
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
