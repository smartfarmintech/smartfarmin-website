'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

const nearbyServices = [
  { name: 'Agricultural Supply Store', dist: '2.3 km', status: 'Open', rating: 4.8 },
  { name: 'Veterinary Clinic', dist: '1.5 km', status: 'Open', rating: 4.9 },
  { name: 'Equipment Rental Shop', dist: '4.2 km', status: 'Closed', rating: 4.7 },
  { name: 'Diesel Pump', dist: '0.8 km', status: 'Open', rating: 4.6 },
  { name: 'Fertilizer Dealer', dist: '3.1 km', status: 'Open', rating: 4.5 },
  { name: 'Seed Shop', dist: '1.9 km', status: 'Open', rating: 4.8 },
  { name: 'Farm Machinery Repair', dist: '5.6 km', status: 'Open', rating: 4.4 },
  { name: 'Agricultural Bank', dist: '2.7 km', status: 'Open', rating: 4.9 },
  { name: 'Pesticide Store', dist: '1.2 km', status: 'Open', rating: 4.7 },
  { name: 'Cold Storage', dist: '6.3 km', status: 'Open', rating: 4.6 },
  { name: 'Cooperative Society', dist: '3.8 km', status: 'Open', rating: 4.8 },
  { name: 'Agricultural Polytechnic', dist: '8.1 km', status: 'Open', rating: 4.5 },
]

export function NearbyServicesSection() {
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
            Nearby Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find agricultural services in your village
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyServices.map((service, idx) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-slate-900 mb-3 text-sm">{service.name}</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span>{service.dist}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className={service.status === 'Open' ? 'text-green-600' : 'text-red-600'} />
                  <span className={service.status === 'Open' ? 'text-green-600' : 'text-red-600'}>
                    {service.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐ {service.rating}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full mt-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:shadow-lg transition-shadow"
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
