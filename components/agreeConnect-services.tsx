"use client"

import { motion } from "framer-motion"
import {
  Tractor,
  Zap,
  Leaf,
  Wrench,
  Droplets,
  Hammer,
  Microscope,
  Users,
  Brain,
  Cloud,
  User,
  TrendingUp,
  Landmark,
  Waves,
  Truck,
  ShoppingBag,
} from "lucide-react"

const services = [
  { icon: Tractor, name: "Tractor Booking", color: "bg-green-500/10 text-green-600" },
  { icon: Zap, name: "Drone Spraying", color: "bg-blue-500/10 text-blue-600" },
  { icon: Leaf, name: "Harvester Booking", color: "bg-emerald-500/10 text-emerald-600" },
  { icon: Wrench, name: "Rotavator", color: "bg-orange-500/10 text-orange-600" },
  { icon: Droplets, name: "Seed Drill", color: "bg-cyan-500/10 text-cyan-600" },
  { icon: Hammer, name: "JCB", color: "bg-yellow-500/10 text-yellow-600" },
  { icon: Microscope, name: "Soil Testing", color: "bg-amber-500/10 text-amber-600" },
  { icon: Users, name: "Farm Labour", color: "bg-red-500/10 text-red-600" },
  { icon: Brain, name: "AI Crop Doctor", color: "bg-purple-500/10 text-purple-600" },
  { icon: Cloud, name: "Weather Intelligence", color: "bg-sky-500/10 text-sky-600" },
  { icon: User, name: "Agriculture Experts", color: "bg-indigo-500/10 text-indigo-600" },
  { icon: TrendingUp, name: "Market Prices", color: "bg-rose-500/10 text-rose-600" },
  { icon: Landmark, name: "Government Schemes", color: "bg-violet-500/10 text-violet-600" },
  { icon: Waves, name: "Irrigation Solutions", color: "bg-teal-500/10 text-teal-600" },
  { icon: Truck, name: "Water Tanker", color: "bg-slate-500/10 text-slate-600" },
  { icon: ShoppingBag, name: "Marketplace (Coming Soon)", color: "bg-gray-500/10 text-gray-600" },
]

export function AgreeConnectServices() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.320, 1] as any },
    },
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Everything a farmer needs on one platform. From machinery to AI guidance to government services.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative overflow-hidden rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${service.color.split(" text-")[0]} backdrop-blur-sm`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className={`inline-flex rounded-lg p-3 ${service.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-medium text-foreground text-sm">{service.name}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
