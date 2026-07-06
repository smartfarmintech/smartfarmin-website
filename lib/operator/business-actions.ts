// ======================== OPERATOR BUSINESS OPERATIONS ========================
// Complete CRUD operations for machinery operator functionality

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== OPERATOR KYC & DOCUMENTS ===================

export async function updateOperatorKYC(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const operatorData = {
    license_number: formData.get('license_number'),
    license_expiry: formData.get('license_expiry'),
    license_verified: formData.get('license_verified') === 'true',
    aadhar_number: formData.get('aadhar_number'),
    aadhar_verified: formData.get('aadhar_verified') === 'true',
    bank_account: formData.get('bank_account'),
    bank_verified: formData.get('bank_verified') === 'true',
    years_experience: parseInt(formData.get('years_experience') as string),
    verified_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('operators')
    .update(operatorData)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== BOOKING ACCEPTANCE & MANAGEMENT ===================

export async function acceptBooking(bookingId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Update booking status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      booking_status: 'confirmed',
      assigned_operator_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (updateError) return { ok: false, error: updateError.message }

  // Add to timeline
  const { error: timelineError } = await supabase
    .from('booking_status_timeline')
    .insert({
      booking_id: bookingId,
      old_status: 'pending',
      new_status: 'confirmed',
      changed_by: user.id,
      changed_at: new Date().toISOString(),
    })

  if (timelineError) return { ok: false, error: timelineError.message }

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Booking Accepted',
      message: 'You have accepted booking ${bookingId}',
      notification_type: 'booking_accepted',
      is_read: false,
    })

  return { ok: true }
}

export async function rejectBooking(bookingId: string, reason: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookings')
    .update({
      booking_status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }

  // Add to timeline
  await supabase
    .from('booking_status_timeline')
    .insert({
      booking_id: bookingId,
      old_status: 'pending',
      new_status: 'rejected',
      changed_by: user.id,
      changed_at: new Date().toISOString(),
    })

  return { ok: true }
}

// =================== WORK PROGRESS TRACKING ===================

export async function startWork(bookingId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookings')
    .update({
      booking_status: 'in_progress',
      work_started_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function completeWork(
  bookingId: string,
  completionData: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookings')
    .update({
      booking_status: 'completed',
      work_completed_at: new Date().toISOString(),
      work_summary: completionData.summary,
      hours_worked: completionData.hours_worked,
      area_covered: completionData.area_covered,
    })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== RATINGS & REVIEWS ===================

export async function submitOperatorReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const review = {
    operator_id: formData.get('operator_id'),
    user_id: user.id,
    booking_id: formData.get('booking_id'),
    rating: parseInt(formData.get('rating') as string),
    title: formData.get('title'),
    body: formData.get('body'),
    review_status: 'published',
  }

  const { error } = await supabase
    .from('operator_reviews')
    .insert(review)

  if (error) return { ok: false, error: error.message }

  // Update operator average rating
  const { data: reviews } = await supabase
    .from('operator_reviews')
    .select('rating')
    .eq('operator_id', formData.get('operator_id'))
    .eq('review_status', 'published')

  if (reviews) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await supabase
      .from('operators')
      .update({
        rating_avg: avgRating,
        rating_count: reviews.length,
      })
      .eq('id', formData.get('operator_id'))
  }

  return { ok: true }
}

// =================== EARNINGS & PAYOUTS ===================

export async function requestPayout(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('operator_payouts')
    .insert({
      operator_id: user.id,
      amount: parseFloat(formData.get('amount') as string),
      requested_at: new Date().toISOString(),
      status: 'pending_approval',
      bank_account: formData.get('bank_account'),
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function getOperatorEarnings(): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('total_amount, booking_status')
    .eq('assigned_operator_id', user.id)
    .eq('booking_status', 'completed')

  const total = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

  return { ok: true, data: { total_earnings: total } }
}

// =================== AVAILABILITY & SCHEDULE ===================

export async function setAvailability(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('operator_availability')
    .upsert(
      {
        operator_id: user.id,
        available_from: formData.get('available_from'),
        available_until: formData.get('available_until'),
        is_available: formData.get('is_available') === 'true',
      },
      { onConflict: 'operator_id' },
    )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
