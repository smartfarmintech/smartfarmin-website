'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, User } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard/operator', icon: '📊' },
  { label: 'Bookings', href: '/dashboard/operator/bookings', icon: '📅' },
  { label: 'Machines', href: '/dashboard/operator/machines', icon: '⚙️' },
  { label: 'Jobs', href: '/dashboard/operator/jobs', icon: '🛠️' },
  { label: 'Earnings', href: '/dashboard/operator/earnings', icon: '💰' },
  { label: 'Reports', href: '/dashboard/operator/reports', icon: '📈' },
]

export default function OperatorNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="flex items-center justify-between p-4 md:px-8">
        {/* Logo */}
        <Link href="/dashboard/operator" className="font-bold text-xl">
          Rythu360 Operator
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="gap-2"
              >
                <span>{item.icon}</span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile Menu */}
          <Link href="/dashboard/operator/profile">
            <Button variant="ghost" size="icon" title="Profile Settings">
              <User className="w-5 h-5" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <span>{item.icon}</span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
