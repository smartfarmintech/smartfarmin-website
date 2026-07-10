'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface ActionCardProps {
  title: string
  description: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'teal'
  badge?: string
  loading?: boolean
}

const colorClasses = {
  green: 'bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200',
  blue: 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200',
  orange: 'bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-200',
  purple: 'bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200',
  teal: 'bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-teal-200',
}

const iconColors = {
  green: 'text-emerald-600',
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
}

export function ActionCard({
  title,
  description,
  icon,
  href,
  onClick,
  color = 'green',
  badge,
  loading = false,
}: ActionCardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer h-full ${colorClasses[color]}`}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-3 inline-block">
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white ${iconColors[color]}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-4 text-4xl ${iconColors[color]}`}>
        {icon}
      </div>

      {/* Title and Description */}
      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      {/* CTA Text */}
      <div className={`text-sm font-semibold ${iconColors[color]} flex items-center gap-1`}>
        Tap to continue →
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full text-left"
    >
      {content}
    </button>
  )
}

export function ActionCardGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {children}
    </div>
  )
}
