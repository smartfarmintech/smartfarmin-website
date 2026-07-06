'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionState = { ok: boolean; error?: string; data?: any }

/**
 * Create a drone booking
 */
export async function createDroneBooking(bookingData: {
  farm_id: string
  crop_name: string
  area_acres: number
  service_type: string
  special_instructions?: string
  booked_date: string
  booked_time: string
}): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error, data } = await supabase
    .from('drone_bookings')
    .insert({
      farmer_id: user.id,
      farm_id: bookingData.farm_id,
      crop_name: bookingData.crop_name,
      area_acres: bookingData.area_acres,
      service_type: bookingData.service_type,
      special_instructions: bookingData.special_instructions,
      scheduled_date: bookingData.booked_date,
      scheduled_time: bookingData.booked_time,
      booking_status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/drone-services')
  return { ok: true, data: data }
}

/**
 * Accept/confirm a booking (operator action)
 */
export async function acceptDroneBooking(bookingId: string): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_bookings')
    .update({
      booking_status: 'confirmed',
      operator_id: user.id,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/drone-services/booking/${bookingId}`)
  return { ok: true }
}

/**
 * Reject a booking
 */
export async function rejectDroneBooking(bookingId: string, reason: string): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('drone_bookings')
    .update({
      booking_status: 'rejected',
      rejection_reason: reason,
      rejected_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/drone-services/booking/${bookingId}`)
  return { ok: true }
}

/**
 * Record a completed flight
 */
export async function recordFlightCompletion(flightData: {
  booking_id: string
  drone_id: string
  area_covered_acres: number
  flight_duration_minutes: number
  battery_used_percent: number
  coverage_quality: string
  post_flight_report: any
  crop_analysis: any
}): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  // Record flight
  const { error: flightError, data: flightData } = await supabase
    .from('drone_flights')
    .insert({
      booking_id: flightData.booking_id,
      drone_id: flightData.drone_id,
      operator_id: user.id,
      area_acres: flightData.area_covered_acres,
      flight_duration_minutes: flightData.flight_duration_minutes,
      battery_used_percent: flightData.battery_used_percent,
      coverage_quality: flightData.coverage_quality,
      post_flight_report: flightData.post_flight_report,
      crop_analysis: flightData.crop_analysis,
      flight_date: new Date().toISOString(),
      status: 'completed',
    })
    .select()
    .single()

  if (flightError) return { ok: false, error: flightError.message }

  // Update booking status
  const { error: bookingError } = await supabase
    .from('drone_bookings')
    .update({
      booking_status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', flightData.booking_id)

  if (bookingError) return { ok: false, error: bookingError.message }

  revalidatePath('/drone-services')
  return { ok: true, data: flightData }
}

/**
 * Cancel a booking
 */
export async function cancelDroneBooking(bookingId: string, reason: string): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('drone_bookings')
    .update({
      booking_status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/drone-services')
  return { ok: true }
}

/**
 * Save AI analysis results
 */
export async function saveAnalysisResults(analysisData: {
  booking_id: string
  analysis_type: string
  crop_stress: any
  spray_schedule: any
  pesticide_quantity: any
  flight_plan: any
  ndvi_analysis: any
  coverage_estimate: any
}): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase.from('drone_analyses').insert({
    booking_id: analysisData.booking_id,
    user_id: user.id,
    analysis_type: analysisData.analysis_type,
    crop_stress_data: analysisData.crop_stress,
    spray_schedule_data: analysisData.spray_schedule,
    pesticide_data: analysisData.pesticide_quantity,
    flight_plan_data: analysisData.flight_plan,
    ndvi_data: analysisData.ndvi_analysis,
    coverage_data: analysisData.coverage_estimate,
    created_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

/**
 * Update operator profile (registration, KYC)
 */
export async function updateOperatorProfile(operatorData: {
  full_name: string
  phone: string
  dgca_license_number: string
  insurance_provider: string
  insurance_policy_number: string
  experience_years: number
  service_area_radius_km: number
}): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_operators')
    .update({
      full_name: operatorData.full_name,
      phone: operatorData.phone,
      dgca_license_number: operatorData.dgca_license_number,
      insurance_provider: operatorData.insurance_provider,
      insurance_policy_number: operatorData.insurance_policy_number,
      experience_years: operatorData.experience_years,
      service_area_radius_km: operatorData.service_area_radius_km,
      is_verified: true,
      verified_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/drone-operator/profile')
  return { ok: true }
}

/**
 * Register a new drone in fleet
 */
export async function registerDrone(droneData: {
  drone_model: string
  manufacturer: string
  registration_number: string
  payload_capacity_kg: number
  battery_capacity_minutes: number
  camera_type: string
  tank_capacity_liters: number
  gps_accuracy_meters: number
}): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error, data } = await supabase
    .from('drones')
    .insert({
      operator_id: user.id,
      drone_model: droneData.drone_model,
      manufacturer: droneData.manufacturer,
      registration_number: droneData.registration_number,
      payload_capacity_kg: droneData.payload_capacity_kg,
      battery_capacity_minutes: droneData.battery_capacity_minutes,
      camera_type: droneData.camera_type,
      tank_capacity_liters: droneData.tank_capacity_liters,
      gps_accuracy_meters: droneData.gps_accuracy_meters,
      status: 'active',
    })
    .select()
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/drone-operator/fleet')
  return { ok: true, data: data }
}

/**
 * Submit a rating for drone service
 */
export async function rateDroneService(
  operatorId: string,
  droneId: string,
  bookingId: string,
  rating: number,
  review: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase.from('drone_ratings').insert({
    farmer_id: user.id,
    operator_id: operatorId,
    drone_id: droneId,
    booking_id: bookingId,
    rating: rating,
    review_text: review,
    created_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/drone-services/booking/${bookingId}`)
  return { ok: true }
}
