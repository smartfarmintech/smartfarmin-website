"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-white font-bold text-lg">R</span>
      </motion.div>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-foreground">Rythu360</span>
        <span className="text-xs text-muted-foreground -mt-1">Smart Farming</span>
      </div>
    </Link>
  )
}
