"use client"

import { motion } from "framer-motion"
import {
  Cpu,
  Tractor,
  Zap,
  ShoppingCart,
  Leaf,
  Cloud,
  Droplets,
  Sun,
  MapPin,
  Building2,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ecosystemFeatures = [
  {
    icon: Cpu,
    title: "AI Crop Doctor",
    description: "Real-time crop health monitoring with AI-powered disease detection",
    color: "from-emerald-400 to-green-600",
    delay: 0,
  },
  {
    icon: Tractor,
    title: "Machinery Booking",
    description: "Instant access to tractors, harvesters, and agricultural equipment",
    color: "from-blue-400 to-cyan-600",
    delay: 0.1,
  },
  {
    icon: Zap,
    title: "Drone Booking",
    description: "Book drone services for precision spraying and field surveying",
    color: "from-purple-400 to-pink-600",
    delay: 0.2,
  },
  {
    icon: ShoppingCart,
    title: "Marketplace",
    description: "Buy and sell farm produce directly with fair pricing",
    color: "from-orange-400 to-red-600",
    delay: 0.3,
  },
  {
    icon: Leaf,
    title: "Organic Store",
    description: "Premium organic products from verified farmers",
    color: "from-green-400 to-emerald-600",
    delay: 0.4,
  },
  {
    icon: Cloud,
    title: "Weather Intelligence",
    description: "Hyperlocal weather forecasts and alerts for optimal farming",
    color: "from-sky-400 to-blue-600",
    delay: 0.5,
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description: "Automated irrigation management based on soil moisture data",
    color: "from-cyan-400 to-teal-600",
    delay: 0.6,
  },
  {
    icon: Sun,
    title: "Solar Farming",
    description: "Solar-powered irrigation and sustainable farming solutions",
    color: "from-yellow-400 to-orange-600",
    delay: 0.7,
  },
  {
    icon: MapPin,
    title: "GPS Tracking",
    description: "Real-time tracking and satellite mapping for field operations",
    color: "from-indigo-400 to-blue-600",
    delay: 0.8,
  },
  {
    icon: Building2,
    title: "Government Schemes",
    description: "Easy access to agricultural subsidies and government programs",
    color: "from-slate-400 to-gray-600",
    delay: 0.9,
  },
  {
    icon: TrendingUp,
    title: "Farm Analytics",
    description: "Comprehensive analytics and insights for better farming decisions",
    color: "from-violet-400 to-purple-600",
    delay: 1.0,
  },
  {
    icon: Users,
    title: "Enterprise Solutions",
    description: "Scalable solutions for agricultural businesses and dealers",
    color: "from-rose-400 to-pink-600",
    delay: 1.1,
  },
]

export function TechnologyEcosystem() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-40 top-20 size-80 rounded-full bg-gradient-to-br from-yellow-100/20 to-transparent blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-40 bottom-20 size-80 rounded-full bg-gradient-to-br from-emerald-100/20 to-transparent blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            Complete Ecosystem
          </p>
          <h2 className="text-5xl font-bold leading-tight text-foreground lg:text-6xl">
            Technology That Empowers
            <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Every Farmer
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/60">
            A comprehensive suite of AI-powered tools and services designed to transform agriculture and maximize farming productivity.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ecosystemFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/40 p-8 backdrop-blur-sm transition-all hover:border-emerald-200/60 hover:bg-white/60 hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />

                {/* Icon */}
                <div className={`mb-4 inline-block rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                  <Icon className="size-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mb-4 text-sm text-foreground/60">{feature.description}</p>

                {/* Learn more link */}
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 transition-all group-hover:gap-3">
                  Learn more
                  <ArrowRight className="size-4" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="mb-6 text-lg text-foreground/60">
            Ready to transform your farming with AI-powered solutions?
          </p>
          <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            Explore All Features
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
