"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  Landmark,
  Nfc,
  Percent,
  Plus,
  QrCode,
  Receipt,
  Repeat,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tractor,
  TrendingUp,
  Wallet as WalletIcon,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import {
  bankAccounts,
  cashbackEarned,
  formatINR,
  monthlyInflow,
  monthlyOutflow,
  rewardPoints,
  rewards,
  savedCards,
  transactions,
  txnDateLabel,
  upiIds,
  walletBalance,
  type SavedCard,
  type Transaction,
  type TxnCategory,
} from "@/lib/agreeConnect/wallet"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
}

const categoryIcon: Record<TxnCategory, typeof WalletIcon> = {
  "add-money": Plus,
  withdraw: ArrowUpRight,
  booking: Tractor,
  subscription: Repeat,
  shopping: Receipt,
  cashback: Gift,
  sale: TrendingUp,
  upi: ArrowLeftRight,
}

const filters: Array<{ key: "all" | "credit" | "debit" | "booking" | "subscription"; label: string }> = [
  { key: "all", label: "All" },
  { key: "credit", label: "Money in" },
  { key: "debit", label: "Money out" },
  { key: "booking", label: "Bookings" },
  { key: "subscription", label: "Subscriptions" },
]

export function WalletDashboard() {
  const [sheet, setSheet] = useState<null | "add" | "withdraw">(null)
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all")

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter === "all") return true
      if (filter === "credit") return t.type === "credit"
      if (filter === "debit") return t.type === "debit"
      return t.category === filter
    })
  }, [filter])

  return (
    <div className="min-h-svh bg-background">
      {/* ambient glow */}
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
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Wallet</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Secured by AgreeConnect · UPI enabled
            </p>
          </div>
          <button
            type="button"
            className="ml-auto hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-card sm:flex"
          >
            <QrCode className="size-4" /> Scan &amp; Pay
          </button>
        </motion.header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LEFT: balance + actions + activity */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <BalanceCard onAdd={() => setSheet("add")} onWithdraw={() => setSheet("withdraw")} />

          {/* Inflow / outflow */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <ArrowDownLeft className="size-4" />
                  </span>
                  Money in
                </div>
                <p className="mt-2 text-xl font-semibold tracking-tight">{formatINR(monthlyInflow)}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </GlassCard>
            </motion.div>
            <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <ArrowUpRight className="size-4" />
                  </span>
                  Money out
                </div>
                <p className="mt-2 text-xl font-semibold tracking-tight">{formatINR(monthlyOutflow)}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Transaction history */}
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
            <GlassCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold tracking-tight">Transaction history</h2>
                <button type="button" className="flex items-center gap-1 text-sm text-primary">
                  Statement <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      filter === f.key
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/70 bg-card/50 text-muted-foreground hover:bg-card",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <ul className="flex flex-col">
                <AnimatePresence mode="popLayout">
                  {filtered.map((t) => (
                    <TxnRow key={t.id} txn={t} />
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <li className="py-8 text-center text-sm text-muted-foreground">No transactions in this filter.</li>
                )}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        {/* RIGHT: rewards, cards, upi, banks */}
        <div className="flex flex-col gap-4">
          <RewardsCard />
          <CardStack cards={savedCards} />
          <UpiSection />
          <BanksSection />
        </div>
      </div>

        <AnimatePresence>
          {sheet && <MoneySheet mode={sheet} onClose={() => setSheet(null)} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------------- Balance hero (Apple Card style) ---------------- */

function BalanceCard({ onAdd, onWithdraw }: { onAdd: () => void; onWithdraw: () => void }) {
  const actions = [
    { label: "Add Money", icon: Plus, onClick: onAdd },
    { label: "Withdraw", icon: ArrowUpRight, onClick: onWithdraw },
    { label: "Send", icon: Send, onClick: onAdd },
    { label: "Scan", icon: QrCode, onClick: onAdd },
  ]
  return (
    <motion.div {...fade}>
      <div className="relative overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/25">
        {/* sheen */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
              <WalletIcon className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium">AgreeConnect Wallet</p>
              <p className="text-xs text-primary-foreground/70">ravikumar@rythu</p>
            </div>
          </div>
          <Nfc className="size-6 text-primary-foreground/80" />
        </div>

        <div className="relative mt-6">
          <p className="text-sm text-primary-foreground/75">Available balance</p>
          <p className="mt-1 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{formatINR(walletBalance)}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/12 px-2.5 py-1 text-xs font-medium backdrop-blur">
            <TrendingUp className="size-3.5" /> +{formatINR(monthlyInflow - monthlyOutflow)} this month
          </p>
        </div>

        <div className="relative mt-6 grid grid-cols-4 gap-2">
          {actions.map((a) => {
            const Icon = a.icon
            return (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-primary-foreground/12 py-3 backdrop-blur transition-colors hover:bg-primary-foreground/20"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground text-primary transition-transform group-hover:scale-105">
                  <Icon className="size-4" />
                </span>
                <span className="text-[11px] font-medium">{a.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- Transaction row ---------------- */

function TxnRow({ txn }: { txn: Transaction }) {
  const Icon = categoryIcon[txn.category]
  const credit = txn.type === "credit"
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 border-b border-border/60 py-3 last:border-0"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-2xl",
          credit ? "bg-primary/12 text-primary" : "bg-muted text-foreground/70",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{txn.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {txn.subtitle} · {txnDateLabel(txn.date)}
        </p>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-semibold tabular-nums", credit ? "text-primary" : "text-foreground")}>
          {credit ? "+" : "−"}
          {formatINR(txn.amount)}
        </p>
        <p className="text-[11px] text-muted-foreground">{txn.method}</p>
      </div>
    </motion.li>
  )
}

/* ---------------- Rewards & cashback ---------------- */

function RewardsCard() {
  return (
    <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
      <GlassCard className="relative overflow-hidden p-5">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Gift className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold tracking-tight">Rewards</h2>
              <p className="text-xs text-muted-foreground">Redeem your harvest points</p>
            </div>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-accent">
              <Star className="size-4 fill-accent" />
              <span className="text-lg font-semibold tabular-nums">{rewardPoints.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-muted-foreground">Reward points</p>
          </div>
          <div className="rounded-2xl bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-primary">
              <Percent className="size-4" />
              <span className="text-lg font-semibold tabular-nums">{formatINR(cashbackEarned)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Cashback earned</p>
          </div>
        </div>

        <ul className="relative mt-3 flex flex-col gap-2">
          {rewards.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  r.claimed ? "bg-muted text-muted-foreground" : "bg-primary/12 text-primary",
                )}
              >
                {r.kind === "cashback" ? (
                  <Percent className="size-4" />
                ) : r.kind === "voucher" ? (
                  <Gift className="size-4" />
                ) : r.kind === "scratch" ? (
                  <Sparkles className="size-4" />
                ) : (
                  <Star className="size-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
              </div>
              {r.claimed ? (
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Check className="size-3.5" /> Claimed
                </span>
              ) : (
                <button
                  type="button"
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {r.points} pts
                </button>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}

/* ---------------- Apple Wallet card stack ---------------- */

const cardTheme: Record<SavedCard["variant"], string> = {
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  dark: "bg-foreground text-background",
}

function CardStack({ cards }: { cards: SavedCard[] }) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            <h2 className="font-semibold tracking-tight">Cards</h2>
          </div>
          <button type="button" className="flex items-center gap-1 text-sm text-primary">
            <Plus className="size-4" /> Add
          </button>
        </div>

        <div className="relative" style={{ height: `${140 + (cards.length - 1) * 46}px` }}>
          {cards.map((card, i) => {
            const isActive = active === card.id
            return (
              <motion.button
                key={card.id}
                type="button"
                onClick={() => setActive(isActive ? null : card.id)}
                initial={false}
                animate={{ y: isActive ? 0 : i * 46, scale: isActive ? 1.02 : 1, zIndex: isActive ? 50 : i }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className={cn(
                  "absolute inset-x-0 flex h-[150px] flex-col justify-between overflow-hidden rounded-3xl p-4 text-left shadow-lg",
                  cardTheme[card.variant],
                )}
              >
                <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-white/10 blur-2xl" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{card.bank}</p>
                    <p className="text-[11px] opacity-75">{card.type} card</p>
                  </div>
                  <Nfc className="size-5 opacity-80" />
                </div>
                <div>
                  <p className="font-mono text-base tracking-[0.2em]">•••• {card.last4}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] opacity-75">Exp {card.expiry}</span>
                    <span className="text-sm font-semibold italic">{card.network}</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Tap a card to bring it forward</p>
      </GlassCard>
    </motion.div>
  )
}

/* ---------------- UPI ---------------- */

function UpiSection() {
  return (
    <motion.div {...fade} transition={{ ...fade.transition, delay: 0.12 }}>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="size-4 text-primary" />
            <h2 className="font-semibold tracking-tight">UPI IDs</h2>
          </div>
          <button type="button" className="flex items-center gap-1 text-sm text-primary">
            <Plus className="size-4" /> Link
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {upiIds.map((u) => (
            <li key={u.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <QrCode className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.handle}</p>
                <p className="truncate text-xs text-muted-foreground">{u.bank}</p>
              </div>
              {u.primary && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Primary</span>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}

/* ---------------- Banks ---------------- */

function BanksSection() {
  return (
    <motion.div {...fade} transition={{ ...fade.transition, delay: 0.14 }}>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="size-4 text-primary" />
            <h2 className="font-semibold tracking-tight">Bank accounts</h2>
          </div>
          <button type="button" className="flex items-center gap-1 text-sm text-primary">
            <Plus className="size-4" /> Add
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {bankAccounts.map((b) => (
            <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/70">
                <Building2 className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.bank}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {b.type} · {b.accountMasked} · {b.ifsc}
                </p>
              </div>
              {b.primary && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Primary</span>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}

/* ---------------- Add / Withdraw sheet ---------------- */

function MoneySheet({ mode, onClose }: { mode: "add" | "withdraw"; onClose: () => void }) {
  const [amount, setAmount] = useState("")
  const [done, setDone] = useState(false)
  const isAdd = mode === "add"
  const presets = [500, 1000, 2000, 5000]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 40, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 40, x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-md rounded-t-[28px] border border-border bg-card p-6 shadow-2xl sm:bottom-6 sm:rounded-[28px]"
        role="dialog"
        aria-modal="true"
        aria-label={isAdd ? "Add money" : "Withdraw money"}
      >
        {done ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Check className="size-8" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold">
              {isAdd ? "Money added" : "Withdrawal requested"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdd
                ? `${formatINR(Number(amount) || 0)} added to your wallet.`
                : `${formatINR(Number(amount) || 0)} will reach your bank shortly.`}
            </p>
            <Button onClick={onClose} className="mt-5 w-full rounded-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-2xl",
                    isAdd ? "bg-primary/12 text-primary" : "bg-accent/15 text-accent",
                  )}
                >
                  {isAdd ? <Plus className="size-5" /> : <ArrowUpRight className="size-5" />}
                </span>
                <h3 className="font-serif text-lg font-semibold">{isAdd ? "Add money" : "Withdraw"}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">{isAdd ? "Amount to add" : "Amount to withdraw"}</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-2xl font-semibold">₹</span>
                <input
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  autoFocus
                  className="w-40 bg-transparent text-center font-serif text-4xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
                />
              </div>
              {!isAdd && (
                <p className="mt-1 text-xs text-muted-foreground">Available {formatINR(walletBalance)}</p>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  className="rounded-full border border-border/70 bg-card py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  ₹{p >= 1000 ? `${p / 1000}k` : p}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/60 p-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                {isAdd ? <QrCode className="size-4" /> : <Landmark className="size-4" />}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{isAdd ? "Pay via UPI" : "To SBI ••••4412"}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdd ? "ravikumar9@okhdfcbank" : "Savings · IMPS instant"}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>

            <Button
              onClick={() => amount && Number(amount) > 0 && setDone(true)}
              disabled={!amount || Number(amount) <= 0}
              className="mt-5 h-12 w-full rounded-full text-base"
            >
              {isAdd ? "Add money" : "Withdraw"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" /> 256-bit encrypted · RBI compliant
            </p>
          </>
        )}
      </motion.div>
    </>
  )
}
