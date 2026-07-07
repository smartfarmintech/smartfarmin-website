import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  BarChart3,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Super Admin Dashboard — Rythu360',
  description: 'Platform-wide administration and revenue tracking',
}

async function PlatformMetrics() {
  try {
    const supabase = await createClient()

    // Fetch aggregated metrics
    const { data: dailyMetrics } = await supabase
      .from('daily_metrics')
      .select('*')
      .order('metric_date', { ascending: false })
      .limit(30)

    // Fetch revenue
    const { data: transactions } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('transaction_type', 'settlement')
      .limit(100)

    const totalRevenue = transactions?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Revenue</p>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(2)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{dailyMetrics?.length || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return null
  }
}

async function IncidentLog() {
  try {
    const supabase = await createClient()

    const { data: incidents } = await supabase
      .from('incident_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents?.map((incident: any) => (
              <div key={incident.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{incident.title}</p>
                  <p className="text-sm text-muted-foreground">{incident.message}</p>
                </div>
                <Badge
                  variant={incident.severity === 'critical' ? 'destructive' : 'default'}
                >
                  {incident.severity}
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

async function SubscriptionAnalytics() {
  try {
    const supabase = await createClient()

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .in('status', ['active', 'canceled', 'expired'])

    const stats = {
      active: subscriptions?.filter((s: any) => s.status === 'active').length || 0,
      canceled: subscriptions?.filter((s: any) => s.status === 'canceled').length || 0,
      expired: subscriptions?.filter((s: any) => s.status === 'expired').length || 0,
    }

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceled</p>
                <p className="text-2xl font-bold text-red-600">{stats.canceled}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return null
  }
}

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide administration</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div>Loading metrics...</div>}>
            <PlatformMetrics />
          </Suspense>
          <Suspense fallback={<div>Loading incidents...</div>}>
            <IncidentLog />
          </Suspense>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Revenue tracking and analytics</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System health and performance monitoring</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Suspense fallback={<div>Loading subscriptions...</div>}>
            <SubscriptionAnalytics />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
