"use client"

import { Sprout } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Cinematic Background with Sunrise Gradient */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-b from-orange-100 via-yellow-50 to-white">
        {/* Hero Banner Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/videos/farm-hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* Sunrise Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-400/20 via-yellow-300/10 to-transparent pointer-events-none" />

        {/* Decorative Sunrise Circle */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-48 h-48 rounded-full bg-gradient-to-b from-yellow-300 to-orange-200 blur-3xl opacity-40 pointer-events-none"
        />



        {/* Gradient SVG Landscape */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sunrise" x1="0%" y1="0%" x2="0%" y2="100%">
              {/* <stop offset="0%" style={{ stopColor: "rgb(254,215,0)", stopOpacity: 0.6 }} /> */}
              <stop offset="30%" style={{ stopColor: "rgb(237, 199, 152)", stopOpacity: 0.4 }} />
              <stop offset="60%" style={{ stopColor: "rgb(165, 234, 190)", stopOpacity: 0.15 }} />
              <stop offset="100%" style={{ stopColor: "rgb(248,250,252)", stopOpacity: 0.8 }} />
            </linearGradient>
            <linearGradient id="field" x1="0%" y1="50%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgb(27,143,58)", stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: "rgb(27,143,58)", stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#sunrise)" />
          <path d="M0,550 Q480,450 960,500 T1920,550 L1920,1080 L0,1080 Z" fill="url(#field)" />
          <path d="M0,680 Q480,600 960,650 T1920,680 L1920,1080 L0,1080 Z" fill="#1B8F3A" opacity="0.12" />
        </svg>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:pr-1/3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary/10 shadow-lg"
            >
              <span className="text-sm font-semibold text-primary flex items-center gap-1">
                <Sprout className="w-4 h-4" />
                Trusted by 250,000+ Farmers Across India
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Empower Every Farmer<br /></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">with Technology</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-white max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              India's most advanced AI-powered agricultural platform. Connect with verified service providers, access real-time weather intelligence, detect crop diseases instantly, and optimize your harvest—all in one intelligent ecosystem.
            </motion.p>



            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-gray-700">Active Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                <div className="text-sm text-gray-700">Services Booked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-700">AI Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
