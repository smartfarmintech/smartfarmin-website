export const dynamic = 'force-dynamic'
export const metadata = { title: 'Orders | Rythu360', description: 'Track your orders and deliveries' }

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, MapPin, Clock, CheckCircle } from 'lucide-react'

async function getOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: orders } = await supabase
    .from('v_order_summary')
    .select('*')
    .eq('buyer_id', user.id)
    .order('placed_at', { ascending: false })
    .limit(50)

  return { orders: orders || [] }
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  pending: Package,
  confirmed: Clock,
  shipped: MapPin,
  delivered: CheckCircle,
}

export default async function OrdersPage() {
  const data = await getOrders()
  if (!data) redirect('/login/farmer')

  const { orders } = data

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <p className="text-muted-foreground">Track and manage your purchases</p>
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order: any) => {
            const StatusIcon = statusIcons[order.order_status as keyof typeof statusIcons] || Package
            return (
              <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-semibold">Order #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.placed_at).toLocaleDateString()} • {order.item_count} items
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge className={statusColors[order.order_status as keyof typeof statusColors] || ''}>
                      {order.order_status}
                    </Badge>
                    <StatusIcon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <Badge variant="outline" className="text-xs">{order.payment_status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="text-xs">{order.expected_delivery_at ? new Date(order.expected_delivery_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking</p>
                    <p className="text-xs text-blue-600 cursor-pointer hover:underline">#{order.tracking_number?.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/orders/${order.id}`}>View Details</a>
                  </Button>
                  <Button size="sm" variant="outline">Track</Button>
                  {order.order_status === 'delivered' && <Button size="sm" variant="outline">Return</Button>}
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No orders yet. Start shopping!</p>
            <Button asChild className="mt-4">
              <a href="/marketplace">Browse Marketplace</a>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
