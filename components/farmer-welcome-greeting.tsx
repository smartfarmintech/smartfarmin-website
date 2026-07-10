'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Mic } from 'lucide-react'

interface FarmerWelcomeGreetingProps {
  farmerName?: string
  language?: 'en' | 'te' | 'hi'
}

const greetings = {
  en: {
    title: 'Welcome to Rythu360',
    subtitle: 'What would you like to do today?',
    voiceAssistant: 'Voice Assistant',
  },
  te: {
    title: 'రిత్థు360కు స్వాగతం',
    subtitle: 'ఈ రోజు మీరు ఏమి చేయాలనుకుంటున్నారు?',
    voiceAssistant: 'వాయిస్ సహాయక',
  },
  hi: {
    title: 'Rythu360 में स्वागत है',
    subtitle: 'आज आप क्या करना चाहते हैं?',
    voiceAssistant: 'वॉयस सहायक',
  },
}

export function FarmerWelcomeGreeting({
  farmerName = 'किसान भाई',
  language = 'en',
}: FarmerWelcomeGreetingProps) {
  const greeting = greetings[language]

  return (
    <motion.section
      className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-green/5 via-leaf-green/5 to-transparent rounded-3xl -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Greeting */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            👋 {greeting.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            {greeting.subtitle}
          </p>
        </motion.div>

        {/* Quick shortcuts - Row 1 */}
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {['🚜 Book Tractor', '🚁 Book Drone', '🏥 Crop Doctor'].map((shortcut, idx) => (
            <button
              key={idx}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-white border-2 border-forest-green/20 rounded-full text-forest-green font-semibold hover:bg-forest-green/5 transition-all text-sm sm:text-base"
            >
              {shortcut}
            </button>
          ))}
        </motion.div>

        {/* Voice Assistant */}
        <motion.button
          className="flex items-center gap-3 px-6 py-4 bg-forest-green text-white rounded-2xl font-semibold hover:bg-leaf-green transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mic className="w-5 h-5" />
          <span className="text-lg">{greeting.voiceAssistant}</span>
        </motion.button>
      </div>
    </motion.section>
  )
}
