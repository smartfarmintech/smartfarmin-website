'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Zap, CheckCircle } from 'lucide-react'

export function AICropDoctorSection() {
  const features = [
    { title: 'Disease Detection', description: 'AI-powered identification of crop diseases in real-time' },
    { title: 'Treatment Plans', description: 'Customized recommendations based on crop, stage, and region' },
    { title: 'Preventive Alerts', description: 'Early warnings for potential diseases and pest outbreaks' },
    { title: 'Success Tracking', description: 'Monitor treatment effectiveness and adjust strategies' },
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute right-0 top-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">AI Crop Doctor</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                Your Personal Crop Health Expert
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Powered by advanced AI and real-time crop monitoring, catch crop diseases before they spread.
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
                  className="flex gap-4 p-4 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg transition-shadow">
                Try AI Crop Doctor
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/platform-ai-doctor.png"
              alt="AI Crop Doctor Interface"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
