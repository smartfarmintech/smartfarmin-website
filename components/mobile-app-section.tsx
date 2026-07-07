"use client"

import { Smartphone, Download, Apple, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Works offline with full functionality",
  "Available in 12 regional languages",
  "Low data consumption - 2G compatible",
  "Optimized for budget Android devices",
  "Daily notifications and alerts",
  "Voice-enabled advisory in your language",
]

export function MobileAppSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex w-fit">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2">
                <Smartphone className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Mobile App</span>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Farming at Your Fingertips
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-xl">
                Download our app and access all SmartFarmin features on any device, even without internet connection
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
                <Apple className="size-5" />
                App Store
              </Button>
              <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base font-semibold border-primary/20 hover:bg-primary/5">
                <Play className="size-5" />
                Play Store
              </Button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/20 bg-white/30 dark:border-white/10 dark:bg-black/20">
              <Download className="size-5 text-primary shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">25 MB</p>
                <p className="text-xs text-muted-foreground">Available in 18 languages</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:flex items-center justify-center h-96">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-white/40 dark:border-white/10 backdrop-blur-xl" />
            
            <div className="relative flex items-center justify-center gap-4">
              {/* Phone mockups */}
              <div className="w-32 h-56 rounded-3xl border-8 border-foreground/10 bg-gradient-to-br from-white/40 to-white/20 dark:from-black/40 dark:to-black/20 backdrop-blur-xl shadow-2xl transform -rotate-12">
                <div className="w-full h-full rounded-2xl bg-gradient-to-b from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-3xl">📱</div>
                </div>
              </div>

              <div className="w-32 h-56 rounded-3xl border-8 border-foreground/10 bg-gradient-to-br from-white/40 to-white/20 dark:from-black/40 dark:to-black/20 backdrop-blur-xl shadow-2xl transform rotate-12">
                <div className="w-full h-full rounded-2xl bg-gradient-to-b from-accent/20 to-primary/20 flex items-center justify-center">
                  <div className="text-3xl">🌾</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
