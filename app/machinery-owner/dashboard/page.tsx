import { redirect } from 'next/navigation'
import { Tractor, Calendar, DollarSign, AlertCircle, TrendingUp, Wrench, CheckCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCurrentUser } from '@/lib/supabase/auth'
import { MetricSummary } from '@/components/dashboard/metric-summary'
import { ActionCard, ActionCardGrid } from '@/components/dashboard/action-card'

export const metadata = {
  title: 'Machinery Owner Dashboard | Rythu360',
  description: 'Manage your machines, bookings, and revenue',
}

export const dynamic = 'force-dynamic'

export default async function MachineryOwnerDashboardPage() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[Machinery Owner Dashboard] Auth error:', error)
  }

  if (!user) {
    redirect('/auth/signin?role=machinery-owner')
  }

  // Mock data
  const stats = {
    totalMachines: 3,
    availableMachines: 1,
    bookedMachines: 2,
    todayRevenue: 2500,
    monthlyRevenue: 45000,
    maintenanceNeeded: 1,
  }

  const machines = [
    {
      id: '1',
      name: 'John Deere Tractor',
      type: 'tractor',
      status: 'booked',
      dailyRate: 1200,
      currentBooking: {
        farmer: 'Rajesh Kumar',
        location: 'Warangal',
        checkoutDate: '2024-07-10',
      },
    },
    {
      id: '2',
      name: 'CLAAS Harvester',
      type: 'harvester',
      status: 'maintenance',
      dailyRate: 3500,
      maintenanceNote: 'Engine service scheduled',
    },
    {
      id: '3',
      name: 'Kubota Rotavator',
      type: 'rotavator',
      status: 'available',
      dailyRate: 800,
      description: 'Ready for booking',
    },
  ]

  const upcomingBookings = [
    {
      id: '1',
      farmer: 'Priya Devi',
      machine: 'John Deere Tractor',
      startDate: '2024-07-09',
      endDate: '2024-07-10',
      expectedRevenue: 2400,
      status: 'confirmed',
    },
    {
      id: '2',
      farmer: 'Arjun Singh',
      machine: 'Kubota Rotavator',
      startDate: '2024-07-11',
      endDate: '2024-07-13',
      expectedRevenue: 2400,
      status: 'pending',
    },
  ]

  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 pb-24 md:pb-8 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-green-900 mb-2">
            🚜 My Machines
          </h1>
          <p className="text-gray-600">Manage bookings, track revenue, and maintain your fleet</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <MetricSummary
            label="Total Machines"
            value={stats.totalMachines}
            icon={<Tractor className="w-5 h-5" />}
          />
          <MetricSummary
            label="Available"
            value={stats.availableMachines}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricSummary
            label="Today Revenue"
            value={`₹${(stats.todayRevenue / 1000).toFixed(1)}K`}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricSummary
            label="Monthly"
            value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <ActionCardGrid>
          <ActionCard
            title="Add Machine"
            icon="➕"
            description="Register new equipment"
            href="/machinery-owner/add-machine"
            color="blue"
          />
          <ActionCard
            title="View Bookings"
            icon="📅"
            description="All machine bookings"
            href="/machinery-owner/bookings"
            color="green"
          />
          <ActionCard
            title="Revenue"
            icon="💰"
            description="Earnings dashboard"
            href="/machinery-owner/revenue"
            color="teal"
          />
          <ActionCard
            title="Maintenance"
            icon="🔧"
            description="Service schedule"
            href="/machinery-owner/maintenance"
            color="orange"
          />
        </ActionCardGrid>

        {/* Machines Fleet */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            🛠️ My Fleet ({stats.totalMachines})
          </h2>

          <div className="space-y-3">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className={`rounded-2xl p-4 border-2 ${
                  machine.status === 'available'
                    ? 'bg-leaf-green-50 border-leaf-green-200'
                    : machine.status === 'booked'
                      ? 'bg-sky-blue-50 border-sky-blue-200'
                      : 'bg-orange-50 border-harvest-orange-200'
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-forest-green-900">{machine.name}</h3>
                    <p className="text-sm text-gray-600">₹{machine.dailyRate}/day</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      machine.status === 'available'
                        ? 'bg-leaf-green-200 text-leaf-green-800'
                        : machine.status === 'booked'
                          ? 'bg-sky-blue-200 text-sky-blue-800'
                          : 'bg-harvest-orange-200 text-harvest-orange-800'
                    }`}
                  >
                    {machine.status === 'available'
                      ? '✓ Available'
                      : machine.status === 'booked'
                        ? '📅 Booked'
                        : '🔧 Maintenance'}
                  </span>
                </div>

                {machine.status === 'booked' && machine.currentBooking && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">
                      {machine.currentBooking.farmer} · {machine.currentBooking.location}
                    </p>
                    <p className="text-xs text-gray-600">Checkout: {machine.currentBooking.checkoutDate}</p>
                  </div>
                )}

                {machine.status === 'maintenance' && machine.maintenanceNote && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-orange-700 font-semibold">
                      ⚠️ {machine.maintenanceNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-forest-green-900 mb-4">
            📅 Upcoming Bookings
          </h2>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-4 border-2 border-forest-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-forest-green-900">{booking.farmer}</h3>
                    <p className="text-sm text-gray-600">{booking.machine}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-leaf-green-200 text-leaf-green-800'
                        : 'bg-warm-beige-200 text-warm-beige-800'
                    }`}
                  >
                    {booking.status === 'confirmed' ? '✓ Confirmed' : '⊙ Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Start</p>
                    <p className="font-semibold text-gray-800">{booking.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">End</p>
                    <p className="font-semibold text-gray-800">{booking.endDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold text-leaf-green-600">₹{booking.expectedRevenue}</p>
                  </div>
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
