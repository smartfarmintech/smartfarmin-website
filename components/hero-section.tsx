'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Zap, Leaf, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
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
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-accent/5 py-20 px-4 md:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 w-fit"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Digital Operating System for Indian Agriculture</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-balance leading-tight text-foreground"
            >
              Empowering Farmers with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Technology
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Rythu360 connects farmers, technology, and markets through AI-powered precision agriculture, intelligent machinery, real-time weather intelligence, and digital marketplaces.
            </motion.p>

            {/* Impact Metrics */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { icon: Leaf, label: 'Farmers', value: '50K+' },
                { icon: TrendingUp, label: 'Yield Increase', value: '35%' },
                { icon: Zap, label: 'Cost Saved', value: '₹5B+' },
              ].map((metric, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-4 h-4 text-accent" />
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {metric.value}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="#ecosystem">
                <motion.button
                  className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg transition-shadow group flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Launch Platform
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="#solutions">
                <motion.button
                  className="px-8 py-4 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Solutions
                </motion.button>
              </Link>

              <Link href="#contact">
                <motion.button
                  className="px-8 py-4 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Partner
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative h-96 md:h-full md:min-h-[600px]"
          >
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative w-full h-full"
            >
              <Image
                src="/images/hero-farmland-sunrise.png"
                alt="Indian farmland with technology integration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Info Cards */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20"
            >
              <p className="text-sm font-semibold text-foreground">Real-time Analytics</p>
              <p className="text-xs text-muted-foreground">Live crop monitoring</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.2 }}
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20"
            >
              <p className="text-sm font-semibold text-foreground">AI Diagnostics</p>
              <p className="text-xs text-muted-foreground">Disease detection</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
