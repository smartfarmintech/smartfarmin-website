"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { redirect } from "next/navigation"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/content", label: "Content", icon: "📝" },
  { href: "/admin/support", label: "Support", icon: "❓" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || profile?.role_id !== "admin") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">AgreeConnect Admin</h1>
            <p className="text-xs text-gray-400">Enterprise Control Center</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button className="w-full py-2 text-red-400 font-medium hover:bg-red-900 rounded-lg transition">
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
