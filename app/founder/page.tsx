import { Suspense } from "react"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { DashboardKPI } from "@/components/dashboard-kpi"
import { DashboardSection } from "@/components/dashboard-section"
import { EmptyState } from "@/components/empty-state"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Founder Dashboard — SmartFarmin",
  description: "Platform-wide business metrics and insights",
}

async function FounderMetrics() {
  try {
    const metrics = {
      totalUsers: 24580,
      monthlyRevenue: 4250000,
      totalTransactions: 12340,
      platformHealth: 99.8,
      activeUsers: 18945,
      newUsersMonth: 2340,
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKPI
          label="Total Users"
          value={metrics.totalUsers.toLocaleString("en-IN")}
          icon={Users}
          trend={{ value: 12, direction: "up" }}
          tone="default"
        />
        <DashboardKPI
          label="Monthly Revenue"
          value={`₹${(metrics.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend={{ value: 23, direction: "up" }}
          tone="accent"
        />
        <DashboardKPI
          label="Total Orders"
          value={metrics.totalTransactions.toLocaleString("en-IN")}
          icon={ShoppingCart}
          hint="All time"
        />
        <DashboardKPI
          label="Platform Health"
          value={`${metrics.platformHealth}%`}
          icon={Activity}
          tone="default"
        />
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading metrics</div>
  }
}

async function BusinessInsights() {
  try {
    const insights = [
      {
        metric: "Monthly Active Users",
        current: 18945,
        previous: 16780,
        growth: 12.9,
      },
      {
        metric: "Avg Order Value",
        current: 3450,
        previous: 3120,
        growth: 10.6,
      },
      {
        metric: "Customer Retention",
        current: 84.5,
        previous: 81.2,
        growth: 4.1,
      },
      {
        metric: "Marketplace GMV",
        current: 12400000,
        previous: 10080000,
        growth: 23.0,
      },
    ]

    return (
      <DashboardSection title="Business Insights" description="Key metrics comparison">
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.metric} className="border-b pb-3 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{insight.metric}</p>
                <span className="text-xs text-green-600">
                  ↑ {insight.growth}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Current: {typeof insight.current === "number" && insight.current > 1000000
                    ? `₹${(insight.current / 1000000).toFixed(1)}M`
                    : typeof insight.current === "number" && insight.current > 1000
                      ? `${(insight.current / 1000).toFixed(0)}K`
                      : typeof insight.current === "number"
                        ? insight.current.toFixed(1)
                        : insight.current}
                </span>
                <span className="text-muted-foreground">
                  Previous: {typeof insight.previous === "number" && insight.previous > 1000000
                    ? `₹${(insight.previous / 1000000).toFixed(1)}M`
                    : typeof insight.previous === "number" && insight.previous > 1000
                      ? `${(insight.previous / 1000).toFixed(0)}K`
                      : typeof insight.previous === "number"
                        ? insight.previous.toFixed(1)
                        : insight.previous}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

async function SystemAlerts() {
  try {
    const alerts = [
      {
        id: "1",
        severity: "critical",
        title: "API Response Time Degradation",
        message: "Response times have increased by 40% in the last hour",
        timestamp: "2024-01-15 14:30",
      },
      {
        id: "2",
        severity: "warning",
        title: "High Error Rate Detected",
        message: "Error rate is at 2.3%, threshold is 2%",
        timestamp: "2024-01-15 13:45",
      },
      {
        id: "3",
        severity: "info",
        title: "Scheduled Maintenance",
        message: "Database backup completed successfully",
        timestamp: "2024-01-15 12:00",
      },
    ]

    return (
      <DashboardSection title="System Alerts" description="Platform health notifications">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                alert.severity === "critical"
                  ? "border-l-red-500 bg-red-50"
                  : alert.severity === "warning"
                    ? "border-l-yellow-500 bg-yellow-50"
                    : "border-l-blue-500 bg-blue-50"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                  alert.severity === "critical"
                    ? "text-red-600"
                    : alert.severity === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

async function TopCategories() {
  try {
    const categories = [
      { name: "Farm Machinery", revenue: 1240000, orders: 340, growth: 18 },
      { name: "Fertilizers & Seeds", revenue: 980000, orders: 2140, growth: 24 },
      { name: "Irrigation Systems", revenue: 650000, orders: 120, growth: 12 },
      { name: "Organic Products", revenue: 380000, orders: 890, growth: 35 },
    ]

    return (
      <DashboardSection title="Top Categories" description="Revenue by category this month">
        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-green-600">+{cat.growth}%</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  ₹{(cat.revenue / 100000).toFixed(1)}L • {cat.orders} orders
                </p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

async function UserSegments() {
  try {
    const segments = [
      { role: "Farmers", count: 14520, growth: 8 },
      { role: "Operators", count: 3240, growth: 12 },
      { role: "Dealers", count: 2150, growth: 15 },
      { role: "Telecallers", count: 890, growth: 5 },
      { role: "Field Agents", count: 420, growth: 22 },
      { role: "Admins", count: 165, growth: 0 },
    ]

    return (
      <DashboardSection title="User Segments" description="Active users by role">
        <div className="grid gap-2 sm:grid-cols-2">
          {segments.map((segment) => (
            <div
              key={segment.role}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">{segment.role}</p>
                <p className="text-xs text-muted-foreground">
                  {segment.count.toLocaleString("en-IN")} users
                </p>
              </div>
              <span className="text-xs text-green-600">+{segment.growth}%</span>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

export default function FounderDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Business metrics, system health, and strategic insights
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <FounderMetrics />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <BusinessInsights />
        </Suspense>
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <SystemAlerts />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <TopCategories />
        </Suspense>
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <UserSegments />
        </Suspense>
      </div>
    </div>
  )
}
