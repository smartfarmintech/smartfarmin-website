import { Suspense } from "react"
import { Phone, Target, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { DashboardKPI } from "@/components/dashboard-kpi"
import { DashboardSection } from "@/components/dashboard-section"
import { EmptyState } from "@/components/empty-state"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Telecaller Dashboard — SmartFarmin",
  description: "Track calls, leads, and conversion metrics",
}

async function TelecallerStats() {
  try {
    const stats = {
      totalCalls: 145,
      connectedCalls: 98,
      leads: 34,
      conversions: 8,
      avgCallDuration: 4.2,
      conversionRate: 23.5,
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKPI
          label="Total Calls"
          value={stats.totalCalls}
          icon={Phone}
          hint="This week"
          tone="default"
        />
        <DashboardKPI
          label="Connected"
          value={`${((stats.connectedCalls / stats.totalCalls) * 100).toFixed(0)}%`}
          icon={CheckCircle2}
          hint={`${stats.connectedCalls} calls`}
          tone="accent"
        />
        <DashboardKPI
          label="Leads"
          value={stats.leads}
          icon={Target}
          hint="Generated this week"
        />
        <DashboardKPI
          label="Conversions"
          value={stats.conversions}
          icon={TrendingUp}
          trend={{ value: 18, direction: "up" }}
        />
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading stats</div>
  }
}

async function CallLogs() {
  try {
    const calls = [
      {
        id: "1",
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        duration: 8,
        outcome: "interested",
        time: "2024-01-15 10:30",
      },
      {
        id: "2",
        name: "Priya Singh",
        phone: "+91 98765 43211",
        duration: 0,
        outcome: "not_reachable",
        time: "2024-01-15 10:15",
      },
      {
        id: "3",
        name: "Amit Patel",
        phone: "+91 98765 43212",
        duration: 5,
        outcome: "not_interested",
        time: "2024-01-15 09:45",
      },
    ]

    return (
      <DashboardSection title="Recent Calls" description="Today's call activity">
        <div className="space-y-2">
          {calls.map((call) => (
            <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{call.name}</p>
                <p className="text-xs text-muted-foreground">{call.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{call.duration}m</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    call.outcome === "interested"
                      ? "bg-green-100 text-green-700"
                      : call.outcome === "not_interested"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {call.outcome.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return <EmptyState title="No calls logged" />
  }
}

async function TargetProgress() {
  try {
    const targets = [
      { metric: "Calls", target: 150, achieved: 145, unit: "calls" },
      { metric: "Leads", target: 40, achieved: 34, unit: "leads" },
      { metric: "Conversions", target: 10, achieved: 8, unit: "sales" },
      { metric: "Avg Duration", target: 5, achieved: 4.2, unit: "min" },
    ]

    return (
      <DashboardSection title="Weekly Targets" description="Performance against goals">
        <div className="space-y-4">
          {targets.map((target) => {
            const percentage = (target.achieved / target.target) * 100
            return (
              <div key={target.metric}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{target.metric}</p>
                  <p className="text-xs text-muted-foreground">
                    {target.achieved} / {target.target} {target.unit}
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </DashboardSection>
    )
  } catch (error) {
    return null
  }
}

async function Followups() {
  try {
    const followups = [
      {
        id: "1",
        lead: "Haryana Agro",
        scheduledFor: "2024-01-16 14:00",
        status: "pending",
      },
      {
        id: "2",
        lead: "Punjab Seeds Co",
        scheduledFor: "2024-01-17 10:30",
        status: "pending",
      },
      {
        id: "3",
        lead: "Rajasthan Farms",
        scheduledFor: "2024-01-18 15:00",
        status: "pending",
      },
    ]

    return (
      <DashboardSection title="Scheduled Followups" description="Upcoming calls">
        <div className="space-y-2">
          {followups.map((fu) => (
            <div key={fu.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{fu.lead}</p>
                <p className="text-xs text-muted-foreground">{fu.scheduledFor}</p>
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

export default function TelecallerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Telecaller Dashboard</h1>
        <p className="text-muted-foreground">Track your calls, leads, and conversion performance</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <TelecallerStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <CallLogs />
        </Suspense>
        <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
          <TargetProgress />
        </Suspense>
      </div>

      <Suspense fallback={<Card><CardContent className="p-8">Loading...</CardContent></Card>}>
        <Followups />
      </Suspense>
    </div>
  )
}
