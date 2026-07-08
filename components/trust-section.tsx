'use client';

import React from 'react';
import { Users, MapPin, Wrench, Zap, BarChart3, Leaf } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { GlassCard } from '@/components/cards/glass-card';
import { motion } from 'framer-motion';

const trustMetrics = [
  {
    icon: <Users className="size-8 text-forest-green" />,
    value: 2000,
    suffix: '+',
    label: 'Registered Farmers',
    description: 'Across India',
  },
  {
    icon: <MapPin className="size-8 text-fresh-mint" />,
    value: 100,
    suffix: '+',
    label: 'Villages Connected',
    description: 'Nationwide reach',
  },
  {
    icon: <Wrench className="size-8 text-golden-yellow" />,
    value: 250,
    suffix: '+',
    label: 'Machinery Operators',
    description: 'Equipment available',
  },
  {
    icon: <Zap className="size-8 text-harvest-orange" />,
    value: 100,
    suffix: '+',
    label: 'Drone Operators',
    description: 'Precision services',
  },
  {
    icon: <BarChart3 className="size-8 text-leaf-green" />,
    value: 10000,
    suffix: '+',
    label: 'Bookings Completed',
    description: 'Successful operations',
  },
  {
    icon: <Leaf className="size-8 text-fresh-mint" />,
    value: 500,
    suffix: '+',
    label: 'Drone Missions',
    description: 'Acres covered',
  },
];

const trustBadges = [
  'AI Powered',
  'GPS Enabled',
  'Secure Payments',
  'Government Ready',
  'Enterprise Ready',
  'Weather Intelligence',
  'Made in India',
];

export function TrustSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-b from-white via-soft-mint-50 to-cream-50">
      {/* Animated background elements */}
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-forest-green/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-golden-yellow/3 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900">
            Trusted by India&apos;s Farmers
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Farmers, machinery operators, drone pilots, and enterprises rely on Rythu360 for seamless agricultural technology integration
          </p>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {trustMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-forest-green/10 hover:border-forest-green/30 hover:bg-white/70 transition-all shadow-sm hover:shadow-xl"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-forest-green/10 to-fresh-mint/10 w-fit">
                {metric.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-forest-green mb-2 font-mono">
                <AnimatedCounter
                  end={metric.value}
                  suffix={metric.suffix}
                  duration={2000}
                />
              </div>
              <p className="text-sm text-gray-700 font-bold">{metric.label}</p>
              <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
              <div className="mt-4 pt-4 border-t border-forest-green/10 flex items-center justify-between">
                <span className="inline-flex h-2 w-2 rounded-full bg-leaf-green animate-pulse" />
                <span className="text-xs text-forest-green font-semibold">Live Data</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-16 border-t border-forest-green/10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Farmers Choose Rythu360</h3>
            <p className="text-gray-700 font-medium max-w-2xl mx-auto">
              Enterprise-ready platform built with trust, security, and farmer success at its core
            </p>
          </div>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                className="px-4 py-3 rounded-2xl bg-gradient-to-br from-forest-green/5 to-fresh-mint/5 border border-forest-green/20 text-center hover:border-forest-green/40 hover:bg-gradient-to-br hover:from-forest-green/10 hover:to-fresh-mint/10 transition-all cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-bold text-forest-green text-pretty">{badge}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
