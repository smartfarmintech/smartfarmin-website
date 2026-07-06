"use client"

import { Store, TrendingUp, Users, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: <TrendingUp className="size-6" />, title: "Fair Price Discovery", description: "Real-time market prices and direct buyer connections" },
  { icon: <Users className="size-6" />, title: "Direct Buyers", description: "Connect with bulk buyers and retailers directly" },
  { icon: <ShieldCheck className="size-6" />, title: "Quality Assurance", description: "Standardized grading ensures premium pricing" },
  { icon: <Store className="size-6" />, title: "Organic Store", description: "Sell certified organic produce to consumers" },
]

export function MarketplaceSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-white/50 px-4 py-2 backdrop-blur-xl dark:bg-black/30">
                <Store className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Smart Marketplace</span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Direct to Market
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-xl">
                Sell produce at fair prices directly to verified buyers. No middlemen, no delays, only transparency and better margins for you.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <div key={i} className="group rounded-2xl border border-white/40 bg-white/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 text-primary transition-all duration-300 group-hover:scale-110">
                      {f.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">
                        {f.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
              Sell on Marketplace
              <ArrowRight className="size-5" />
            </Button>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-white/40 dark:border-white/10 backdrop-blur-xl" />
            
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Product cards illustration */}
              <div className="absolute top-12 left-8 w-40 p-6 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl mb-2">🍅</div>
                <div className="text-sm font-semibold text-foreground">Tomatoes</div>
                <div className="text-xs text-muted-foreground mt-2">₹40/kg → ₹35/kg</div>
                <div className="text-xs font-bold text-green-600 mt-1">+12% margin</div>
              </div>

              <div className="absolute bottom-12 right-8 w-40 p-6 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl mb-2">🌾</div>
                <div className="text-sm font-semibold text-foreground">Wheat</div>
                <div className="text-xs text-muted-foreground mt-2">₹2,200/100kg</div>
                <div className="text-xs font-bold text-green-600 mt-1">Real-time rates</div>
              </div>

              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
