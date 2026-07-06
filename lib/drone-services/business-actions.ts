// ======================== DRONE SERVICES OPERATIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== DRONE SERVICE BOOKING ===================

export async function createDroneServiceBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const booking = {
    user_id: user.id,
    drone_service_id: formData.get('drone_service_id'),
    scheduled_date: formData.get('scheduled_date'),
    scheduled_time: formData.get('scheduled_time'),
    area_acres: parseFloat(formData.get('area_acres') as string),
    farm_location: formData.get('farm_location'),
    crop_type: formData.get('crop_type'),
    service_type: formData.get('service_type'), // spraying, surveying, monitoring
    notes: formData.get('notes'),
    booking_status: 'pending',
    total_amount: parseFloat(formData.get('total_amount') as string),
    created_at: new Date().toISOString(),
  }

  const { data: newBooking, error } = await supabase
    .from('drone_services_bookings')
    .insert(booking)
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Drone Service Booked',
      message: 'Your drone service booking has been confirmed',
      notification_type: 'drone_booking_created',
      is_read: false,
    })

  return { ok: true, data: { bookingId: newBooking.id } }
}

export async function updateDroneServiceBooking(
  bookingId: string,
  updates: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_services_bookings')
    .update(updates)
    .eq('id', bookingId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function cancelDroneServiceBooking(
  bookingId: string,
  reason: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_services_bookings')
    .update({
      booking_status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== DRONE SERVICE ASSIGNMENT ===================

export async function assignDroneOperator(
  bookingId: string,
  operatorId: string,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('drone_services_bookings')
    .update({
      assigned_operator_id: operatorId,
      booking_status: 'operator_assigned',
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== WORK COMPLETION ===================

export async function completeDroneService(
  bookingId: string,
  completionData: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_services_bookings')
    .update({
      booking_status: 'completed',
      completed_at: new Date().toISOString(),
      area_covered: completionData.area_covered,
      flight_time_minutes: completionData.flight_time_minutes,
      images_captured: completionData.images_captured,
      report_url: completionData.report_url,
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Drone Service Completed',
      message: 'Your drone service has been completed',
      notification_type: 'drone_service_completed',
      is_read: false,
    })

  return { ok: true }
}

// =================== DRONE SERVICE REVIEWS ===================

export async function submitDroneServiceReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const review = {
    drone_service_id: formData.get('drone_service_id'),
    user_id: user.id,
    booking_id: formData.get('booking_id'),
    rating: parseInt(formData.get('rating') as string),
    title: formData.get('title'),
    body: formData.get('body'),
    review_status: 'published',
  }

  const { error } = await supabase
    .from('drone_service_reviews')
    .insert(review)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== DRONE SERVICE OPERATOR AVAILABILITY ===================

export async function setDroneOperatorAvailability(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('drone_operator_availability')
    .upsert(
      {
        operator_id: user.id,
        available_from: formData.get('available_from'),
        available_until: formData.get('available_until'),
        is_available: formData.get('is_available') === 'true',
        service_area: formData.get('service_area'),
      },
      { onConflict: 'operator_id' },
    )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
