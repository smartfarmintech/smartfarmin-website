"use client"

import { motion } from "framer-motion"
import { ArrowRight, Smartphone, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PremiumCTASection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-primary/90 to-accent overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Join 250,000+ Farmers<br />
            Already Using AgreeConnect
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Download the free app today and get instant access to AI crop doctor, machinery booking, marketplace, and government schemes—all in one platform.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-primary px-8 py-6 rounded-lg text-lg font-semibold shadow-2xl"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Download App
            </Button>
            <Button
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-lg text-lg font-semibold"
            >
              Start Web Version <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Zap,
                title: "Instant AI Analysis",
                desc: "Get disease diagnosis in seconds",
              },
              {
                icon: Shield,
                title: "100% Verified",
                desc: "All services are verified & certified",
              },
              {
                icon: Smartphone,
                title: "Available Offline",
                desc: "Works even without internet connection",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
              >
                <item.icon className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                <div className="text-xs text-white/80">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
