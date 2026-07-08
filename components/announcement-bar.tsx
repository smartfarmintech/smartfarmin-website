"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between"
    >
      <div className="flex-1 text-center">
        <p className="text-sm font-medium text-foreground">
          <span className="text-primary font-semibold">Rythu360 is live!</span> Join 2,50,000+ farmers already growing smarter.{" "}
          <a href="#" className="underline hover:text-primary transition-colors">
            Download now
          </a>
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close announcement"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  )
}
