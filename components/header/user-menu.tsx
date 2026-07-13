"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, Settings, LogIn, Globe, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { languageOptions } from "@/data/nav-data"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")

  const isAuthenticated = false // TODO: Get from context/auth

  return (
    <div className="flex items-center gap-3">
      {/* Theme Toggle */}
      <motion.button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* Language Selector */}
      <div className="relative">
        <motion.button
          onClick={() => setShowLanguages(!showLanguages)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe size={20} />
        </motion.button>

        <AnimatePresence>
          {showLanguages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-50"
            >
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setShowLanguages(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    language === lang.code
                      ? "bg-green-500/10 text-green-600 font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Menu */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
            {isAuthenticated ? "A" : "?"}
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
              onMouseLeave={() => setIsOpen(false)}
            >
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Akanksha Sharma</p>
                    <p className="text-xs text-muted-foreground">akanksha@example.com</p>
                  </div>
                  <nav className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors border-t border-border mt-2 pt-2">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </nav>
                </>
              ) : (
                <nav className="py-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-muted transition-colors border-t border-border mt-2 pt-2 font-medium"
                  >
                    <User size={16} />
                    Create Account
                  </Link>
                </nav>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
