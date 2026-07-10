"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Apple, Smartphone } from "lucide-react"

const features = [
  {
    title: "Instant Booking",
    description: "Book machinery, labour, and drone services in seconds",
  },
  {
    title: "Live Tracking",
    description: "Monitor operators and services in real-time with GPS",
  },
  {
    title: "AI Guidance",
    description: "Get personalized crop and farming recommendations",
  },
  {
    title: "Multi-Language",
    description: "Full support for Telugu, Hindi, Kannada, and more",
  },
]

export function MobileAppSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground mb-4">
              <Smartphone size={14} />
              Mobile App
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Farm smarter from your pocket
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download Rythu360 and get instant access to machinery, AI advisory, and a community of farmers and experts.
            </p>

            <div className="grid gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Apple size={18} />
                App Store
              </Button>
              <Button variant="outline" className="gap-2">
                <Download size={18} />
                Google Play
              </Button>
            </div>
          </motion.div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative rounded-3xl border-8 border-slate-900 bg-slate-900 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-40 h-7 bg-slate-900 rounded-b-3xl"></div>
                
                {/* Screen */}
                <div className="rounded-2xl bg-gradient-to-b from-primary/20 to-primary/10 p-6 h-screen flex flex-col items-center justify-center text-center">
                  <div className="text-white space-y-4">
                    <h3 className="text-2xl font-bold">Rythu360</h3>
                    <p className="text-sm opacity-80">Farm Smart</p>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-8"
                    >
                      <Smartphone size={48} className="mx-auto" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
