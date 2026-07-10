"use client"

import { motion } from "framer-motion"
import { Apple, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DownloadAppSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Download Rythu360 Today
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get access to all features including AI advisory, machinery booking, and market prices in one app
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="gap-2">
                <Apple className="size-5" />
                Download on App Store
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="size-5" />
                Get it on Google Play
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            Available in Telugu, Hindi, Kannada, Tamil, and English
          </div>
        </motion.div>
      </div>
    </section>
  )
}
