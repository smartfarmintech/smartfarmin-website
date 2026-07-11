'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function InteractivePoll() {
  const [voted, setVoted] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const options = [
    { id: 'rice', label: 'Rice', percent: 35, count: 1240 },
    { id: 'cotton', label: 'Cotton', percent: 28, count: 980 },
    { id: 'groundnut', label: 'Groundnut', percent: 22, count: 780 },
    { id: 'sugarcane', label: 'Sugarcane', percent: 15, count: 530 },
  ]

  const handleVote = (optionId: string) => {
    setSelected(optionId)
    setVoted(true)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
            Farmer Survey
          </h2>
          <p className="text-slate-600">Which crop did you plant this season?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 border border-slate-200"
        >
          <div className="space-y-4">
            {options.map((option, idx) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleVote(option.id)}
                disabled={voted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selected === option.id
                    ? 'border-primary bg-primary/5'
                    : voted
                    ? 'border-slate-200 opacity-75'
                    : 'border-slate-200 hover:border-primary'
                } ${!voted && 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{option.label}</span>
                  <span className="text-sm text-slate-600">{option.percent}%</span>
                </div>
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percent}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-2">{option.count} votes</div>
              </motion.button>
            ))}
          </div>

          {voted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <p className="text-green-900 font-semibold">Thank you for voting!</p>
              <p className="text-sm text-green-800 mt-1">
                Help us improve by sharing your farming challenges.
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600">
            Total farmers participated: <span className="font-bold text-slate-900">3,530</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">Live data updated every hour</p>
        </motion.div>
      </div>
    </section>
  )
}
