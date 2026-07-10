'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BookingStep {
  id: number
  title: string
  description: string
  icon: string
}

const BOOKING_STEPS: BookingStep[] = [
  { id: 1, title: 'Select Machine', description: 'Choose the equipment you need', icon: '🚜' },
  { id: 2, title: 'Select Village', description: 'Where will you use it?', icon: '🏘️' },
  { id: 3, title: 'Select Date', description: 'Pick your booking date', icon: '📅' },
  { id: 4, title: 'Select Time', description: 'Choose time slot', icon: '⏰' },
  { id: 5, title: 'Confirm', description: 'Review and book', icon: '✅' },
]

const MACHINES = [
  { id: 1, name: 'Tractor', icon: '🚜', description: 'Multi-purpose farming' },
  { id: 2, name: 'Harvester', icon: '🌾', description: 'Crop harvesting' },
  { id: 3, name: 'Rotavator', icon: '🔄', description: 'Soil preparation' },
  { id: 4, name: 'Sprayer', icon: '💧', description: 'Pesticide/fertilizer' },
  { id: 5, name: 'Cultivator', icon: '🌱', description: 'Seedbed preparation' },
]

export function MachineryBookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)
  const [selectedVillage, setSelectedVillage] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedMachine !== null
      case 2:
        return selectedVillage !== ''
      case 3:
        return selectedDate !== ''
      case 4:
        return selectedTime !== ''
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {BOOKING_STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step.id < currentStep
                    ? 'bg-leaf-green-500 text-white'
                    : step.id === currentStep
                      ? 'bg-leaf-green-500 text-white ring-4 ring-leaf-green-200'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id < currentStep ? <CheckCircle size={20} /> : step.id}
              </div>
              <p className="text-xs font-medium mt-2 text-center text-gray-700">{step.title}</p>
            </div>
          ))}
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-leaf-green-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 mb-6 border-2 border-gray-200 rounded-2xl">
        <div className="mb-6">
          <div className="text-4xl mb-2">{BOOKING_STEPS[currentStep - 1].icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{BOOKING_STEPS[currentStep - 1].title}</h2>
          <p className="text-gray-600 mt-1">{BOOKING_STEPS[currentStep - 1].description}</p>
        </div>

        {/* Step 1: Machine Selection */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MACHINES.map((machine) => (
              <button
                key={machine.id}
                onClick={() => setSelectedMachine(machine.id)}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  selectedMachine === machine.id
                    ? 'border-leaf-green-500 bg-leaf-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{machine.icon}</div>
                <p className="font-bold text-sm text-gray-800">{machine.name}</p>
                <p className="text-xs text-gray-600">{machine.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Village Selection */}
        {currentStep === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select your village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-leaf-green-500"
            >
              <option value="">Choose a village...</option>
              <option value="village1">Hyderabad Village</option>
              <option value="village2">Secunderabad Village</option>
              <option value="village3">Kukatpally Village</option>
              <option value="village4">Dilsukhnagar Village</option>
            </select>
          </div>
        )}

        {/* Step 3: Date Selection */}
        {currentStep === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select booking date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-leaf-green-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {/* Step 4: Time Selection */}
        {currentStep === 4 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select time slot</label>
            <div className="grid grid-cols-3 gap-3">
              {['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg font-medium transition-all border-2 text-sm ${
                    selectedTime === time
                      ? 'border-leaf-green-500 bg-leaf-green-50 text-leaf-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="bg-soft-mint-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Machine:</strong> {MACHINES.find((m) => m.id === selectedMachine)?.name}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Village:</strong> {selectedVillage}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Date:</strong> {selectedDate}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Time:</strong> {selectedTime}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Click "Confirm Booking" to proceed. A machinery owner will accept or reject your request within 2 hours.
            </p>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 1}
          className="flex-1 h-12 text-lg"
        >
          <ChevronLeft className="mr-2" size={20} /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 h-12 text-lg bg-leaf-green-500 hover:bg-leaf-green-600 text-white"
        >
          {currentStep === 5 ? 'Confirm Booking' : 'Next'} <ChevronRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  )
}
