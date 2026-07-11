'use client'

import { motion } from 'framer-motion'

const temples = [
  { name: 'Sri Veerabhadreshwara Temple', district: 'Chikkaballapur', priests: 3, annualFestivals: 6 },
  { name: 'Keshava Temple', district: 'Hassan', priests: 5, annualFestivals: 8 },
  { name: 'Lakshmi Narasimha Temple', district: 'Bengaluru', priests: 4, annualFestivals: 5 },
  { name: 'Adi Shankara Matha', district: 'Sringeri', priests: 6, annualFestivals: 12 },
  { name: 'Channakeshava Temple', district: 'Belur', priests: 4, annualFestivals: 7 },
  { name: 'Hoysaleshwara Temple', district: 'Halebidu', priests: 3, annualFestivals: 6 },
  { name: 'Vitthala Temple', district: 'Hampi', priests: 5, annualFestivals: 10 },
  { name: 'Virupaksha Temple', district: 'Hampi', priests: 6, annualFestivals: 9 },
]

export function TempleInformation() {
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
            Sacred Temples Near You
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Information about 8 historic temples in your region
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {temples.map((temple, idx) => (
            <motion.div
              key={temple.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">🕉️</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">{temple.name}</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <p><span className="font-semibold">District:</span> {temple.district}</p>
                <p><span className="font-semibold">Priests:</span> {temple.priests}</p>
                <p><span className="font-semibold">Annual Festivals:</span> {temple.annualFestivals}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full mt-4 py-2 text-xs font-semibold text-orange-700 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 transition-all"
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200"
        >
          <h3 className="text-xl font-bold text-orange-900 mb-4">Temple Services Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-orange-800">
            <div>🙏 Darshan (Viewing)</div>
            <div>🎉 Festival Services</div>
            <div>🕯️ Puja Bookings</div>
            <div>📅 Event Planning</div>
            <div>🎁 Offerings & Donations</div>
            <div>🚪 Temple Information Desk</div>
          </div>
          <p className="text-xs text-orange-700 mt-4">
            Note: We do not facilitate ticket sales or commercialization of temple services.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
