'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

export function HowItWorksDashboard() {
  const steps = [
    { number: '1', title: 'Register', description: 'Create your farmer profile in minutes' },
    { number: '2', title: 'Select Farm', description: 'Add your farm details and location' },
    { number: '3', title: 'Choose Service', description: 'Browse machinery, drones, or AI tools' },
    { number: '4', title: 'Book & Pay', description: 'Secure digital payment processing' },
    { number: '5', title: 'Live Tracking', description: 'Monitor service in real-time' },
    { number: '6', title: 'AI Monitoring', description: 'Get real-time crop health insights' },
    { number: '7', title: 'Complete', description: 'Digital invoice and performance report' },
    { number: '8', title: 'Harvest Insights', description: 'AI recommendations for next season' },
  ]

  const dashboards = [
    {
      title: 'Farmer Dashboard',
      items: ['Bookings', 'Weather Alerts', 'AI Recommendations', 'Payments', 'Analytics'],
      icon: '👨‍🌾',
    },
    {
      title: 'Operator Dashboard',
      items: ['Daily Jobs', 'Earnings', 'Equipment Health', 'Ratings', 'Schedule'],
      icon: '🚜',
    },
    {
      title: 'Enterprise Dashboard',
      items: ['Fleet Management', 'Analytics', 'Team', 'Billing', 'Reports'],
      icon: '🏢',
    },
  ]

  return (
    <>
      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, intuitive, and designed for farmers. Get started in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                className="relative"
              >
                {/* Connecting line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-green-300 to-transparent transform translate-y-0 -z-10" />
                )}

                <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-green-500 relative">
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Platform Dashboards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beautiful, intuitive dashboards designed for every user type.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {dashboards.map((dashboard, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
              >
                {/* Dashboard header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
                  <div className="text-5xl mb-4">{dashboard.icon}</div>
                  <h3 className="text-2xl font-bold">{dashboard.title}</h3>
                </div>

                {/* Dashboard content */}
                <div className="p-8">
                  <div className="space-y-4">
                    {dashboard.items.map((item, itemIdx) => (
                      <motion.div
                        key={itemIdx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (idx * 0.1) + (itemIdx * 0.05), duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Dashboard preview placeholder */}
                  <div className="mt-8 bg-white rounded-lg p-6 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm text-gray-500">Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dashboard features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 grid md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Real-Time Data', value: 'Live updates every second' },
              { label: 'AI Analytics', value: 'Predictive insights' },
              { label: 'Mobile Sync', value: 'Access anywhere' },
              { label: 'Secure', value: 'Bank-level encryption' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                <p className="text-green-600 font-semibold text-sm">{feature.label}</p>
                <p className="text-gray-600 text-sm mt-2">{feature.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
