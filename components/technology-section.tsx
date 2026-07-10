'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, Satellite, Smartphone, Cloud, Radio, Wind, MapPin } from 'lucide-react'

export function TechnologySection() {
  const technologies = [
    { icon: Brain, label: 'Artificial Intelligence', description: 'ML models for crop recommendations' },
    { icon: Satellite, label: 'Satellite Mapping', description: 'Real-time field monitoring' },
    { icon: Zap, label: 'Machine Learning', description: 'Predictive analytics and forecasting' },
    { icon: Smartphone, label: 'Mobile First', description: 'Offline-capable farmer apps' },
    { icon: Cloud, label: 'Cloud Computing', description: 'Scalable infrastructure' },
    { icon: Radio, label: 'IoT Integration', description: 'Smart sensor networks' },
    { icon: Wind, label: 'Weather Models', description: 'Hyperlocal forecasting' },
    { icon: MapPin, label: 'GPS Precision', description: 'Centimeter-level accuracy' },
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-accent/5 via-background to-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
            Powering the Future
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on cutting-edge technology to deliver precision agriculture at scale
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {technologies.map((tech, i) => {
            const Icon = tech.icon
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative p-8 rounded-2xl border border-accent/20 bg-card group-hover:bg-accent/5 transition-colors space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-foreground text-lg">
                      {tech.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
