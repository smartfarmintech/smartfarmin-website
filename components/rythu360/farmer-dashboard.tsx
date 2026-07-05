"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Bell,
  CalendarDays,
  ChevronRight,
  CloudRain,
  CloudSun,
  Crown,
  Droplets,
  HeartPulse,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  MapPinned,
  Package,
  ShoppingBasket,
  Sprout,
  Store,
  Sun,
  ThermometerSun,
  Tractor,
  TrendingUp,
  Wallet,
  Wind,
} from "lucide-react"
import { GlassCard } from "@/components/rythu360/glass-card"
import {
  CropHealthGauge,
  IncomeAreaChart,
  MandiLineChart,
  SoilMoistureChart,
  WeatherChart,
} from "@/components/rythu360/charts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

export function FarmerDashboard({ active }: { active: string }) {
  return (
    <motion.div
      key={active}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto w-full max-w-6xl"
    >
      {active === "Overview" && <Overview />}
      {active === "My Crops" && <MyCrops />}
      {active === "Advisory" && <Advisory />}
      {active === "Weather" && <Weather />}
      {active === "Marketplace" && <Marketplace />}
      {active === "Finance" && <Finance />}
      {active === "Settings" && <SettingsSection />}
    </motion.div>
  )
}

/* ----------------------------- shared bits ----------------------------- */

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-6">
      <h1 className="text-balance font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  )
}

type Stat = {
  label: string
  value: string
  delta: string
  up: boolean
  icon: typeof Leaf
}

const stats: Stat[] = [
  { label: "Season income", value: "₹84,200", delta: "+18.2%", up: true, icon: BadgeIndianRupee },
  { label: "Active crops", value: "4 fields", delta: "+1", up: true, icon: Sprout },
  { label: "Water saved", value: "1,240 L", delta: "+9.4%", up: true, icon: Droplets },
  { label: "Advisory score", value: "92 / 100", delta: "-3", up: false, icon: TrendingUp },
]

function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div key={s.label} {...fade} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                    s.up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {s.delta}
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ------------------------------- Overview ------------------------------ */

const advisories = [
  { icon: Droplets, title: "Irrigate West field", note: "Soil moisture at 47%. Water within 2 days.", tone: "text-chart-3" },
  { icon: CloudRain, title: "Rain expected Thu", note: "24mm forecast. Delay spraying schedule.", tone: "text-primary" },
  { icon: Lightbulb, title: "Top-dress urea", note: "Paddy at tillering stage — apply nitrogen.", tone: "text-accent" },
]

const quickActions = [
  { label: "Crop Advisory", icon: Lightbulb, tint: "bg-primary/12 text-primary" },
  { label: "Market Prices", icon: TrendingUp, tint: "bg-accent/15 text-accent", href: "/app/market" },
  { label: "Machinery Booking", icon: Tractor, tint: "bg-chart-3/15 text-chart-3", href: "/app/machinery" },
  { label: "Nearby Services", icon: MapPinned, tint: "bg-chart-4/15 text-chart-4" },
  { label: "Government Schemes", icon: Landmark, tint: "bg-primary/12 text-primary" },
  { label: "Marketplace", icon: Store, tint: "bg-accent/15 text-accent", href: "/app/shop" },
  { label: "Organic Store", icon: ShoppingBasket, tint: "bg-chart-3/15 text-chart-3", href: "/app/organic" },
  { label: "Wallet", icon: Wallet, tint: "bg-chart-4/15 text-chart-4", href: "/app/wallet" },
  { label: "Orders", icon: Package, tint: "bg-primary/12 text-primary", href: "/app/orders" },
]

const summaryItems = [
  { label: "Today's income", value: "₹4,280", icon: BadgeIndianRupee },
  { label: "Tasks due", value: "3 pending", icon: CalendarDays },
  { label: "Active alerts", value: "2 advisories", icon: Bell },
  { label: "Water saved", value: "1,240 L", icon: Droplets },
]

