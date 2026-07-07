'use client';

import React, { useState } from 'react';
import { MapPin, Droplet, Calendar, User, Zap, CheckCircle, ChevronRight, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/cards/glass-card';

interface BookingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const bookingSteps: BookingStep[] = [
  {
    id: 1,
    title: 'Field Selection',
    description: 'Select your field on the map',
    icon: <MapPin className="size-6" />,
  },
  {
    id: 2,
    title: 'Field Details',
    description: 'Enter acres and field size',
    icon: <Zap className="size-6" />,
  },
  {
    id: 3,
    title: 'Chemical Selection',
    description: 'Choose pesticide or herbicide',
    icon: <Droplet className="size-6" />,
  },
  {
    id: 4,
    title: 'Schedule',
    description: 'Pick date and time',
    icon: <Calendar className="size-6" />,
  },
  {
    id: 5,
    title: 'Operator Selection',
    description: 'Choose drone operator',
    icon: <User className="size-6" />,
  },
];

export function DroneBookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fieldLocation: '',
    acres: '',
    chemical: '',
    date: '',
    operator: '',
  });

  const handleNext = () => {
    if (currentStep < bookingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-yellow-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Premium Drone Booking
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Book drone spraying with real-time tracking and weather recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps sidebar */}
          <div className="space-y-3">
            {bookingSteps.map((step) => (
              <div
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  currentStep === step.id
                    ? 'bg-green-600/20 border-green-500/50'
                    : currentStep > step.id
                    ? 'bg-white/5 border-green-500/20'
                    : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${
                      currentStep >= step.id
                        ? 'text-green-400'
                        : 'text-white/40'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="size-5" />
                    ) : (
                      <div className="size-5 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      currentStep === step.id ? 'text-white' : 'text-white/70'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-white/50 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form content */}
          <div className="lg:col-span-2">
            <GlassCard variant="lg">
              {currentStep === 1 && (
                <div className="space-y-6 fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Field Location
                    </label>
                    <div className="h-64 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="size-12 text-white/30 mx-auto mb-2" />
                        <p className="text-white/70">Click to select field on map</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Search location..."
                      className="w-full mt-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Field Size (Acres)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        GPS Coordinates
                      </label>
                      <input
                        type="text"
                        placeholder="Latitude, Longitude"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Select Chemical/Pesticide
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Herbicide', 'Insecticide', 'Fungicide', 'Neem Oil'].map((chem) => (
                        <button
                          key={chem}
                          className="p-3 rounded-lg border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all text-white text-sm font-medium"
                        >
                          {chem}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Quantity (Liters)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 10"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  {/* Weather info */}
                  <GlassCard className="bg-white/5 border border-yellow-500/20">
                    <div className="flex gap-3">
                      <Cloud className="size-6 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Weather Recommendation</h4>
                        <p className="text-sm text-white/70">
                          Sunny conditions with 15-20 km/h wind - Ideal for spraying
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6 fade-in">
                  <label className="block text-sm font-semibold text-white mb-3">
                    Select Drone Operator
                  </label>
                  <div className="space-y-3">
                    {[
                      { name: 'Rajesh Kumar', rating: 4.9, drones: 5 },
                      { name: 'Priya Singh', rating: 4.8, drones: 3 },
                      { name: 'Amit Patel', rating: 4.7, drones: 4 },
                    ].map((op) => (
                      <div
                        key={op.name}
                        className="p-4 rounded-lg border border-white/10 hover:border-green-500/50 cursor-pointer hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{op.name}</h4>
                            <p className="text-xs text-white/60">{op.drones} drones available</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                            <span className="text-sm text-white/70 ml-2">{op.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step indicators and buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {bookingSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full ${
                        idx + 1 <= currentStep ? 'bg-green-500 w-8' : 'bg-white/10 w-6'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    disabled={currentStep === 1}
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className={`${
                      currentStep === bookingSteps.length
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
                    } text-white border-0 gap-2`}
                  >
                    {currentStep === bookingSteps.length ? 'Book Now' : 'Next'}
                    {currentStep < bookingSteps.length && <ChevronRight className="size-4" />}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
