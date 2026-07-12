"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/lib/hooks"

export default function FarmerDashboard() {
  const { profile } = useAuth()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const stats = [
    { label: "Active Fields", value: "2", icon: "🌾" },
    { label: "Crop Cycles", value: "3", icon: "🌱" },
    { label: "Pending Bookings", value: "1", icon: "🚜" },
    { label: "Marketplace Orders", value: "5", icon: "📦" },
  ]

  return (
    <div className="p-4 md:p-8">
      <motion.div {...fadeIn} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {profile?.full_name}!</h1>
        <p className="text-lg text-gray-600">Here&apos;s your farm overview</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
