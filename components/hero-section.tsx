import { ArrowRight, Sprout, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-32">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl animate-pulse duration-7000" />
        <div className="absolute -left-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-t from-accent/20 to-transparent blur-3xl animate-pulse duration-5000 delay-1000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Announcement badge */}
            <div className="inline-flex w-fit">
              <div className="group flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 dark:hover:bg-black/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Trusted by farmers across India
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-balance font-serif text-5xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Smart Farming,{" "}
                <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Better Harvest
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-xl">
                AI-powered crop advisory, machinery rentals, fair marketplace access, and real-time farming insights—all in one platform
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
                Get Started Free
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 py-6 text-base font-semibold border-primary/20 hover:bg-primary/5"
              >
                <TrendingUp className="size-5" />
                View Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">250K+</span> farmers active
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/10">
                <Zap className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">30% avg yield increase</span>
              </div>
            </div>
          </div>

          {/* Right illustration area */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/10 backdrop-blur-xl" />
            
            {/* Floating cards illustration */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Card 1 - Top Left */}
              <div className="absolute top-12 left-8 w-48 p-6 rounded-2xl bg-card border border-border/70 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Sprout className="size-5 text-green-600" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">Crop Advisory</div>
                </div>
                <p className="text-xs text-muted-foreground">Real-time AI insights for better decisions</p>
              </div>

              {/* Card 2 - Bottom Right */}
              <div className="absolute bottom-12 right-8 w-48 p-6 rounded-2xl bg-card border border-border/70 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="size-5 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">Market Prices</div>
                </div>
                <p className="text-xs text-muted-foreground">Fair pricing across all produce types</p>
              </div>

              {/* Center accent */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 py-12 border-t border-primary/10 sm:gap-12">
          {[
            { value: "250K+", label: "Active Farmers" },
            { value: "18+", label: "States Covered" },
            { value: "₹500Cr+", label: "Value Created" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group">
              <dt className="font-serif text-3xl font-bold text-foreground sm:text-4xl group-hover:text-primary transition-colors">
                {stat.value}
              </dt>
              <dd className="text-xs text-muted-foreground sm:text-sm font-medium">
                {stat.label}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
