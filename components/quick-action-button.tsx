'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface QuickActionButtonProps {
  label: string
  icon: string | React.ReactNode
  href?: string
  onClick?: () => void
  color?: 'emerald' | 'blue' | 'orange' | 'purple' | 'teal'
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  purple: 'bg-purple-600 hover:bg-purple-700 text-white',
  teal: 'bg-teal-600 hover:bg-teal-700 text-white',
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
}

export function QuickActionButton({
  label,
  icon,
  href,
  onClick,
  color = 'emerald',
  size = 'md',
}: QuickActionButtonProps) {
  const className = `
    ${colorClasses[color]} 
    ${sizeClasses[size]}
    rounded-lg font-semibold
    transition-all duration-300
    flex items-center gap-2
    shadow-md hover:shadow-lg
    active:scale-95
  `

  const content = (
    <motion.div
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 w-full"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      <ChevronRight className="w-5 h-5 ml-auto" />
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        <button className={className}>
          {content}
        </button>
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )
}
