'use client'

import { motion } from 'framer-motion'
import { Search, Leaf, Zap, Smartphone, TrendingUp, BarChart3, Truck, Sprout } from 'lucide-react'

export function JourneyTimelineSection() {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      description: 'Learn about precision agriculture solutions and connect with the platform',
    },
    {
      icon: Leaf,
      title: 'Plan',
      description: 'Create crop plans with AI recommendations tailored to your farm',
    },
    {
      icon: Zap,
      title: 'Book Services',
      description: 'Access drones, machinery, and expert services on-demand',
    },
    {
      icon: Smartphone,
      title: 'Monitor',
      description: 'Track real-time crop health and weather with live dashboards',
    },
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'Get detailed insights into farming performance and improvements',
    },
    {
      icon: TrendingUp,
      title: 'Optimize',
      description: 'Refine strategies based on data and get better yields',
    },
    {
      icon: Truck,
      title: 'Harvest',
      description: 'Connect directly with buyers for fair prices',
    },
    {
      icon: Sprout,
      title: 'Grow',
      description: 'Scale operations with confidence and community support',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
          animate={{
            x: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
            The Farmer&apos;s Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From discovery to harvest—how farmers transform their operations with Rythu360
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Horizontal Line */}
          <motion.div
            className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
            variants={lineVariants}
            style={{ originX: 0 }}
          />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Dot on Timeline */}
                  <motion.div
                    className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      delay: 0.2 + i * 0.08,
                      duration: 0.4,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg border-4 border-background">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="pt-24 space-y-4 text-center"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Step Number */}
                    <div className="pt-4 flex justify-center">
                      <span className="text-sm font-semibold text-accent">
                        Step {i + 1}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to start your journey?
          </p>
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Transformation
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
