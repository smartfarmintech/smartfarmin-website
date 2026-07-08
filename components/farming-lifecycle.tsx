"use client"

import { motion } from "framer-motion"
import { Sprout, CloudRain, Leaf, Zap, Wheat } from "lucide-react"

export function FarmingLifecycle() {
  const stages = [
    { icon: Sprout, title: "Prepare", description: "Soil testing and crop planning" },
    { icon: CloudRain, title: "Sow", description: "AI-guided planting with precision timing" },
    { icon: Leaf, title: "Grow", description: "Monitor health with daily AI insights" },
    { icon: Zap, title: "Manage", description: "Pest and disease detection" },
    { icon: Wheat, title: "Harvest", description: "Optimal harvest timing and market pricing" },
  ]

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Interactive Farming Lifecycle
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From seed to harvest, Rythu360 guides every step with AI-powered intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-2 w-4 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}

                <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="size-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
