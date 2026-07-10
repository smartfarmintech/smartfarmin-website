'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

type BookingStep = 'service' | 'location' | 'confirm'

interface SimpleBookingWizardProps {
  onComplete?: (booking: any) => void
}

const services = [
  { id: 'tractor', icon: '🚜', name: 'Tractor', rate: '₹500/hour' },
  { id: 'harvester', icon: '🌾', name: 'Harvester', rate: '₹1000/hour' },
  { id: 'rotavator', icon: '🔄', name: 'Rotavator', rate: '₹300/hour' },
  { id: 'sprayer', icon: '💧', name: 'Sprayer', rate: '₹200/hour' },
]

const villages = [
  { id: 'v1', name: 'Hyderabad', distance: '2 km' },
  { id: 'v2', name: 'Secunderabad', distance: '5 km' },
  { id: 'v3', name: 'Gachibowli', distance: '8 km' },
]

export function SimpleBookingWizard({ onComplete }: SimpleBookingWizardProps) {
  const [step, setStep] = useState<BookingStep>('service')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [date, setDate] = useState<string>('')

  const getStepNumber = (s: BookingStep) => {
    return s === 'service' ? 1 : s === 'location' ? 2 : 3
  }

  const currentStep = getStepNumber(step)

  const handleNext = () => {
    if (step === 'service' && selectedService) setStep('location')
    else if (step === 'location' && selectedLocation) setStep('confirm')
    else if (step === 'confirm') {
      onComplete?.({
        service: selectedService,
        location: selectedLocation,
        date,
      })
    }
  }

  const handleBack = () => {
    if (step === 'location') setStep('service')
    else if (step === 'confirm') setStep('location')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8 flex gap-4">
        {[1, 2, 3].map((n) => (
          <motion.div
            key={n}
            className={`flex-1 h-2 rounded-full transition-all ${
              n <= currentStep ? 'bg-forest-green' : 'bg-gray-200'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'service' && 'Step 1: Choose Service'}
          {step === 'location' && 'Step 2: Select Location'}
          {step === 'confirm' && 'Step 3: Confirm Booking'}
        </h2>
        <p className="text-gray-600 text-sm">
          {currentStep} of 3 steps
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {services.map((service) => (
              <motion.button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-6 rounded-2xl border-3 transition-all text-center ${
                  selectedService === service.id
                    ? 'border-forest-green bg-forest-green/5'
                    : 'border-gray-200 hover:border-forest-green/50'
                }`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-5xl mb-3">{service.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{service.name}</div>
                <div className="text-sm text-forest-green font-semibold">{service.rate}</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Location Selection */}
        {step === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-4 mb-8"
          >
            {villages.map((village) => (
              <motion.button
                key={village.id}
                onClick={() => setSelectedLocation(village.id)}
                className={`w-full p-6 rounded-2xl border-3 text-left transition-all flex justify-between items-center ${
                  selectedLocation === village.id
                    ? 'border-forest-green bg-forest-green/5'
                    : 'border-gray-200 hover:border-forest-green/50'
                }`}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <div className="font-bold text-gray-900 text-lg">{village.name}</div>
                  <div className="text-sm text-gray-600">📍 {village.distance} from you</div>
                </div>
                {selectedLocation === village.id && (
                  <Check className="w-6 h-6 text-forest-green" />
                )}
              </motion.button>
            ))}

            {/* Date picker */}
            <div className="mt-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                📅 Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-forest-green focus:outline-none text-lg"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-4 mb-8"
          >
            <div className="bg-forest-green/5 border-2 border-forest-green rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b-2 border-forest-green/20">
                <span className="text-gray-700">Service:</span>
                <span className="font-bold text-gray-900">
                  {services.find((s) => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b-2 border-forest-green/20">
                <span className="text-gray-700">Location:</span>
                <span className="font-bold text-gray-900">
                  {villages.find((v) => v.id === selectedLocation)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Date:</span>
                <span className="font-bold text-gray-900">{date}</span>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-leaf-green rounded-2xl p-4">
              <p className="text-center text-gray-700 text-sm">
                ✅ Ready to book? Confirm to proceed to payment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-4">
        {step !== 'service' && (
          <motion.button
            onClick={handleBack}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-300 text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>
        )}
        <motion.button
          onClick={handleNext}
          disabled={
            (step === 'service' && !selectedService) ||
            (step === 'location' && (!selectedLocation || !date))
          }
          className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            (step === 'service' && !selectedService) ||
            (step === 'location' && (!selectedLocation || !date))
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-forest-green text-white hover:bg-leaf-green'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {step === 'confirm' ? (
            <>
              Confirm Booking <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Next <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
