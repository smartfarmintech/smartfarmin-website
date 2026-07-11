'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Counter {
  label: string
  value: number
  suffix: string
  color: string
}

const counters: Counter[] = [
  { label: 'Active Farmers', value: 20000, suffix: '+', color: 'from-green-500 to-emerald-600' },
  { label: 'Villages Connected', value: 5000, suffix: '+', color: 'from-blue-500 to-cyan-600' },
  { label: 'Rural Services', value: 500, suffix: '+', color: 'from-purple-500 to-pink-600' },
  { label: 'Daily Transactions', value: 100000, suffix: '+', color: 'from-orange-500 to-red-600' },
]

export function LiveCounters() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Growing Every Day
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real-time metrics showing the impact of Rythu360 across rural India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {counters.map((counter, idx) => (
            <CounterCard key={counter.label} counter={counter} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CounterCard({ counter, index }: { counter: Counter; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayValue, setDisplayValue] = React.useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2
          const steps = 60
          const increment = counter.value / steps
          let current = 0

          const interval = setInterval(() => {
            current += increment
            if (current >= counter.value) {
              setDisplayValue(counter.value)
              clearInterval(interval)
            } else {
              setDisplayValue(Math.floor(current))
            }
          }, (duration * 1000) / steps)

          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl bg-gradient-to-br ${counter.color} group overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />

      <div className="relative z-10">
        <p className="text-white/80 text-sm font-semibold mb-3 uppercase tracking-wider">
          {counter.label}
        </p>
        <div className="text-5xl md:text-6xl font-bold text-white mb-2">
          {displayValue.toLocaleString()}{counter.suffix}
        </div>
        <div className="h-1 w-16 bg-white/50 rounded-full" />
      </div>
    </motion.div>
  )
}

import React from 'react'
