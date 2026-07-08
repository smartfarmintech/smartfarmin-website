'use client';

import Image from "next/image"
import { ArrowRight, Play, Zap, Smartphone, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-24 pb-20 sm:pb-32 bg-gradient-to-b from-cream-50 via-white to-soft-mint-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-40 left-10 w-72 h-72 bg-forest-green/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 right-10 w-96 h-96 bg-golden-yellow/3 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div 
            className="flex flex-col justify-center space-y-8 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust badge */}
            <div className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-forest-green/20 backdrop-blur-sm hover:bg-emerald-100 transition-all">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-forest-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-green" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-forest-green">
                Trusted by 2,000+ registered farmers
              </span>
            </div>

            {/* Premium headline */}
            <div className="space-y-6">
              <h1 className="text-balance font-sans text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                India&apos;s AI Powered{' '}
                <span className="bg-gradient-to-r from-forest-green via-leaf-green to-fresh-mint bg-clip-text text-transparent">
                  Agriculture Super Platform
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-gray-600 max-w-xl font-medium">
                One Platform for Farmers, Machinery Owners, Drone Operators, Dealers, Enterprises and Government Services.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="gap-2 px-8 py-6 text-base font-semibold rounded-2xl bg-forest-green hover:bg-leaf-green text-white shadow-lg hover:shadow-xl transition-all"
              >
                Launch Platform
                <ArrowRight className="size-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="gap-2 px-8 py-6 text-base font-semibold rounded-2xl border-2 border-forest-green text-forest-green hover:bg-forest-green/5"
              >
                <Play className="size-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <motion.div 
                className="p-4 rounded-2xl bg-white/60 border border-forest-green/10 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-forest-green">2,000+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Registered Farmers</div>
              </motion.div>
              <motion.div 
                className="p-4 rounded-2xl bg-white/60 border border-forest-green/10 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-leaf-green">250+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Machinery Operators</div>
              </motion.div>
              <motion.div 
                className="p-4 rounded-2xl bg-white/60 border border-forest-green/10 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-fresh-mint">100+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Drone Operators</div>
              </motion.div>
              <motion.div 
                className="p-4 rounded-2xl bg-white/60 border border-forest-green/10 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-golden-yellow">100+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Villages</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Animated drone illustration */}
          <motion.div 
            className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Main drone image */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <Image
                src="/images/hero-drone-spray.png"
                alt="Premium agriculture drone spraying farmland"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-forest-green/20 via-transparent to-transparent" />
            </div>

            {/* Floating feature cards - glass morphism */}
            <motion.div 
              className="absolute top-8 right-8 backdrop-blur-md bg-white/70 border border-white/40 rounded-3xl p-5 shadow-2xl max-w-xs"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-green to-leaf-green flex items-center justify-center flex-shrink-0">
                  <Zap className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">AI Crop Doctor</div>
                  <div className="text-xs text-gray-600">Disease Detection</div>
                </div>
              </div>
            </motion.div>

            {/* Machinery booking card */}
            <motion.div 
              className="absolute bottom-12 left-8 backdrop-blur-md bg-white/70 border border-white/40 rounded-3xl p-5 shadow-2xl max-w-xs"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fresh-mint to-sky-blue flex items-center justify-center flex-shrink-0">
                  <Smartphone className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Book Machinery</div>
                  <div className="text-xs text-gray-600">On-Demand Services</div>
                </div>
              </div>
            </motion.div>

            {/* Weather card */}
            <motion.div 
              className="absolute top-1/3 left-8 backdrop-blur-md bg-white/70 border border-white/40 rounded-3xl p-5 shadow-2xl max-w-xs"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-weather-blue to-sky-blue flex items-center justify-center flex-shrink-0">
                  <Cloud className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Weather Intel</div>
                  <div className="text-xs text-gray-600">Real-time Forecasts</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile image */}
        <motion.div 
          className="relative h-96 sm:h-[450px] lg:hidden rounded-3xl overflow-hidden mt-12 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Image
            src="/images/hero-drone-spray.png"
            alt="Premium agriculture drone"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-forest-green/30 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
