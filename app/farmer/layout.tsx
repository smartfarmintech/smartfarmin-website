"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"

const NAV_ITEMS = [
  { href: "/farmer/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/farmer/bookings", label: "Book Services", icon: "🚜" },
  { href: "/farmer/marketplace", label: "Marketplace", icon: "🛒" },
  { href: "/farmer/ai", label: "Akanksha AI", icon: "🤖" },
  { href: "/farmer/profile", label: "Profile", icon: "👤" },
  { href: "/farmer/settings", label: "Settings", icon: "⚙️" },
]

export default function FarmerLayout({ children }: { children: ReactNode }) {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  if (!user) {
    redirect("/auth/login")
  }

  if (profile?.role_id !== "farmer") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-3 text-center text-xs font-medium hover:bg-gray-50 transition"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">Rythu360</h1>
            <p className="text-sm text-gray-600">{profile?.full_name}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-600 font-medium"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => window.location.href = "/auth/login"}
              className="w-full py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
