"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Carrot,
  Egg,
  Fuel,
  Leaf,
  type LucideIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react"
import {
  CATEGORIES,
  type Commodity,
  commodities,
  DISTRICTS,
  formatPrice,
  getHistory,
  getSparkline,
  MANDIS,
  type MarketCategory,
  type RangeKey,
} from "@/lib/rythu360/market"
import { MarketAreaChart, MarketTrendChart, Sparkline } from "@/components/rythu360/charts"
import { GlassCard } from "@/components/rythu360/glass-card"
import { ThemeToggle } from "@/components/rythu360/theme-toggle"
import { cn } from "@/lib/utils"

const CATEGORY_ICON: Record<MarketCategory, LucideIcon> = {
  Grains: Wheat,
  Vegetables: Carrot,
  "Cash Crops": Sprout,
  "Dairy & Poultry": Egg,
  Fuel: Fuel,
}

const CATEGORY_TINT: Record<MarketCategory, string> = {
  Grains: "bg-primary/12 text-primary",
  Vegetables: "bg-accent/15 text-accent",
  "Cash Crops": "bg-chart-3/15 text-chart-3",
  "Dairy & Poultry": "bg-chart-4/15 text-chart-4",
  Fuel: "bg-chart-5/15 text-chart-5",
}

const RANGES: RangeKey[] = ["1W", "1M", "3M", "1Y"]

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function MarketDashboard() {
  const [query, setQuery] = useState("")
  const [district, setDistrict] = useState<(typeof DISTRICTS)[number]>("All Districts")
  const [mandi, setMandi] = useState<(typeof MANDIS)[number]>("All Mandis")
  const [category, setCategory] = useState<"All" | MarketCategory>("All")
  const [selectedId, setSelectedId] = useState("paddy")
  const [range, setRange] = useState<RangeKey>("1M")

  const filtered = useMemo(() => {
    return commodities.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
      if (district !== "All Districts" && c.district !== district) return false
      if (mandi !== "All Mandis" && c.mandi !== mandi) return false
      if (category !== "All" && c.category !== category) return false
      return true
    })
  }, [query, district, mandi, category])

  const selected = useMemo(
    () => commodities.find((c) => c.id === selectedId) ?? commodities[0],
    [selectedId],
  )

  const history = useMemo(() => getHistory(selected, range), [selected, range])

  const gainers = commodities.filter((c) => c.changePct > 0).length
  const losers = commodities.filter((c) => c.changePct < 0).length

  return (
    <div className="min-h-svh bg-background">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ---------- Header ---------- */}
        <header className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Market Prices
            </h1>
            <p className="text-sm text-muted-foreground">Live mandi &amp; fuel rates · Telangana</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" /> Live
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* ---------- Market summary strip ---------- */}
        <motion.div {...fade} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryTile label="Commodities" value={`${commodities.length}`} icon={TrendingUp} tint="bg-primary/12 text-primary" />
          <SummaryTile label="Gainers" value={`${gainers}`} icon={ArrowUpRight} tint="bg-chart-1/15 text-chart-1" />
          <SummaryTile label="Losers" value={`${losers}`} icon={ArrowDownRight} tint="bg-destructive/12 text-destructive" />
          <SummaryTile label="Updated" value="Just now" icon={MapPin} tint="bg-accent/15 text-accent" />
        </motion.div>

        {/* ---------- Search + filters ---------- */}
        <motion.div {...fade} transition={{ delay: 0.05 }} className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-3.5 py-2.5">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search commodity — paddy, tomato, diesel…"
                aria-label="Search commodities"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <SlidersHorizontal className="size-3.5" /> Filters
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <FilterSelect label="District" value={district} options={DISTRICTS} onChange={(v) => setDistrict(v as typeof district)} />
                <FilterSelect label="Mandi" value={mandi} options={MANDIS} onChange={(v) => setMandi(v as typeof mandi)} />
              </div>
              {/* category chips */}
              <div className="flex flex-wrap gap-1.5 lg:ml-auto">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      category === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ---------- Detail hero (selected commodity) ---------- */}
        <motion.div {...fade} transition={{ delay: 0.1 }} className="mt-4">
          <DetailHero
            commodity={selected}
            history={history}
            range={range}
            onRange={setRange}
          />
        </motion.div>

        {/* ---------- Commodity cards ---------- */}
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">All commodities</h2>
            <span className="text-sm text-muted-foreground">{filtered.length} results</span>
          </div>

          {filtered.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center gap-2 p-10 text-center">
              <Leaf className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No commodities match your filters.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((c, i) => (
                  <CommodityCard
                    key={c.id}
                    commodity={c}
                    active={c.id === selectedId}
                    index={i}
                    onSelect={() => setSelectedId(c.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string
  value: string
  icon: LucideIcon
  tint: string
}) {
  return (
    <GlassCard className="flex items-center gap-3 p-3.5">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", tint)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold tracking-tight">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </GlassCard>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-3 py-2 text-sm">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="cursor-pointer bg-transparent pr-1 text-sm font-medium text-foreground outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-popover text-popover-foreground">
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function CommodityCard({
  commodity,
  active,
  index,
  onSelect,
}: {
  commodity: Commodity
  active: boolean
  index: number
  onSelect: () => void
}) {
  const Icon = CATEGORY_ICON[commodity.category]
  const up = commodity.changePct >= 0
  const spark = getSparkline(commodity)
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index * 0.03, 0.2) }}
      onClick={onSelect}
      className={cn(
        "group flex flex-col rounded-3xl border bg-card/70 p-4 text-left backdrop-blur-xl transition-colors",
        active ? "border-primary ring-1 ring-primary/40" : "border-border/70 hover:bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={cn("flex size-10 items-center justify-center rounded-2xl", CATEGORY_TINT[commodity.category])}>
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-semibold leading-tight tracking-tight">{commodity.name}</p>
            <p className="text-xs text-muted-foreground">{commodity.category}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
            up ? "bg-chart-1/15 text-chart-1" : "bg-destructive/12 text-destructive",
          )}
        >
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(commodity.changePct).toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 h-11">
        <Sparkline data={spark} up={up} />
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-xl font-semibold tracking-tight">
            ₹{formatPrice(commodity.price)}
          </p>
          <p className="text-xs text-muted-foreground">{commodity.unit}</p>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" /> {commodity.mandi === "—" ? commodity.district : commodity.mandi}
        </p>
      </div>
    </motion.button>
  )
}

function DetailHero({
  commodity,
  history,
  range,
  onRange,
}: {
  commodity: Commodity
  history: Array<{ label: string; price: number }>
  range: RangeKey
  onRange: (r: RangeKey) => void
}) {
  const Icon = CATEGORY_ICON[commodity.category]
  const up = commodity.changePct >= 0
  const first = history[0]?.price ?? commodity.price
  const rangeChange = ((commodity.price - first) / first) * 100
  const rangeUp = rangeChange >= 0

  return (
    <GlassCard className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left: identity + price */}
        <div className="border-b border-border/70 p-5 lg:col-span-2 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className={cn("flex size-12 items-center justify-center rounded-2xl", CATEGORY_TINT[commodity.category])}>
              <Icon className="size-6" />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight">{commodity.name}</h2>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {commodity.mandi === "—" ? commodity.district : `${commodity.mandi}, ${commodity.district}`}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-4xl font-semibold tracking-tight">₹{formatPrice(commodity.price)}</p>
            <span className="pb-1 text-sm text-muted-foreground">{commodity.unit}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-sm font-semibold",
                up ? "bg-chart-1/15 text-chart-1" : "bg-destructive/12 text-destructive",
              )}
            >
              {up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
              {Math.abs(commodity.changePct).toFixed(1)}% today
            </span>
            <span className="text-sm text-muted-foreground">
              {rangeUp ? "+" : "−"}
              {Math.abs(rangeChange).toFixed(1)}% over {range}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Category" value={commodity.category} />
            <Stat label="Unit" value={commodity.unit} />
            <Stat label="District" value={commodity.district} />
            <Stat label="Mandi" value={commodity.mandi} />
          </dl>
        </div>

        {/* Right: charts */}
        <div className="p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold tracking-tight">Price History</h3>
              <p className="text-xs text-muted-foreground">{commodity.unit} · {range}</p>
            </div>
            {/* range selector */}
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/60 p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRange(r)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <MarketAreaChart data={history} unit={commodity.unit} up={rangeUp} />

          <div className="mt-4 border-t border-border/70 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h3 className="font-semibold tracking-tight">Price Trend</h3>
            </div>
            <MarketTrendChart data={history} up={rangeUp} />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tracking-tight">{value}</dd>
    </div>
  )
}
