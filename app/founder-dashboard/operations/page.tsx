"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"

export default function OperationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const metrics = [
    { label: "Active Bookings", value: "234", icon: "📅", trend: "+12" },
    { label: "Field Agents", value: "45", icon: "👤", trend: "+3" },
    { label: "Avg Response", value: "2.3min", icon: "⏱️", trend: "-0.5min" },
    { label: "Success Rate", value: "98.2%", icon: "✓", trend: "+0.3%" },
    { label: "Avg Rating", value: "4.7★", icon: "⭐", trend: "+0.1" },
    { label: "On-time Delivery", value: "96.8%", icon: "📦", trend: "+1.2%" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Operations</h1>
        <p className="text-gray-400">Real-time operational performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <p className="text-gray-400 text-xs mb-2">{metric.label}</p>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-sm text-green-400 mt-1">{metric.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Active Bookings</h2>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-700"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { id: "BK001", machine: "Tractor John Deere", farmer: "Ramakrishna", status: "active", time: "4.2 hours" },
              { id: "BK002", machine: "Harvester CLAAS", farmer: "Sunitha", status: "pending", time: "0 hours" },
              { id: "BK003", machine: "Cultivator", farmer: "Venkatesh", status: "active", time: "2.1 hours" },
              { id: "BK004", machine: "Sprayer", farmer: "Lakshmi", status: "completed", time: "6 hours" },
            ].map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-semibold">{booking.machine}</p>
                  <p className="text-sm text-gray-400">{booking.farmer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{booking.time}</span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      booking.status === "active"
                        ? "bg-green-900/30 text-green-400"
                        : booking.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Booking Pipeline</h2>
          <div className="space-y-3">
            {[
              { stage: "Inquiry", count: 12, percent: 20 },
              { stage: "Confirmed", count: 24, percent: 40 },
              { stage: "In Progress", count: 18, percent: 30 },
              { stage: "Completed", count: 6, percent: 10 },
            ].map((item) => (
              <div key={item.stage}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">{item.stage}</span>
                  <span className="text-blue-400 font-semibold text-sm">{item.count}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Field Agent Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 text-gray-400 font-medium">Agent</th>
                <th className="text-left py-3 text-gray-400 font-medium">Bookings</th>
                <th className="text-left py-3 text-gray-400 font-medium">Revenue</th>
                <th className="text-left py-3 text-gray-400 font-medium">Rating</th>
                <th className="text-left py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Rajesh Kumar", bookings: 34, revenue: "₹8,500", rating: 4.9, status: "active" },
                { name: "Priya Sharma", bookings: 28, revenue: "₹7,200", rating: 4.8, status: "active" },
                { name: "Vikas Patel", bookings: 22, revenue: "₹5,600", rating: 4.6, status: "active" },
                { name: "Anita Singh", bookings: 18, revenue: "₹4,800", rating: 4.4, status: "offline" },
              ].map((agent) => (
                <tr key={agent.name} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-3 text-white">{agent.name}</td>
                  <td className="py-3 text-gray-300">{agent.bookings}</td>
                  <td className="py-3 text-green-400 font-semibold">{agent.revenue}</td>
                  <td className="py-3 text-yellow-400">★ {agent.rating}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        agent.status === "active"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
