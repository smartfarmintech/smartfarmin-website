'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function LivePlatformSection() {
  const [activeTab, setActiveTab] = useState(0)

  const dashboards = [
    {
      title: 'Farmer Dashboard',
      description: 'Real-time crop insights, AI recommendations, and service bookings',
      features: ['Crop Health Monitor', 'Weather Alerts', 'Marketplace Access', 'AI Guidance'],
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Operator Dashboard',
      description: 'Drone fleet management and real-time mission tracking',
      features: ['Mission Planning', 'Live Tracking', 'Service History', 'Earnings Analytics'],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Enterprise Dashboard',
      description: 'Bulk purchasing and supply chain management',
      features: ['Supplier Network', 'Price Analytics', 'Order Management', 'Quality Tracking'],
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Government Dashboard',
      description: 'Agricultural monitoring and subsidy distribution',
      features: ['Field Monitoring', 'Subsidy Tracking', 'Farmer Registry', 'Impact Metrics'],
      color: 'from-orange-500 to-amber-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background to-accent/5">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
          animate={{
            x: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              Live Platform Dashboards
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored interfaces for every stakeholder in the Rythu360 ecosystem
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 justify-center"
          >
            {dashboards.map((dashboard, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === i
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card border border-border text-foreground hover:bg-secondary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dashboard.title}
              </motion.button>
            ))}
          </motion.div>

          {/* Dashboard Content */}
          <motion.div
            variants={itemVariants}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className={`rounded-2xl bg-gradient-to-br ${dashboards[activeTab].color} p-1`}>
              <div className="bg-card rounded-2xl p-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
                      {dashboards[activeTab].title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {dashboards[activeTab].description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {dashboards[activeTab].features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors"
                      >
                        <p className="font-semibold text-foreground">{feature}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="pt-4 flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg transition-shadow">
                      Explore Dashboard
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
