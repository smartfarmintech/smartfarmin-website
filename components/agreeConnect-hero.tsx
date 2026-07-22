"use client"

import Image from "next/image"
import { ArrowRight, Sprout, Leaf, Cloud, MapPin, Zap, Droplets, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface GlassCard {
  id: string
  icon: React.ReactNode
  label: string
  value?: string
  detail: string
  delay: number
  position: {
    top?: string
    right?: string
    left?: string
    bottom?: string
  }
}

function AnimatedStatistics() {
  const [counts, setCounts] = useState({
    farmers: 0,
    operators: 0,
    services: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    const targets = { farmers: 10000, operators: 300, services: 2500, satisfaction: 95 }
    let animationFrameId: NodeJS.Timeout

    const animate = () => {
      setCounts((prev) => ({
        farmers: Math.min(prev.farmers + 200, targets.farmers),
        operators: Math.min(prev.operators + 6, targets.operators),
        services: Math.min(prev.services + 50, targets.services),
        satisfaction: Math.min(prev.satisfaction + 1.9, targets.satisfaction),
      }))
    }

    animationFrameId = setInterval(animate, 50)
    return () => clearInterval(animationFrameId)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {[
        { value: Math.floor(counts.farmers).toLocaleString(), label: "Registered Farmers" },
        { value: Math.floor(counts.operators).toLocaleString(), label: "Verified Operators" },
        { value: Math.floor(counts.services).toLocaleString(), label: "Completed Services" },
        { value: `${Math.floor(counts.satisfaction)}%`, label: "Customer Satisfaction" },
        { value: "24×7", label: "Support" },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <dt className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</dt>
          <dd className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</dd>
        </motion.div>
      ))}
    </div>
  )
}

function FloatingGlassCards() {
  const cards: GlassCard[] = [
    {
      id: "crop-health",
      icon: <Leaf className="size-5 text-green-500" />,
      label: "Crop Health",
      value: "98%",
      detail: "Healthy",
      delay: 0,
      position: { top: "5%", left: "3%" },
    },
    {
      id: "drone-spraying",
      icon: <Droplets className="size-5 text-blue-500" />,
      label: "Drone Spraying",
      detail: "Available Today",
      delay: 0.1,
      position: { top: "15%", right: "5%" },
    },
    {
      id: "weather",
      icon: <Cloud className="size-5 text-cyan-500" />,
      label: "Weather",
      value: "27°C",
      detail: "Rain Tomorrow",
      delay: 0.2,
      position: { top: "60%", left: "2%" },
    },
    {
      id: "gps-tracking",
      icon: <MapPin className="size-5 text-red-500" />,
      label: "Live GPS Tracking",
      value: "En Route",
      detail: "Operator",
      delay: 0.3,
      position: { bottom: "10%", right: "4%" },
    },
    {
      id: "ai-doctor",
      icon: <Cpu className="size-5 text-purple-500" />,
      label: "AI Crop Doctor",
      value: "Healthy",
      detail: "Fertilizer in 5 Days",
      delay: 0.4,
      position: { bottom: "20%", left: "5%" },
    },
    {
      id: "machinery",
      icon: <Zap className="size-5 text-amber-500" />,
      label: "Machinery Nearby",
      value: "12 Available",
      detail: "Within 5 km",
      delay: 0.5,
      position: { top: "45%", right: "3%" },
    },
  ]

  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.5 }}
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
              y: [0, -12, 0],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{
              duration: 5 + card.delay * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="group"
          >
            <div className="relative w-48 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-3 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  {card.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wide">
                    {card.label}
                  </p>
                  {card.value && (
                    <p className="mt-0.5 text-base font-bold text-white">
                      {card.value}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-white/80">
                    {card.detail}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

function TrustRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
    >
      {[
        "Trusted by 10,000+ Farmers",
        "300+ Verified Operators",
        "AI Crop Advisory",
        "Secure Digital Booking",
        "24×7 Customer Support",
      ].map((item, idx) => (
        <div key={item} className="flex items-center gap-2">
          <svg className="size-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{item}</span>
        </div>
      ))}
    </motion.div>
  )
}

export function AgreeConnectHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 size-80 rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 size-96 rounded-full bg-green-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-32 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <Sprout className="size-4" />
                India&apos;s AI-Powered Agriculture Super App
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-8 text-balance font-serif text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-5xl"
            >
              Empowering Farmers with{" "}
              <motion.span
                className="relative inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  background: "linear-gradient(90deg, #22c55e, #10b981, #22c55e)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Technology
              </motion.span>
            </motion.h1>

            {/* Supporting Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 text-2xl font-semibold text-foreground/80 sm:text-3xl"
            >
              Everything a Farmer Needs.
              <br />
              <span className="text-primary">One Smart Platform.</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              AgreeConnect is your trusted farming companion. Book tractors and agricultural machinery, schedule drone spraying, hire farm labour, detect crop diseases with AI, receive weather alerts, access government schemes, connect with agricultural experts, and manage your farm—all from one easy-to-use application.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 space-y-3 text-lg font-medium text-muted-foreground"
            >
              <p>✓ Save time.</p>
              <p>✓ Reduce farming costs.</p>
              <p>✓ Increase crop productivity.</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                  Start Farming Free
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Book Machinery
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                  Download App
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Row */}
            <div className="mt-12 hidden sm:block">
              <TrustRow />
            </div>
          </motion.div>

          {/* Right - Hero Image with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            {/* Hero Image */}
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative size-full overflow-hidden rounded-3xl border border-border shadow-2xl"
            >
              <Image
                src="/images/agreeConnect-hero.png"
                alt="Agricultural drone spraying over lush paddy fields with farmer using AgreeConnect app"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Glass Cards */}
            <FloatingGlassCards />

            {/* Bottom Card - Features Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 left-4 right-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:flex sm:left-auto sm:right-auto sm:w-72 sm:flex-col gap-3"
            >
              <h3 className="font-semibold text-foreground">What You Get:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Machinery Booking
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  AI Crop Doctor
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Drone Services
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-border"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Trusted by Farmers Across India
            </h3>
            <p className="mt-3 text-muted-foreground">
              Real numbers from real farmers using AgreeConnect today
            </p>
          </div>
          <AnimatedStatistics />
        </motion.div>
      </div>
    </section>
  )
}
