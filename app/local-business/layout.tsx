"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"

const NAV_ITEMS = [
  { href: "/local-business/dashboard", label: "Home", icon: "🏠" },
  { href: "/local-business/discover", label: "Discover", icon: "🗺️" },
  { href: "/local-business/vendors", label: "Vendors", icon: "🏪" },
  { href: "/local-business/bookings", label: "Bookings", icon: "📅" },
  { href: "/local-business/reviews", label: "Reviews", icon: "⭐" },
  { href: "/local-business/profile", label: "Profile", icon: "👤" },
]

export default function LocalBusinessLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around text-xs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-2 text-center hover:bg-gray-50 transition"
            >
              <div className="text-lg mb-1">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-orange-600">Local Rythu</h1>
            <p className="text-xs text-gray-600">Village Services Hub</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3">Business Owner?</p>
            <button className="w-full py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition text-sm">
              List Your Business
            </button>
          </div>
        </aside>

        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
