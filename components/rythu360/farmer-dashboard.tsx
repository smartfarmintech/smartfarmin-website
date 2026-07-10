"use client"

import { useState, type FormEvent } from "react"
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
  Droplets,
  HeartPulse,
  Headphones,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  Mic,
  Navigation,
  Search,
  MapPinned,
  ShoppingBasket,
  Sparkles,
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
  WeatherChart,
} from "@/components/rythu360/charts"
import { VideoServices } from "@/components/rythu360/video-services"
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

const liveSignals = [
  { label: "Operators nearby", value: "18 online", icon: Navigation },
  { label: "Machines ready", value: "11 available", icon: Tractor },
  { label: "Today’s bookings", value: "4 confirmed", icon: CalendarDays },
  { label: "Nellore paddy", value: "₹2,460 / qtl", icon: TrendingUp },
]

const quickActions = [
  { label: "Ask Akanksha AI", icon: Sparkles, href: "/app/ai" },
  { label: "Market prices", icon: TrendingUp, href: "/app/market" },
  { label: "Book machinery", icon: Tractor, href: "/app/machinery" },
  { label: "Nearby services", icon: MapPinned, href: "/app/nearby" },
  { label: "Schemes", icon: Landmark, href: "/app/schemes" },
  { label: "Marketplace", icon: Store, href: "/app/shop" },
  { label: "Organic store", icon: ShoppingBasket, href: "/app/organic" },
  { label: "Wallet", icon: Wallet, href: "/app/wallet" },
]

type SpeechRecognitionConstructor = new () => {
  lang: string
  start: () => void
  onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void
  onerror: () => void
  onend: () => void
}

