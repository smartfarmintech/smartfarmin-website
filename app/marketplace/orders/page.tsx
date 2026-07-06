import { Suspense } from "react"
import { Package, Truck, CheckCircle2, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"

const STATUS_CONFIG = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Confirmed" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Cancelled" },
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: keyof typeof STATUS_CONFIG
  total: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

async function OrdersList() {
  // Mock orders data
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      date: "2024-01-20",
      status: "delivered",
      total: 2850,
      items: [
        { id: "1", name: "Premium Hybrid Paddy Seeds", quantity: 2, price: 850 },
        { id: "2", name: "Organic NPK Fertilizer", quantity: 1, price: 1200 },
      ],
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      date: "2024-01-22",
      status: "shipped",
      total: 4500,
      items: [
        { id: "3", name: "Pesticide Spray - 5L", quantity: 1, price: 4500 },
      ],
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      date: "2024-01-25",
      status: "confirmed",
      total: 6200,
      items: [
        { id: "4", name: "Farm Equipment Kit", quantity: 1, price: 6200 },
      ],
    },
  ]

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
        <p className="text-muted-foreground">Start shopping to place your first order</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusConfig = STATUS_CONFIG[order.status]
        const Icon = statusConfig.icon
        return (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.date).toLocaleDateString("en-IN")}
                  </CardDescription>
                </div>
                <Badge className={statusConfig.color} variant="secondary">
                  <Icon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button size="sm" variant="outline">
                    Leave Review
                  </Button>
                )}
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <Button size="sm" variant="outline">
                    Track Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
            <OrdersList />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
