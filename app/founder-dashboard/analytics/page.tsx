"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30days")

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Deep dive into platform metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Revenue Trend</h2>
          <div className="h-80 bg-gray-800 rounded-lg flex items-end justify-around gap-1 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${Math.random() * 100}%`, minWidth: "20px" }}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
          <div className="space-y-3">
            {[
              { label: "Growth Rate", value: "24.5%", trend: "↑" },
              { label: "Churn Rate", value: "2.1%", trend: "↓" },
              { label: "LTV:CAC Ratio", value: "3.8x", trend: "↑" },
              { label: "Payback Period", value: "45 days", trend: "↓" },
              { label: "Net Revenue Retention", value: "112%", trend: "↑" },
            ].map((metric) => (
              <div key={metric.label} className="flex justify-between items-center">
                <span className="text-gray-400">{metric.label}</span>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">User Cohorts</h2>
          <div className="space-y-3 text-sm">
            {[
              { cohort: "Jan 2024", users: "1,245", retention: "89%" },
              { cohort: "Feb 2024", users: "1,892", retention: "85%" },
              { cohort: "Mar 2024", users: "2,134", retention: "78%" },
              { cohort: "Apr 2024", users: "2,456", retention: "72%" },
            ].map((item) => (
              <div key={item.cohort} className="flex justify-between p-2 bg-gray-800 rounded">
                <span className="text-gray-300">{item.cohort}</span>
                <div className="flex gap-4">
                  <span className="text-blue-400">{item.users}</span>
                  <span className="text-green-400 w-12 text-right">{item.retention}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Funnel Analysis</h2>
          <div className="space-y-2">
            {[
              { stage: "Views", count: "45,234", conversion: "100%" },
              { stage: "Sign ups", count: "12,145", conversion: "26.9%" },
              { stage: "Activated", count: "8,234", conversion: "67.9%" },
              { stage: "Paid", count: "4,152", conversion: "50.4%" },
            ].map((item) => (
              <div key={item.stage}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">{item.stage}</span>
                  <span className="text-blue-400 text-sm">{item.count}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: item.conversion }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
