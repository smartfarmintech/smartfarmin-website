'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Leaf,
  Zap,
  Cloud,
  TrendingUp,
  FileText,
  Wrench,
  Drone,
  ShoppingBag,
  Sprout,
  Wallet,
  ShoppingCart,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'

const mainMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard/farmer'
  },
  {
    title: 'My Fields',
    icon: Leaf,
    href: '/dashboard/farmer/fields'
  },
  {
    title: 'AI Crop Doctor',
    icon: Zap,
    href: '/dashboard/farmer/crop-doctor'
  },
  {
    title: 'Weather',
    icon: Cloud,
    href: '/dashboard/farmer/weather'
  },
  {
    title: 'Market Prices',
    icon: TrendingUp,
    href: '/dashboard/farmer/market'
  },
  {
    title: 'Government Schemes',
    icon: FileText,
    href: '/dashboard/farmer/schemes'
  },
  {
    title: 'Machinery Booking',
    icon: Wrench,
    href: '/dashboard/farmer/machinery'
  },
  {
    title: 'Drone Booking',
    icon: Drone,
    href: '/dashboard/farmer/drones'
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    href: '/dashboard/farmer/marketplace'
  },
  {
    title: 'Organic Store',
    icon: Sprout,
    href: '/dashboard/farmer/organic'
  },
  {
    title: 'Wallet',
    icon: Wallet,
    href: '/dashboard/farmer/wallet'
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/dashboard/farmer/orders'
  },
  {
    title: 'Notifications',
    icon: Bell,
    href: '/dashboard/farmer/notifications'
  }
]

const bottomMenuItems = [
  {
    title: 'Profile',
    icon: User,
    href: '/dashboard/farmer/profile'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/farmer/settings'
  },
  {
    title: 'Help Center',
    icon: HelpCircle,
    href: '/help'
  }
]

export function FarmerSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    // TODO: Implement logout
    router.push('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-border">
        <Link href="/dashboard/farmer" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg hidden lg:inline">Rythu360</span>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Bottom Menu */}
      <div className="p-2 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{item.title}</span>
            </Link>
          )
        })}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </div>
  )
}
