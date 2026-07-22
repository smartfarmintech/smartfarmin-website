"use client"

import { motion } from "framer-motion"
import {
  Tractor,
  Wrench,
  Leaf,
  Zap,
  Drill,
  Wind,
  Hammer,
  Pickaxe,
  Waves,
  Search,
  Sliders,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react"

const machinery = [
  { icon: Tractor, name: "Tractor", category: "Heavy Machinery" },
  { icon: Wrench, name: "Rotavator", category: "Soil Preparation" },
  { icon: Leaf, name: "Cultivator", category: "Soil Preparation" },
  { icon: Zap, name: "Harvester", category: "Harvesting" },
  { icon: Drill, name: "Drone", category: "Advanced Tech" },
  { icon: Drill, name: "Seed Drill", category: "Sowing" },
  { icon: Wind, name: "Power Sprayer", category: "Pest Management" },
  { icon: Hammer, name: "JCB", category: "Heavy Machinery" },
  { icon: Pickaxe, name: "Excavator", category: "Heavy Machinery" },
  { icon: Waves, name: "Water Tanker", category: "Irrigation" },
]

const features = [
  { icon: Search, label: "Advanced Search" },
  { icon: Sliders, label: "Smart Filters" },
  { icon: Calendar, label: "Availability" },
  { icon: CreditCard, label: "Pricing" },
  { icon: MapPin, label: "Location-Based" },
]

export function AgreeConnectMarketplace() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Machinery Marketplace
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Find and book trusted machinery operators in your area. Browse availability, compare prices, and book in minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Available Machinery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {machinery.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl border border-border/50 bg-white/5 p-4 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:border-border hover:bg-white/10"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Smart Features
            </h3>
            <div className="space-y-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feature.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.label === "Advanced Search" && "Find exactly what you need"}
                        {feature.label === "Smart Filters" && "Filter by type, price, and more"}
                        {feature.label === "Availability" && "Check real-time availability"}
                        {feature.label === "Pricing" && "Compare fair prices instantly"}
                        {feature.label === "Location-Based" && "Find operators near you"}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-12 text-center"
        >
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
            Ready to Book?
          </h3>
          <p className="text-muted-foreground mb-6">
            Browse our marketplace, find verified operators, and book machinery instantly.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium transition-all duration-300 hover:shadow-lg"
          >
            Explore Machinery
            <Tractor className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
