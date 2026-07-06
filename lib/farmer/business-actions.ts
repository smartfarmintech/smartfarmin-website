// ======================== FARMER BUSINESS OPERATIONS ========================
// Complete CRUD operations for core farmer functionality

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== FARMER KYC & VERIFICATION ===================

export async function updateFarmerKYC(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const farmerData = {
    aadhar_number: formData.get('aadhar_number'),
    aadhar_verified: formData.get('aadhar_verified') === 'true',
    bank_account: formData.get('bank_account'),
    bank_verified: formData.get('bank_verified') === 'true',
    pan_number: formData.get('pan_number'),
    land_size_acres: parseFloat(formData.get('land_size_acres') as string),
    farm_location: formData.get('farm_location'),
    verified_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('farmers')
    .update(farmerData)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== BOOKING INTERACTIONS ===================

export async function updateBookingStatus(
  bookingId: string,
  newStatus: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Add status to timeline
  const { error: timelineError } = await supabase
    .from('booking_status_timeline')
    .insert({
      booking_id: bookingId,
      old_status: null,
      new_status: newStatus,
      changed_by: user.id,
      changed_at: new Date().toISOString(),
    })

  if (timelineError) return { ok: false, error: timelineError.message }

  // Update booking status
  const { error } = await supabase
    .from('bookings')
    .update({ booking_status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== REVIEW & RATING ===================

export async function submitMachineReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const review = {
    machine_id: formData.get('machine_id'),
    user_id: user.id,
    rating: parseInt(formData.get('rating') as string),
    title: formData.get('title'),
    body: formData.get('body'),
    review_status: 'pending_approval',
  }

  const { error } = await supabase
    .from('machine_reviews')
    .insert(review)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== FARMER PREFERENCES ===================

export async function updateFarmerPreferences(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const preferences = {
    preferred_machine_types: formData.get('preferred_machine_types'),
    notification_email: formData.get('notification_email') === 'true',
    notification_sms: formData.get('notification_sms') === 'true',
    notification_push: formData.get('notification_push') === 'true',
    auto_cancel_unconfirmed: parseInt(formData.get('auto_cancel_unconfirmed') as string) || 24,
  }

  const { error } = await supabase
    .from('farmer_preferences')
    .upsert(
      { user_id: user.id, ...preferences },
      { onConflict: 'user_id' },
    )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== REFERRAL & REWARDS ===================

export async function getOrCreateReferralCode(): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('farmer_referrals')
    .select('referral_code')
    .eq('user_id', user.id)
    .single()

  if (existing) return { ok: true, data: existing.referral_code }

  // Generate unique code
  const code = `RF${user.id.slice(0, 8).toUpperCase()}`

  const { error } = await supabase
    .from('farmer_referrals')
    .insert({
      user_id: user.id,
      referral_code: code,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: code }
}

// =================== MACHINE WISHLIST ===================

export async function addToWishlist(machineId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('farmer_wishlist')
    .insert({
      user_id: user.id,
      machine_id: machineId,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removeFromWishlist(machineId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('farmer_wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('machine_id', machineId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== SAVED FILTERS & SEARCHES ===================

export async function saveSearchFilter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const filter = {
    user_id: user.id,
    name: formData.get('name'),
    filters: formData.get('filters'), // JSON string
    is_favorite: formData.get('is_favorite') === 'true',
  }

  const { error } = await supabase
    .from('saved_searches')
    .insert(filter)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
