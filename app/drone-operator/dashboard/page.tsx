import { redirect } from 'next/navigation'
import { Zap, MapPin, CheckCircle, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCurrentUser } from '@/lib/supabase/auth'
import { MetricSummary } from '@/components/dashboard/metric-summary'
import { ActionCard, ActionCardGrid } from '@/components/dashboard/action-card'

export const metadata = {
  title: 'Drone Operator Dashboard | AgreeConnect',
  description: 'Manage drone missions, flights, and earnings',
}

export const dynamic = 'force-dynamic'

export default async function DroneOperatorDashboardPage() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[Drone Operator Dashboard] Auth error:', error)
  }

  if (!user) {
    redirect('/auth/signin?role=drone-operator')
  }

  // Mock data
  const stats = {
    totalMissions: 156,
    completedThisMonth: 24,
    pendingMissions: 2,
    totalFlightHours: 584,
    monthlyEarnings: 78000,
    droneHealth: 95,
  }

  const missions = [
    {
      id: '1',
      farmer: 'Rajesh Kumar',
      village: 'Warangal',
      service: 'Crop Monitoring',
      area: '5 acres',
      status: 'completed',
      date: '2024-07-08',
      earnings: 2500,
    },
    {
      id: '2',
      farmer: 'Priya Devi',
      village: 'Hyderabad',
      service: 'Pesticide Spray',
      area: '8 acres',
      status: 'in-progress',
      date: '2024-07-09',
      earnings: 4000,
    },
    {
      id: '3',
      farmer: 'Arjun Singh',
      village: 'Medak',
      service: 'Fertilizer Spray',
      area: '6 acres',
      status: 'scheduled',
      date: '2024-07-10',
      earnings: 3500,
    },
  ]

  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 pb-24 md:pb-8 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green-900 mb-2">
            🚁 Drone Missions
          </h1>
          <p className="text-gray-600">Track your flights, mission status, and earnings</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <MetricSummary
            label="Total Missions"
            value={stats.totalMissions}
            icon={<Zap className="w-5 h-5" />}
          />
          <MetricSummary
            label="This Month"
            value={stats.completedThisMonth}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricSummary
            label="Pending"
            value={stats.pendingMissions}
            icon={<Clock className="w-5 h-5" />}
          />
          <MetricSummary
            label="Earnings"
            value={`₹${(stats.monthlyEarnings / 1000).toFixed(0)}K`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <ActionCardGrid>
          <ActionCard
            title="Start Mission"
            icon="🚁"
            description="Create new flight"
            href="/drone-operator/start-mission"
            color="blue"
          />
          <ActionCard
            title="Flight History"
            icon="📊"
            description="Past missions"
            href="/drone-operator/history"
            color="green"
          />
          <ActionCard
            title="Drone Health"
            icon="🔧"
            description="Maintenance check"
            href="/drone-operator/health"
            color="orange"
          />
          <ActionCard
            title="Earnings"
            icon="💰"
            description="Revenue dashboard"
            href="/drone-operator/earnings"
            color="purple"
          />
        </ActionCardGrid>

        {/* Flight Missions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            ✈️ Today's Missions
          </h2>

          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`rounded-2xl p-4 border-2 ${
                  mission.status === 'completed'
                    ? 'bg-leaf-green-50 border-leaf-green-200 opacity-75'
                    : mission.status === 'in-progress'
                      ? 'bg-sky-blue-50 border-sky-blue-300'
                      : 'bg-white border-warm-beige-200'
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-forest-green-900">{mission.farmer}</h3>
                    <p className="text-sm text-gray-600">{mission.village} · {mission.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-leaf-green-600">₹{mission.earnings}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold block mt-1 ${
                        mission.status === 'completed'
                          ? 'bg-leaf-green-200 text-leaf-green-800'
                          : mission.status === 'in-progress'
                            ? 'bg-sky-blue-200 text-sky-blue-800'
                            : 'bg-warm-beige-200 text-warm-beige-800'
                      }`}
                    >
                      {mission.status === 'completed'
                        ? '✓ Done'
                        : mission.status === 'in-progress'
                          ? '● Active'
                          : '⊙ Scheduled'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">{mission.service}</p>
                  <p className="text-xs text-gray-500">{mission.date}</p>
                </div>

                {mission.status === 'scheduled' && (
                  <button className="mt-3 w-full bg-forest-green-500 text-white font-semibold py-2 rounded-xl hover:bg-forest-green-600 transition-colors">
                    Confirm Mission
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drone Health */}
        <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-forest-green-200">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            🔋 Drone Health
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-gray-700">Overall Health</p>
                <p className="font-bold text-forest-green-600">{stats.droneHealth}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-leaf-green-500 h-3 rounded-full"
                  style={{ width: `${stats.droneHealth}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Battery</p>
                <p className="font-bold text-gray-800">98%</p>
              </div>
              <div>
                <p className="text-gray-600">Motor</p>
                <p className="font-bold text-gray-800">94%</p>
              </div>
              <div>
                <p className="text-gray-600">Camera</p>
                <p className="font-bold text-gray-800">96%</p>
              </div>
              <div>
                <p className="text-gray-600">GPS</p>
                <p className="font-bold text-gray-800">92%</p>
              </div>
            </div>

            <button className="w-full mt-4 bg-forest-green-500 text-white font-semibold py-2 rounded-xl hover:bg-forest-green-600 transition-colors">
              Schedule Maintenance
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
