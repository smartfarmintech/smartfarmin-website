'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MetricSummaryProps {
  label: string
  value: string | number
  format?: 'currency' | 'number' | 'percent' | 'text'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  backgroundColor?: string
  textColor?: string
}

export function MetricSummary({
  label,
  value,
  format = 'text',
  trend,
  icon,
  backgroundColor = 'bg-blue-50',
  textColor = 'text-blue-600',
}: MetricSummaryProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return typeof val === 'number'
        ? `₹${val.toLocaleString('en-IN')}`
        : val
    }
    if (format === 'number') {
      return typeof val === 'number'
        ? val.toLocaleString('en-IN')
        : val
    }
    if (format === 'percent') {
      return `${val}%`
    }
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
    >
      <Card className={`${backgroundColor} border-0 p-4 md:p-6`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${textColor}`}>
              {formatValue(value)}
            </p>
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                {trend.direction === 'up' ? (
                  <TrendingUp className={`w-4 h-4 ${textColor}`} />
                ) : (
                  <TrendingDown className={`w-4 h-4 text-red-600`} />
                )}
                <span
                  className={`text-xs font-semibold ${
                    trend.direction === 'up' ? textColor : 'text-red-600'
                  }`}
                >
                  {trend.direction === 'up' ? '+' : '-'}
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          {icon && <div className={`text-3xl ${textColor}`}>{icon}</div>}
        </div>
      </Card>
    </motion.div>
  )
}

export function MetricGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {children}
    </div>
  )
}
