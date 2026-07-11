'use client'

import { motion } from 'framer-motion'

const challenges = [
  { title: 'Low Prices', desc: 'Limited market access reduces profits', icon: '📉' },
  { title: 'Unpredictable Weather', desc: 'Monsoon failures impact yields', icon: '⛈️' },
  { title: 'Expensive Equipment', desc: 'High cost of machinery', icon: '🚜' },
  { title: 'Limited Education', desc: 'Lack of modern farming techniques', icon: '📚' },
  { title: 'No Credit Access', desc: 'Difficulty obtaining loans', icon: '🏦' },
  { title: 'Pest & Diseases', desc: 'Crop damage without quick solutions', icon: '🐛' },
  { title: 'Market Exploitation', desc: 'Middlemen taking high margins', icon: '🤝' },
  { title: 'Soil Degradation', desc: 'Declining soil fertility', icon: '🌍' },
  { title: 'Water Scarcity', desc: 'Irregular water supply', icon: '💧' },
  { title: 'Labor Shortage', desc: 'Difficulty hiring seasonal workers', icon: '👨‍🌾' },
  { title: 'No Tech Access', desc: 'Limited digital tools', icon: '📱' },
  { title: 'Storage Issues', desc: 'Post-harvest losses', icon: '🏚️' },
  { title: 'Complex Regulations', desc: 'Confusing government policies', icon: '📋' },
  { title: 'Limited Scale', desc: 'Small landholdings', icon: '📐' },
]

export function RealityOfAgriculture() {
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
            The Reality of Indian Agriculture
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            14 major challenges farmers face daily. Rythu360 solves them all.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {challenges.map((challenge, idx) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="p-6 rounded-xl bg-white border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{challenge.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{challenge.title}</h3>
              <p className="text-sm text-slate-600">{challenge.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
        >
          <h3 className="text-2xl font-bold text-green-900 mb-4">Our Solution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
            <div>✓ Direct market access without middlemen</div>
            <div>✓ AI-powered weather predictions</div>
            <div>✓ Equipment sharing marketplace</div>
            <div>✓ Free farming education</div>
            <div>✓ Micro-credit at low interest rates</div>
            <div>✓ Instant pest advisory</div>
            <div>✓ Fair price guarantees</div>
            <div>✓ Soil testing and remediation</div>
            <div>✓ Irrigation optimization</div>
            <div>✓ Labor marketplace</div>
            <div>✓ Mobile app with Hindi/Telugu support</div>
            <div>✓ Scientific storage facilities</div>
            <div>✓ Government scheme assistance</div>
            <div>✓ Cooperative formation support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
