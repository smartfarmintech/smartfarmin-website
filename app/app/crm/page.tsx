import { Suspense } from "react"
import {
  Users,
  MapPin,
  TrendingUp,
  Clock,
} from "lucide-react"
import {
  getFieldAgent,
  getAssignedFarmers,
  getAgentVisits,
  getAgentExpenses,
  getAgentPerformance,
} from "@/lib/crm/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function AgentProfile() {
  try {
    const agent = await getFieldAgent()

    if (!agent) {
      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Field agent profile not found</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{agent.full_name}</CardTitle>
          <CardDescription>{agent.employee_code} • {agent.team}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{agent.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{agent.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {agent.state}, {agent.district}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{agent.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading agent profile</div>
  }
}

async function PerformanceMetrics() {
  try {
    const metrics = await getAgentPerformance()

    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.presentDays || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.averageHours || "0"}</div>
            <p className="text-xs text-muted-foreground">Per working day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((metrics?.totalWorkedMinutes || 0) / 60).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading metrics</div>
  }
}

async function AssignedFarmers() {
  try {
    const { farmers, total } = await getAssignedFarmers(5)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assigned Farmers
          </CardTitle>
          <CardDescription>{total} farmers under your care</CardDescription>
        </CardHeader>
        <CardContent>
          {farmers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No farmers assigned</p>
          ) : (
            <div className="space-y-3">
              {farmers.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.farmers?.user_profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{item.farmers?.farmer_code}</p>
                  </div>
                  <Button size="sm" variant="outline">Visit</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading farmers</div>
  }
}

async function RecentVisits() {
  try {
    const visits = await getAgentVisits({ limit: 5 })

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
          <CardDescription>Latest farmer visits</CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visits logged</p>
          ) : (
            <div className="space-y-2">
              {visits.map((visit: any) => (
                <div key={visit.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{visit.farmers?.user_profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{visit.visit_type}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading visits</div>
  }
}

async function PendingExpenses() {
  try {
    const expenses = await getAgentExpenses(3)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your submitted expense claims</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expenses submitted</p>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense: any) => (
                <div key={expense.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium capitalize">{expense.category}</p>
                    <p className="text-xs text-muted-foreground">{expense.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{expense.amount.toLocaleString("en-IN")}</p>
                    <p className="text-xs capitalize text-muted-foreground">{expense.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading expenses</div>
  }
}

export default function CrmPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Field Agent CRM</h1>
        <p className="text-muted-foreground mt-2">Manage your farmers, visits, and activities</p>
      </div>

      <Suspense fallback={<div>Loading profile...</div>}>
        <AgentProfile />
      </Suspense>

      <Suspense fallback={<div>Loading metrics...</div>}>
        <PerformanceMetrics />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<div>Loading farmers...</div>}>
          <AssignedFarmers />
        </Suspense>

        <Suspense fallback={<div>Loading visits...</div>}>
          <RecentVisits />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading expenses...</div>}>
        <PendingExpenses />
      </Suspense>
    </div>
  )
}
