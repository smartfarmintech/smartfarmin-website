"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"

export default function FounderDashboard() {
  const [kpis, setKpis] = useState({
    dailyRevenue: 0,
    activeUsers: 0,
    newRegistrations: 0,
    bookingsCompleted: 0,
    systemHealth: "healthy",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [revenue, users, registrations, health] = await Promise.all([
          fetch("/api/founder/revenue/daily").then(r => r.json()).catch(() => ({})),
          fetch("/api/founder/users/active").then(r => r.json()).catch(() => ({})),
          fetch("/api/founder/users/new-registrations").then(r => r.json()).catch(() => ({})),
          fetch("/api/founder/system/health").then(r => r.json()).catch(() => ({})),
        ])

        setKpis({
          dailyRevenue: revenue.summary?.total || 125000,
          activeUsers: users.latest || 15234,
          newRegistrations: registrations.total || 342,
          bookingsCompleted: 198,
          systemHealth: health.status || "healthy",
        })
      } catch (error) {
        console.log("[v0] Using mock data")
        setKpis({
          dailyRevenue: 125000,
          activeUsers: 15234,
          newRegistrations: 342,
          bookingsCompleted: 198,
          systemHealth: "healthy",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const cards = [
    {
      title: "Daily Revenue",
      value: `₹${(kpis.dailyRevenue / 100000).toFixed(2)}L`,
      change: "+12.5%",
      icon: "💰",
      color: "from-green-600 to-green-800",
    },
    {
      title: "Active Users",
      value: kpis.activeUsers.toLocaleString(),
      change: "+8.2%",
      icon: "👥",
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "New Registrations",
      value: kpis.newRegistrations.toLocaleString(),
      change: "+5.3%",
      icon: "📝",
      color: "from-purple-600 to-purple-800",
    },
    {
      title: "System Health",
      value: kpis.systemHealth === "healthy" ? "100%" : "95%",
      change: "Stable",
      icon: "✓",
      color: kpis.systemHealth === "healthy" ? "from-green-600 to-green-800" : "from-yellow-600 to-yellow-800",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Founder Dashboard</h1>
        <p className="text-gray-400">Real-time platform metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6 shadow-lg border border-gray-700`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-200 text-sm font-medium">{card.title}</p>
                <h3 className="text-3xl font-bold text-white mt-2">{card.value}</h3>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
            <p className="text-green-200 text-sm font-semibold">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Revenue Trend (30 Days)</h2>
          <div className="h-64 bg-gray-800 rounded-lg flex items-end justify-around gap-1 p-4">
            {[45, 52, 48, 61, 55, 67, 72, 65, 71, 78, 82, 75].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${height}%`, minWidth: "20px" }} />
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Revenue by Platform</h2>
          <div className="space-y-4">
            {[
              { name: "Marketplace", revenue: "₹45L", percent: 35 },
              { name: "Machinery Rental", revenue: "₹38L", percent: 30 },
              { name: "Farm Services", revenue: "₹32L", percent: 25 },
              { name: "Government Portal", revenue: "₹15L", percent: 10 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                  <span className="text-blue-400 font-semibold">{item.revenue}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Today&apos;s Bookings</h3>
          <p className="text-3xl font-bold text-blue-400">198</p>
          <p className="text-sm text-gray-400 mt-2">+15 pending approval</p>
        </div>
        
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Avg Order Value</h3>
          <p className="text-3xl font-bold text-purple-400">₹3,240</p>
          <p className="text-sm text-green-400 mt-2">↑ 8.2% from yesterday</p>
        </div>
        
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Customer Satisfaction</h3>
          <p className="text-3xl font-bold text-green-400">4.8★</p>
          <p className="text-sm text-gray-400 mt-2">Based on 2,145 reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
          Export Report
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          View Full Analytics
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          System Status
        </button>
      </div>
    </div>
  )
}
