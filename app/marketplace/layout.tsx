"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"

const NAV_ITEMS = [
  { href: "/marketplace/dashboard", label: "Home", icon: "🏠" },
  { href: "/marketplace/products", label: "Browse", icon: "🛍️" },
  { href: "/marketplace/cart", label: "Cart", icon: "🛒" },
  { href: "/marketplace/orders", label: "Orders", icon: "📦" },
  { href: "/marketplace/seller-center", label: "Sell", icon: "📊" },
  { href: "/marketplace/support", label: "Support", icon: "❓" },
]

export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-600">Rythu Marketplace</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
