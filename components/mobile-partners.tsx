'use client'

import { motion } from 'framer-motion'
import { Download, Apple, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobilePartners() {
  const appFeatures = [
    { icon: '📍', label: 'Live GPS Tracking', desc: 'Real-time machinery location' },
    { icon: '🤖', label: 'AI Crop Doctor', desc: 'Disease detection on the go' },
    { icon: '⛅', label: 'Weather Alerts', desc: 'Hyperlocal forecasts' },
    { icon: '💳', label: 'Secure Payments', desc: 'Digital wallet integration' },
    { icon: '📊', label: 'Farm Analytics', desc: 'Performance insights' },
    { icon: '🔔', label: 'Notifications', desc: 'Real-time updates' },
  ]

  const partners = [
    { name: 'Government of India', category: 'Government', icon: '🏛️' },
    { name: 'SBI', category: 'Banking', icon: '🏦' },
    { name: 'Axis Bank', category: 'Banking', icon: '🏦' },
    { name: 'HDFC Insurance', category: 'Insurance', icon: '🛡️' },
    { name: 'Agricultural Universities', category: 'Education', icon: '🎓' },
    { name: 'Tata Motors', category: 'Equipment', icon: '🚗' },
    { name: 'John Deere', category: 'Equipment', icon: '🚜' },
    { name: 'Airbus Helicopters', category: 'Drone Tech', icon: '🚁' },
  ]

  return (
    <>
      {/* Mobile App Section */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                Farming in Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Pocket
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-12">
                Download the Rythu360 app to access all platform features from anywhere. Manage your farm, book services, and monitor crops in real-time.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {appFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6 }}
                    className="flex gap-3"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{feature.label}</p>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Download buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex gap-4"
              >
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                  <Apple className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </motion.div>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-8"
              >
                <p className="text-sm text-gray-600 mb-3">Scan to download</p>
                <div className="w-32 h-32 bg-white rounded-lg p-3 border-2 border-gray-300 inline-block">
                  <div className="text-center text-2xl h-full flex items-center justify-center text-gray-400">QR</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - App mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center"
            >
              <div className="relative w-64 h-96 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl shadow-2xl flex items-center justify-center border-8 border-gray-800">
                <div className="text-center text-white">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-2">Rythu360 App</p>
                  <p className="text-sm opacity-80">Premium farming experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Trusted by India&apos;s Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Partnered with government bodies, financial institutions, and industry leaders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="text-5xl mb-4">{partner.icon}</div>
                <p className="font-bold text-gray-900 mb-2">{partner.name}</p>
                <p className="text-sm text-gray-600">{partner.category}</p>
              </motion.div>
            ))}
          </div>

          {/* Partnership CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-12 text-center border-2 border-green-200"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Become a Partner</h3>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Join our ecosystem and reach millions of farmers across India. We're looking for innovative partners in technology, finance, agriculture, and services.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Explore Partnership Opportunities
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
