import { redirect } from 'next/navigation'
import { MapPin, Camera, CheckCircle, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCurrentUser } from '@/lib/supabase/auth'
import { MetricSummary } from '@/components/dashboard/metric-summary'
import { ActionCard, ActionCardGrid } from '@/components/dashboard/action-card'

export const metadata = {

export const dynamic = 'force-dynamic'
  title: 'Field Agent Dashboard | Rythu360',
  description: 'Track visits, check in with GPS, and submit reports',
}

export default async function FieldAgentDashboardPage() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[Field Agent Dashboard] Auth error:', error)
  }

  if (!user) {
    redirect('/auth/signin?role=field-agent')
  }

  // Mock data
  const todayStats = {
    plannedVisits: 8,
    completedVisits: 5,
    pendingVisits: 3,
    farmersMetByArea: 12,
    targetVisits: 10,
  }

  const visitsList = [
    {
      id: '1',
      farmerName: 'Rajesh Kumar',
      village: 'Warangal',
      status: 'completed',
      cropType: 'Paddy',
      time: '10:30 AM',
      notes: 'Soil quality check done',
    },
    {
      id: '2',
      farmerName: 'Priya Devi',
      village: 'Hyderabad',
      status: 'in-progress',
      cropType: 'Cotton',
      time: '02:00 PM',
      notes: 'Visiting now',
    },
    {
      id: '3',
      farmerName: 'Arjun Singh',
      village: 'Medak',
      status: 'pending',
      cropType: 'Sugarcane',
      time: '04:30 PM',
      notes: 'Scheduled',
    },
  ]

  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 pb-24 md:pb-8 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green-900 mb-2">
            🚜 Today's Field Visits
          </h1>
          <p className="text-gray-600">Track visits, capture photos, and submit reports</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <MetricSummary
            label="Planned"
            value={todayStats.plannedVisits}
            icon={<MapPin className="w-5 h-5" />}
          />
          <MetricSummary
            label="Completed"
            value={todayStats.completedVisits}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricSummary
            label="Pending"
            value={todayStats.pendingVisits}
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <MetricSummary
            label="Met"
            value={todayStats.farmersMetByArea}
            icon={<Users className="w-5 h-5" />}
          />
          <MetricSummary
            label="Progress"
            value={`${Math.round((todayStats.completedVisits / todayStats.targetVisits) * 100)}%`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <ActionCardGrid>
          <ActionCard
            title="GPS Check-in"
            icon="📍"
            description="Start field visit"
            href="/field-agent/checkin"
            color="blue"
          />
          <ActionCard
            title="Capture Photo"
            icon="📷"
            description="Upload field images"
            href="/field-agent/photo"
            color="green"
          />
          <ActionCard
            title="Village Map"
            icon="🗺️"
            description="View all farmers"
            href="/field-agent/map"
            color="teal"
          />
          <ActionCard
            title="Submit Report"
            icon="📝"
            description="Daily summary"
            href="/field-agent/report"
            color="orange"
          />
        </ActionCardGrid>

        {/* Visits Schedule */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            📅 Today's Schedule
          </h2>

          <div className="space-y-3">
            {visitsList.map((visit) => (
              <div
                key={visit.id}
                className={`rounded-2xl p-4 border-2 ${
                  visit.status === 'completed'
                    ? 'bg-leaf-green-50 border-leaf-green-200 opacity-75'
                    : visit.status === 'in-progress'
                      ? 'bg-sky-blue-50 border-sky-blue-300'
                      : 'bg-white border-warm-beige-200'
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-forest-green-900">{visit.farmerName}</h3>
                    <p className="text-sm text-gray-600">{visit.village} · {visit.cropType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-forest-green-600">{visit.time}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        visit.status === 'completed'
                          ? 'bg-leaf-green-200 text-leaf-green-800'
                          : visit.status === 'in-progress'
                            ? 'bg-sky-blue-200 text-sky-blue-800'
                            : 'bg-warm-beige-200 text-warm-beige-800'
                      }`}
                    >
                      {visit.status === 'completed'
                        ? '✓ Done'
                        : visit.status === 'in-progress'
                          ? '● Active'
                          : '⊙ Pending'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{visit.notes}</p>
                {visit.status === 'pending' && (
                  <button className="mt-3 w-full bg-forest-green-500 text-white font-semibold py-2 rounded-xl hover:bg-forest-green-600 transition-colors">
                    Start Visit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
