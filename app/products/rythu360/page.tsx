import type { Metadata } from "next"
import Image from "next/image"
import {
  CloudSun,
  TrendingUp,
  Landmark,
  MessageCircle,
  Sprout,
  Languages,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CinematicHero } from "@/components/cinematic-hero"
import { AgreeConnectServices } from "@/components/agreeConnect-services"
import { AgreeConnectFeatures } from "@/components/agreeConnect-features"
import { AgreeConnectAIPlatform } from "@/components/agreeConnect-ai-platform"
import { AgreeConnectMarketplace } from "@/components/agreeConnect-marketplace"
import { AgreeConnectHowItWorks } from "@/components/agreeConnect-how-it-works"
import { AgreeConnectDesignedFor } from "@/components/agreeConnect-designed-for"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AgreeConnect — The Farmer Super-App | SmartFarmin",
  description:
    "AgreeConnect puts crop planning, live mandi prices, weather, credit and expert advice in every farmer's pocket, in their own language.",
}

const features = [
  {
    icon: Sprout,
    title: "Crop planning",
    desc: "Personalised sowing calendars and input plans built around your soil, season and budget.",
  },
  {
    icon: CloudSun,
    title: "Hyperlocal weather",
    desc: "Field-level forecasts and alerts so you always know the right day to sow, irrigate and harvest.",
  },
  {
    icon: TrendingUp,
    title: "Live mandi prices",
    desc: "Real-time prices from nearby markets to help you sell at the right place and the right time.",
  },
  {
    icon: Landmark,
    title: "Credit & schemes",
    desc: "Discover eligible government schemes and apply for fair, transparent farm credit in a few taps.",
  },
  {
    icon: MessageCircle,
    title: "Expert support",
    desc: "Chat with agronomists and a farmer community for answers whenever a problem shows up.",
  },
  {
    icon: Languages,
    title: "Your language",
    desc: "Full support for Telugu, Hindi and more, with a simple voice-first interface for every farmer.",
  },
]

const stats = [
  { value: "2M+", label: "Farmers onboarded" },
  { value: "11", label: "Languages supported" },
  { value: "18%", label: "Avg. income uplift" },
]

export default function AgreeConnectPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CinematicHero />
        <AgreeConnectServices />
        <AgreeConnectFeatures />
        <AgreeConnectAIPlatform />
        <AgreeConnectMarketplace />
        <AgreeConnectHowItWorks />
        <AgreeConnectDesignedFor />

        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/farmer.png"
                alt="A farmer using the AgreeConnect app in the field"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built for the field, not the boardroom
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                AgreeConnect works on entry-level phones and patchy networks. Every
                screen is voice-friendly and designed with farmers, so the advice
                that matters is always one tap away.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-serif text-3xl font-semibold text-primary">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Everything a farmer needs, in one place
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Six core tools that work together across the entire crop cycle.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