function Overview() {
  const [query, setQuery] = useState("")
  const [listening, setListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState("")

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const search = query.trim()
    if (search) window.location.href = `/app/nearby?q=${encodeURIComponent(search)}`
  }

  function startVoiceSearch() {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
    if (!Recognition) {
      setVoiceStatus("Voice search is not supported in this browser. Please type your search.")
      return
    }
    const recognition = new Recognition()
    recognition.lang = "te-IN"
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ""
      setQuery(transcript)
      setVoiceStatus(`Heard: ${transcript}`)
    }
    recognition.onerror = () => setVoiceStatus("I could not hear that. Please try again.")
    recognition.onend = () => setListening(false)
    setListening(true)
    setVoiceStatus("Listening…")
    recognition.start()
  }

  return (
    <>
      <motion.section {...fade} aria-labelledby="dashboard-greeting" className="overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-sm">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="flex flex-col gap-6 p-5 sm:p-7">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm text-primary-foreground/75">
                  <CalendarDays className="size-4" />
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 id="dashboard-greeting" className="mt-1 text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  {greeting}, Ravi
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-primary-foreground/75">
                  <MapPin className="size-4" /> Nellore Rural, SPSR Nellore · 6.5 acres
                </p>
              </div>
              <button type="button" aria-label="Open notifications, 3 unread" className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20">
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-primary" />
              </button>
            </header>

            <div className="rounded-3xl bg-background p-2 text-foreground shadow-lg">
              <form onSubmit={handleSearch} role="search" className="flex items-center gap-1">
                <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="farm-search" className="sr-only">Search services and farm information</label>
                <input
                  id="farm-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tractor, drone, mandi price…"
                  className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button type="button" onClick={startVoiceSearch} aria-label="Search by voice" aria-pressed={listening} className={cn("flex size-11 shrink-0 items-center justify-center rounded-full transition-colors", listening ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/70")}>
                  <Mic className="size-5" />
                </button>
                <Button type="submit" className="hidden rounded-full sm:flex">Search</Button>
              </form>
              <p className="sr-only" aria-live="polite">{voiceStatus}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button render={<Link href="/app/ai" />} nativeButton={false} className="rounded-full bg-background text-foreground hover:bg-background/90">
                <Sparkles data-icon="inline-start" /> Ask Akanksha AI
              </Button>
              <Button render={<a href="tel:18001234567" />} nativeButton={false} variant="outline" className="rounded-full border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Headphones data-icon="inline-start" /> Farmer helpline
              </Button>
            </div>
          </div>

          <aside aria-label="Current farm conditions" className="flex flex-col justify-between gap-5 bg-foreground/15 p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-primary-foreground/70">Current weather</p>
                <p className="mt-1 text-5xl font-semibold tracking-tight">29°</p>
                <p className="mt-1 text-sm">Cloudy · Feels like 31°</p>
              </div>
              <CloudSun className="size-12 text-accent" />
            </div>
            <dl className="grid grid-cols-3 gap-2 border-t border-primary-foreground/20 pt-4 text-sm">
              <div><dt className="text-primary-foreground/65">Humidity</dt><dd className="mt-1 font-semibold">72%</dd></div>
              <div><dt className="text-primary-foreground/65">Wind</dt><dd className="mt-1 font-semibold">9 km/h</dd></div>
              <div><dt className="text-primary-foreground/65">Rain</dt><dd className="mt-1 font-semibold">35%</dd></div>
            </dl>
            <Link href="/app/wallet" className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/15">
              <span className="flex items-center gap-2 text-sm"><Wallet className="size-4" /> Wallet balance</span>
              <strong>₹12,840</strong>
            </Link>
          </aside>
        </div>
      </motion.section>

      <motion.div {...fade} transition={{ delay: 0.05 }} className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {liveSignals.map((signal) => {
          const Icon = signal.icon
          return (
            <GlassCard key={signal.label} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <Icon className="size-5 text-primary" />
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary"><span className="size-1.5 rounded-full bg-primary" /> Live</span>
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight">{signal.value}</p>
              <p className="text-xs text-muted-foreground">{signal.label}</p>
            </GlassCard>
          )
        })}
      </motion.div>

      <motion.div {...fade} transition={{ delay: 0.08 }} className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
        <GlassCard className="border-primary/25 p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent"><Lightbulb className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Today&apos;s farm advisory</h2><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Updated 8 min ago</span></div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Rain is likely after 4 PM. Complete paddy top-dressing before 2 PM and postpone pesticide spraying until tomorrow morning.</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active booking</p>
          <div className="mt-2 flex items-center justify-between gap-3"><div><p className="font-semibold">Drone spraying</p><p className="text-sm text-muted-foreground">Arrives in 18 min</p></div><span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Navigation className="size-5" /></span></div>
        </GlassCard>
      </motion.div>

      <VideoServices />

      <motion.section {...fade} transition={{ delay: 0.12 }} aria-labelledby="quick-actions-title" className="mt-6">
        <div className="mb-3 flex items-center justify-between"><h2 id="quick-actions-title" className="font-semibold tracking-tight">Explore Rythu360</h2><Link href="/app/nearby" className="flex items-center gap-1 text-sm font-medium text-primary">All services <ChevronRight className="size-4" /></Link></div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href} className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-colors hover:bg-muted">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><Icon className="size-5" /></span>
                <span className="text-pretty text-[11px] font-medium leading-tight">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </motion.section>

      <div className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2"><div className="mb-4"><h2 className="font-semibold">Seven-day farm outlook</h2><p className="text-sm text-muted-foreground">Temperature and rainfall · SPSR Nellore</p></div><WeatherChart /></GlassCard>
        <GlassCard className="flex flex-col p-5"><div className="flex items-center gap-2"><HeartPulse className="size-4 text-primary" /><h2 className="font-semibold">Crop health</h2></div><div className="relative flex-1"><CropHealthGauge value={88} /><div className="pointer-events-none absolute inset-x-0 bottom-6 text-center"><p className="text-3xl font-semibold">88</p><p className="text-xs text-muted-foreground">Healthy</p></div></div><p className="text-center text-xs text-muted-foreground">4 fields monitored · 1 needs attention</p></GlassCard>
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
