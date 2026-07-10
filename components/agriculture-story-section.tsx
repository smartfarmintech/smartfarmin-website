'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function AgricultureStorySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-12"
        >
          {/* Main Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.h2
                variants={itemVariants}
                className="text-5xl md:text-6xl font-serif font-bold text-balance leading-tight text-foreground"
              >
                Agriculture Feeds the World
              </motion.h2>
              <motion.h3
                variants={itemVariants}
                className="text-3xl md:text-4xl font-serif font-bold text-balance text-accent"
              >
                Technology Should Empower It
              </motion.h3>
            </div>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
            >
              For centuries, Indian farmers have fed the nation through tradition, hard work, and deep knowledge of the land. Yet today, they face unprecedented challenges: unpredictable monsoons, rising input costs, fragmented markets, and limited access to modern tools.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
            >
              While technology has transformed every other industry, agriculture remains largely unchanged. Farmers still make decisions based on intuition and outdated information. They lack access to quality machinery, fair prices, and timely guidance.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
            >
              This is where Rythu360 steps in. We believe every farmer deserves access to world-class technology, market access, and expert guidance. We&apos;re building the digital operating system that connects farmers directly with technology, markets, and opportunities.
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/story-agriculture.png"
              alt="Indian farmers working in fields"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Three Pillars */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 pt-8"
          >
            {[
              {
                title: 'Empowerment',
                description: 'AI-powered guidance and precision farming tools to help farmers make better decisions and increase yields.',
              },
              {
                title: 'Access',
                description: 'Direct connection to markets, machinery, and services without middlemen. Fair prices and real opportunities.',
              },
              {
                title: 'Community',
                description: 'Connect with a network of farmers, experts, and enterprises. Share knowledge and grow together.',
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="space-y-4 p-8 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <h4 className="text-2xl font-serif font-bold text-foreground">
                  {pillar.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-8"
          >
            <p className="text-lg text-muted-foreground mb-6">
              We&apos;re not just building a platform. We&apos;re building the future of Indian agriculture.
            </p>
            <motion.a
              href="#ecosystem"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See the Ecosystem
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
