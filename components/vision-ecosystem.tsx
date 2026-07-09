'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Leaf, Zap, Tractor, Cloud, Droplets, BarChart3, MapPin, Building2, Smartphone, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VisionEcosystem() {
  const visionStages = [
    { year: 'Traditional', description: 'Manual farming methods', icon: '🌾' },
    { year: 'Mechanized', description: 'Basic machinery adoption', icon: '🚜' },
    { year: 'Digital', description: 'Technology integration', icon: '💻' },
    { year: 'Artificial Intelligence', description: 'AI-driven decisions', icon: '🤖' },
    { year: 'Precision', description: 'Data-optimized farming', icon: '🎯' },
    { year: 'Sustainable', description: 'Climate-smart agriculture', icon: '🌍' },
  ]

  const ecosystemServices = [
    {
      title: 'AI Crop Doctor',
      description: 'Real-time disease detection and crop health monitoring',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Machinery Booking',
      description: 'Access to verified tractors and farm equipment',
      icon: Tractor,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Drone Services',
      description: 'Professional drone spraying and field surveying',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Weather Intelligence',
      description: 'Hyperlocal weather forecasts and alerts',
      icon: Cloud,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Smart Irrigation',
      description: 'AI-optimized water management systems',
      icon: Droplets,
      color: 'from-teal-500 to-green-500',
    },
    {
      title: 'Solar Farming',
      description: 'Renewable energy integration for farms',
      icon: Leaf,
      color: 'from-lime-500 to-green-500',
    },
    {
      title: 'Farm Analytics',
      description: 'Comprehensive farm performance insights',
      icon: BarChart3,
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: 'GPS Tracking',
      description: 'Real-time machinery and asset tracking',
      icon: MapPin,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Government Services',
      description: 'Direct access to schemes and subsidies',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Marketplace',
      description: 'Direct farmer-to-buyer platform',
      icon: Smartphone,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Enterprise Solutions',
      description: 'B2B tools for agribusinesses',
      icon: Users,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Organic Store',
      description: 'Premium organic produce marketplace',
      icon: Leaf,
      color: 'from-green-600 to-emerald-600',
    },
  ]

  return (
    <>
      {/* Vision Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Our Vision for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                the Future of Farming
              </span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-200 to-emerald-200" />

            <div className="space-y-12">
              {visionStages.map((stage, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                      <p className="text-2xl mb-2">{stage.icon}</p>
                      <h3 className="text-xl font-bold text-gray-900">{stage.year}</h3>
                      <p className="text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  <div className="w-0 flex justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full ring-4 ring-white absolute" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              One Platform.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Complete Agriculture Ecosystem.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything a farmer needs to grow smarter, faster, and more sustainably.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`h-24 bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <a href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center mt-16"
          >
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              Explore All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
