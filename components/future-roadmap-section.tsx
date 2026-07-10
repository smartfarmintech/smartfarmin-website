'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function FutureRoadmapSection() {
  const roadmapItems = [
    {
      year: '2024',
      title: 'Digital Villages',
      description: 'Launch community centers with shared infrastructure and training programs',
      status: 'in-progress',
    },
    {
      year: '2024',
      title: 'Smart Irrigation',
      description: 'AI-driven water management reducing consumption by 40%',
      status: 'in-progress',
    },
    {
      year: '2025',
      title: 'Carbon Credits',
      description: 'Enable farmers to monetize sustainable practices',
      status: 'planned',
    },
    {
      year: '2025',
      title: 'Agricultural Finance',
      description: 'Micro-lending and credit scoring for farmers',
      status: 'planned',
    },
    {
      year: '2025',
      title: 'Crop Insurance',
      description: 'AI-powered parametric insurance for risk mitigation',
      status: 'planned',
    },
    {
      year: '2026',
      title: 'Supply Chain',
      description: 'End-to-end traceability from farm to consumer',
      status: 'future',
    },
    {
      year: '2026',
      title: 'Export Networks',
      description: 'Connect Indian farmers directly to global buyers',
      status: 'future',
    },
    {
      year: '2026',
      title: 'Smart Warehouses',
      description: 'Cold chain and storage optimization',
      status: 'future',
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
            Our Vision for Tomorrow
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building the complete digital ecosystem for Indian agriculture
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          {roadmapItems.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`p-6 rounded-xl border-2 transition-all ${
                item.status === 'in-progress'
                  ? 'border-primary bg-primary/5 hover:bg-primary/10'
                  : item.status === 'planned'
                  ? 'border-accent bg-accent/5 hover:bg-accent/10'
                  : 'border-muted bg-muted/5 hover:bg-muted/10'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {item.status === 'in-progress' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </motion.div>
                  )}
                  {item.status === 'planned' && (
                    <ArrowRight className="w-8 h-8 text-accent" />
                  )}
                  {item.status === 'future' && (
                    <div className="w-8 h-8 rounded-full border-2 border-muted" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-accent px-3 py-1 rounded-full bg-accent/10">
                      {item.year}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {item.status === 'in-progress' && (
                  <div className="flex-shrink-0">
                    <span className="text-xs font-semibold text-primary px-3 py-1 rounded-full bg-primary/10">
                      In Progress
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-muted-foreground mb-8">
            This is just the beginning. We&apos;re building the future of agriculture together.
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Revolution
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
