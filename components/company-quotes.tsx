'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  {
    text: 'Empowering farmers with technology and knowledge to build a prosperous India',
    author: 'Founder Vision',
    lang: 'en',
  },
  {
    text: 'రైతులను సాంకేతికత ద్వారా శక్తిపెట్టి, భారతను సమృద్ధిමంతం చేయడం',
    author: 'స్థాపక దృష్టి',
    lang: 'te',
  },
  {
    text: 'Every farmer deserves access to modern tools, market knowledge, and fair prices',
    author: 'Our Mission',
    lang: 'en',
  },
  {
    text: 'ప్రతి రైతు ఆధునిక సాధనాలు, విపణన జ్ఞానం మరియు న్యాయమైన ధరలకు యోग్యుడు',
    author: 'మా లక్ష్యం',
    lang: 'te',
  },
  {
    text: 'Connecting rural communities to unlimited opportunities and growth',
    author: 'Core Value',
    lang: 'en',
  },
]

export function CompanyQuotes() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Our Vision
          </h2>
          <p className="text-slate-600">Rotating inspirations from our community</p>
        </motion.div>

        <div className="relative h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                "{quotes[current].text}"
              </p>
              <p className="text-sm font-semibold text-primary">
                — {quotes[current].author}
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                {quotes.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === current
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">🌍</div>
            <p className="text-sm font-semibold text-slate-900">Global Reach</p>
            <p className="text-xs text-slate-600">Serving farmers worldwide</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">💡</div>
            <p className="text-sm font-semibold text-slate-900">Innovation</p>
            <p className="text-xs text-slate-600">Latest technology for farms</p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🤝</div>
            <p className="text-sm font-semibold text-slate-900">Community</p>
            <p className="text-xs text-slate-600">United farming network</p>
          </div>
        </div>
      </div>
    </section>
  )
}
