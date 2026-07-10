import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FarmerInfoSummary } from '@/components/dashboard/farmer-info-summary'
import { ActionCard, ActionCardGrid } from '@/components/dashboard/action-card'
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings'
import { FarmerDashboardClient } from '@/components/dashboard/farmer-dashboard-client'
import { getFarmerDashboardData } from '@/lib/queries/farmer-dashboard'
import { getCurrentUser } from '@/lib/supabase/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | Rythu360 Farmer',
  description: 'Your personal farming dashboard with AI Crop Doctor, machinery booking, and marketplace',
}

export const dynamic = 'force-dynamic'

export default async function FarmerDashboardPage() {
  // Get current user
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[Farmer Dashboard] Auth error:', error)
  }

  if (!user) {
    redirect('/auth/signin?role=farmer')
  }

  // Fetch dashboard data
  let dashboardData = null
  let error = null

  try {
    dashboardData = await getFarmerDashboardData(user)
  } catch (err: any) {
    error = err.message
    console.error('[Farmer Dashboard Error]', error)
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dashboard Error</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to load your dashboard. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const {
    farmer,
    profile,
    lands,
    activeCropCycles,
    upcomingBookings,
    wallet,
    latestCropHealth,
  } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Farmer Info Summary */}
        <FarmerInfoSummary
          farmerName={profile?.full_name || 'Farmer'}
          village={farmer.village?.name || 'Your Village'}
          activeLands={lands.length}
          activeCrops={activeCropCycles.length}
          walletBalance={wallet?.balance || 0}
          currency={wallet?.currency || 'INR'}
        />

        {/* Primary Action Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <ActionCardGrid>
            <ActionCard
              title="Book Tractor"
              description="Rent machinery for your fields with verified operators"
              icon="🚜"
              href="/machinery/booking?type=tractor"
              color="green"
              badge="POPULAR"
            />
            <ActionCard
              title="AI Crop Doctor"
              description="Get instant disease detection and treatment advice"
              icon="🤖"
              href="/ai-assistant/disease-detection"
              color="blue"
            />
            <ActionCard
              title="Marketplace"
              description="Browse seeds, fertilizers, and organic products"
              icon="🛍️"
              href="/marketplace"
              color="orange"
            />
            <ActionCard
              title="Drone Spray"
              description="Book drone services for crop spraying"
              icon="🚁"
              href="/drone-services/booking"
              color="purple"
            />
            <ActionCard
              title="Government Schemes"
              description="Check eligibility for subsidies and schemes"
              icon="📋"
              href="/farmer/schemes"
              color="teal"
            />
            <ActionCard
              title="Weather & Alerts"
              description="Real-time weather and farming alerts"
              icon="☁️"
              href="/ai/weather"
              color="blue"
            />
          </ActionCardGrid>
        </section>

        {/* Upcoming Bookings */}
        {upcomingBookings && upcomingBookings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your Upcoming Bookings</h2>
              <a
                href="/farmer/bookings"
                className="text-emerald-600 font-semibold hover:underline text-sm"
              >
                View all →
              </a>
            </div>
            <UpcomingBookings bookings={upcomingBookings} />
          </section>
        )}

        {/* Crop Health Alerts */}
        {latestCropHealth && latestCropHealth.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Crop Health Alerts</h2>
            <div className="space-y-3">
              {latestCropHealth.map((issue, index) => (
                <div
                  key={issue.id}
                  className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{issue.issue_name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Severity: <span className="font-medium capitalize">{issue.severity}</span>
                    </p>
                  </div>
                  <a
                    href="/ai-assistant/disease-detection"
                    className="text-emerald-600 font-semibold text-sm hover:underline flex-shrink-0"
                  >
                    Get Help →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Secondary Action Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">More Services</h2>
          <ActionCardGrid>
            <ActionCard
              title="My Lands"
              description="View and manage your farm fields"
              icon="🗺️"
              href="/farmer/lands"
              color="green"
            />
            <ActionCard
              title="Crop Cycles"
              description="Track your growing crops and harvest dates"
              icon="📊"
              href="/farmer/crop-cycles"
              color="teal"
            />
            <ActionCard
              title="Soil Testing"
              description="Get soil health reports and recommendations"
              icon="🧪"
              href="/farmer/soil-tests"
              color="blue"
            />
            <ActionCard
              title="Learning Center"
              description="Watch tutorials and farming tips"
              icon="📚"
              href="/farmer/learning"
              color="orange"
            />
            <ActionCard
              title="My Wallet"
              description="Manage payments and transactions"
              icon="💳"
              href="/farmer/wallet"
              color="purple"
            />
            <ActionCard
              title="Support"
              description="Chat with our support team"
              icon="☎️"
              href="/support"
              color="green"
            />
          </ActionCardGrid>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
