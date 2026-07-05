import type { Metadata } from "next"
import Link from "next/link"
import { Heart, Rocket, MapPin, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Careers | SmartFarmin",
  description:
    "Help build the technology that puts more value in farmers' hands. Explore open roles at SmartFarmin.",
}

const perks = [
  {
    icon: Heart,
    title: "Meaningful impact",
    desc: "Your work directly improves the livelihoods of millions of farming families.",
  },
  {
    icon: Rocket,
    title: "Fast growth",
    desc: "Own big problems early and grow your scope as we scale across the country.",
  },
  {
    icon: MapPin,
    title: "Field + remote",
    desc: "Hybrid teams across Hyderabad, Bengaluru and on-ground in farming districts.",
  },
]

const openings = [
  { role: "Senior Frontend Engineer", team: "Product", location: "Hyderabad / Remote" },
  { role: "ML Engineer, Crop Intelligence", team: "Akanksha AI", location: "Bengaluru" },
  { role: "Field Operations Lead", team: "Drone Services", location: "Warangal" },
  { role: "Product Designer", team: "Design", location: "Remote (India)" },
  { role: "Agronomist", team: "Advisory", location: "Multiple districts" },
]

export default function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Careers"
          title="Grow something that matters"
          description="We're a team of engineers, agronomists and operators building tools that put farmers first. Come build with us."
        >
          <Button render={<Link href="#openings" />} nativeButton={false}>
            See open roles
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <perk.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {perk.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="openings" className="scroll-mt-20 border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl font-semibold text-foreground">Open positions</h2>
            <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {openings.map((job) => (
                <li key={job.role}>
                  <Link
                    href="/contact"
                    className="flex flex-col gap-2 p-5 transition-colors hover:bg-secondary sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-medium text-foreground">{job.role}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {job.team} · {job.location}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Apply <ArrowUpRight className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
