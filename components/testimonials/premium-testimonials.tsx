'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/cards/glass-card';

interface Testimonial {
  id: number;
  name: string;
  village: string;
  state: string;
  crop: string;
  rating: number;
  story: string;
  photo: string;
  yieldIncrease: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    village: 'Marathalli',
    state: 'Karnataka',
    crop: 'Cotton',
    rating: 5,
    story: 'Using Rythu360 increased my cotton yield by 35% in just one season. The AI crop advisory helped me detect and prevent diseases early. Highly recommend!',
    photo: '👨‍🌾',
    yieldIncrease: '+35%',
    verified: true,
  },
  {
    id: 2,
    name: 'Priya Singh',
    village: 'Indore',
    state: 'Madhya Pradesh',
    crop: 'Soybean',
    rating: 5,
    story: 'The machinery booking service saved me ₹15,000 per season. No more waiting for equipment. The operators are professional and GPS tracking gives peace of mind.',
    photo: '👩‍🌾',
    yieldIncrease: '+28%',
    verified: true,
  },
  {
    id: 3,
    name: 'Suresh Rao',
    village: 'Belgaum',
    state: 'Karnataka',
    crop: 'Sugarcane',
    rating: 5,
    story: 'Drone spraying reduced my pesticide cost by 40%. The weather-based recommendations are spot-on. My field productivity increased significantly.',
    photo: '👨‍🌾',
    yieldIncrease: '+42%',
    verified: true,
  },
  {
    id: 4,
    name: 'Radha Devi',
    village: 'Dhanbad',
    state: 'Jharkhand',
    crop: 'Rice',
    rating: 5,
    story: 'The marketplace gave me fair prices for my rice. No middlemen, no cheating. I earned 50% more compared to selling through traditional channels.',
    photo: '👩‍🌾',
    yieldIncrease: '+50%',
    verified: true,
  },
  {
    id: 5,
    name: 'Rajesh Patel',
    village: 'Anand',
    state: 'Gujarat',
    crop: 'Groundnut',
    rating: 4.8,
    story: 'AI predictions helped me plan my crop rotation perfectly. Soil testing recommendations improved my soil health. Best agritech platform I\'ve used.',
    photo: '👨‍🌾',
    yieldIncrease: '+32%',
    verified: true,
  },
  {
    id: 6,
    name: 'Neha Sharma',
    village: 'Meerut',
    state: 'Uttar Pradesh',
    crop: 'Wheat',
    rating: 5,
    story: 'From small-scale farming to commercial production. Rythu360 made everything simpler - planning, execution, and selling. Truly transformational.',
    photo: '👩‍🌾',
    yieldIncrease: '+38%',
    verified: true,
  },
];

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Show 3 testimonials at a time on desktop
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Success Stories
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Real farmers, real results - Rythu360 has transformed agriculture across India
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="space-y-8">
          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, idx) => (
              <div key={testimonial.id} className={`fade-in stagger-item-${idx + 1}`}>
                <GlassCard hover variant="lg" className="h-full flex flex-col">
                  {/* Testimonial header */}
                  <div className="mb-4">
                    {/* Star rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Story text */}
                    <blockquote className="text-white/90 italic mb-4 text-sm leading-relaxed flex-grow">
                      "{testimonial.story}"
                    </blockquote>
                  </div>

                  {/* Divider */}
                  <div className="mb-4 pb-4 border-b border-white/10" />

                  {/* Farmer info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-5xl">{testimonial.photo}</div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <CheckCircle className="size-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-xs text-white/60">
                          {testimonial.village}, {testimonial.state}
                        </p>
                      </div>
                    </div>

                    {/* Crop and yield info */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-xs text-white/60">Crop</p>
                        <p className="text-sm font-semibold text-white">{testimonial.crop}</p>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                        <p className="text-xs text-white/60">Yield Increase</p>
                        <p className="text-sm font-semibold text-green-400">{testimonial.yieldIncrease}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="pt-3 border-t border-white/10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                      <CheckCircle className="size-3" />
                      Verified Farmer
                    </span>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-green-500/50 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-green-500 w-8'
                      : idx === (currentIndex + 1) % testimonials.length ||
                        idx === (currentIndex + 2) % testimonials.length
                      ? 'bg-white/30 w-6'
                      : 'bg-white/10 w-2'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-green-500/50 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Trust metrics */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 fade-in">
          {[
            { label: 'Average Yield Increase', value: '+36%' },
            { label: 'Verified Success Stories', value: '2,500+' },
            { label: 'Customer Satisfaction', value: '4.8/5' },
            { label: 'Money Saved', value: '₹50Cr+' },
          ].map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-white/70">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
