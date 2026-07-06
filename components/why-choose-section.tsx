"use client"

import { CheckCircle2, Shield, Zap, Globe, BarChart3, Users } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <CheckCircle2 className="size-6" />,
    title: "Proven Results",
    description: "Documented 30% yield increase and ₹25,000+ seasonal savings for farmers",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Data Security",
    description: "Bank-level encryption protects your farm data and financial information",
  },
  {
    icon: <Zap className="size-6" />,
    title: "24/7 Support",
    description: "Multilingual expert support available whenever you need assistance",
  },
  {
    icon: <Globe className="size-6" />,
    title: "Offline First",
    description: "Full functionality works without internet connection or mobile data",
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: "Smart Analytics",
    description: "Track yield, costs, profits, and trends with detailed farm insights",
  },
  {
    icon: <Users className="size-6" />,
    title: "Farmer Community",
    description: "Learn from 250K+ farmers and share successful farming practices",
  },
]

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Why Choose SmartFarmin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Technology, expertise, and farmer-first design combined to deliver real results
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 hover:-translate-y-1 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50"
            >
              {/* Gradient accent */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative space-y-3">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground text-base">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
