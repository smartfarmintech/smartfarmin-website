"use client"

import { motion } from "framer-motion"
import {
  Bug,
  Leaf,
  Droplets,
  Calendar,
  TrendingUp,
  Cloud,
  Zap,
  Mic,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react"

const aiFeatures = [
  {
    icon: Bug,
    name: "Crop Disease Detection",
    description: "Identify diseases early using image recognition. Get treatment plans instantly.",
  },
  {
    icon: Leaf,
    name: "Pest Identification",
    description: "Detect pests automatically and receive targeted prevention strategies.",
  },
  {
    icon: Droplets,
    name: "Fertilizer Recommendation",
    description: "Get personalized fertilizer schedules based on soil and crop health.",
  },
  {
    icon: Calendar,
    name: "Irrigation Advice",
    description: "Smart irrigation scheduling to save water and reduce costs.",
  },
  {
    icon: TrendingUp,
    name: "Crop Calendar",
    description: "Personalized seasonal calendar for your specific crops and region.",
  },
  {
    icon: Cloud,
    name: "Yield Prediction",
    description: "Predict yields based on real-time data and historical patterns.",
  },
  {
    icon: Zap,
    name: "Weather Intelligence",
    description: "Hyper-local weather forecasts with actionable farming alerts.",
  },
  {
    icon: Mic,
    name: "Voice Assistant (Coming Soon)",
    description: "Ask questions in your language. Get answers in real-time.",
  },
  {
    icon: ImageIcon,
    name: "Image Recognition",
    description: "Analyze crop photos to get instant insights and recommendations.",
  },
  {
    icon: Sparkles,
    name: "Personalized Recommendations",
    description: "AI learns from your farm data to provide better advice over time.",
  },
]

export function AgreeConnectAIPlatform() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.320, 1] },
    },
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 mb-6 text-sm font-medium text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI-Powered Intelligence
          </motion.div>
          
          <h2 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Meet Akanksha AI
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Your intelligent farming assistant helping you make better decisions through artificial intelligence. Available 24/7 to guide every step of your farming journey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-5"
        >
          {aiFeatures.map((feature, idx) => {
            const Icon = feature.icon
            const isComingSoon = feature.name.includes("Coming Soon")
            
            return (
              <motion.div
                key={idx}
                variants={itemVariants as any}
                whileHover={!isComingSoon ? { y: -4, transition: { duration: 0.3 } } : {}}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 ${
                  !isComingSoon ? "hover:shadow-lg hover:border-border hover:bg-white/10 cursor-pointer" : "opacity-70"
                }`}
              >
                <div className={`inline-flex rounded-lg p-2.5 mb-3 bg-white/10 ${isComingSoon ? "text-muted-foreground" : "text-purple-600"}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-medium text-foreground text-sm mb-1">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>

                {isComingSoon && (
                  <div className="absolute top-3 right-3 text-xs font-semibold text-amber-600 bg-amber-50/80 px-2 py-1 rounded">
                    Soon
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
