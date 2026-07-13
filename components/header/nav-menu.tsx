"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { mainNavigation } from "@/data/nav-data"
import { MegaMenu } from "./mega-menu"

export function NavMenu() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {mainNavigation.map((item) => (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setOpenMenuId(item.id)}
          onMouseLeave={() => setOpenMenuId(null)}
        >
          <motion.button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              openMenuId === item.id
                ? "text-green-600"
                : "text-foreground hover:text-green-600"
            }`}
            whileHover={{ backgroundColor: "hsl(var(--muted))" }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: openMenuId === item.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </motion.button>

          {/* Mega menu */}
          {item.megaMenu && (
            <MegaMenu isOpen={openMenuId === item.id} sections={item.megaMenu} />
          )}
        </div>
      ))}
    </nav>
  )
}
