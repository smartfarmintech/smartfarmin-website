'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'

export function TestimonialsImpact() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Farmer, Karnataka',
      quote: 'Rythu360 helped me reduce costs by 40% and increase yield by 25%. The AI crop doctor is incredible!',
      image: '👨‍🌾',
      rating: 5,
    },
    {
      name: 'Priya Singh',
      role: 'Machinery Owner, Punjab',
      quote: 'I book my equipment consistently through Rythu360. The platform is transparent and reliable.',
      image: '👩‍💼',
      rating: 5,
    },
    {
      name: 'Vikram Patel',
      role: 'Drone Operator, Gujarat',
      quote: 'Steady income through drone bookings. The platform takes care of payments and tracking perfectly.',
      image: '👨‍✈️',
      rating: 5,
    },
    {
      name: 'Anitha Devi',
      role: 'Organic Farmer, Tamil Nadu',
      quote: 'Direct market access through the organic store. Fair prices and zero middlemen. Game changer!',
      image: '👩‍🌾',
      rating: 5,
    },
  ]

  const impactMetrics = [
    { label: 'Farmers Connected', value: '2,50,000+', icon: '👥' },
    { label: 'Villages Served', value: '5,000+', icon: '🏘️' },
    { label: 'Machinery Bookings', value: '50,000+', icon: '🚜' },
    { label: 'Drone Missions', value: '25,000+', icon: '🚁' },
    { label: 'Acres Managed', value: '5,00,000+', icon: '🌾' },
    { label: 'Weather Alerts', value: '10M+', icon: '⛅' },
    { label: 'AI Recommendations', value: '50M+', icon: '🤖' },
    { label: 'Service Partners', value: '10,000+', icon: '🤝' },
  ]

  return (
    <>
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Farmer Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from farmers, operators, and businesses using Rythu360.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-lg mb-6 font-medium leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transforming Indian agriculture, one farm at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border-2 border-green-100"
              >
                <div className="text-5xl mb-4">{metric.icon}</div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-3">
                  {metric.label}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 + 0.3, duration: 0.8 }}
                  className="text-4xl lg:text-5xl font-bold text-green-600"
                >
                  {metric.value}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Impact statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white text-center"
          >
            <p className="text-2xl lg:text-3xl font-bold mb-4">
              Empowering Agricultural Transformation
            </p>
            <p className="text-lg text-green-100 max-w-3xl mx-auto">
              Rythu360 is committed to sustainable agriculture, rural development, and economic empowerment of farming communities across India.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
