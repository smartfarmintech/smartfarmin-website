"use client"

import { Wrench, MapPin, CreditCard, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MachineryFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: MachineryFeature[] = [
  {
    icon: <Wrench className="size-6" />,
    title: "Complete Equipment Range",
    description: "Tractors, harvesters, sprayers, and more available for hourly or daily rental",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Location-Based Booking",
    description: "Find available machinery near your farm with real-time GPS tracking",
  },
  {
    icon: <CreditCard className="size-6" />,
    title: "Transparent Pricing",
    description: "No hidden charges. Pay only for what you use with instant invoicing",
  },
  {
    icon: <Truck className="size-6" />,
    title: "Free Delivery & Support",
    description: "Free delivery and on-site operator support for major equipment",
  },
]

export function MachineryBookingSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-white/50 px-4 py-2 backdrop-blur-xl dark:bg-black/30">
                <span className="text-sm font-medium text-foreground">Machinery Booking</span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Equipment On Demand
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-xl">
                Rent modern farm equipment without capital investment or maintenance burden. Save 50% on equipment costs.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="group flex gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/40 dark:hover:bg-black/20">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold mt-4">
              Browse Machinery
              <ArrowRight className="size-5" />
            </Button>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-white/40 dark:border-white/10 backdrop-blur-xl" />
            
            {/* Feature cards illustration */}
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Card 1 - Tractor */}
              <div className="absolute top-12 left-8 w-40 p-6 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-4xl mb-2">🚜</div>
                <div className="text-sm font-semibold text-foreground">Tractor</div>
                <div className="text-xs text-muted-foreground mt-1">₹500/hour</div>
              </div>

              {/* Card 2 - Harvester */}
              <div className="absolute bottom-12 right-8 w-40 p-6 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-4xl mb-2">🌾</div>
                <div className="text-sm font-semibold text-foreground">Harvester</div>
                <div className="text-xs text-muted-foreground mt-1">₹2,000/day</div>
              </div>

              {/* Center accent */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
