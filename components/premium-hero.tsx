"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Cloud, Droplets, Leaf, MapPin, Zap, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function PremiumHero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const floatingCards = [
    {
      id: "weather",
      icon: Cloud,
      label: "Weather Intelligence",
      value: "28°C",
      subtitle: "Optimal Conditions",
      position: { top: "15%", left: "8%" },
      color: "from-blue-400 to-cyan-400",
      delay: 0,
    },
    {
      id: "crop",
      icon: Leaf,
      label: "AI Crop Doctor",
      value: "98%",
      subtitle: "Crop Health",
      position: { top: "25%", right: "10%" },
      color: "from-green-400 to-emerald-400",
      delay: 0.2,
    },
    {
      id: "drone",
      icon: Droplets,
      label: "Drone Booking",
      value: "3",
      subtitle: "Available Today",
      position: { bottom: "20%", left: "12%" },
      color: "from-purple-400 to-pink-400",
      delay: 0.4,
    },
    {
      id: "machinery",
      icon: Zap,
      label: "Machinery Booking",
      value: "12",
      subtitle: "Within 5km",
      position: { bottom: "25%", right: "8%" },
      color: "from-yellow-400 to-orange-400",
      delay: 0.6,
    },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-yellow-50 pt-20">
      {/* Animated background elements */}
      <motion.div
        className="absolute -right-32 -top-32 size-96 rounded-full bg-gradient-to-br from-emerald-100/40 to-transparent blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-32 top-1/2 size-96 rounded-full bg-gradient-to-br from-yellow-100/40 to-transparent blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div>
              <motion.p
                className="mb-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                AI Powered Agriculture Super Platform
              </motion.p>
            </div>

            <motion.h1
              className="text-5xl font-bold leading-tight text-foreground lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              India&apos;s
              <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Smart Farming Future
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-foreground/70"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              One platform for Farmers, Machinery Owners, Drone Operators, Dealers, Enterprises and Government Services.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {["AI Powered", "GPS Enabled", "Secure Payments", "Government Ready"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  {badge}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                Launch Platform
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline">
                Book Machinery
              </Button>
              <Button size="lg" variant="outline">
                Book Drone
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Hero image and floating cards */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Hero drone image */}
            <div className="relative size-full max-w-md">
              <motion.div
                className="relative size-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/rythu360-hero.png"
                  alt="Premium Agriculture Drone"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Floating cards */}
            {floatingCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.id}
                  className="absolute rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md"
                  style={{
                    top: card.position.top,
                    right: card.position.right,
                    bottom: card.position.bottom,
                    left: card.position.left,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: card.delay + 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}>
                      <Icon className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/70">{card.label}</p>
                      <p className="text-lg font-bold text-foreground">{card.value}</p>
                      <p className="text-xs text-foreground/60">{card.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Live statistics */}
        <motion.div
          className="mt-20 grid gap-8 border-t border-emerald-200 pt-12 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "2,000+", label: "Registered Farmers" },
            { value: "250+", label: "Machinery Operators" },
            { value: "100+", label: "Drone Operators" },
            { value: "10,000+", label: "Bookings Completed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-emerald-600">{stat.value}</p>
              <p className="mt-2 text-sm text-foreground/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
