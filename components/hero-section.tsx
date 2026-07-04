import Image from "next/image"
import { ArrowRight, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sprout className="size-3.5 text-primary" />
              Trusted by 2,50,000+ farmers across India
            </span>
            <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Smart farming for a{" "}
              <span className="text-primary">growing India</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              SmartFarmin brings AI advisory, drone services, a fair marketplace
              and an organic store together on one platform, so every farmer can
              grow more while spending less.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="gap-2">
                Start growing
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline">
                Explore solutions
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { value: "2.5L+", label: "Active farmers" },
                { value: "18 states", label: "Coverage" },
                { value: "30%", label: "Avg. yield lift" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-2xl font-semibold text-foreground">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/images/hero-farm.png"
                alt="Aerial view of lush Indian farmland at golden hour"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sprout className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Akanksha AI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wheat: Irrigate in 2 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
