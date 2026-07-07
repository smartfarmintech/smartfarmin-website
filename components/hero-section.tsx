'use client';

import Image from "next/image"
import { ArrowRight, Download, Play, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-24 pb-20 sm:pb-32">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8 z-10">
            {/* Trust badge */}
            <div className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-white">
                Trusted by 50,000+ farmers
              </span>
            </div>

            {/* Premium headline */}
            <div className="space-y-6">
              <h1 className="text-balance font-sans text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                India's AI-Powered{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Agriculture Super Platform
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-xl">
                Smart crop advisory, machinery on-demand, drone services, direct marketplace, and weather-driven farming intelligence. Everything a farmer needs to increase yields and income.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="btn-primary gap-2 px-6 sm:px-8 py-6 text-base font-semibold rounded-xl"
              >
                Book Machinery
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="btn-secondary gap-2 px-6 sm:px-8 py-6 text-base font-semibold rounded-xl border border-white/20"
              >
                <Play className="size-4 fill-white" />
                Watch Demo
              </Button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">50K+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Farmers Active</div>
              </div>
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">₹500Cr</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Value Transacted</div>
              </div>
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">1000+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Machines Available</div>
              </div>
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-2xl sm:text-3xl font-bold text-teal-400">200+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">Drone Operators</div>
              </div>
            </div>
          </div>

          {/* Right side - Image showcase */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:block">
            {/* Main drone image */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden group">
              <Image
                src="/images/hero-drone-spray.png"
                alt="Drone spraying agricultural field"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent" />
            </div>

            {/* Floating feature cards */}
            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="size-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">Real-time AI Crop Doctor</div>
                  <div className="text-xs text-slate-400">Disease detection & treatment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile image */}
        <div className="relative h-96 sm:h-[450px] lg:hidden rounded-2xl overflow-hidden mt-12 group">
          <Image
            src="/images/hero-drone-spray.png"
            alt="Drone spraying agricultural field"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}
