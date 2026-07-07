import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const period = searchParams.get('period') || 'day'

    // Fetch daily metrics
    let query = supabase.from('daily_metrics').select('*')

    if (metric) {
      query = query.eq('metric_key', metric)
    }

    const { data: metrics, error: metricsError } = await query
      .order('metric_date', { ascending: false })
      .limit(30)

    if (metricsError) {
      return NextResponse.json({ error: metricsError.message }, { status: 500 })
    }

    // Fetch summary statistics
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })

    const { data: orders } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('order_status', 'completed')

    const { data: bookings } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('booking_state', 'completed')

    return NextResponse.json({
      metrics,
      summary: {
        totalUsers: users?.length || 0,
        completedOrders: orders?.length || 0,
        completedBookings: bookings?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
