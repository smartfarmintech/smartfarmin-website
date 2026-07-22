"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-block">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2"
                whileHover={{ scale: 1.05 }}
              >
                AgreeConnect
              </motion.h1>
              <p className="text-lg sm:text-xl text-green-100 font-semibold">
                SmartFarmin
              </p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              One Platform.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-green-200 to-cyan-200">
                Every Farming Solution.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
              India's most comprehensive agriculture ecosystem connecting farmers with services, markets, and opportunities.
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
          >
            {[
              { icon: "🚜", label: "Services" },
              { icon: "📊", label: "Markets" },
              { icon: "🤖", label: "AI" },
              { icon: "👥", label: "Community" },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.1, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm font-semibold text-white">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/auth?mode=login"
              className="px-8 py-4 bg-white text-green-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              href="/auth?mode=register"
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              Create Account
            </Link>
            <Link
              href="/?guest=true"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              Explore as Guest
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto text-center"
          >
            {[
              { number: "20K+", label: "Farmers" },
              { number: "5000+", label: "Services" },
              { number: "100K+", label: "Transactions" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-200">
                  {stat.number}
                </div>
                <p className="text-xs sm:text-sm text-gray-100">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
          <p>&copy; 2025 SmartFarmin. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