function Overview() {
  return (
    <>
      {/* ---------- Top: profile, location, weather, notifications ---------- */}
      <motion.div {...fade}>
        <GlassCard className="relative overflow-hidden p-5 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-3xl bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
                RK
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 className="mt-0.5 text-balance font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  Namaste, Ravi Kumar
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> Warangal, Telangana · 6.5 acres
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-3">
                <CloudSun className="size-8 text-accent" />
                <div className="leading-tight">
                  <p className="text-lg font-semibold tracking-tight">31°C</p>
                  <p className="text-xs text-muted-foreground">Partly cloudy</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-card"
              >
                <Bell className="size-5" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent ring-2 ring-card" />
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ---------- Today's summary ---------- */}
      <motion.div {...fade} transition={{ delay: 0.05 }} className="mt-4">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Today&apos;s summary</h2>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {summaryItems.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3.5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold tracking-tight">{s.value}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* ---------- Quick actions ---------- */}
      <motion.div {...fade} transition={{ delay: 0.1 }} className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">Quick actions</h2>
          <button type="button" className="flex items-center gap-1 text-sm text-primary">
            All services <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-9">
          {quickActions.map((a, i) => {
            const Icon = a.icon
            const inner = (
              <>
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                    a.tint,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-[11px] font-medium leading-tight text-foreground">{a.label}</span>
              </>
            )
            const className =
              "group flex flex-col items-center gap-2 rounded-3xl border border-border/70 bg-card/70 p-3 text-center backdrop-blur-xl transition-colors hover:bg-card"
            return "href" in a && a.href ? (
              <motion.div key={a.label} {...fade} transition={{ delay: 0.1 + i * 0.03 }}>
                <Link href={a.href} className={cn(className, "h-full")}>
                  {inner}
                </Link>
              </motion.div>
            ) : (
              <motion.button
                key={a.label}
                type="button"
                {...fade}
                transition={{ delay: 0.1 + i * 0.03 }}
                className={className}
              >
                {inner}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ---------- Charts: income + crop health ---------- */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <motion.div {...fade} transition={{ delay: 0.12 }} className="lg:col-span-2">
          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Today&apos;s income</h2>
                <p className="text-sm text-muted-foreground">Income vs expenses · 7 months</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-chart-1" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-chart-2" /> Expenses
                </span>
              </div>
            </div>
            <IncomeAreaChart />
          </GlassCard>
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.16 }}>
          <GlassCard className="flex h-full flex-col p-5">
            <div className="mb-1 flex items-center gap-2">
              <HeartPulse className="size-4 text-primary" />
              <h2 className="font-semibold tracking-tight">Crop health</h2>
            </div>
            <div className="relative flex-1">
              <CropHealthGauge value={88} />
              <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center">
                <p className="text-3xl font-semibold tracking-tight">88</p>
                <p className="text-xs text-muted-foreground">Healthy</p>
              </div>
            </div>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              4 fields monitored · 1 needs attention
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* ---------- Weather forecast + subscription ---------- */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <motion.div {...fade} transition={{ delay: 0.12 }} className="lg:col-span-2">
          <GlassCard className="p-5">
            <div className="mb-4">
              <h2 className="font-semibold tracking-tight">Weather forecast</h2>
              <p className="text-sm text-muted-foreground">Temperature &amp; rainfall · Warangal</p>
            </div>
            <WeatherChart />
          </GlassCard>
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.16 }}>
          <GlassCard className="relative flex h-full flex-col overflow-hidden p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="relative flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Crown className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold tracking-tight">Rythu360 Plus</h2>
                <p className="text-xs text-muted-foreground">Subscription status</p>
              </div>
            </div>

            <div className="relative mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> Active
              </span>
              <p className="mt-3 text-sm text-muted-foreground">Renews on 14 Aug 2026</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">28 of 40 days remaining</p>
            </div>

            <Button variant="outline" className="relative mt-auto w-full rounded-full">
              Manage plan
            </Button>
          </GlassCard>
        </motion.div>
      </div>

      {/* ---------- Mandi price + soil moisture ---------- */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <motion.div {...fade} transition={{ delay: 0.12 }}>
          <GlassCard className="p-5">
            <div className="mb-4">
              <h2 className="font-semibold tracking-tight">Paddy mandi price</h2>
              <p className="text-sm text-muted-foreground">Warangal · ₹/quintal · 8 weeks</p>
            </div>
            <MandiLineChart />
          </GlassCard>
        </motion.div>
        <motion.div {...fade} transition={{ delay: 0.16 }}>
          <GlassCard className="p-5">
            <h2 className="mb-4 font-semibold tracking-tight">Soil moisture by field</h2>
            <SoilMoistureChart />
          </GlassCard>
        </motion.div>
      </div>
    </>
  )
}

function WeatherNow() {
  return (
    <GlassCard className="overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Warangal</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">31°C</p>
          <p className="text-sm text-muted-foreground">Partly cloudy</p>
        </div>
        <CloudSun className="size-12 text-accent" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-muted/60 py-2">
          <Droplets className="mx-auto size-4 text-chart-3" />
          <p className="mt-1 font-medium">64%</p>
          <p className="text-muted-foreground">Humidity</p>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <Wind className="mx-auto size-4 text-muted-foreground" />
          <p className="mt-1 font-medium">12 km/h</p>
          <p className="text-muted-foreground">Wind</p>
        </div>
        <div className="rounded-xl bg-muted/60 py-2">
          <ThermometerSun className="mx-auto size-4 text-accent" />
          <p className="mt-1 font-medium">UV 7</p>
          <p className="text-muted-foreground">High</p>
        </div>
      </div>
    </GlassCard>
  )
}

/* ------------------------------- My Crops ------------------------------ */

const crops = [
  { name: "Paddy (BPT 5204)", field: "North field", stage: "Tillering", progress: 55, health: "Good" },
  { name: "Cotton", field: "East field", stage: "Flowering", progress: 72, health: "Watch" },
  { name: "Maize", field: "South field", stage: "Vegetative", progress: 38, health: "Good" },
  { name: "Red gram", field: "West field", stage: "Sowing", progress: 12, health: "Good" },
]

function MyCrops() {
  return (
    <>
      <SectionHeading title="My Crops" subtitle="Track growth stages and health across your fields." />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {crops.map((c, i) => (
          <motion.div key={c.name} {...fade} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Leaf className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold tracking-tight">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.field}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    c.health === "Good" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent",
                  )}
                >
                  {c.health}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{c.stage}</span>
                <span className="font-medium">{c.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </>
  )
}

/* ------------------------------- Advisory ------------------------------ */

function Advisory() {
  return (
    <>
      <SectionHeading title="Advisory" subtitle="AI-backed recommendations from Akanksha AI and agronomists." />
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {advisories.map((a, i) => {
          const Icon = a.icon
          return (
            <motion.div key={a.title} {...fade} transition={{ delay: i * 0.05 }}>
              <GlassCard className="h-full p-5">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-muted">
                  <Icon className={cn("size-5", a.tone)} />
                </span>
                <h2 className="mt-3 font-semibold tracking-tight">{a.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.note}</p>
                <Button variant="outline" size="sm" className="mt-4 rounded-full">
                  View details
                </Button>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------- Weather ------------------------------- */

const forecast = [
  { day: "Mon", icon: Sun, hi: 33, lo: 24 },
  { day: "Tue", icon: Sun, hi: 34, lo: 25 },
  { day: "Wed", icon: CloudSun, hi: 31, lo: 24 },
  { day: "Thu", icon: CloudRain, hi: 28, lo: 23 },
  { day: "Fri", icon: CloudRain, hi: 29, lo: 23 },
  { day: "Sat", icon: CloudSun, hi: 32, lo: 24 },
  { day: "Sun", icon: Sun, hi: 34, lo: 25 },
]

function Weather() {
  return (
    <>
      <SectionHeading title="Weather" subtitle="7-day outlook and field conditions for Warangal." />
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <motion.div {...fade} className="lg:col-span-1">
          <WeatherNow />
        </motion.div>
        <motion.div {...fade} transition={{ delay: 0.08 }} className="lg:col-span-2">
          <GlassCard className="h-full p-5">
            <h2 className="mb-4 font-semibold tracking-tight">Temperature & rainfall</h2>
            <WeatherChart />
          </GlassCard>
        </motion.div>
      </div>
      <motion.div {...fade} transition={{ delay: 0.12 }} className="mt-4">
        <GlassCard className="p-5">
          <h2 className="mb-4 font-semibold tracking-tight">7-day forecast</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
            {forecast.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.day} className="rounded-2xl bg-muted/50 p-3 text-center">
                  <p className="text-sm text-muted-foreground">{f.day}</p>
                  <Icon className="mx-auto my-2 size-6 text-accent" />
                  <p className="text-sm font-medium">{f.hi}°</p>
                  <p className="text-xs text-muted-foreground">{f.lo}°</p>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </>
  )
}

/* ----------------------------- Marketplace ----------------------------- */

const listings = [
  { name: "Paddy — BPT 5204", price: "₹2,480/qtl", trend: "+3.1%" },
  { name: "Cotton — Long staple", price: "₹7,200/qtl", trend: "+1.4%" },
  { name: "Maize — Yellow", price: "₹2,150/qtl", trend: "-0.8%" },
  { name: "Red gram — Whole", price: "₹9,850/qtl", trend: "+2.6%" },
]

function Marketplace() {
  return (
    <>
      <SectionHeading title="Marketplace" subtitle="Sell your harvest and track live mandi rates." />
      <div className="mb-4">
        <GlassCard className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Store className="size-5" />
            </span>
            <div>
              <p className="font-semibold tracking-tight">Ready to sell?</p>
              <p className="text-sm text-muted-foreground">List a lot and reach verified buyers directly.</p>
            </div>
          </div>
          <Button className="rounded-full">List a lot</Button>
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((l, i) => {
          const up = l.trend.startsWith("+")
          return (
            <motion.div key={l.name} {...fade} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5">
                <p className="font-medium">{l.name}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight">{l.price}</p>
                <span
                  className={cn(
                    "mt-1 inline-flex items-center gap-0.5 text-xs font-medium",
                    up ? "text-primary" : "text-destructive",
                  )}
                >
                  {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {l.trend} this week
                </span>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------- Finance ------------------------------- */

const transactions = [
  { label: "Paddy sale — Warangal mandi", amount: "+₹34,200", up: true, date: "12 Jul" },
  { label: "Drone spraying service", amount: "-₹1,800", up: false, date: "9 Jul" },
  { label: "Kisan credit disbursal", amount: "+₹25,000", up: true, date: "5 Jul" },
  { label: "Seeds & fertiliser", amount: "-₹6,400", up: false, date: "2 Jul" },
]

function Finance() {
  return (
    <>
      <SectionHeading title="Finance" subtitle="Income, expenses and credit at a glance." />
      <StatCards />
      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <motion.div {...fade} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <GlassCard className="p-5">
            <h2 className="mb-4 font-semibold tracking-tight">Cash flow</h2>
            <IncomeAreaChart />
          </GlassCard>
        </motion.div>
        <motion.div {...fade} transition={{ delay: 0.15 }}>
          <GlassCard className="h-full p-5">
            <h2 className="mb-3 font-semibold tracking-tight">Recent transactions</h2>
            <ul className="flex flex-col gap-3">
              {transactions.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-xl",
                      t.up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {t.up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <span className={cn("text-sm font-semibold", t.up ? "text-primary" : "text-foreground")}>
                    {t.amount}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </>
  )
}

/* ------------------------------- Settings ------------------------------ */

function SettingsSection() {
  return (
    <>
      <SectionHeading title="Settings" subtitle="Manage your profile and preferences." />
      <div className="grid max-w-2xl grid-cols-1 gap-3.5">
        <GlassCard className="p-5">
          <h2 className="font-semibold tracking-tight">Profile</h2>
          <dl className="mt-3 divide-y divide-border/70 text-sm">
            {[
              ["Name", "Ravi Kumar"],
              ["Location", "Warangal, Telangana"],
              ["Land holding", "6.5 acres"],
              ["Language", "Telugu"],
              ["Rythu360 ID", "RY-TG-2048"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>
    </>
  )
}
