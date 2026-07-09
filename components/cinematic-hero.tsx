'use client'

import { motion } from 'framer-motion'
import { Cloud, Leaf, Sun, Wind, Droplets, Zap, MapPin, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CinematicHero() {
  const floatingWidgets = [
    { icon: Cloud, label: 'Weather', value: '28°C', color: 'from-blue-400 to-cyan-500', position: 'top-20 left-8' },
    { icon: Leaf, label: 'AI Crop Doctor', value: 'Healthy', color: 'from-green-400 to-emerald-500', position: 'top-32 right-12' },
    { icon: Zap, label: 'Machinery Booking', value: 'Available', color: 'from-amber-400 to-yellow-500', position: 'bottom-32 left-16' },
    { icon: Droplets, label: 'Smart Irrigation', value: '65%', color: 'from-cyan-400 to-blue-500', position: 'bottom-20 right-8' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50 to-white overflow-hidden pt-32 pb-20">
      {/* Animated background elements */}
      <motion.div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating widgets */}
        {floatingWidgets.map((widget, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            className={`absolute ${widget.position} z-20`}
          >
            <div className={`bg-gradient-to-br ${widget.color} rounded-2xl p-4 backdrop-blur-md bg-opacity-20 border border-white/30 shadow-xl min-w-40`}>
              <div className="flex items-center gap-3">
                <widget.icon className="w-6 h-6 text-white" />
                <div>
                  <p className="text-xs text-white/80">{widget.label}</p>
                  <p className="text-sm font-bold text-white">{widget.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Main content */}
        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants as any} className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Sun className="w-4 h-4" />
            AI Powered Agriculture Super Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants as any} className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">

            <br />
          </motion.h1>

          {/* Supporting text */}
          <motion.p variants={itemVariants as any} className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">

          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants as any} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              Launch Platform
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold">
              Book Machinery
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold">
              Book Drone
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants as any} className="mt-16 flex flex-wrap justify-center gap-4">
            {['AI Powered', 'Made in India', 'Enterprise Ready', 'Government Ready', 'Secure Payments'].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-full px-4 py-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative h-96 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-8xl mb-4">🚁</div>
            <p className="text-gray-500">Premium Drone Agriculture Image</p>
            <p className="text-sm text-gray-400">(High-res image will be optimized)</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
