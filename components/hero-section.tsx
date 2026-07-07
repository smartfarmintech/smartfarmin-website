'use client';

import { ArrowRight, Sprout, Zap, TrendingUp, Smartphone, Droplets, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedOrbs } from "@/components/illustrations/animated-orbs"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-32 pb-20">
      {/* Premium animated background */}
      <AnimatedOrbs />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8 page-transition">
            {/* Premium announcement badge */}
            <div className="inline-flex w-fit">
              <div className="group flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-500/40 px-4 py-2 transition-all duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-sm font-medium text-white">
                  Trusted by 10,000+ farmers
                </span>
              </div>
            </div>

            {/* New headline */}
            <div className="space-y-6">
              <h1 className="text-balance font-serif text-5xl font-bold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Empowering Every Farmer{" "}
                <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  with Technology
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-white/70 sm:text-xl max-w-2xl">
                AI-powered crop advisory, machinery booking, drone spraying, marketplace, weather intelligence and digital agriculture—all in one intelligent platform.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row pt-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 gap-2 px-8 py-6 text-base font-semibold text-white border-0 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-green-600/40"
              >
                Book Machinery
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 py-6 text-base font-semibold border-white/15 text-white hover:bg-white/10 transition-all"
              >
                <TrendingUp className="size-5" />
                Watch Demo
              </Button>
            </div>

            {/* Statistics row */}
            <div className="grid grid-cols-2 gap-6 pt-6 max-w-md">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-sm text-white/60">Farmers Registered</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-400">500+</div>
                <div className="text-sm text-white/60">Villages Connected</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">250+</div>
                <div className="text-sm text-white/60">Machines Available</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-400">100+</div>
                <div className="text-sm text-white/60">Drone Operators</div>
              </div>
            </div>
          </div>

          {/* Right side - Floating dashboard cards with animations */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            {/* Floating card 1 - Crop Advisory (top) */}
            <div className="absolute top-0 left-4 w-56 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300 hover:translate-y-[-8px] hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 float-animation slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center">
                  <Sprout className="size-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Crop Advisory</div>
                  <div className="text-xs text-green-400">AI Powered</div>
                </div>
              </div>
              <p className="text-xs text-white/60">Real-time insights for crop health monitoring</p>
            </div>

            {/* Floating card 2 - Machinery Booking (middle right) */}
            <div className="absolute top-1/3 right-4 w-56 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300 hover:translate-y-[-8px] hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 float-animation-delayed slide-in-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center">
                  <Gauge className="size-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Machinery Booking</div>
                  <div className="text-xs text-blue-400">Instant Access</div>
                </div>
              </div>
              <p className="text-xs text-white/60">Book tractors and equipment within minutes</p>
            </div>

            {/* Floating card 3 - Weather & Drone (bottom) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-56 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl hover:translate-y-[-8px] hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 float-animation slide-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500/30 to-orange-600/20 flex items-center justify-center">
                  <Droplets className="size-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Drone Spraying</div>
                  <div className="text-xs text-yellow-400">Real-time Tracking</div>
                </div>
              </div>
              <p className="text-xs text-white/60">Automated drone services for crop protection</p>
            </div>

            {/* Center glowing orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-600/20 to-green-500/10 blur-3xl glow-animation" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
