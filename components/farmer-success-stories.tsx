'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

const stories = [
  { name: 'Ramesh Kumar', location: 'Karnataka', income: '₹5L to ₹15L', crop: 'Cotton', icon: '👨‍🌾' },
  { name: 'Savitri Devi', location: 'Maharashtra', income: '₹3L to ₹10L', crop: 'Soybean', icon: '👩‍🌾' },
  { name: 'Arjun Singh', location: 'Punjab', income: '₹8L to ₹20L', crop: 'Wheat', icon: '👨‍🌾' },
  { name: 'Lakshmi Amma', location: 'Andhra Pradesh', income: '₹2L to ₹8L', crop: 'Groundnut', icon: '👵' },
  { name: 'Mohan Reddy', location: 'Telangana', income: '₹4L to ₹12L', crop: 'Maize', icon: '👨‍🌾' },
  { name: 'Priya Sharma', location: 'Himachal', income: '₹3.5L to ₹9L', crop: 'Apple', icon: '👩‍🌾' },
]

export function FarmerSuccessStories() {
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
            Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real farmers transforming their lives with Rythu360
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative group rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600" />
              <div className="relative p-8 text-white">
                <div className="text-5xl mb-4">{story.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{story.name}</h3>
                <p className="text-sm text-green-100 mb-4">{story.location}</p>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span>Income Growth:</span>
                    <span className="font-bold">{story.income}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Main Crop:</span>
                    <span className="font-bold">{story.crop}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Play size={16} />
                  Watch Story
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-6">
            Average income increase: <span className="font-bold text-slate-900">3-5x</span> within 2 years
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Share Your Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
