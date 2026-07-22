"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileText,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import { Button } from "@/components/ui/button"
import {
  ORDER_TABS,
  ORDERS,
  STATUS_META,
  formatINR,
  orderItemCount,
  type Order,
  type OrderStatus,
} from "@/lib/agreeConnect/orders"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
}

const STEP_ICONS = [Package, PackageCheck, Truck, CheckCircle2]

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", meta.tint)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}

/* Compact 4-step progress rail used on cards */
function MiniTracker({ status }: { status: OrderStatus }) {
  const current = STATUS_META[status].step
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map((s) => (
        <span
          key={s}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            s <= current ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  )
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  return (
    <GlassCard className="overflow-hidden p-0">
      <button type="button" onClick={onOpen} className="block w-full p-5 text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground">
              {order.placedOn} · {orderItemCount(order)} item{orderItemCount(order) > 1 ? "s" : ""}
            </p>
          </div>
          <StatusPill status={order.status} />
        </div>

        {/* thumbnails */}
        <div className="mt-4 flex items-center gap-2">
          {order.items.slice(0, 3).map((it, i) => (
            <span
              key={i}
              className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-muted/40"
            >
              <Image
                src={it.image || "/placeholder.svg"}
                alt={it.name}
                width={56}
                height={56}
                className="size-full object-contain p-1.5"
              />
            </span>
          ))}
          <div className="ml-1 min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{order.items[0].name}</p>
            {order.items.length > 1 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 1} more</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tracking-tight">{formatINR(order.total)}</p>
            <p className="text-[11px] text-muted-foreground">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="mt-4">
          <MiniTracker status={order.status} />
          <div className="mt-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Truck className="size-3.5" /> {order.eta}
            </p>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              Details <ChevronRight className="size-3.5" />
            </span>
          </div>
        </div>
      </button>
    </GlassCard>
  )
}

/* ---------- Detail overlay ---------- */

function Timeline({ order }: { order: Order }) {
  return (
    <ol className="relative ml-1">
      {order.timeline.map((step, i) => {
        const done = step.at !== null
        const isLast = i === order.timeline.length - 1
        const Icon = STEP_ICONS[i] ?? Check
        return (
          <li key={step.label} className="relative flex gap-3.5 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm font-medium", !done && "text-muted-foreground")}>{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.note}</p>
              {step.at && <p className="mt-0.5 text-xs font-medium text-primary">{step.at}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function InvoiceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn(strong ? "font-semibold" : "text-muted-foreground")}>{label}</span>
      <span className={cn(strong ? "text-base font-semibold tracking-tight" : "font-medium")}>{value}</span>
    </div>
  )
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [reordered, setReordered] = useState(false)

  function copyAwb() {
    navigator.clipboard?.writeText(order.awb).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[820px] px-4 py-6 sm:px-6"
      >
        {/* header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to orders"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              Order #{order.id}
            </h2>
            <p className="text-xs text-muted-foreground">Placed on {order.placedOn}</p>
          </div>
          <StatusPill status={order.status} />
        </div>

        {/* tracking banner */}
        <GlassCard className="mb-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Truck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{order.eta}</p>
                <p className="text-xs text-muted-foreground">
                  {order.courier} · AWB {order.awb}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={copyAwb}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-card"
            >
              {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy AWB"}
            </button>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* left: timeline + items */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <GlassCard className="p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold tracking-tight">
                <MapPin className="size-4 text-primary" /> Tracking timeline
              </h3>
              <Timeline order={order} />
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-3 font-semibold tracking-tight">Items</h3>
              <ul className="flex flex-col gap-3">
                {order.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
                      <Image
                        src={it.image || "/placeholder.svg"}
                        alt={it.name}
                        width={56}
                        height={56}
                        className="size-full object-contain p-1.5"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatINR(it.price * it.qty)}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* right: invoice + address + actions */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <GlassCard className="p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold tracking-tight">
                <FileText className="size-4 text-primary" /> Invoice
              </h3>
              <div className="flex flex-col gap-2.5">
                <InvoiceRow label="Subtotal" value={formatINR(order.subtotal)} />
                <InvoiceRow label="Delivery" value={order.delivery === 0 ? "Free" : formatINR(order.delivery)} />
                <InvoiceRow label="Discount" value={"− " + formatINR(order.discount)} />
                <InvoiceRow label="GST" value={formatINR(order.tax)} />
                <div className="my-1 h-px bg-border" />
                <InvoiceRow label="Total paid" value={formatINR(order.total)} strong />
                <p className="text-xs text-muted-foreground">Paid via {order.paymentMethod}</p>
              </div>
              <Button variant="outline" className="mt-4 w-full rounded-full">
                <Download className="size-4" /> Download invoice
              </Button>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-2 font-semibold tracking-tight">Delivery address</h3>
              <p className="text-sm font-medium">{order.address.name}</p>
              <p className="text-sm text-muted-foreground">{order.address.line}</p>
              <p className="text-sm text-muted-foreground">{order.address.city}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="size-3.5" /> {order.address.phone}
              </p>
            </GlassCard>

            <div className="flex flex-col gap-2.5">
              <Button
                onClick={() => {
                  setReordered(true)
                  setTimeout(() => setReordered(false), 1800)
                }}
                className="w-full rounded-full"
              >
                {reordered ? <Check className="size-4" /> : <RotateCcw className="size-4" />}
                {reordered ? "Added to cart" : "Reorder items"}
              </Button>
              {order.status !== "Delivered" ? (
                <Button variant="outline" className="w-full rounded-full">
                  <MapPin className="size-4" /> Live tracking
                </Button>
              ) : (
                <Button variant="outline" className="w-full rounded-full">
                  Need help with this order?
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Main screen ---------- */

export function OrdersScreen() {
  const [tab, setTab] = useState<(typeof ORDER_TABS)[number]>("All")
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      const matchTab = tab === "All" || o.status === tab
      const q = query.trim().toLowerCase()
      const matchQuery =
        q === "" ||
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q)) ||
        o.seller.toLowerCase().includes(q)
      return matchTab && matchQuery
    })
  }, [tab, query])

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: ORDERS.length }
    for (const o of ORDERS) c[o.status] = (c[o.status] ?? 0) + 1
    return c
  }, [])

  return (
    <div className="min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        {/* header */}
        <motion.header {...fade} className="mb-5 flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/60 transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">My Orders</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Package className="size-4 text-primary" /> {ORDERS.length} orders &middot; Track, reorder &amp; invoices
            </p>
          </div>
        </motion.header>

        {/* search */}
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.04 }} className="mb-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders, products or sellers"
              className="h-11 w-full rounded-2xl border border-border/70 bg-card/60 pl-10 pr-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-ring/30"
            />
          </div>
        </motion.div>

        {/* tabs */}
        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.08 }}
          className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {ORDER_TABS.map((t) => {
            const activeTab = tab === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  activeTab
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card/60 text-foreground hover:bg-card",
                )}
              >
                {t}
                {counts[t] ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold",
                      activeTab ? "bg-primary-foreground/20" : "bg-muted",
                    )}
                  >
                    {counts[t]}
                  </span>
                ) : null}
              </button>
            )
          })}
        </motion.div>

        {/* list */}
        {filtered.length === 0 ? (
          <GlassCard className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Package className="size-6" />
            </span>
            <div>
              <p className="font-medium">No orders found</p>
              <p className="text-sm text-muted-foreground">Try a different tab or search term.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {filtered.map((o, i) => (
              <motion.div key={o.id} {...fade} transition={{ ...fade.transition, delay: 0.1 + i * 0.04 }}>
                <OrderCard order={o} onOpen={() => setActive(o)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && <OrderDetail order={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}
