import { Suspense } from "react"
import { ShoppingCart, TrendingUp, Users, Package, AlertCircle } from "lucide-react"
import { DashboardKPI } from "@/components/dashboard-kpi"
import { DashboardSection } from "@/components/dashboard-section"
import { EmptyState } from "@/components/empty-state"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dealer Dashboard — SmartFarmin",
  description: "Manage your product inventory, sales, and customer orders",
}

async function DealerStats() {
  try {
    // In production, fetch real data from Supabase
    const stats = {
      totalProducts: 156,
      activeOrders: 24,
      monthlyRevenue: 285000,
      pendingInventory: 8,
      totalCustomers: 342,
      returnRate: 2.3,
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKPI
          label="Products"
          value={stats.totalProducts}
          icon={Package}
          hint="In stock"
          tone="default"
        />
        <DashboardKPI
          label="Active Orders"
          value={stats.activeOrders}
          icon={ShoppingCart}
          hint="This month"
          tone="accent"
        />
        <DashboardKPI
          label="Revenue (MTD)"
          value={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          trend={{ value: 12, direction: "up" }}
        />
        <DashboardKPI
          label="Customers"
          value={stats.totalCustomers}
          icon={Users}
          hint={`${stats.returnRate}% return rate`}
        />
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading stats</div>
  }
}

async function RecentOrders() {
  try {
    const orders = [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: "Ramesh Fertilizer",
        items: 5,
        total: 45000,
        status: "delivered",
        date: "2024-01-15",
      },
      {
        id: "2",
        orderNumber: "ORD-2024-002",
        customer: "Haryana Seeds Ltd",
        items: 12,
        total: 78000,
        status: "shipped",
        date: "2024-01-14",
      },
      {
        id: "3",
        orderNumber: "ORD-2024-003",
        customer: "Punjab Agro",
        items: 8,
        total: 62000,
        status: "pending",
        date: "2024-01-13",
      },
    ]

    return (
      <DashboardSection title="Recent Orders" description="Latest customer orders">
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">₹{(order.total / 1000).toFixed(0)}K</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return <EmptyState title="No orders yet" />
  }
}

async function InventoryAlerts() {
  try {
    const alerts = [
      { id: "1", product: "Urea 50kg", current: 12, reorderLevel: 50, status: "low" },
      { id: "2", product: "DAP Fertilizer", current: 5, reorderLevel: 25, status: "critical" },
      { id: "3", product: "Seed Box A", current: 3, reorderLevel: 10, status: "critical" },
    ]

    return (
      <DashboardSection
        title="Inventory Alerts"
        description="Products needing restock"
        action={<Button size="sm" variant="outline">Reorder</Button>}
      >
        {alerts.length === 0 ? (
          <EmptyState title="All inventory levels healthy" />
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                  alert.status === "critical"
                    ? "border-l-red-500 bg-red-50"
                    : "border-l-yellow-500 bg-yellow-50"
                }`}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.product}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.current} / {alert.reorderLevel} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

async function TopProducts() {
  try {
    const products = [
      { id: "1", name: "Urea Fertilizer", sales: 1240, revenue: 92000 },
      { id: "2", name: "Hybrid Maize Seeds", sales: 856, revenue: 128400 },
      { id: "3", name: "Fungicide Spray", sales: 642, revenue: 76000 },
      { id: "4", name: "DAP Mix", sales: 580, revenue: 43500 },
      { id: "5", name: "Organic Manure", sales: 480, revenue: 32000 },
    ]

    return (
      <DashboardSection title="Top Selling Products" description="Based on revenue this month">
        <div className="space-y-3">
          {products.map((product, idx) => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">₹{(product.revenue / 1000).toFixed(0)}K</p>
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

export default function DealerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dealer Dashboard</h1>
        <p className="text-muted-foreground">Manage inventory, orders, and sales performance</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DealerStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
            <RecentOrders />
          </Suspense>
        </div>
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <TopProducts />
        </Suspense>
      </div>

      <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
        <InventoryAlerts />
      </Suspense>
    </div>
  )
}
