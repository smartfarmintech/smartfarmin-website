import { Landmark, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const segments = [
  {
    icon: Landmark,
    name: "Government",
    desc: "Scheme delivery, subsidy tracking and district-level crop analytics to power data-driven agricultural policy.",
    points: ["DBT & subsidy disbursal", "Crop & yield dashboards", "Disaster early warning"],
  },
  {
    icon: Building2,
    name: "Enterprise",
    desc: "Traceable, reliable sourcing and supply-chain visibility for agri-businesses, FPOs and food brands.",
    points: ["Farm-to-shelf traceability", "Contract farming tools", "Quality & compliance"],
  },
]

export function SegmentsSection() {
  return (
    <section id="segments" className="scroll-mt-20 bg-primary py-16 text-primary-foreground lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">
            For every stakeholder
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for governments and enterprises too
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {segments.map((seg) => {
            const Icon = seg.icon
            return (
              <div
                key={seg.name}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-8 backdrop-blur-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold">
                  {seg.name}
                </h3>
                <p className="mt-3 leading-relaxed text-primary-foreground/80">
                  {seg.desc}
                </p>
                <ul className="mt-6 space-y-2">
                  {seg.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm text-primary-foreground/90"
                    >
                      <span className="size-1.5 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="secondary"
                  className="mt-8 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Talk to our team
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
