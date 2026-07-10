'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
]

interface LanguageSwitcherProps {
  currentLanguage?: string
  onLanguageChange?: (code: string) => void
}

export function LanguageSwitcher({
  currentLanguage = 'en',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const current = languages.find((l) => l.code === currentLanguage) || languages[0]

  const handleSelect = (code: string) => {
    onLanguageChange?.(code)
    setIsOpen(false)
    // Store preference
    localStorage.setItem('preferred_language', code)
  }

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-300 hover:border-emerald-600 transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="font-semibold">{current.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{current.name}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 min-w-max"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                  lang.code === currentLanguage ? 'bg-emerald-50' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <span className="ml-auto text-emerald-600">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
