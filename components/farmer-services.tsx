'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, CheckCircle, Users } from 'lucide-react'
import { farmerServices, serviceCategories, type FarmerService } from '@/lib/services-catalog'

export function FarmerServices() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return farmerServices
    if (selectedCategory === 'popular') {
      return farmerServices.filter(s => s.rating >= 4.8)
    }
    return farmerServices.filter(s => s.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            48+ Farmer-Friendly Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything from land preparation to harvest—all in one platform
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {serviceCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-green-500'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.02 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all"
            >
              {/* Card Header with Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform">
                  {service.categoryEmoji}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {service.verified && (
                    <div className="bg-green-500 text-white rounded-full p-1.5" title="Verified">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Title & Price */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <div className="mb-3 flex items-baseline justify-between">
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>

                {/* Price Badge */}
                <div className="mb-4 inline-block px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <span className="text-green-700 font-semibold text-sm">{service.price}</span>
                </div>

                {/* Rating & Stats Row */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(service.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{service.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">{service.jobsCompleted?.toLocaleString()} jobs</span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 mb-4">
                  {service.availability && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-700">{service.availability}</span>
                    </div>
                  )}

                  {service.providersNearby && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={14} className="text-slate-500" />
                      <span className="text-slate-600">{service.providersNearby} providers nearby</span>
                    </div>
                  )}

                  {service.arrivalTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-slate-500" />
                      <span className="text-slate-600">Arrives in {service.arrivalTime}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 mb-6">
            Showing <span className="font-bold text-slate-900">{filteredServices.length}</span> services
            {selectedCategory !== 'all' && selectedCategory !== 'popular' && ` in ${serviceCategories.find(c => c.id === selectedCategory)?.label}`}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            View All Services
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
