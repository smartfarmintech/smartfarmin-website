"use client"

import { TrendingUp, Zap, Target, BarChart3 } from "lucide-react"

interface Statistic {
  icon: React.ReactNode
  number: string
  title: string
  description: string
  color: string
}

const statistics: Statistic[] = [
  {
    icon: <TrendingUp className="size-6" />,
    number: "30%",
    title: "Average Yield Increase",
    description: "Farmers see significant improvements in crop productivity using our AI advisory",
    color: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    icon: <Zap className="size-6" />,
    number: "₹25,000",
    title: "Avg Savings Per Season",
    description: "Reduce expenses through optimized resource management and smart machinery rental",
    color: "from-amber-500/20 to-amber-500/0",
  },
  {
    icon: <Target className="size-6" />,
    number: "95%",
    title: "Fair Price Guarantee",
    description: "Direct marketplace connection ensures competitive pricing for all produce types",
    color: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: <BarChart3 className="size-6" />,
    number: "₹500Cr",
    title: "Value Created",
    description: "Total value generated for farmer communities across India since inception",
    color: "from-primary/20 to-primary/0",
  },
]

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,.05)_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,.02)_50%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Company Statistics
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real impact on real farmers. These numbers represent our commitment to agricultural transformation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 hover:-translate-y-1 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50"
            >
              {/* Gradient background */}
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-b ${stat.color} blur-3xl transition-all duration-300 group-hover:scale-110`} />

              {/* Content */}
              <div className="relative space-y-4">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-accent/30">
                  {stat.icon}
                </div>

                <div className="space-y-2">
                  <p className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                    {stat.number}
                  </p>
                  <h3 className="font-semibold text-foreground text-base">
                    {stat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
