"use client"

import { motion } from "framer-motion"
import {
  Clock,
  TrendingDown,
  TrendingUp,
  Zap,
  CheckCircle,
  Globe,
  Languages,
  Lock,
  PhoneOff,
} from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Book services in minutes, not hours. Get instant confirmations and real-time tracking.",
    color: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-600",
  },
  {
    icon: TrendingDown,
    title: "Reduce Farming Costs",
    description: "Fair pricing, transparent quotes, and bulk discounts. Maximize your profits.",
    color: "from-green-500/10 to-green-500/5",
    iconColor: "text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Increase Crop Productivity",
    description: "AI-guided decisions backed by real data. Optimize every stage of your farming cycle.",
    color: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "AI-Powered Decisions",
    description: "Real-time crop advisory, pest detection, and weather intelligence at your fingertips.",
    color: "from-yellow-500/10 to-yellow-500/5",
    iconColor: "text-yellow-600",
  },
  {
    icon: CheckCircle,
    title: "Verified Operators",
    description: "Work only with trusted, verified machinery owners and operators. Safety guaranteed.",
    color: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-600",
  },
  {
    icon: Globe,
    title: "Farmer Friendly",
    description: "Designed with farmers. Works on low-end phones. Simple, intuitive interface.",
    color: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-600",
  },
  {
    icon: Languages,
    title: "Regional Language Support",
    description: "Available in 11+ regional languages. Voice-first interface for every farmer.",
    color: "from-pink-500/10 to-pink-500/5",
    iconColor: "text-pink-600",
  },
  {
    icon: Lock,
    title: "Secure Digital Payments",
    description: "Safe, encrypted transactions. Pay only after service completion.",
    color: "from-red-500/10 to-red-500/5",
    iconColor: "text-red-600",
  },
  {
    icon: PhoneOff,
    title: "24×7 Support",
    description: "Round-the-clock customer support. We're always here when you need us.",
    color: "from-cyan-500/10 to-cyan-500/5",
    iconColor: "text-cyan-600",
  },
]

export function Rythu360Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

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
            Why Choose Rythu360
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Built for farmers, by farmers. Experience the difference technology brings to your farm.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${feature.color} p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-border`}
              >
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-background to-background/50" />
                
                <div className={`inline-flex rounded-xl p-3 mb-4 bg-white/10 ${feature.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
