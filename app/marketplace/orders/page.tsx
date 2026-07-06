import { Suspense } from "react"
import { Package, Truck, CheckCircle2, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { getUserOrders } from "@/lib/marketplace/queries"
import type { Order as OrderType } from "@/lib/marketplace/types"

const STATUS_CONFIG = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Confirmed" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Cancelled" },
}

async function OrdersList() {
  // Fetch live orders from Supabase
  const orders = await getUserOrders()

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
        const statusKey = (order.order_status?.toLowerCase() || "pending") as keyof typeof STATUS_CONFIG
        const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending
        const Icon = statusConfig.icon
        return (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{order.order_number || "Order"}</CardTitle>
                  <CardDescription>
                    Placed on {order.placed_at ? new Date(order.placed_at).toLocaleDateString("en-IN") : "N/A"}
                  </CardDescription>
                </div>
                <Badge className={statusConfig.color} variant="secondary">
                  <Icon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{(order.subtotal || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{(order.tax_amount || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{(order.shipping_amount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{(order.total_amount || 0).toLocaleString("en-IN")}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <a href={`/marketplace/orders/${order.id}`}>
                    <Eye className="h-4 w-4" />
                    View Details
                  </a>
                </Button>
                {statusKey === "delivered" && (
                  <Button size="sm" variant="outline">
                    Leave Review
                  </Button>
                )}
                {statusKey !== "delivered" && statusKey !== "cancelled" && (
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
