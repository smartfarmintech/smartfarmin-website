import { Suspense } from "react"
import {
  Users,
  TrendingUp,
  ShoppingCart,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { requireAdmin, getAdminStats, getRecentOrders, getPendingVerifications, getPendingApplications } from "@/lib/admin/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function AdminStats() {
  try {
    const stats = await getAdminStats()
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFarmers.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">Active farmers</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading statistics</div>
  }
}

async function RecentOrders() {
  try {
    const orders = await getRecentOrders(5)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders placed on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">₹{order.total_amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading orders</div>
  }
}

async function PendingVerifications() {
  try {
    const verifications = await getPendingVerifications(5)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pending Verifications
          </CardTitle>
          <CardDescription>Farm documents and documents awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending verifications</p>
            ) : (
              verifications.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Farmer: {v.farmers?.user_profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{v.verification_type}</p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading verifications</div>
  }
}

async function PendingSchemeApplications() {
  try {
    const applications = await getPendingApplications(5)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Scheme Applications
          </CardTitle>
          <CardDescription>Government scheme applications pending approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending applications</p>
            ) : (
              applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.schemes?.name}</p>
                    <p className="text-xs text-muted-foreground">{app.farmers?.user_profiles?.full_name}</p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading applications</div>
  }
}

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage platform, users, and operations</p>
      </div>

      <Suspense fallback={<div>Loading statistics...</div>}>
        <AdminStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<div>Loading orders...</div>}>
          <RecentOrders />
        </Suspense>

        <Suspense fallback={<div>Loading verifications...</div>}>
          <PendingVerifications />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading applications...</div>}>
        <PendingSchemeApplications />
      </Suspense>
    </div>
  )
}
