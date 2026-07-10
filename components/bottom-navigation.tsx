'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, Plus, Bell, User } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: <Home className="w-6 h-6" />, label: 'Home', href: '/farmer/dashboard' },
  { icon: <Search className="w-6 h-6" />, label: 'Browse', href: '/marketplace' },
  { icon: <Plus className="w-6 h-6" />, label: 'Book', href: '/machinery/booking' },
  { icon: <Bell className="w-6 h-6" />, label: 'Alerts', href: '/notifications' },
  { icon: <User className="w-6 h-6" />, label: 'Profile', href: '/farmer/profile' },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 sm:hidden z-40">
      <div className="flex items-center justify-around gap-1">
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1"
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? '#059669' : 'transparent',
                  color: isActive ? '#ffffff' : '#6b7280',
                }}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-t-lg transition-colors"
              >
                {item.icon}
                <span className="text-xs font-semibold">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
