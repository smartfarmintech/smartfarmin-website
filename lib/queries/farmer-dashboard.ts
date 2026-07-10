import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export interface FarmerDashboardData {
  farmer: any
  profile: any
  lands: any[]
  activeCropCycles: any[]
  upcomingBookings: any[]
  wallet: any
  latestCropHealth: any[]
  weather: any
}

/**
 * Fetch complete farmer dashboard data
 * Combines farmer profile, lands, crops, bookings, and wallet
 */
export async function getFarmerDashboardData(user: User): Promise<FarmerDashboardData> {
  if (!user?.id) throw new Error('User not authenticated')

  const supabase = await createClient()

  // Fetch farmer profile
  const { data: farmerData, error: farmerError } = await supabase
    .from('farmers')
    .select('*, user:user_profiles(full_name, phone, avatar_url, preferred_language), village:villages(name)')
    .eq('user_id', user.id)
    .single()

  if (farmerError) throw farmerError

  const farmerId = farmerData.id

  // Fetch lands
  const { data: lands = [] } = await supabase
    .from('lands')
    .select('id, land_name, area_value, area_unit, status, soil_type, village:villages(name)')
    .eq('farmer_id', farmerId)
    .eq('is_active', true)

  // Fetch active crop cycles
  const { data: cropCycles = [] } = await supabase
    .from('crop_cycles')
    .select('id, crop_name, variety, sowing_date, expected_harvest_date, status, area_value, area_unit')
    .eq('farmer_id', farmerId)
    .eq('status', 'active')

  // Fetch upcoming bookings
  const { data: bookings = [] } = await supabase
    .from('bookings')
    .select('*, machine:machines(name, image_url, brand, model), village:villages(name)')
    .eq('renter_id', farmerId)
    .eq('booking_state', 'confirmed')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(5)

  // Fetch wallet
  const { data: wallet = null } = await supabase
    .from('wallets')
    .select('id, balance, currency, wallet_status')
    .eq('user_id', user.id)
    .single()

  // Fetch latest crop health issues
  const { data: cropHealth = [] } = await supabase
    .from('crop_health')
    .select('id, issue_name, severity, is_resolved, crop_cycle_id, observed_at')
    .eq('farmer_id', farmerId)
    .eq('is_resolved', false)
    .order('observed_at', { ascending: false })
    .limit(3)

  return {
    farmer: farmerData,
    profile: farmerData.user,
    lands: lands || [],
    activeCropCycles: cropCycles || [],
    upcomingBookings: bookings || [],
    wallet: wallet || { balance: 0, currency: 'INR' },
    latestCropHealth: cropHealth || [],
    weather: null, // To be enhanced with weather API
  }
}

/**
 * Get today's weather for farmer's location
 */
export async function getFarmerWeather(farmerId: string) {
  const supabase = await createClient()
  
  const { data: farmer } = await supabase
    .from('farmers')
    .select('village_id')
    .eq('id', farmerId)
    .single()

  if (!farmer) return null

  const { data: village } = await supabase
    .from('villages')
    .select('latitude, longitude, name')
    .eq('id', farmer.village_id)
    .single()

  return village
}

/**
 * Get government scheme eligibility for farmer
 */
export async function getFarmerSchemeEligibility(farmerId: string) {
  const supabase = await createClient()
  
  const { data: farmer } = await supabase
    .from('farmers')
    .select('*,farmer_profiles(*)')
    .eq('id', farmerId)
    .single()

  if (!farmer) return []

  // Fetch schemes and check eligibility
  const { data: schemes = [] } = await supabase
    .from('schemes')
    .select('id, name, code, category_id, eligibility(*)')
    .eq('status', 'active')

  return schemes
}

/**
 * Get farmer's crop booking history
 */
export async function getFarmerBookingHistory(farmerId: string, limit = 10) {
  const supabase = await createClient()
  
  const { data: bookings = [] } = await supabase
    .from('bookings')
    .select('*, machine:machines(name, image_url), owner:user_profiles!owner_id(full_name)')
    .eq('renter_id', farmerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return bookings
}

/**
 * Get farmer's AI crop doctor history
 */
export async function getFarmerAiHistory(farmerId: string, limit = 5) {
  const supabase = await createClient()
  
  const { data: predictions = [] } = await supabase
    .from('disease_predictions')
    .select('id, predicted_disease, confidence, severity, treatment, created_at, image_url')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return predictions
}
