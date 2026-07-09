"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const selectedLanguage = languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-secondary"
        aria-label="Select language"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{selectedLanguage?.name}</span>
        <span className="sm:hidden">{selectedLanguage?.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-50">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setCurrentLanguage(language.code)
                  setOpen(false)
                  // You can add logic here to change the app language
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary transition-colors"
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1 text-left">{language.name}</span>
                {currentLanguage === language.code && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
