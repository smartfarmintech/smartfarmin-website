import { redirect } from 'next/navigation'
import { AlertCircle, Phone, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCurrentUser } from '@/lib/supabase/auth'
import { MetricSummary } from '@/components/dashboard/metric-summary'
import { ActionCard, ActionCardGrid } from '@/components/dashboard/action-card'

export const metadata = {
  title: 'Telecaller Dashboard | Rythu360',
  description: 'Manage leads, make calls, and track conversions',
}

export default async function TelecallerDashboardPage() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[Telecaller Dashboard] Auth error:', error)
  }

  if (!user) {
    redirect('/auth/signin?role=telecaller')
  }

  // Mock data - replace with real queries
  const todayStats = {
    totalCalls: 24,
    completedCalls: 18,
    pendingCalls: 6,
    conversionRate: 42,
    targetCalls: 30,
  }

  const leads = [
    {
      id: '1',
      farmerName: 'Rajesh Kumar',
      village: 'Warangal',
      phone: '+91 98765 43210',
      status: 'pending',
      interest: 'Machinery',
      lastContact: '2 hours ago',
    },
    {
      id: '2',
      farmerName: 'Priya Devi',
      village: 'Hyderabad',
      phone: '+91 97654 32109',
      status: 'contacted',
      interest: 'Seeds',
      lastContact: '1 hour ago',
    },
    {
      id: '3',
      farmerName: 'Arjun Singh',
      village: 'Medak',
      phone: '+91 96543 21098',
      status: 'converted',
      interest: 'Government Scheme',
      lastContact: '30 min ago',
    },
  ]

  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 pb-24 md:pb-8 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green-900 mb-2">
            📞 Today's Calls
          </h1>
          <p className="text-gray-600">Manage leads and track your conversation progress</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <MetricSummary
            label="Total Calls"
            value={todayStats.totalCalls}
            icon={<Phone className="w-5 h-5" />}
          />
          <MetricSummary
            label="Completed"
            value={todayStats.completedCalls}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricSummary
            label="Pending"
            value={todayStats.pendingCalls}
            icon={<Clock className="w-5 h-5" />}
          />
          <MetricSummary
            label="Conversions"
            value={`${todayStats.conversionRate}%`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricSummary
            label="Target"
            value={`${todayStats.totalCalls}/${todayStats.targetCalls}`}
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <ActionCardGrid>
          <ActionCard
            title="Make Quick Call"
            icon="☎️"
            description="Dial pending leads"
            href="/telecaller/make-call"
            color="blue"
          />
          <ActionCard
            title="View Leads"
            icon="📋"
            description="All pending leads"
            href="/telecaller/leads"
            color="green"
          />
          <ActionCard
            title="Call History"
            icon="📞"
            description="Recent conversations"
            href="/telecaller/history"
            color="teal"
          />
          <ActionCard
            title="Performance"
            icon="📊"
            description="View your stats"
            href="/telecaller/performance"
            color="orange"
          />
        </ActionCardGrid>

        {/* Pending Leads */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            📌 Pending Leads ({todayStats.pendingCalls})
          </h2>

          <div className="space-y-3">
            {leads
              .filter((l) => l.status === 'pending')
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-2xl p-4 border-2 border-leaf-green-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-forest-green-900">{lead.farmerName}</h3>
                      <p className="text-sm text-gray-600">{lead.village} · {lead.interest}</p>
                    </div>
                    <button className="bg-leaf-green-500 text-white rounded-full p-3 hover:bg-leaf-green-600 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                  <p className="text-xs text-gray-400 mt-2">Last contact: {lead.lastContact}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Call Log */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            ✅ Today's Calls ({todayStats.completedCalls})
          </h2>

          <div className="space-y-3">
            {leads
              .filter((l) => l.status !== 'pending')
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-2xl p-4 border-2 border-fresh-mint-200 hover:shadow-md transition-shadow opacity-75"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-forest-green-900">{lead.farmerName}</h3>
                      <p className="text-sm text-gray-600">
                        {lead.village} · {lead.interest} · Status: {lead.status}
                      </p>
                    </div>
                    <span className="text-xs bg-leaf-green-100 text-leaf-green-700 px-3 py-1 rounded-full font-semibold">
                      {lead.lastContact}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
