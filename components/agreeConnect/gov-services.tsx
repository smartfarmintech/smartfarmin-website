"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Clock,
  FileCheck,
  FileText,
  Hourglass,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { Button } from "@/components/ui/button"
import {
  SCHEMES,
  STATUS_META,
  docsScore,
  eligibilityScore,
  type Scheme,
} from "@/lib/agreeConnect/schemes"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

const CATEGORIES = ["All", "Income", "Insurance", "Subsidy", "Credit", "Advisory"] as const

export function GovServices() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All")
  const [active, setActive] = useState<Scheme | null>(null)

  const filtered = useMemo(() => {
    return SCHEMES.filter((s) => {
      const matchCat = cat === "All" || s.category === cat
      const q = query.trim().toLowerCase()
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [query, cat])

  return (
    <div className="min-h-svh bg-background">
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
              Government Services
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4 text-primary" /> Schemes, subsidies &amp; benefits for farmers
            </p>
          </div>
        </motion.header>

        {/* Search + summary */}
        <motion.div {...fade} transition={{ delay: 0.04 }} className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 backdrop-blur">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schemes, subsidies, loans…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <GlassCard className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <CircleCheck className="size-4" />
              </span>
              <span className="text-sm text-muted-foreground">Active applications</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              {SCHEMES.filter((s) => s.status !== "not_applied").length}
            </span>
          </GlassCard>
        </motion.div>

        {/* Category chips */}
        <motion.div
          {...fade}
          transition={{ delay: 0.08 }}
          className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:bg-card",
              )}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <SchemeCard key={s.id} scheme={s} index={i} onOpen={() => setActive(s)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">No schemes match your search.</div>
        )}
      </div>

      <AnimatePresence>
        {active && <SchemeDetail scheme={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}

function SchemeCard({
  scheme,
  index,
  onOpen,
}: {
  scheme: Scheme
  index: number
  onOpen: () => void
}) {
  const Icon = scheme.icon
  const status = STATUS_META[scheme.status]
  const elig = eligibilityScore(scheme)
  return (
    <motion.div {...fade} transition={{ delay: 0.1 + index * 0.04 }}>
      <GlassCard className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("flex size-11 items-center justify-center rounded-2xl", scheme.tint)}>
            <Icon className="size-5" />
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
              status.tone,
            )}
          >
            <span className={cn("size-1.5 rounded-full", status.dot)} /> {status.label}
          </span>
        </div>

        <h3 className="mt-3 font-semibold tracking-tight">{scheme.shortName}</h3>
        <p className="text-xs text-muted-foreground">{scheme.tagline}</p>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight text-primary">{scheme.benefit}</span>
          <span className="text-xs text-muted-foreground">{scheme.benefitNote}</span>
        </div>

        {/* eligibility meter */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Eligibility match</span>
            <span className="font-medium text-foreground">{elig.pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", elig.pct >= 75 ? "bg-primary" : "bg-accent")}
              style={{ width: `${elig.pct}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {scheme.deadline}
          </span>
        </div>

        <Button onClick={onOpen} className="mt-4 w-full rounded-full">
          View details
        </Button>
      </GlassCard>
    </motion.div>
  )
}

const TABS = ["Eligibility", "Documents", "Status"] as const

function SchemeDetail({ scheme, onClose }: { scheme: Scheme; onClose: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Eligibility")
  const [applied, setApplied] = useState(scheme.status !== "not_applied")
  const Icon = scheme.icon
  const elig = eligibilityScore(scheme)
  const docs = docsScore(scheme)
  const eligible = elig.met === elig.total

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-2xl"
      >
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-border/60 p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex items-start justify-between">
            <span className={cn("flex size-12 items-center justify-center rounded-2xl", scheme.tint)}>
              <Icon className="size-6" />
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
            >
              <X className="size-4" />
            </button>
          </div>
          <h2 className="relative mt-3 text-balance font-serif text-xl font-semibold tracking-tight">
            {scheme.name}
          </h2>
          <p className="relative mt-1 text-sm leading-relaxed text-muted-foreground">{scheme.about}</p>

          <div className="relative mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl bg-muted/50 p-3">
              <p className="text-lg font-semibold tracking-tight text-primary">{scheme.benefit}</p>
              <p className="text-xs text-muted-foreground">{scheme.benefitNote}</p>
            </div>
            <div className="flex-1 rounded-2xl bg-muted/50 p-3">
              <p className="text-lg font-semibold tracking-tight">{scheme.beneficiaries}</p>
              <p className="text-xs text-muted-foreground">beneficiaries</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 flex gap-1 border-b border-border/60 bg-background/80 px-3 py-2 backdrop-blur">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 p-5">
          {tab === "Eligibility" && (
            <div>
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-muted/50 p-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl",
                      eligible ? "bg-primary/12 text-primary" : "bg-accent/15 text-accent",
                    )}
                  >
                    {eligible ? <CircleCheck className="size-5" /> : <Hourglass className="size-5" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {eligible ? "You are eligible" : "Almost eligible"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {elig.met} of {elig.total} criteria met
                    </p>
                  </div>
                </div>
                <span className="text-lg font-semibold tracking-tight">{elig.pct}%</span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {scheme.eligibility.map((e) => (
                  <li key={e.label} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full",
                        e.met
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {e.met ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    </span>
                    <span className={cn("text-sm", !e.met && "text-muted-foreground")}>{e.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "Documents" && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                {docs.done} of {docs.total} documents ready. Upload the remaining to speed up approval.
              </p>
              <ul className="flex flex-col gap-2.5">
                {scheme.documents.map((d) => (
                  <li
                    key={d.label}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/50 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl",
                          d.uploaded ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {d.uploaded ? <FileCheck className="size-4" /> : <FileText className="size-4" />}
                      </span>
                      <span className="text-sm">{d.label}</span>
                    </div>
                    {d.uploaded ? (
                      <span className="text-xs font-medium text-primary">Uploaded</span>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                      >
                        <Upload className="size-3.5" /> Upload
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "Status" && (
            <div>
              {scheme.appId && (
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-muted/50 p-3.5">
                  <span className="text-xs text-muted-foreground">Application ID</span>
                  <span className="font-mono text-sm font-medium">{scheme.appId}</span>
                </div>
              )}
              {applied ? (
                <ol className="relative flex flex-col gap-5 pl-2">
                  {scheme.steps.map((step, i) => {
                    const isLast = i === scheme.steps.length - 1
                    return (
                      <li key={step.label} className="relative flex gap-3">
                        {!isLast && (
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-[11px] top-6 h-full w-0.5",
                              step.state === "done" ? "bg-primary" : "bg-border",
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                            step.state === "done" && "bg-primary text-primary-foreground",
                            step.state === "current" && "bg-accent text-accent-foreground",
                            step.state === "pending" && "border border-border bg-muted text-muted-foreground",
                          )}
                        >
                          {step.state === "done" ? (
                            <Check className="size-3.5" />
                          ) : step.state === "current" ? (
                            <span className="size-2 animate-pulse rounded-full bg-current" />
                          ) : (
                            <span className="size-2 rounded-full bg-current" />
                          )}
                        </span>
                        <div className="-mt-0.5">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              step.state === "pending" && "text-muted-foreground",
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.note}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <FileText className="size-6" />
                  </span>
                  <p className="mt-3 text-sm font-medium">Not applied yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submit your application to start status tracking.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer action */}
        <div className="sticky bottom-0 border-t border-border/60 bg-background/85 p-4 backdrop-blur">
          {applied ? (
            <Button variant="outline" className="w-full rounded-full" onClick={() => setTab("Status")}>
              <Clock className="size-4" /> Track application
            </Button>
          ) : (
            <Button
              className="w-full rounded-full"
              disabled={!eligible}
              onClick={() => {
                setApplied(true)
                setTab("Status")
              }}
            >
              {eligible ? "Apply now" : "Complete eligibility to apply"}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
