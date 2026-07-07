'use client';

import { ArrowRight, Sprout, Zap, TrendingUp, Smartphone, Droplets, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SunriseHeroBackground } from "@/components/backgrounds/sunrise-hero"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-32 pb-20">
      {/* Sunrise over Indian farms theme */}
      <SunriseHeroBackground />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8 page-transition">
            {/* Premium announcement badge */}
            <div className="inline-flex w-fit">
              <div className="group glass-glow-green">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm font-medium text-white">
                  Trusted by 10,000+ farmers across 500+ villages
                </span>
              </div>
            </div>

            {/* Premium headline with Sunrise theme */}
            <div className="space-y-6">
              <h1 className="text-balance font-serif text-5xl font-bold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Empowering Every Farmer{" "}
                <span className="text-gradient-primary">
                  with Technology
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-slate-300 sm:text-xl max-w-2xl">
                AI-powered crop advisory, machinery booking, drone spraying, marketplace, weather intelligence and digital agriculture—all in one intelligent platform. Built for the future of farming.
              </p>
            </div>

            {/* Premium CTA Buttons with new colors */}
            <div className="flex flex-col gap-4 sm:flex-row pt-2">
              <Button 
                size="lg" 
                className="btn-primary gap-2 px-8 py-6 text-base font-semibold"
              >
                Book Machinery
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                size="lg" 
                className="btn-secondary gap-2 px-8 py-6 text-base font-semibold"
              >
                <TrendingUp className="size-5" />
                Watch Demo
              </Button>
            </div>

            {/* Premium statistics row with glassmorphism */}
            <div className="grid grid-cols-2 gap-6 pt-8 max-w-md">
              <div className="glass-subtle p-4 rounded-xl">
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-xs text-slate-400 mt-1">Farmers Registered</div>
              </div>
              <div className="glass-subtle p-4 rounded-xl">
                <div className="text-3xl font-bold text-emerald-400">500+</div>
                <div className="text-xs text-slate-400 mt-1">Villages Connected</div>
              </div>
              <div className="glass-subtle p-4 rounded-xl">
                <div className="text-3xl font-bold text-white">250+</div>
                <div className="text-xs text-slate-400 mt-1">Machines Available</div>
              </div>
              <div className="glass-subtle p-4 rounded-xl">
                <div className="text-3xl font-bold text-amber-400">100+</div>
                <div className="text-xs text-slate-400 mt-1">Drone Operators</div>
              </div>
            </div>
          </div>

          {/* Right side - Floating dashboard cards with Sunrise theme */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            {/* Floating card 1 - Crop Advisory (top) */}
            <div className="absolute top-0 left-4 w-56 card-hover-lift transform -rotate-2 hover:rotate-0 float-animation slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center">
                  <Sprout className="size-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Crop Advisory</div>
                  <div className="text-xs text-emerald-400">AI Powered</div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Real-time insights for crop health monitoring</p>
            </div>

            {/* Floating card 2 - Machinery Booking (middle right) */}
            <div className="absolute top-1/3 right-4 w-56 card-hover-lift transform rotate-2 hover:rotate-0 float-animation-delayed slide-in-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center">
                  <Gauge className="size-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Machinery Booking</div>
                  <div className="text-xs text-cyan-400">Instant Access</div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Book tractors and equipment within minutes</p>
            </div>

            {/* Floating card 3 - Weather & Drone (bottom) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-56 card-hover-lift float-animation slide-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-600/20 flex items-center justify-center">
                  <Droplets className="size-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Drone Spraying</div>
                  <div className="text-xs text-amber-400">Real-time Tracking</div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Automated drone services for crop protection</p>
            </div>

            {/* Center glowing orb - Sunrise theme */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-600/20 to-amber-500/10 blur-3xl glow-animation" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
