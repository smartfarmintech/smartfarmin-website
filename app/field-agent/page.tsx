import { Suspense } from "react"
import { Users, MapPin, Clock, CheckCircle2, FileText } from "lucide-react"
import { DashboardKPI } from "@/components/dashboard-kpi"
import { DashboardSection } from "@/components/dashboard-section"
import { EmptyState } from "@/components/empty-state"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Field Agent Dashboard — SmartFarmin",
  description: "Manage assigned farmers, visits, and performance metrics",
}

async function AgentStats() {
  try {
    const stats = {
      assignedFarmers: 48,
      visits: 32,
      visitCompletion: 94,
      pendingVerifications: 5,
      expenses: 12850,
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKPI
          label="Assigned Farmers"
          value={stats.assignedFarmers}
          icon={Users}
          hint="Under your care"
          tone="default"
        />
        <DashboardKPI
          label="Visits This Month"
          value={stats.visits}
          icon={MapPin}
          hint={`${stats.visitCompletion}% completed`}
          tone="accent"
        />
        <DashboardKPI
          label="Pending Verifications"
          value={stats.pendingVerifications}
          icon={FileText}
          hint="Awaiting review"
        />
        <DashboardKPI
          label="Expenses Submitted"
          value={`₹${(stats.expenses / 1000).toFixed(0)}K`}
          icon={Clock}
          trend={{ value: 8, direction: "up" }}
        />
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading stats</div>
  }
}

async function AssignedFarmers() {
  try {
    const farmers = [
      {
        id: "1",
        name: "Rajesh Kumar",
        code: "FM001",
        crops: "Cotton, Maize",
        lastVisit: "2024-01-12",
        status: "active",
      },
      {
        id: "2",
        name: "Priya Singh",
        code: "FM002",
        crops: "Paddy, Sugarcane",
        lastVisit: "2024-01-10",
        status: "active",
      },
      {
        id: "3",
        name: "Amit Patel",
        code: "FM003",
        crops: "Wheat",
        lastVisit: "2024-01-08",
        status: "inactive",
      },
    ]

    return (
      <DashboardSection
        title="Top Assigned Farmers"
        description="Farmers you manage"
        action={<Button size="sm" variant="outline">View All</Button>}
      >
        <div className="space-y-2">
          {farmers.map((farmer) => (
            <div key={farmer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{farmer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {farmer.crops} • Last visit: {farmer.lastVisit}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  farmer.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {farmer.status}
              </span>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return <EmptyState title="No farmers assigned" />
  }
}

async function RecentVisits() {
  try {
    const visits = [
      {
        id: "1",
        farmer: "Rajesh Kumar",
        village: "Warangal",
        type: "routine",
        status: "completed",
        date: "2024-01-15",
      },
      {
        id: "2",
        farmer: "Priya Singh",
        village: "Karimnagar",
        type: "disease_check",
        status: "completed",
        date: "2024-01-14",
      },
      {
        id: "3",
        farmer: "Haryana Agro",
        village: "Hisar",
        type: "training",
        status: "scheduled",
        date: "2024-01-16",
      },
    ]

    return (
      <DashboardSection title="Recent Visits" description="Visit history and schedule">
        <div className="space-y-2">
          {visits.map((visit) => (
            <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{visit.farmer}</p>
                <p className="text-xs text-muted-foreground">
                  {visit.village} • {visit.type.replace(/_/g, " ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{visit.date}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    visit.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {visit.status}
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

async function PendingTasks() {
  try {
    const tasks = [
      { id: "1", task: "Verify farmer registration", daysOverdue: 0 },
      { id: "2", task: "Submit crop health reports", daysOverdue: 2 },
      { id: "3", task: "Approve expense claims", daysOverdue: 0 },
      { id: "4", task: "Document verification", daysOverdue: 1 },
    ]

    return (
      <DashboardSection title="Pending Tasks" description="Action required">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {task.daysOverdue > 0 ? (
                <div className="h-2 w-2 rounded-full bg-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{task.task}</p>
              </div>
              {task.daysOverdue > 0 && (
                <span className="text-xs text-red-600">
                  {task.daysOverdue} day{task.daysOverdue > 1 ? "s" : ""} overdue
                </span>
              )}
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

export default function FieldAgentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Field Agent Dashboard</h1>
        <p className="text-muted-foreground">Manage farmers, visits, and performance</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <AgentStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <AssignedFarmers />
        </Suspense>
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <RecentVisits />
        </Suspense>
      </div>

      <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
        <PendingTasks />
      </Suspense>
    </div>
  )
}
