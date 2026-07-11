'use client'

import { motion } from 'framer-motion'

const services = [
  { title: 'Soil Testing', desc: 'Lab analysis for soil health', icon: '🔬' },
  { title: 'Crop Advisory', desc: 'AI-powered farming guidance', icon: '🤖' },
  { title: 'Market Prices', desc: 'Real-time commodity prices', icon: '📊' },
  { title: 'Weather Forecast', desc: '15-day prediction', icon: '🌤️' },
  { title: 'Equipment Rental', desc: 'Share expensive machinery', icon: '🚜' },
  { title: 'Drone Spraying', desc: 'Precision pesticide application', icon: '🚁' },
  { title: 'Storage Facility', desc: 'Safe post-harvest storage', icon: '🏭' },
  { title: 'Insurance Plans', desc: 'Crop and life insurance', icon: '🛡️' },
  { title: 'Financing', desc: 'Low-interest farm loans', icon: '💰' },
  { title: 'Training Videos', desc: 'Learn modern techniques', icon: '📹' },
  { title: 'Community Forum', desc: 'Connect with other farmers', icon: '💬' },
  { title: 'Marketplace', desc: 'Sell directly to buyers', icon: '🛒' },
  { title: 'Livestock Health', desc: 'Veterinary advisory', icon: '🐄' },
  { title: 'Water Management', desc: 'Irrigation optimization', icon: '💧' },
  { title: 'Government Schemes', desc: 'Assistance and subsidies', icon: '📜' },
  { title: 'Labor Services', desc: 'Find seasonal workers', icon: '👨‍🌾' },
  { title: 'Transportation', desc: 'Farm to market logistics', icon: '🚚' },
  { title: 'Quality Certification', desc: 'Organic & export standards', icon: '✅' },
  { title: 'Weather Station', desc: 'Local micro-climate data', icon: '⛅' },
  { title: 'Soil Mapping', desc: 'Field-level soil analysis', icon: '🗺️' },
  { title: 'Pest Management', desc: 'Integrated pest control', icon: '🐛' },
  { title: 'Climate Data', desc: 'Historical weather patterns', icon: '📈' },
  { title: 'Field Tours', desc: 'Learn from expert farms', icon: '👁️' },
  { title: 'Expert Consultation', desc: '1-on-1 video consulting', icon: '👨‍💼' },
  { title: 'Crop Insurance', desc: 'Monsoon & hail protection', icon: '⛈️' },
  { title: 'Buyer Network', desc: 'Connect with B2B buyers', icon: '🤝' },
  { title: 'Contract Farming', desc: 'Guaranteed procurement', icon: '📋' },
  { title: 'Farming News', desc: 'Daily agriculture updates', icon: '📰' },
  { title: 'Mobile App', desc: 'All services in your pocket', icon: '📱' },
  { title: 'Customer Support', desc: 'Hindi/Telugu 24/7 help', icon: '☎️' },
]

export function PremiumServices() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            30+ Services Included
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything a farmer needs, all in one platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.03 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all group text-center"
            >
              <div className="text-3xl mb-3 group-hover:scale-125 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{service.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-6">
            All services available at{' '}
            <span className="font-bold text-slate-900">one subscription</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
