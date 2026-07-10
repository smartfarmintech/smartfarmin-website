'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, CheckCircle } from 'lucide-react'

export function MarketplaceSection() {
  const features = [
    { title: 'Direct Connections', description: 'Skip middlemen and connect directly with buyers' },
    { title: 'Fair Pricing', description: 'Real-time market rates and transparent transactions' },
    { title: 'Quality Guarantee', description: 'Verified buyers and secure payment systems' },
    { title: 'Bulk Purchasing', description: 'Aggregate farmer produce for enterprise buyers' },
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-rose-500/5 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute right-0 top-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
                <Users className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-rose-500">Farm Marketplace</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                Sell Directly to Buyers
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                No middlemen, no delays. Connect with buyers who value your produce and pay fair prices immediately.
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <button className="px-8 py-4 bg-rose-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
                Start Selling
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/platform-marketplace.png"
              alt="Farm Marketplace"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
