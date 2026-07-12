"use client"

import Image from "next/image"
import { ArrowRight, Sprout, Leaf, Cloud, MapPin, Zap, Droplets, Cpu, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// Animated number counter component
function CounterValue({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    const increment = Math.ceil(target / 50)

    interval = setInterval(() => {
      setCount((prev) => (prev + increment >= target ? target : prev + increment))
    }, 30)

    return () => clearInterval(interval)
  }, [target])

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  )
}

// Floating glass cards with premium styling
function FloatingGlassCards() {
  const cards = [
    {
      id: "ai-crop-doctor",
      icon: <Cpu className="w-5 h-5" />,
      title: "Akanksha AI",
      subtitle: "AI Crop Doctor",
      detail1: "Detect Crop Diseases",
      detail2: "95% AI Accuracy",
      color: "from-purple-500/20 to-blue-500/20",
      delay: 0,
      position: { top: "8%", left: "2%" },
    },
    {
      id: "drone-services",
      icon: <Droplets className="w-5 h-5" />,
      title: "Drone Services",
      subtitle: "Available Today",
      detail1: "Verified Operator",
      detail2: "Book Instantly • ETA 30 mins",
      color: "from-cyan-500/20 to-blue-500/20",
      delay: 0.15,
      position: { top: "12%", right: "3%" },
    },
    {
      id: "live-weather",
      icon: <Cloud className="w-5 h-5" />,
      title: "27°C",
      subtitle: "Live Weather",
      detail1: "Rain in 2 Hours",
      detail2: "Humidity 81% • Wind 12 km/h",
      color: "from-sky-500/20 to-cyan-500/20",
      delay: 0.3,
      position: { bottom: "15%", left: "3%" },
    },
    {
      id: "market-prices",
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Today's Market",
      subtitle: "Live Prices",
      detail1: "Lemon ₹6,500 ▲ +4%",
      detail2: "Paddy ₹2,250 ▲ +2%",
      color: "from-emerald-500/20 to-green-500/20",
      delay: 0.45,
      position: { bottom: "18%", right: "2%" },
    },
    {
      id: "government-benefits",
      icon: <Zap className="w-5 h-5" />,
      title: "PM Kisan",
      subtitle: "Government Benefits",
      detail1: "Eligible • ₹6,000",
      detail2: "Apply Online Now",
      color: "from-orange-500/20 to-red-500/20",
      delay: 0.6,
      position: { top: "45%", right: "2%" },
    },
    {
      id: "nearby-operator",
      icon: <MapPin className="w-5 h-5" />,
      title: "Nearby Operator",
      subtitle: "Field Service",
      detail1: "Verified • 2.4 km Away",
      detail2: "Available Now • Book Service",
      color: "from-rose-500/20 to-pink-500/20",
      delay: 0.75,
      position: { top: "50%", left: "2%" },
    },
  ]

  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.6, type: "spring" }}
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
              y: [0, -15, 0],
              rotate: [0, 2, -1, 0],
            }}
            transition={{
              duration: 6 + card.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="group cursor-pointer"
          >
            <div className={`relative w-56 rounded-2xl border border-white/20 bg-gradient-to-br ${card.color} backdrop-blur-xl p-4 shadow-2xl hover:shadow-3xl hover:border-white/40 transition-all duration-300 group-hover:scale-105`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider group-hover:text-white/80">
                    {card.subtitle}
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">{card.title}</p>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    {card.detail1}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{card.detail2}</p>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

// Trust badge
function TrustBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm"
    >
      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-semibold text-green-300">Trusted by 20,000+ Farmers Across Andhra Pradesh</span>
    </motion.div>
  )
}

// Impact counters section
function ImpactCounters() {
  const counters = [
    { value: 20000, suffix: "+", label: "Farmers Registered" },
    { value: 5000, suffix: "+", label: "Service Requests" },
    { value: 3000, suffix: "+", label: "Services Completed" },
    { value: 300, suffix: "+", label: "Verified Operators" },
    { value: 30, suffix: "+", label: "Villages Covered" },
    { value: 98, suffix: "%", label: "Customer Satisfaction" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-24 pt-16 border-t border-white/10"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Live Impact Metrics</h2>
        <p className="mt-3 text-white/60">Real numbers from real farmers using Rythu360 today</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {counters.map((counter) => (
          <motion.div
            key={counter.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
            >
              <CounterValue target={counter.value} suffix={counter.suffix} />
            </motion.div>
            <p className="mt-2 text-sm text-white/60">{counter.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Farmer quote carousel
function QuoteCarousel() {
  const quotes = [
    "Empowering farmers is empowering India.",
    "The future of agriculture is intelligent, connected, and sustainable.",
    "A farmer's success feeds an entire nation.",
    "Technology in the hands of farmers transforms villages.",
    "From seed to harvest, every decision matters.",
    "Smart farming creates prosperous farming.",
    "The land rewards those who combine tradition with technology.",
    "Every sunrise brings a new opportunity for every farmer.",
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-24 pt-16 border-t border-white/10 text-center"
    >
      <div className="inline-block max-w-2xl">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-white italic leading-relaxed">
            "{quotes[currentQuote]}"
          </p>
        </motion.div>

        {/* Quote indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentQuote(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentQuote ? "w-8 bg-green-400" : "w-2 bg-white/20"}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Market ticker with animated scroll
function MarketTicker() {
  const items = [
    { emoji: "🍋", name: "Lemon", price: "₹6,500/Q", trend: "+4%" },
    { emoji: "🌾", name: "Paddy", price: "₹2,250/Q", trend: "+2%" },
    { emoji: "🌶", name: "Mirchi", price: "₹8,900/Q", trend: "-1%" },
    { emoji: "🍅", name: "Tomato", price: "₹1,850/Q", trend: "-3%" },
    { emoji: "🧅", name: "Onion", price: "₹2,400/Q", trend: "+5%" },
    { emoji: "🥥", name: "Coconut", price: "₹4,200/Q", trend: "+1%" },
    { emoji: "🥛", name: "Milk", price: "₹56/L", trend: "+2%" },
    { emoji: "🐔", name: "Chicken", price: "₹220/kg", trend: "+3%" },
    { emoji: "🐐", name: "Goat", price: "₹350/kg", trend: "+1%" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-24 pt-16 border-t border-white/10"
    >
      <h3 className="text-xl font-bold text-white text-center mb-8">Live Market Prices</h3>

      {/* Animated ticker */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...items, ...items].map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-4 py-2 rounded-lg border border-white/10 bg-white/5 whitespace-nowrap"
            >
              <span className="text-lg mr-2">{item.emoji}</span>
              <span className="text-sm text-white font-semibold">{item.name}</span>
              <span className="text-xs text-white/60 ml-2">{item.price}</span>
              <span className={`text-xs ml-2 font-bold ${item.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {item.trend}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main cinematic hero component
export function CinematicHero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-cinematic-farm.png"
          alt="Cinematic agricultural sunrise scene with farmer using Rythu360"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0,
              }}
              animate={{
                y: [0, -200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          {/* Trust Badge */}
          <TrustBadge />

          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Empower Every Farmer
              <br />
              with{" "}
              <motion.span
                className="relative inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  background: "linear-gradient(90deg, #22c55e, #fbbf24, #22c55e)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Technology
              </motion.span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-xl sm:text-2xl text-white/80 max-w-2xl"
          >
            India's AI-powered Agriculture & Rural Digital Super Platform connecting farmers, verified field operators, AI advisory, machinery booking, live market prices, government schemes, crop insurance, marketplace, local businesses, and rural communities into one intelligent ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl bg-green-600 hover:bg-green-700">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Explore Services
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Features Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 hidden lg:grid grid-cols-7 gap-2"
          >
            {[
              { icon: "🤖", label: "AI Crop Doctor" },
              { icon: "🚜", label: "Tractor Booking" },
              { icon: "🚁", label: "Drone Spraying" },
              { icon: "🌤", label: "Weather" },
              { icon: "📈", label: "Market Prices" },
              { icon: "🛒", label: "Marketplace" },
              { icon: "🏛", label: "Gov. Schemes" },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-center cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl">{feature.icon}</span>
                <p className="text-xs text-white/70 mt-2">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Glass Cards */}
        <FloatingGlassCards />
      </div>

      {/* Additional Sections Below Hero */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Impact Counters */}
          <ImpactCounters />

          {/* Quote Carousel */}
          <QuoteCarousel />

          {/* Market Ticker */}
          <MarketTicker />
        </div>
      </div>
    </section>
  )
}
