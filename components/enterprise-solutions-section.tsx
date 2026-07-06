"use client"

import { Building2, BarChart3, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const solutions = [
  {
    icon: <Building2 className="size-6" />,
    title: "Agribusiness Companies",
    description: "B2B procurement and supply chain optimization",
    features: ["Supply chain visibility", "Batch ordering", "Custom pricing"],
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: "Government Programs",
    description: "Agricultural extension and subsidy management",
    features: ["Program tracking", "Farmer onboarding", "Analytics & reporting"],
  },
  {
    icon: <Users className="size-6" />,
    title: "Financial Institutions",
    description: "Farmer credit scoring and loan origination",
    features: ["Risk assessment", "Digital KYC", "Payment tracking"],
  },
  {
    icon: <Zap className="size-6" />,
    title: "FMCG & Retail",
    description: "Direct sourcing and quality assurance",
    features: ["Direct sourcing", "Quality control", "Traceability"],
  },
]

export function EnterpriseSolutionsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/3 top-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Enterprise Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Purpose-built solutions for businesses working with farmers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 hover:-translate-y-1 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative space-y-4">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary transition-all duration-300 group-hover:scale-110">
                  {solution.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-lg">{solution.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{solution.description}</p>
                </div>

                <ul className="space-y-2 border-t border-white/20 pt-4 dark:border-white/10">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
            Contact Enterprise Team
          </Button>
        </div>
      </div>
    </section>
  )
}
