import { ArrowRight, Sprout, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-32">
      {/* Premium animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        {/* Premium gradient orbs */}
        <div className="absolute -right-1/3 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-b from-green-600/20 to-transparent blur-3xl opacity-30" />
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-green-500/15 to-transparent blur-3xl opacity-20" />
        <div className="absolute -bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-green-600/10 to-transparent blur-3xl opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8 page-transition">
            {/* Premium announcement badge */}
            <div className="inline-flex w-fit">
              <div className="group flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-500/40 px-4 py-2 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-sm font-medium text-white">
                  Trusted by 250K+ farmers
                </span>
              </div>
            </div>

            {/* Premium headline */}
            <div className="space-y-6">
              <h1 className="text-balance font-serif text-5xl font-bold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl">
                India's Most Premium{" "}
                <span className="text-gradient">
                  AgriTech Platform
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-white/70 sm:text-xl max-w-xl">
                AI-powered crop advisory, machinery rentals, fair marketplace access, and real-time farming insights—all in one billion-dollar startup experience.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row pt-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 gap-2 px-8 py-6 text-base font-semibold text-white border-0 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-green-600/30"
              >
                Get Started Free
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 py-6 text-base font-semibold border-white/15 text-white hover:bg-white/10 transition-all"
              >
                <TrendingUp className="size-5" />
                View Demo
              </Button>
            </div>

            {/* Premium trust indicators */}
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-white/10"
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  <span className="font-semibold text-white">250K+</span> active farmers
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-green-500/20">
                <Zap className="size-4 text-green-400" />
                <span className="text-sm font-medium text-white">30% avg yield increase</span>
              </div>
            </div>
          </div>

          {/* Right illustration area - Premium cards */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            {/* Premium gradient background */}
            <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10" />
            
            {/* Floating premium cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Card 1 - Top Left - Premium Crop Advisory */}
              <div className="absolute top-12 left-8 w-48 slide-in-left bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300 border-green-500/30 hover:border-green-500/60 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center">
                    <Sprout className="size-5 text-green-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">Crop Advisory</div>
                </div>
                <p className="text-xs text-white/60">Real-time AI insights for better decisions</p>
              </div>

              {/* Card 2 - Bottom Right - Premium Market Prices */}
              <div className="absolute bottom-12 right-8 w-48 slide-in-left bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-300 border-green-500/30 hover:border-green-500/60 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center">
                    <TrendingUp className="size-5 text-green-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">Market Prices</div>
                </div>
                <p className="text-xs text-white/60">Fair pricing across all produce types</p>
              </div>

              {/* Center premium glow */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-600/25 to-green-500/15 blur-3xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Premium stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 py-12 border-t border-white/5 sm:gap-12">
          {[
            { value: "250K+", label: "Active Farmers" },
            { value: "18+", label: "States Covered" },
            { value: "₹500Cr+", label: "Value Created" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group hover-lift">
              <dt className="font-serif text-3xl font-bold text-white sm:text-4xl group-hover:text-green-400 transition-colors duration-300">
                {stat.value}
              </dt>
              <dd className="text-xs text-white/60 sm:text-sm font-medium">
                {stat.label}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
