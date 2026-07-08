'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Wrench, ShoppingBag, BookOpen, User } from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  { label: 'Home', icon: <Home className="w-6 h-6" />, href: '/farmer/dashboard' },
  { label: 'Services', icon: <Wrench className="w-6 h-6" />, href: '/farmer/services' },
  { label: 'Marketplace', icon: <ShoppingBag className="w-6 h-6" />, href: '/farmer/marketplace' },
  { label: 'Bookings', icon: <BookOpen className="w-6 h-6" />, href: '/farmer/bookings', badge: 0 },
  { label: 'Profile', icon: <User className="w-6 h-6" />, href: '/farmer/profile' },
]

export function FarmerBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-forest-green/10 shadow-2xl md:hidden z-40">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-semibold transition-all relative group"
            >
              <motion.div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-forest-green/10 text-forest-green'
                    : 'text-gray-600 group-hover:text-forest-green'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.div>
              <span className={isActive ? 'text-forest-green font-bold' : 'text-gray-600'}>
                {item.label}
              </span>

              {/* Indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 w-1 h-1 bg-forest-green rounded-full"
                  layoutId="bottomNavIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
