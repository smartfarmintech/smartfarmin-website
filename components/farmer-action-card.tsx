'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FarmerActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  badge?: string
  color?: 'green' | 'orange' | 'blue' | 'red' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  green: 'bg-gradient-to-br from-leaf-green/10 to-fresh-mint/5 border-leaf-green/20 hover:from-leaf-green/20 hover:to-fresh-mint/10',
  orange: 'bg-gradient-to-br from-harvest-orange/10 to-golden-yellow/5 border-harvest-orange/20 hover:from-harvest-orange/20 hover:to-golden-yellow/10',
  blue: 'bg-gradient-to-br from-sky-blue/10 to-weather-blue/5 border-sky-blue/20 hover:from-sky-blue/20 hover:to-weather-blue/10',
  red: 'bg-gradient-to-br from-red-100/10 to-red-50/5 border-red-200/20 hover:from-red-100/20 hover:to-red-50/10',
  purple: 'bg-gradient-to-br from-purple-100/10 to-purple-50/5 border-purple-200/20 hover:from-purple-100/20 hover:to-purple-50/10',
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function FarmerActionCard({
  icon,
  title,
  description,
  href,
  badge,
  color = 'green',
  size = 'md',
}: FarmerActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link href={href} className="block h-full">
        <div className={`${sizeClasses[size]} rounded-3xl border-2 ${colorClasses[color]} transition-all duration-300 cursor-pointer hover:shadow-xl`}>
          {/* Badge */}
          {badge && (
            <div className="mb-3 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-forest-green">
              {badge}
            </div>
          )}

          {/* Icon - Large */}
          <div className="mb-4 text-4xl sm:text-5xl">
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* CTA Button */}
          <div className="inline-flex items-center gap-2 text-forest-green font-semibold hover:gap-3 transition-all">
            <span>Book Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
