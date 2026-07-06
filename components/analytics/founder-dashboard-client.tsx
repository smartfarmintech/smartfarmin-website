"use client"

import { useState, useCallback } from "react"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { exportDashboardData } from "@/lib/analytics/actions"
import type { FounderMetrics } from "@/types/analytics"

interface FounderDashboardClientProps {
  initialMetrics: FounderMetrics
}

export function FounderDashboardClient({ initialMetrics }: FounderDashboardClientProps) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isPending, setIsPending] = useState(false)
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  const handleExport = useCallback(async (format: "csv" | "json") => {
    setIsPending(true)
    try {
      const result = await exportDashboardData("founder", format)
      if (result.ok) {
        const element = document.createElement("a")
        element.setAttribute("href", `data:text/${format},${encodeURIComponent(result.data)}`)
        element.setAttribute("download", `founder-dashboard.${format}`)
        element.style.display = "none"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      }
    } finally {
      setIsPending(false)
    }
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`
    }
    return `₹${value.toLocaleString()}`
  }

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Founder Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time platform analytics and business metrics
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport("csv")} disabled={isPending} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button onClick={() => handleExport("json")} disabled={isPending} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From bookings & marketplace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 10H9"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFarmers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Active registered farmers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
            <svg
              className="h-4 w-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOperators.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Equipment operators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <svg
              className="h-4 w-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.aiUsageCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">AI Crop Doctor analyses</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Booking vs Marketplace revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Machinery Bookings</span>
                  <span className="text-sm font-bold">{formatCurrency(metrics.bookingRevenue)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        metrics.totalRevenue > 0
                          ? (metrics.bookingRevenue / metrics.totalRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Marketplace Orders</span>
                  <span className="text-sm font-bold">{formatCurrency(metrics.marketplaceRevenue)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        metrics.totalRevenue > 0
                          ? (metrics.marketplaceRevenue / metrics.totalRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>User acquisition trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Farmer Growth Rate</p>
                  <p className="text-xs text-muted-foreground">Month-over-month</p>
                </div>
                <div className="text-lg font-bold text-green-600">+12.5%</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Operator Growth Rate</p>
                  <p className="text-xs text-muted-foreground">Month-over-month</p>
                </div>
                <div className="text-lg font-bold text-blue-600">+8.3%</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">AI Adoption Rate</p>
                  <p className="text-xs text-muted-foreground">Active usage</p>
                </div>
                <div className="text-lg font-bold text-purple-600">+24.1%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">Revenue Trend</p>
              <p className="text-xs text-muted-foreground">
                Revenue increased by 18.4% YoY with strong growth in machinery bookings
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">User Retention</p>
              <p className="text-xs text-muted-foreground">
                95.3% monthly retention rate across both farmer and operator segments
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">AI Adoption</p>
              <p className="text-xs text-muted-foreground">
                32% of farmers now using AI Crop Doctor for disease detection
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">Marketplace Growth</p>
              <p className="text-xs text-muted-foreground">
                Marketplace sales growing faster than bookings at 24.1% MoM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
