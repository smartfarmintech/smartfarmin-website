"use client"

import { motion } from "framer-motion"
import { Cloud, Droplets, Wind, Sun, AlertCircle } from "lucide-react"

export function FarmSnapshot() {
  const conditions = [
    { icon: Sun, label: "Temperature", value: "28°C", status: "Optimal" },
    { icon: Droplets, label: "Moisture", value: "65%", status: "Good" },
    { icon: Wind, label: "Wind Speed", value: "12 km/h", status: "Moderate" },
    { icon: Cloud, label: "Rainfall", value: "0 mm", status: "No rain" },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Today's Farm Snapshot
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time weather and soil conditions for your fields
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {conditions.map((condition, index) => {
            const Icon = condition.icon
            return (
              <motion.div
                key={condition.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{condition.label}</p>
                      <p className="text-2xl font-bold text-foreground">{condition.value}</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    {condition.status}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
