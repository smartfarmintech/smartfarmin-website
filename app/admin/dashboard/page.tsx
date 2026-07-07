import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  ShoppingCart,
  Tractor,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Admin Dashboard — Rythu360',
  description: 'Platform administration and monitoring',
}

async function AdminStats() {
  try {
    const supabase = await createClient()

    const [
      { count: userCount },
      { count: orderCount },
      { count: bookingCount },
      { count: leadCount },
    ] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact' }),
      supabase.from('orders').select('id', { count: 'exact' }),
      supabase.from('bookings').select('id', { count: 'exact' }),
      supabase.from('leads').select('id', { count: 'exact' }),
    ])

    const stats = [
      {
        icon: Users,
        label: 'Total Users',
        value: userCount || 0,
        trend: '+12%',
      },
      {
        icon: ShoppingCart,
        label: 'Orders',
        value: orderCount || 0,
        trend: '+8%',
      },
      {
        icon: Tractor,
        label: 'Bookings',
        value: bookingCount || 0,
        trend: '+5%',
      },
      {
        icon: TrendingUp,
        label: 'Active Leads',
        value: leadCount || 0,
        trend: '+15%',
      },
    ]

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  } catch (error) {
    return <div>Error loading stats</div>
  }
}

async function RecentOrders() {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        buyer_id,
        total_amount,
        order_status,
        created_at
      `
      )
      .order('created_at', { ascending: false })
      .limit(5)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">₹{order.total_amount}</p>
                </div>
                <Badge variant={order.order_status === 'completed' ? 'default' : 'outline'}>
                  {order.order_status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return null
  }
}

async function SystemHealth() {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from('system_health')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(5)

    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.map((health: any) => (
              <div key={health.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{health.service}</p>
                  <p className="text-sm text-muted-foreground">Latency: {health.latency_ms}ms</p>
                </div>
                <Badge
                  variant={health.status === 'healthy' ? 'default' : 'destructive'}
                >
                  {health.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return null
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform management and monitoring</p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <AdminStats />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
          <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
            <RecentOrders />
          </Suspense>
          <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
            <SystemHealth />
          </Suspense>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Content management interface</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings interface</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
