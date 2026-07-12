"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"

const NAV_ITEMS = [
  { href: "/crm/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/crm/contacts", label: "Contacts", icon: "👥" },
  { href: "/crm/calls", label: "Calls", icon: "☎️" },
  { href: "/crm/leads", label: "Leads", icon: "🎯" },
  { href: "/crm/territories", label: "Territories", icon: "🗺️" },
  { href: "/crm/reports", label: "Reports", icon: "📈" },
  { href: "/crm/team", label: "Team", icon: "👔" },
  { href: "/crm/settings", label: "Settings", icon: "⚙️" },
]

export default function CRMLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-72 bg-gray-800 border-r border-gray-700 flex-col">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Rythu CRM</h1>
            <p className="text-xs text-gray-400 mt-1">Sales & Contact Hub</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button className="w-full py-2 text-red-400 font-medium hover:bg-red-900/20 rounded-lg transition">
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex justify-around overflow-x-auto text-xs">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 py-2 text-center text-gray-300 hover:text-white hover:bg-gray-700 transition"
              >
                <div className="text-lg">{item.icon}</div>
                <div className="text-xs">{item.label}</div>
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
