import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const points = [
  "Real-time crop health from satellite and on-ground sensors",
  "Personalised advice in 12 regional languages",
  "Direct market access with transparent pricing",
  "Access to credit, insurance and subsidies",
]

export function SolutionsSection() {
  return (
    <section id="solutions" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/images/farmer.png"
                alt="Farmer using the Akanksha AgreeTech app in the field"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Solutions
            </span>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Technology that speaks the language of the farm
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              We built Akanksha AgreeTech with farmers, not just for them. Every feature
              is designed to work on any phone, in any village, in the language you
              think in.
            </p>
            <ul className="mt-8 space-y-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground/90">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
