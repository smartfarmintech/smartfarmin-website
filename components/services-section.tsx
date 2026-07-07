'use client';

import React from 'react';
import { Zap, Wrench, Droplets, ShoppingCart, Cloud, Beaker, CreditCard, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/cards/glass-card';

const services = [
  {
    icon: <Zap className="size-8" />,
    title: 'AI Crop Advisory',
    description: 'Real-time crop health monitoring with machine learning insights',
    features: ['Disease detection', 'Yield prediction', 'Optimal timing'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: <Wrench className="size-8" />,
    title: 'Machinery Booking',
    description: 'Book tractors, harvesters, and equipment with transparent pricing',
    features: ['Real-time availability', 'GPS tracking', 'Skilled operators'],
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: <Droplets className="size-8" />,
    title: 'Drone Spraying',
    description: 'Automated drone services for precise and efficient pesticide application',
    features: ['Live tracking', 'Weather monitoring', 'Digital records'],
    color: 'from-yellow-500 to-orange-600',
  },
  {
    icon: <ShoppingCart className="size-8" />,
    title: 'Marketplace',
    description: 'Fair pricing marketplace connecting farmers directly with buyers',
    features: ['No middlemen', 'Quality assured', 'Bulk orders'],
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: <Cloud className="size-8" />,
    title: 'Weather Intelligence',
    description: 'Hyperlocal weather forecasts and agricultural recommendations',
    features: ['15-day forecast', 'Crop-specific alerts', 'Risk mitigation'],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: <Beaker className="size-8" />,
    title: 'Soil Testing',
    description: 'Soil health analysis with personalized nutrient recommendations',
    features: ['Lab testing', 'Custom reports', 'Fertilizer suggestions'],
    color: 'from-amber-500 to-yellow-600',
  },
  {
    icon: <CreditCard className="size-8" />,
    title: 'Farmer Credit',
    description: 'Quick, collateral-free loans with flexible repayment terms',
    features: ['Instant approval', 'Low interest', 'Easy repayment'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <Shield className="size-8" />,
    title: 'Insurance',
    description: 'Comprehensive crop insurance with quick claim settlement',
    features: ['Crop protection', 'Weather coverage', 'Quick payouts'],
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: <Leaf className="size-8" />,
    title: 'Government Schemes',
    description: 'Direct access to government subsidies and agricultural programs',
    features: ['Easy enrollment', 'Documentation help', 'Direct benefits'],
    color: 'from-green-600 to-lime-600',
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl pointer-events-none transform -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Premium Services
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Comprehensive agriculture solutions designed for every farmer's needs
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`fade-in stagger-item-${(index % 9) + 1}`}
            >
              <GlassCard hover variant="lg" className="h-full flex flex-col">
                {/* Icon with gradient background */}
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/20`}>
                  {service.icon}
                </div>

                {/* Title and description */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-white/70 mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-6 pb-6 border-b border-white/10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
                      <span className="inline-flex h-4 w-4 rounded-full bg-green-500/30 border border-green-500/50 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0 transition-all duration-300"
                  size="sm"
                >
                  Learn More
                </Button>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
