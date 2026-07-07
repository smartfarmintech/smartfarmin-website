import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MarketDashboard } from '@/components/farmer/market/market-dashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Market Prices | Farmer Dashboard | Rythu360',
  description: 'Real-time agricultural commodity prices in your region'
}

export default async function MarketPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login/farmer')

  const { data: farmer } = await supabase
    .from('farmers')
    .select('*, lands(*)')
    .eq('user_id', user.id)
    .single()

  if (!farmer) redirect('/login/farmer')

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Prices</h1>
        <p className="text-muted-foreground">Real-time agricultural commodity prices</p>
      </div>

      <MarketDashboard farmer={farmer} />
    </div>
  )
}
