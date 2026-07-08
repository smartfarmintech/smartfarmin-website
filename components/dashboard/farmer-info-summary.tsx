'use client'

import { motion } from 'framer-motion'
import { Cloud, Leaf, MapPin, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FarmerInfoSummaryProps {
  farmerName: string
  village: string
  activeLands: number
  activeCrops: number
  walletBalance: number
  currency: string
  temperature?: number
  humidity?: number
}

export function FarmerInfoSummary({
  farmerName,
  village,
  activeLands,
  activeCrops,
  walletBalance,
  currency,
  temperature,
  humidity,
}: FarmerInfoSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Greeting and Name */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white"
      >
        <p className="text-sm font-medium opacity-90 mb-2">Welcome back,</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{farmerName}</h1>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin className="w-4 h-4" />
          <span>{village}</span>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {/* Active Lands */}
        <MetricCard
          icon={<Leaf className="w-5 h-5" />}
          label="Active Lands"
          value={activeLands.toString()}
          color="green"
        />

        {/* Active Crops */}
        <MetricCard
          icon={<Leaf className="w-5 h-5" />}
          label="Growing Crops"
          value={activeCrops.toString()}
          color="teal"
        />

        {/* Wallet */}
        <MetricCard
          icon={<Wallet className="w-5 h-5" />}
          label="Wallet Balance"
          value={`${currency} ${walletBalance.toLocaleString('en-IN')}`}
          color="blue"
        />

        {/* Weather */}
        {temperature !== undefined && (
          <MetricCard
            icon={<Cloud className="w-5 h-5" />}
            label="Temperature"
            value={`${temperature}°C`}
            color="orange"
          />
        )}
      </motion.div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'green' | 'teal' | 'blue' | 'orange'
}

const colorStyles = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
}

const iconColors = {
  green: 'text-emerald-600',
  teal: 'text-teal-600',
  blue: 'text-blue-600',
  orange: 'text-orange-600',
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className={`rounded-xl border-2 p-3 md:p-4 ${colorStyles[color]}`}>
      <div className={`mb-2 ${iconColors[color]}`}>{icon}</div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg md:text-xl font-bold">{value}</p>
    </div>
  )
}
