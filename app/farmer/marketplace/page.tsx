"use client"

import { motion } from "framer-motion"

export default function MarketplacePage() {
  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
      </motion.div>
    </div>
  )
}
