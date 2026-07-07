"use client"

import { Brain, Leaf, Droplet, AlertCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: AiFeature[] = [
  {
    icon: <Leaf className="size-6" />,
    title: "Soil Analysis",
    description: "Real-time soil health monitoring and AI recommendations",
  },
  {
    icon: <Droplet className="size-6" />,
    title: "Smart Irrigation",
    description: "AI-optimized watering schedules based on weather patterns",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "Disease Detection",
    description: "Early pest identification using crop images and satellite data",
  },
  {
    icon: <Brain className="size-6" />,
    title: "Yield Prediction",
    description: "Forecast harvest yields and optimize farming strategies",
  },
]

export function AiCropDoctorSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-white/40 dark:border-white/10 backdrop-blur-xl" />
            
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* AI visualization cards */}
              <div className="absolute top-8 left-4 w-32 p-4 rounded-2xl bg-card border border-border/70 shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-xs font-semibold text-foreground">Soil Health</div>
                <div className="text-[10px] text-muted-foreground mt-1">pH: 7.2</div>
              </div>

              <div className="absolute bottom-8 right-4 w-32 p-4 rounded-2xl bg-card border border-border/70 shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="text-2xl mb-2">💧</div>
                <div className="text-xs font-semibold text-foreground">Irrigation</div>
                <div className="text-[10px] text-muted-foreground mt-1">2L/sqm</div>
              </div>

              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-2xl animate-pulse" />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex w-fit">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Akanksha AI</span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Your Personal AI Crop Doctor
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-xl">
                Advanced machine learning analyzes soil, weather, satellite imagery, and your farm to provide personalized recommendations that increase yield by 30%+
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature, idx) => (
                <div key={idx} className="group rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 text-primary transition-all duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
              Try AI Advisory Free
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
