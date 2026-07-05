import type { Metadata } from "next"
import Link from "next/link"
import { Sprout, Target, Globe2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About | SmartFarmin",
  description:
    "SmartFarmin is building a smarter, fairer and more sustainable food system for India — from the farmer up.",
}

const values = [
  {
    icon: Sprout,
    title: "Farmer-first",
    desc: "Every product decision starts with the question: does this put more value in the farmer's hands?",
  },
  {
    icon: Target,
    title: "Evidence over hype",
    desc: "We ground advice in soil, satellite and weather data — not guesswork.",
  },
  {
    icon: Globe2,
    title: "Sustainable by design",
    desc: "We help farms cut inputs, protect soil health and build climate resilience.",
  },
]

const milestones = [
  { year: "2021", text: "SmartFarmin founded; Rythu360 pilots in Telangana." },
  { year: "2022", text: "Akanksha AI advisory launched with satellite integration." },
  { year: "2023", text: "Marketplace crosses 1M farmers; drone services introduced." },
  { year: "2024", text: "First state government partnerships for scheme delivery." },
]

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="About us"
          title="Cultivating a fairer food system"
          description="SmartFarmin started with a simple belief: when farmers have the same tools, data and market access as large agri-businesses, everyone eats better."
        >
          <Button render={<Link href="/careers" />} nativeButton={false}>
            Join our team
          </Button>
          <Button render={<Link href="/investors" />} nativeButton={false} variant="outline">
            For investors
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold text-foreground">Our journey</h2>
            <ol className="mt-10 space-y-8 border-l border-border pl-6">
              {milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background" />
                  <div className="font-serif text-lg font-semibold text-primary">{m.year}</div>
                  <p className="mt-1 text-pretty text-muted-foreground">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
