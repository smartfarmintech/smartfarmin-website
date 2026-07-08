"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const impacts = [
  {
    value: 250000,
    label: "Farmers Connected",
    suffix: "+",
  },
  {
    value: 50000,
    label: "Bookings Completed",
    suffix: "+",
  },
  {
    value: 1200,
    label: "Operators On Platform",
    suffix: "+",
  },
  {
    value: 500,
    label: "Million Rupees Saved",
    suffix: "+",
  },
]

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = target / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [target])

  return (
    <>
      {(count / 1000).toFixed(0)}
      {suffix}
    </>
  )
}

export function ImpactSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Impact in numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforming Indian agriculture one farmer at a time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                <AnimatedCounter target={impact.value} suffix={impact.suffix} />
              </div>
              <p className="text-muted-foreground">{impact.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
