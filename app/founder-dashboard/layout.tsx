"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/founder-dashboard", label: "Dashboard", icon: "📊" },
  { href: "/founder-dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/founder-dashboard/operations", label: "Operations", icon: "⚙️" },
  { href: "/founder-dashboard/market-insights", label: "Market Insights", icon: "🌍" },
  { href: "/founder-dashboard/system-admin", label: "System", icon: "🔧" },
  { href: "/founder-dashboard/reports", label: "Reports", icon: "📋" },
  { href: "/founder-dashboard/settings", label: "Settings", icon: "⚡" },
]

export default function FounderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex h-screen">
        <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-blue-400">Rythu360</h1>
            <p className="text-xs text-gray-500 mt-1">Founder Dashboard v1.0</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <button className="w-full py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition">
              Export Data
            </button>
            <button className="w-full py-2 text-sm bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition">
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
