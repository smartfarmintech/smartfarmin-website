'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Zap, Users, TrendingUp } from 'lucide-react'

export function ChallengeMission() {
  const challenges = [
    { icon: AlertCircle, title: 'Labour Shortages', description: 'Limited agricultural workforce affecting crop management' },
    { icon: Users, title: 'Unpredictable Weather', description: 'Climate changes impacting harvest planning' },
    { icon: TrendingUp, title: 'High Operational Costs', description: 'Expensive machinery and inefficient resource use' },
    { icon: Zap, title: 'Manual Processes', description: 'Time-consuming traditional farming methods' },
  ]

  return (
    <>
      {/* Challenge Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Agriculture is Changing.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Technology Must Lead.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Indian farmers face unprecedented challenges. Rythu360 provides the tools to thrive in the digital agriculture era.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Challenges list */}
            <div className="space-y-6">
              {challenges.map((challenge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100">
                      <challenge.icon className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Solution illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-12 text-center h-96 flex items-center justify-center"
            >
              <div>
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Rythu360 Solutions</h3>
                <p className="text-green-800">Intelligent technology solving real farmer challenges</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-4">Our Mission</p>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              Empowering Every Farmer
              <br />
              with Technology
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We believe technology should serve farmers, not complicate their lives. Rythu360 is built from the ground up to understand the unique challenges of Indian agriculture — from monsoons to market access, from soil health to sustainable practices. We're creating an ecosystem where every farmer, regardless of farm size or location, can access world-class tools, expertise, and marketplace opportunities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              { label: 'Inclusive', value: 'Technology for all farmers' },
              { label: 'Sustainable', value: 'Environmentally responsible' },
              { label: 'Intelligent', value: 'AI-driven decision making' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-green-600 font-semibold">{item.label}</p>
                <p className="text-gray-600 text-sm mt-2">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
