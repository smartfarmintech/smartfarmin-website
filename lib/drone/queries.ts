'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAvailableDrones(district?: string, droneType?: string) {
  const supabase = await createClient()

  let query = supabase.from('drones').select('*, operators(*)').eq('status', 'active')

  if (district) query = query.eq('district', district)
  if (droneType) query = query.eq('drone_category', droneType)

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getDroneDetail(droneId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drones')
    .select('*, operators(*), drone_flights(*)')
    .eq('id', droneId)
    .single()

  if (error) throw error
  return data
}

export async function getDroneOperator(operatorId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drone_operators')
    .select('*, drones(*), ratings(*)')
    .eq('id', operatorId)
    .single()

  if (error) throw error
  return data
}

export async function getOperatorAvailability(operatorId: string, startDate: string, endDate: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drone_availability')
    .select('*')
    .eq('operator_id', operatorId)
    .gte('available_date', startDate)
    .lte('available_date', endDate)

  if (error) throw error
  return data || []
}

export async function getBookingHistory(farmerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drone_bookings')
    .select('*, drones(*), operators(*)')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getFlightHistory(droneId: string, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drone_flights')
    .select('*')
    .eq('drone_id', droneId)
    .order('flight_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getDroneAnalytics(droneId: string, period: 'week' | 'month' | 'year' = 'month') {
  const supabase = await createClient()

  const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const startDate = new Date(Date.now() - periodDays * 86400000).toISOString()

  const { data: flights, error: flightError } = await supabase
    .from('drone_flights')
    .select('*')
    .eq('drone_id', droneId)
    .gte('flight_date', startDate)

  if (flightError) throw flightError

  const totalFlights = flights?.length || 0
  const totalAreaCovered = flights?.reduce((sum: number, f: any) => sum + (f.area_acres || 0), 0) || 0
  const avgFlightTime = flights?.length
    ? flights.reduce((sum: number, f: any) => sum + (f.flight_duration_minutes || 0), 0) / flights.length
    : 0

  return {
    total_flights: totalFlights,
    total_area_acres: Math.round(totalAreaCovered * 10) / 10,
    avg_flight_time: Math.round(avgFlightTime),
    operational_days: [...new Set(flights?.map((f: any) => f.flight_date))].length,
  }
}

export async function getOperatorRatings(operatorId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('drone_ratings')
    .select('*')
    .eq('operator_id', operatorId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const ratings = data || []
  const avgRating = ratings.length > 0 ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length : 0

  return {
    ratings: ratings,
    average_rating: Math.round(avgRating * 10) / 10,
    total_reviews: ratings.length,
  }
}
