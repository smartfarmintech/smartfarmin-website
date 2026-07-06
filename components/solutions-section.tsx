import { CheckCircle2, Smartphone, Zap, Globe, Shield } from "lucide-react"

const solutions = [
  {
    title: "Akanksha AI",
    description: "AI-powered crop advisory with real-time disease detection",
    icon: <Zap className="size-6" />,
    features: ["Personalized in 12 languages", "Real-time crop monitoring", "Weather-based alerts"],
  },
  {
    title: "Machinery Rental",
    description: "Access quality equipment without expensive ownership",
    icon: <Smartphone className="size-6" />,
    features: ["50% cost savings", "On-demand booking", "Professional operators"],
  },
  {
    title: "Smart Marketplace",
    description: "Direct connection to buyers with fair prices",
    icon: <Globe className="size-6" />,
    features: ["Transparent pricing", "Zero middlemen", "Better margins"],
  },
  {
    title: "Farmer Protection",
    description: "Insurance, credit access, and subsidy information",
    icon: <Shield className="size-6" />,
    features: ["Crop insurance", "Easy credit", "Subsidy guidance"],
  },
]

export function SolutionsSection() {
  return (
    <section id="solutions" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Our Solutions
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Complete Platform for Modern Farming
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Four powerful solutions built for Indian farmers, operating seamlessly on any device, in any village
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 hover:-translate-y-1 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50"
            >
              {/* Corner glow */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative space-y-4">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary transition-all duration-300 group-hover:scale-110">
                  {solution.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-lg">{solution.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{solution.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 border-t border-white/20 pt-4 dark:border-white/10">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
