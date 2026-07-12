"use client"

export const dynamic = "force-dynamic"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"

const NAV_ITEMS = [
  { href: "/temple-tourism/dashboard", label: "Home", icon: "🏠" },
  { href: "/temple-tourism/temples", label: "Temples", icon: "🛕" },
  { href: "/temple-tourism/accommodations", label: "Stay", icon: "🏨" },
  { href: "/temple-tourism/festivals", label: "Festivals", icon: "🎉" },
  { href: "/temple-tourism/guides", label: "Guides", icon: "🎫" },
  { href: "/temple-tourism/bookings", label: "My Trips", icon: "🎒" },
]

export default function TempleLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around text-xs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-2 text-center hover:bg-gray-50"
            >
              <div className="text-lg mb-1">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-purple-600">Darshan</h1>
            <p className="text-xs text-gray-600">Sacred Journeys</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
