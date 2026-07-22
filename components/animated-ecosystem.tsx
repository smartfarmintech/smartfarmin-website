'use client'

import { motion } from 'framer-motion'

const ecosystemModules = [
  { name: 'Crop Advisory', icon: '🌾', color: 'from-green-400 to-emerald-600' },
  { name: 'Marketplace', icon: '🛒', color: 'from-blue-400 to-blue-600' },
  { name: 'Drone Services', icon: '🚁', color: 'from-sky-400 to-cyan-600' },
  { name: 'Financing', icon: '💰', color: 'from-amber-400 to-orange-600' },
  { name: 'Weather', icon: '⛅', color: 'from-slate-400 to-slate-600' },
  { name: 'Equipment', icon: '🔧', color: 'from-red-400 to-rose-600' },
  { name: 'Training', icon: '📚', color: 'from-purple-400 to-purple-600' },
  { name: 'Community', icon: '👥', color: 'from-pink-400 to-rose-600' },
  { name: 'Insurance', icon: '🛡️', color: 'from-indigo-400 to-indigo-600' },
]

export function AnimatedEcosystem() {
  const radius = 250
  const angleSlice = (Math.PI * 2) / ecosystemModules.length

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Integrated Ecosystem
          </h2>
          <p className="text-xl text-slate-600">
            9 interconnected modules powering rural agriculture
          </p>
        </motion.div>

        <div className="flex justify-center items-center min-h-[700px] relative">
          <svg className="absolute inset-0 w-full h-full max-w-2xl mx-auto" viewBox="0 0 600 600">
            {ecosystemModules.map((_, idx) => {
              const nextIdx = (idx + 1) % ecosystemModules.length
              const angle1 = angleSlice * idx - Math.PI / 2
              const angle2 = angleSlice * nextIdx - Math.PI / 2

              const x1 = 300 + radius * Math.cos(angle1)
              const y1 = 300 + radius * Math.sin(angle1)
              const x2 = 300 + radius * Math.cos(angle2)
              const y2 = 300 + radius * Math.sin(angle2)

              return (
                <motion.line
                  key={`line-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                />
              )
            })}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34,197,94)" />
                <stop offset="50%" stopColor="rgb(59,130,246)" />
                <stop offset="100%" stopColor="rgb(168,85,247)" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            className="absolute flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌾</div>
              <div className="text-sm font-bold text-white">AgreeConnect</div>
            </div>
          </motion.div>

          {ecosystemModules.map((module, idx) => {
            const angle = angleSlice * idx - Math.PI / 2
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)

            return (
              <motion.div
                key={module.name}
                className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${module.color} flex flex-col items-center justify-center cursor-pointer group`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                whileHover={{ scale: 1.1 }}
                viewport={{ once: true }}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div className="text-2xl mb-1">{module.icon}</div>
                <div className="text-xs font-bold text-white text-center px-2 leading-tight">
                  {module.name}
                </div>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
