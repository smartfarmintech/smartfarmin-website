import type { Metadata } from "next"
import Image from "next/image"
import {
  Satellite,
  Droplets,
  Bug,
  CalendarClock,
  LineChart,
  ShieldCheck,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Akanksha AI — Precision Crop Advisory | SmartFarmin",
  description:
    "Akanksha AI reads soil, satellite and weather data to tell farmers exactly when to sow, irrigate, fertilise and spray for the best possible yield.",
}

const capabilities = [
  {
    icon: Satellite,
    title: "Satellite crop health",
    desc: "Track vegetation and stress across every field with regularly refreshed satellite imagery.",
  },
  {
    icon: Droplets,
    title: "Smart irrigation",
    desc: "Get exact watering windows based on soil moisture, crop stage and upcoming rainfall.",
  },
  {
    icon: Bug,
    title: "Pest & disease alerts",
    desc: "Early warnings for likely outbreaks with targeted, lower-cost treatment recommendations.",
  },
  {
    icon: CalendarClock,
    title: "Sowing calendars",
    desc: "AI-generated schedules that align every operation with weather and market windows.",
  },
  {
    icon: LineChart,
    title: "Yield forecasting",
    desc: "Season-long yield predictions so you can plan storage, logistics and sales with confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Input optimisation",
    desc: "Precise fertiliser and pesticide dosing that protects margins, soil health and the environment.",
  },
]

const steps = [
  {
    step: "01",
    title: "Connect your fields",
    desc: "Draw or import field boundaries once, and Akanksha AI starts monitoring them automatically.",
  },
  {
    step: "02",
    title: "AI reads the data",
    desc: "Soil, satellite and weather signals are fused into a clear picture of what each field needs.",
  },
  {
    step: "03",
    title: "Act with confidence",
    desc: "Receive simple, timely recommendations in Rythu360 and watch your yields and margins improve.",
  },
]

export default function AkankshaAIPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Akanksha AI"
          title="AI that knows your field better than a weather app"
          description="Akanksha AI fuses soil, satellite and weather data into clear, timely advice, so you know exactly when to sow, irrigate, fertilise and spray."
        >
          <Button size="lg">Try Akanksha AI</Button>
          <Button size="lg" variant="outline">
            Talk to sales
          </Button>
        </PageHero>

        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Turn field data into decisions
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Instead of drowning farmers in dashboards, Akanksha AI answers the
                only questions that matter: what to do, where, and when. Every
                recommendation is explainable and tuned to local conditions.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Works with any crop and any field size",
                  "Delivers advice directly inside Rythu360",
                  "Improves with every season of local data",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/farmer.jpg"
                alt="Satellite crop health analytics over farmland"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                What Akanksha AI can do
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                A full precision-agriculture toolkit, delivered as simple advice.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {c.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-2xl text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.step} className="relative">
                  <span className="font-serif text-5xl font-semibold text-primary/25">
                    {s.step}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
