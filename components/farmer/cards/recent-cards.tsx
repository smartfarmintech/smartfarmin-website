import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function RecentOrdersCard({ farmer }: any) {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', farmer.user_id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <Card className="md:col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
        <CardDescription>{orders?.length || 0} orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="p-2 rounded border border-border text-sm">
                <p className="font-medium">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">₹{order.total_amount}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/dashboard/farmer/orders">View All Orders</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export async function RecentBookingsCard({ farmer }: any) {
  const supabase = await createClient()
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, machines(name)')
    .eq('renter_id', farmer.user_id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <Card className="md:col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
        <CardDescription>{bookings?.length || 0} bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="p-2 rounded border border-border text-sm">
                <p className="font-medium">{booking.machines?.name}</p>
                <p className="text-xs text-muted-foreground">₹{booking.total_amount}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/dashboard/farmer/machinery">Book Machinery</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
