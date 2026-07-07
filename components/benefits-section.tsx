'use client';

import React from 'react';
import { Zap, IndianRupee, CheckCircle, Headphones, Users, CreditCard, TrendingUp, Bell } from 'lucide-react';
import { GlassCard } from '@/components/cards/glass-card';

const benefits = [
  {
    icon: <Zap className="size-8 text-yellow-400" />,
    title: 'AI Powered',
    description: 'Machine learning algorithms optimize every farming decision in real-time',
  },
  {
    icon: <IndianRupee className="size-8 text-green-400" />,
    title: 'Affordable',
    description: 'Lowest pricing in the market with no hidden charges or subscriptions',
  },
  {
    icon: <CheckCircle className="size-8 text-blue-400" />,
    title: 'Trusted',
    description: '10,000+ farmers trust us with their harvests every season',
  },
  {
    icon: <Headphones className="size-8 text-purple-400" />,
    title: '24x7 Support',
    description: 'Dedicated support team available round the clock in local languages',
  },
  {
    icon: <Users className="size-8 text-cyan-400" />,
    title: 'Verified Operators',
    description: 'Background-checked and certified machinery and drone operators',
  },
  {
    icon: <CreditCard className="size-8 text-orange-400" />,
    title: 'Digital Payments',
    description: 'Secure, cashless transactions with multiple payment options',
  },
  {
    icon: <TrendingUp className="size-8 text-emerald-400" />,
    title: 'Real Time Tracking',
    description: 'Live GPS tracking for machinery and drone operations',
  },
  {
    icon: <Bell className="size-8 text-pink-400" />,
    title: 'Instant Notifications',
    description: 'Get alerts for market prices, weather changes, and recommendations',
  },
];

export function BenefitsSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Why Choose Rythu360?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Built by farmers, for farmers - with enterprise-grade technology and support
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`fade-in stagger-item-${(index % 9) + 1}`}
            >
              <GlassCard
                hover
                variant="md"
                className="flex flex-col items-center text-center h-full"
              >
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-white/70">
                  {benefit.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 pt-12 border-t border-white/10 text-center fade-in">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to transform your farming?
          </h3>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Join thousands of farmers already benefiting from Rythu360's intelligent platform
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-lg transition-all duration-300 hover:translate-y-[-2px] shadow-lg shadow-green-600/40">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
