"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  ChevronRight,
  Inbox,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"
import {
  CATEGORY_META,
  NOTIFICATIONS,
  type NotifCategory,
  type Notification,
} from "@/lib/agreeConnect/notifications"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FilterKey = "all" | "unread" | NotifCategory

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "weather", label: "Weather" },
  { key: "orders", label: "Orders" },
  { key: "marketplace", label: "Marketplace" },
  { key: "government", label: "Government" },
  { key: "ai", label: "AI Alerts" },
  { key: "payments", label: "Payments" },
]

const PRIORITY_STYLE: Record<
  Notification["priority"],
  { ring: string; label: string; chip: string }
> = {
  urgent: {
    ring: "ring-1 ring-destructive/30",
    label: "Urgent",
    chip: "bg-destructive/12 text-destructive",
  },
  high: {
    ring: "",
    label: "Important",
    chip: "bg-accent/15 text-accent",
  },
  normal: { ring: "", label: "", chip: "" },
}

function groupLabel(minsAgo: number): "Today" | "This week" | "Earlier" {
  if (minsAgo < 1440) return "Today"
  if (minsAgo < 1440 * 7) return "This week"
  return "Earlier"
}

export function NotificationCenter() {
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [query, setQuery] = useState("")

  const unreadCount = items.filter((n) => !n.read).length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((n) => {
      if (filter === "unread" && n.read) return false
      if (filter !== "all" && filter !== "unread" && n.category !== filter) return false
      if (q && !`${n.title} ${n.body} ${n.tag ?? ""}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, filter, query])

  const groups = useMemo(() => {
    const order: Array<"Today" | "This week" | "Earlier"> = ["Today", "This week", "Earlier"]
    const map = new Map<string, Notification[]>()
    for (const n of filtered) {
      const g = groupLabel(n.minsAgo)
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(n)
    }
    return order.filter((g) => map.has(g)).map((g) => ({ label: g, items: map.get(g)! }))
  }, [filtered])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  function toggleRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back"
          className="rounded-full"
          render={<Link href="/app/dashboard" />}
          nativeButton={false}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </span>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-tight">Notifications</h1>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread updates` : "You're all caught up"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="ml-auto rounded-full text-xs"
        >
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3.5 py-2.5 backdrop-blur-xl">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notifications…"
          aria-label="Search notifications"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-3 flex items-center gap-2">
        <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
          {FILTERS.map((f) => {
            const active = filter === f.key
            const count =
              f.key === "all"
                ? items.length
                : f.key === "unread"
                  ? unreadCount
                  : items.filter((n) => n.category === f.key).length
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] tabular-nums",
                    active ? "bg-primary-foreground/20" : "bg-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="mt-5 space-y-6">
        {groups.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
              <Inbox className="size-7" />
            </span>
            <div>
              <p className="font-medium">No notifications found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different filter or clear your search.
              </p>
            </div>
          </GlassCard>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {group.items.map((n) => {
                    const meta = CATEGORY_META[n.category]
                    const Icon = n.icon
                    const prio = PRIORITY_STYLE[n.priority]
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GlassCard
                          className={cn(
                            "group relative overflow-hidden p-4 transition-colors",
                            !n.read && "bg-card/80",
                            prio.ring,
                          )}
                        >
                          {!n.read && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-accent" aria-hidden />
                          )}
                          <div className="flex gap-3.5">
                            <span
                              className={cn(
                                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                                meta.tint,
                              )}
                            >
                              <Icon className="size-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <p
                                  className={cn(
                                    "text-pretty text-sm leading-snug",
                                    n.read ? "font-medium" : "font-semibold",
                                  )}
                                >
                                  {n.title}
                                </p>
                                {!n.read && (
                                  <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
                                )}
                              </div>
                              <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                                {n.body}
                              </p>

                              <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <span className={cn("size-1.5 rounded-full", meta.dot)} />
                                  {meta.label}
                                </span>
                                <span className="text-muted-foreground/50" aria-hidden>
                                  ·
                                </span>
                                <span className="text-xs text-muted-foreground">{n.time}</span>
                                {prio.label && (
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                      prio.chip,
                                    )}
                                  >
                                    {prio.label}
                                  </span>
                                )}
                                {n.amount && (
                                  <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-semibold text-primary tabular-nums">
                                    {n.amount}
                                  </span>
                                )}
                              </div>

                              {n.action && (
                                <button
                                  type="button"
                                  className="mt-2.5 inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
                                >
                                  {n.action}
                                  <ChevronRight className="size-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Hover actions */}
                            <div className="flex shrink-0 flex-col gap-1">
                              <button
                                type="button"
                                aria-label={n.read ? "Mark as unread" : "Mark as read"}
                                onClick={() => toggleRead(n.id)}
                                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <CheckCheck className="size-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="Delete notification"
                                onClick={() => remove(n.id)}
                                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
