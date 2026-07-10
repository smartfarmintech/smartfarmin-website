'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Leaf, Droplets, Sun } from 'lucide-react'

export function FarmerHeroSection() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] overflow-hidden bg-gradient-to-b from-green-50 via-white to-soft-mint-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sunrise gradient */}
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-yellow-100/30 via-orange-50/20 to-transparent" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-10 right-10 text-6xl"
          animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          ☁️
        </motion.div>

        <motion.div
          className="absolute top-20 left-20 text-5xl"
          animate={{ y: [0, -15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          🌾
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-1/4 text-6xl"
          animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        >
          🚜
        </motion.div>

        {/* Drone animation */}
        <motion.div
          className="absolute top-1/3 left-1/4 text-5xl"
          animate={{ x: [0, 200, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        >
          🚁
        </motion.div>

        {/* Birds flying */}
        <motion.div
          className="absolute top-1/4 right-32 text-4xl"
          animate={{ x: [-50, 100, -50] }}
          transition={{ duration: 12, repeat: Infinity }}
        >
          🦅
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full py-16 sm:py-24">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main headline with animation */}
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
              🌱 Welcome to{' '}
              <span className="bg-gradient-to-r from-forest-green via-leaf-green to-fresh-mint bg-clip-text text-transparent">
                Rythu360
              </span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Your trusted farming companion for machinery, drones, crops, and government schemes
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {[
              { icon: '🚜', label: 'Book Machinery' },
              { icon: '🚁', label: 'Drone Services' },
              { icon: '🏥', label: 'AI Crop Doctor' },
              { icon: '🌤', label: 'Weather Info' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-forest-green/20 rounded-full text-sm sm:text-base font-semibold text-gray-900 hover:bg-white hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="text-xl sm:text-2xl">{feature.icon}</span>
                {feature.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-emerald-50 border-2 border-forest-green/20"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-forest-green opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-leaf-green" />
            </span>
            <span className="text-sm sm:text-base font-semibold text-forest-green">
              ✓ Trusted by 2,000+ Farmers
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-forest-green to-transparent opacity-30" />
    </section>
  )
}
