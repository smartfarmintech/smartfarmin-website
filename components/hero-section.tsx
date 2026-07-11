"use client"

import Image from "next/image"
import { ArrowRight, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Cinematic Background */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-b from-background via-white/50 to-white">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(27,143,58);stop-opacity:0.8' /%3E%3Cstop offset='50%25' style='stop-color:rgb(244,180,0);stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:rgb(248,250,252);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3Cpath d='M0,600 Q480,400 960,500 T1920,600 L1920,1080 L0,1080 Z' fill='%231B8F3A' opacity='0.15'/%3E%3Cpath d='M0,700 Q480,550 960,650 T1920,700 L1920,1080 L0,1080 Z' fill='%23F4B400' opacity='0.08'/%3E%3C/svg%3E"
            alt="Indian paddy field at sunrise"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
              Empower Every Farmer<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">with Technology</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              India's most advanced AI-powered agricultural platform. Connect with verified service providers, access real-time weather intelligence, detect crop diseases instantly, and optimize your harvest—all in one intelligent ecosystem.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-6 rounded-lg text-lg font-semibold"
              >
                Watch Demo
              </Button>
            </motion.div>

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
