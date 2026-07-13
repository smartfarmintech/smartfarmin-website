"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Logo } from "./logo"
import { SearchBar } from "./search-bar"
import { NavMenu } from "./nav-menu"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"

export function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/75 backdrop-blur-xl border-b border-border"
          : "bg-background"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4">
          {/* Left: Logo */}
          <Logo />

          {/* Center: Search & Navigation */}
          <div className="hidden md:flex items-center flex-1 gap-4">
            <SearchBar />
            <NavMenu />
          </div>

          {/* Right: User Menu & Mobile Nav */}
          <div className="flex items-center gap-2">
            <UserMenu />
            <MobileNav />
          </div>
        </div>

        {/* Scroll indicator */}
        {!isScrolled && (
          <motion.div
            className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 1 }}
            style={{ originX: 0.5 }}
          />
        )}
      </div>
    </motion.header>
  )
}
