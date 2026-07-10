'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Smartphone, CheckCircle } from 'lucide-react'

export function DroneIntelligenceSection() {
  const features = [
    { title: 'Precision Spraying', description: 'Targeted application reduces chemical use by up to 40%' },
    { title: 'Live Monitoring', description: 'Real-time crop health assessment across acres' },
    { title: 'Efficient Scheduling', description: 'Book drones on-demand with instant availability' },
    { title: 'Cost Savings', description: 'Fair pricing without middlemen—save up to 50%' },
  ]

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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-0 bottom-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1"
          >
            <Image
              src="/images/hero-drone-precision.png"
              alt="Drone Intelligence Platform"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 order-1 md:order-2"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Drone Intelligence</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                Precision Farming From the Sky
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Book smart drones for spraying, monitoring, and mapping. Get results in days, not weeks.
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <button className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
                Book a Drone
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
