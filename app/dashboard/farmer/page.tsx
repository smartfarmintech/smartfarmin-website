import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardGrid } from '@/components/farmer/dashboard-grid'
import { WelcomeCard } from '@/components/farmer/cards/welcome-card'
import { ProfileCompletionCard } from '@/components/farmer/cards/profile-completion-card'
import { WeatherCard } from '@/components/farmer/cards/weather-card'
import { MarketPricesCard } from '@/components/farmer/cards/market-prices-card'
import { MyFieldsCard } from '@/components/farmer/cards/my-fields-card'
import { 
  GovernmentSchemesCard,
  MachineryBookingCard,
  DroneBookingCard,
  MarketplaceCard,
  OrganicStoreCard,
  WalletCard
} from '@/components/farmer/cards/quick-action-cards'
import { RecentOrdersCard, RecentBookingsCard } from '@/components/farmer/cards/recent-cards'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | Farmer | Rythu360',
  description: 'Your farm dashboard with crops, bookings, and market information'
}

export default async function FarmerDashboard() {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/roles')
  }

  // Get farmer profile
  const { data: farmer } = await supabase
    .from('farmers')
    .select('*, farmer_profiles(*), user_profiles(*)')
    .eq('user_id', user.id)
    .single()

  if (!farmer) {
    redirect('/login/farmer')
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farm Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {farmer.farmer_profiles?.first_name || 'Farmer'}</p>
      </div>

      {/* Dashboard Grid */}
      <DashboardGrid>
        {/* Row 1 - Welcome & Profile */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <WelcomeCard farmer={farmer} />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <ProfileCompletionCard farmer={farmer} />
        </Suspense>

        {/* Row 2 - Weather & Market */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <WeatherCard farmer={farmer} />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <MarketPricesCard />
        </Suspense>

        {/* Row 3 - Core Features */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <MyFieldsCard farmer={farmer} />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <GovernmentSchemesCard farmer={farmer} />
        </Suspense>

        {/* Row 4 - Bookings */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <MachineryBookingCard farmer={farmer} />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <DroneBookingCard farmer={farmer} />
        </Suspense>

        {/* Row 5 - Marketplace */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <MarketplaceCard />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <OrganicStoreCard />
        </Suspense>

        {/* Row 6 - Wallet & Recent Activity */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <WalletCard farmer={farmer} />
        </Suspense>

        {/* Row 7 - Recent Activity */}
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <RecentOrdersCard farmer={farmer} />
        </Suspense>
        <Suspense fallback={<div className="bg-card rounded-lg h-32 animate-pulse" />}>
          <RecentBookingsCard farmer={farmer} />
        </Suspense>
      </DashboardGrid>
    </div>
  )
}
