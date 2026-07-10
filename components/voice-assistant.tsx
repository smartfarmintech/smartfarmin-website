'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X, Volume2 } from 'lucide-react'

type Language = 'en' | 'te' | 'hi'

interface VoiceAssistantProps {
  onCommand?: (command: string, language: Language) => void
}

const voiceCommands = {
  en: [
    { command: 'I need tractor', action: 'book_machinery' },
    { command: 'Book drone', action: 'book_drone' },
    { command: 'Show weather', action: 'show_weather' },
    { command: 'Crop disease', action: 'crop_doctor' },
    { command: 'Buy seeds', action: 'marketplace' },
    { command: 'My bookings', action: 'bookings' },
    { command: 'Help', action: 'support' },
  ],
  te: [
    { command: 'ట్రాక్టర్ కావాలి', action: 'book_machinery' },
    { command: 'డ్రోన్ బుక్ చేయండి', action: 'book_drone' },
    { command: 'వాతావరణం చూపించండి', action: 'show_weather' },
    { command: 'పంట వ్యాధి', action: 'crop_doctor' },
    { command: 'విత్తనాలు కొనండి', action: 'marketplace' },
    { command: 'నా బుకింగ్‌లు', action: 'bookings' },
    { command: 'సహాయం', action: 'support' },
  ],
  hi: [
    { command: 'मुझे ट्रैक्टर चाहिए', action: 'book_machinery' },
    { command: 'ड्रोन बुक करें', action: 'book_drone' },
    { command: 'मौसम दिखाएं', action: 'show_weather' },
    { command: 'फसल रोग', action: 'crop_doctor' },
    { command: 'बीज खरीदें', action: 'marketplace' },
    { command: 'मेरी बुकिंग', action: 'bookings' },
    { command: 'सहायता', action: 'support' },
  ],
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [transcript, setTranscript] = useState('')

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript('Processing audio...')
        setTimeout(() => {
          setIsListening(false)
          setTranscript('')
        }, 2000)
      }, 1500)
    }
  }

  const handleCommandSelect = (command: string) => {
    onCommand?.(command, language)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Voice Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-harvest-orange text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-harvest-orange/90 transition-colors z-40"
      >
        <Mic className="w-8 h-8" />
      </motion.button>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-forest-green/10 p-6 z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-harvest-orange" />
                <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex gap-2 mb-4">
              {(['en', 'te', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                    language === lang
                      ? 'bg-forest-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'te' ? 'Telugu' : 'Hindi'}
                </button>
              ))}
            </div>

            {/* Microphone Section */}
            <div className="mb-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMicClick}
                disabled={isListening}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-harvest-orange text-white hover:bg-harvest-orange/90'
                }`}
              >
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Mic className="w-10 h-10" />
                </motion.div>
              </motion.button>
              <p className="text-sm text-gray-600 mt-2">
                {isListening ? 'Listening...' : 'Tap mic to speak'}
              </p>
              {transcript && <p className="text-sm text-gray-800 font-semibold mt-1">{transcript}</p>}
            </div>

            {/* Common Commands */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Quick Commands</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {voiceCommands[language].map((cmd, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => handleCommandSelect(cmd.command)}
                    className="w-full text-left p-3 rounded-lg bg-soft-mint-50 hover:bg-forest-green/10 transition-colors text-sm font-medium text-gray-800"
                  >
                    {cmd.command}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
