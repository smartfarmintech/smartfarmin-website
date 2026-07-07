'use client';

import React from 'react';
import { Users, MapPin, Wrench, Zap, BarChart3, ShoppingCart } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { GlassCard } from '@/components/cards/glass-card';

const trustMetrics = [
  {
    icon: <Users className="size-8 text-emerald-400" />,
    value: 10000,
    suffix: '+',
    label: 'Farmers Registered',
  },
  {
    icon: <MapPin className="size-8 text-cyan-400" />,
    value: 500,
    suffix: '+',
    label: 'Villages Connected',
  },
  {
    icon: <Wrench className="size-8 text-amber-400" />,
    value: 250,
    suffix: '+',
    label: 'Machinery Partners',
  },
  {
    icon: <Zap className="size-8 text-orange-400" />,
    value: 100,
    suffix: '+',
    label: 'Drone Operators',
  },
  {
    icon: <BarChart3 className="size-8 text-emerald-400" />,
    value: 15,
    suffix: '+',
    label: 'Government Programs',
  },
  {
    icon: <ShoppingCart className="size-8 text-pink-400" />,
    value: 500,
    suffix: '+',
    label: 'Marketplace Sellers',
  },
];

export function TrustSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Sunrise theme background orbs */}
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Trusted Across India
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Farmers, operators, and partners rely on Rythu360 for seamless agricultural technology integration
          </p>
        </div>

        {/* Metrics grid with animated counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustMetrics.map((metric, index) => (
            <GlassCard
              key={index}
              variant="md"
              className={`fade-in stagger-item-${(index % 9) + 1} flex flex-col items-center justify-center text-center`}
              hover
            >
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                {metric.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                <AnimatedCounter
                  end={metric.value}
                  suffix={metric.suffix}
                  duration={2000}
                />
              </div>
              <p className="text-sm text-white/70 font-medium">{metric.label}</p>
              <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-center gap-1">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Verified</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Trust indicators row */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
              { title: '100% Verified', desc: 'All operators and partners verified' },
              { title: 'Secure Payments', desc: 'SSL encrypted transactions' },
              { title: 'ISO Certified', desc: 'Enterprise-grade security standards' },
            ].map((indicator, idx) => (
              <div key={idx} className="fade-in stagger-item-5 text-center space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 mx-auto">
                  <Zap className="size-5 text-green-400" />
                </div>
                <h4 className="font-semibold text-white">{indicator.title}</h4>
                <p className="text-sm text-white/60">{indicator.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
