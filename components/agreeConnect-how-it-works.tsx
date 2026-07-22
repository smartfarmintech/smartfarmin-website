"use client"

import { motion } from "framer-motion"
import {
  UserPlus,
  Zap,
  Calendar,
  CheckCircle,
  MapPin,
  Star,
} from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your profile in minutes. Verify your details.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Zap,
    title: "Choose Service",
    description: "Browse and select the machinery or service you need.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Calendar,
    title: "Select Date",
    description: "Pick your preferred date and time slot.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: CheckCircle,
    title: "Confirm Booking",
    description: "Review details and confirm your booking.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: MapPin,
    title: "Track Live",
    description: "Monitor your operator in real-time on the map.",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Star,
    title: "Rate & Feedback",
    description: "Complete service and share your experience.",
    color: "bg-pink-500/10 text-pink-600",
  },
]

export function AgreeConnectHowItWorks() {
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
            How It Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and farmer-friendly. Get started in just a few easy steps.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative"
              >
                {/* Arrow connector for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <motion.div
                  whileHover={{ y: -4 }}
                  className={`relative overflow-hidden rounded-2xl border border-border/50 ${step.color.split(" text-")[0]} p-8 transition-all duration-300 hover:shadow-lg`}
                >
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground opacity-50">
                    Step {idx + 1}
                  </div>

                  <div className={`inline-flex rounded-xl p-3 mb-4 ${step.color} bg-white/20`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Timeline dot for mobile and tablet */}
                  <div className="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Final step indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg font-medium text-foreground">
            All done! 🎉
          </p>
          <p className="text-muted-foreground mt-2">
            Your service is now complete. Thank you for using AgreeConnect.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
