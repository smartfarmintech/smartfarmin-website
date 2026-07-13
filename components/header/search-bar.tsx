"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Mic, X } from "lucide-react"

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState("")

  return (
    <motion.div
      className="relative hidden md:flex items-center flex-1 max-w-sm mx-4"
      animate={{ scale: isFocused ? 1.02 : 1 }}
    >
      <div className="relative w-full">
        <div
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            isFocused ? "text-green-500" : "text-muted-foreground"
          }`}
        >
          <Search size={18} />
        </div>
        
        <input
          type="text"
          placeholder="Search crops, services, guides..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-12 py-2 rounded-lg bg-muted/50 border border-border hover:border-green-500/50 focus:border-green-500 focus:outline-none transition-colors text-sm"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              onClick={() => setValue("")}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-green-500 transition-colors">
            <Mic size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
