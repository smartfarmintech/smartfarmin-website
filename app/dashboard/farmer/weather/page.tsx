import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WeatherDashboard } from '@/components/farmer/weather/weather-dashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Weather | Farmer Dashboard | Rythu360',
  description: 'Real-time weather data and forecasts for your farm location'
}

export default async function WeatherPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login/farmer')

  const { data: farmer } = await supabase
    .from('farmers')
    .select('*, lands(*), weather_preferences(*)')
    .eq('user_id', user.id)
    .single()

  if (!farmer) redirect('/login/farmer')

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather Forecast</h1>
        <p className="text-muted-foreground">Real-time weather data for your farms</p>
      </div>

      <WeatherDashboard farmer={farmer} />
    </div>
  )
}
