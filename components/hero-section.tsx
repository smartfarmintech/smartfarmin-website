"use client"

import Image from "next/image"
import { ArrowRight, Sprout, Droplets, Cloud, MapPin, Cpu, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface FloatingCard {
  id: string
  icon: React.ReactNode
  title: string
  value?: string
  description: string
  delay: number
  position: {
    top: string
    right?: string
    left?: string
  }
}

function FloatingCards() {
  const cards: FloatingCard[] = [
    {
      id: "crop-health",
      icon: <Leaf className="size-5 text-primary" />,
      title: "Crop Health",
      value: "98%",
      description: "Healthy",
      delay: 0,
      position: { top: "10%", left: "5%" },
    },
    {
      id: "drone-spray",
      icon: <Droplets className="size-5 text-blue-500" />,
      title: "Drone Spraying",
      description: "Available Today",
      delay: 0.2,
      position: { top: "20%", right: "8%" },
    },
    {
      id: "weather",
      icon: <Cloud className="size-5 text-cyan-500" />,
      title: "Weather",
      value: "27°C",
      description: "Light Rain Tomorrow",
      delay: 0.4,
      position: { top: "65%", left: "3%" },
    },
    {
      id: "gps-tracking",
      icon: <MapPin className="size-5 text-red-500" />,
      title: "GPS Tracking",
      value: "Live",
      description: "",
      delay: 0.6,
      position: { bottom: "15%", right: "5%" },
    },
    {
      id: "ai-recommendation",
      icon: <Cpu className="size-5 text-purple-500" />,
      title: "AI Recommendation",
      value: "Crop Healthy",
      description: "Apply Fertilizer in 5 Days",
      delay: 0.8,
      position: { bottom: "20%", left: "8%" },
    },
  ]

  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.6, ease: "easeOut" }}
          className="absolute hidden lg:block"
          style={{
            top: card.position.top,
            right: card.position.right,
            left: card.position.left,
            bottom: card.position.bottom,
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4 + card.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <div className="relative w-56 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wide">
                    {card.title}
                  </p>
                  {card.value && (
                    <p className="mt-1 text-lg font-bold text-white">
                      {card.value}
                    </p>
                  )}
                  {card.description && (
                    <p className="mt-1 text-sm text-white/80">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

function AnimatedStats() {
  const [counts, setCounts] = useState({
    farmers: 0,
    states: 0,
    yield: 0,
  })

  useEffect(() => {
    const targets = { farmers: 250000, states: 18, yield: 30 }
    let animationFrameId: number

    const animate = () => {
      setCounts((prev) => ({
        farmers: Math.min(prev.farmers + 5000, targets.farmers),
        states: Math.min(prev.states + 0.5, targets.states),
        yield: Math.min(prev.yield + 1, targets.yield),
      }))

      if (
        counts.farmers < targets.farmers ||
        counts.states < targets.states ||
        counts.yield < targets.yield
      ) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [counts])

  return (
    <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
      {[
        { value: Math.floor(counts.farmers / 1000).toLocaleString(), label: "K+ Active farmers", suffix: "" },
        { value: Math.floor(counts.states), label: "States coverage", suffix: "" },
        { value: Math.floor(counts.yield), label: "% Avg. yield lift", suffix: "" },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <dt className="font-serif text-2xl font-semibold text-foreground">
            {stat.value}{stat.suffix}
          </dt>
          <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
        </motion.div>
      ))}
    </dl>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Sprout className="size-3.5 text-primary" />
              Trusted by 2,50,000+ farmers across India
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Smart farming for a{" "}
              <span className="text-primary">growing India</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              SmartFarmin brings AI advisory, drone services, a fair marketplace
              and an organic store together on one platform, so every farmer can
              grow more while spending less.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  Start growing
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline">
                  Explore solutions
                </Button>
              </motion.div>
            </motion.div>

            <AnimatedStats />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-2xl"
            >
              <Image
                src="/images/drone-hero.png"
                alt="Modern white agricultural drone spraying crops over paddy fields in Andhra Pradesh"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </motion.div>

            {/* Floating Cards */}
            <FloatingCards />

            {/* AI Card - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-5 -left-4 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-lg sm:block"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sprout className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Akanksha AI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wheat: Irrigate in 2 days
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
