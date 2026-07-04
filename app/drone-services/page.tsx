import type { Metadata } from "next"
import Image from "next/image"
import {
  SprayCan,
  Map,
  Timer,
  IndianRupee,
  HeartPulse,
  Leaf,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Drone Services — Precision Spraying & Mapping | SmartFarmin",
  description:
    "Book on-demand agricultural drone spraying and field mapping. Cut input costs, save water, protect your health and boost yields with SmartFarmin drones.",
}

const services = [
  {
    icon: SprayCan,
    title: "Precision spraying",
    desc: "Uniform pesticide and nutrient application that uses up to 30% less input and zero manual exposure.",
  },
  {
    icon: Map,
    title: "Field mapping",
    desc: "High-resolution aerial maps that reveal crop stress, water logging and gaps in your stand.",
  },
  {
    icon: Leaf,
    title: "Nutrient scouting",
    desc: "Identify under-performing zones and treat them individually for a healthier, even crop.",
  },
]

const outcomes = [
  { icon: Timer, value: "1 acre / 7 min", label: "Spraying speed" },
  { icon: IndianRupee, value: "Up to 30%", label: "Lower input cost" },
  { icon: HeartPulse, value: "Zero", label: "Chemical exposure" },
]

const steps = [
  { step: "01", title: "Book a slot", desc: "Choose your field, crop and service in the app and pick a convenient time." },
  { step: "02", title: "Certified pilot arrives", desc: "A trained pilot and calibrated drone reach your field on schedule." },
  { step: "03", title: "Get your report", desc: "Receive a digital coverage and health report right after the operation." },
]

export default function DroneServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Drone Services"
          title="Precision from the sky, on demand"
          description="Book certified drone pilots for spraying and field mapping that slashes input costs, saves time and keeps farmers safe from harmful chemicals."
        >
          <Button size="lg">Book a drone</Button>
          <Button size="lg" variant="outline">
            Become a pilot partner
          </Button>
        </PageHero>

        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/drone-services.png"
                alt="Agricultural drone spraying a crop field"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Modern spraying without the guesswork
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Our drones apply exactly the right amount, exactly where it is
                needed. That means healthier crops, lower costs, and no more hours
                spent walking fields with a heavy manual sprayer.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-6">
                {outcomes.map((o) => {
                  const Icon = o.icon
                  return (
                    <div key={o.label}>
                      <Icon className="size-5 text-primary" />
                      <dt className="mt-2 font-serif text-2xl font-semibold text-foreground">
                        {o.value}
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {o.label}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Services on offer
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Everything you need to manage your crop from above.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {services.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
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
              Book in three simple steps
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.step}>
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
