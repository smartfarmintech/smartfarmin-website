'use client'

import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LanguageSelectorProps {
  onLanguageChange?: (language: 'en' | 'te' | 'hi') => void
  currentLanguage?: 'en' | 'te' | 'hi'
}

const languages = [
  { code: 'en', name: 'English', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
]

export function LanguageSelector({
  onLanguageChange,
  currentLanguage = 'en',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<'en' | 'te' | 'hi'>(currentLanguage)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'te' | 'hi' | null
    if (savedLanguage) {
      setSelected(savedLanguage)
    }
  }, [])

  const handleSelect = (lang: 'en' | 'te' | 'hi') => {
    setSelected(lang)
    localStorage.setItem('language', lang)
    onLanguageChange?.(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-forest-green/20 text-forest-green font-semibold hover:bg-forest-green/5 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm">{selected.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-forest-green/20 rounded-2xl shadow-xl p-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleSelect(lang.code as 'en' | 'te' | 'hi')}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 ${
                  selected === lang.code
                    ? 'bg-forest-green/10 text-forest-green'
                    : 'text-gray-700 hover:bg-forest-green/5'
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="text-sm">{lang.name}</div>
                </div>
                {selected === lang.code && (
                  <span className="ml-auto">✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
