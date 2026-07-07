"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Fetch bookings for a farmer (renter)
 */
export const getFarmerBookings = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("v_booking_summary")
    .select("*")
    .eq("renter_id", user.id)
    .order("starts_at", { ascending: false })

  if (error) throw error
  return data || []
})

/**
 * Fetch bookings for a machinery owner
 */
export const getOwnerBookings = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("v_booking_summary")
    .select("*")
    .eq("owner_id", user.id)
    .order("starts_at", { ascending: false })

  if (error) throw error
  return data || []
})

/**
 * Fetch operator bookings
 */
export const getOperatorBookings = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("v_booking_summary")
    .select("*")
    .eq("operator_id", user.id)
    .order("starts_at", { ascending: false })

  if (error) throw error
  return data || []
})

/**
 * Fetch single booking with full details
 */
export const getBookingById = cache(async (bookingId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*,
      machine:machine_id (id, name, brand, model, category_id, image_url),
      owner:owner_id (full_name, phone, avatar_url),
      renter:renter_id (full_name, phone, avatar_url),
      operator:operator_id (full_name, phone, photo_url, rating_avg),
      pricing_rule:pricing_rule_id (id, name, price, operator_fee),
      status_history:booking_status (id, from_state, to_state, changed_by, note, created_at)
    `
    )
    .eq("id", bookingId)
    .single()

  if (error) throw error
  return data
})

/**
 * Fetch booking history (all status transitions)
 */
export const getBookingHistory = cache(async (bookingId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("booking_status")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
})

/**
 * Fetch GPS tracking history for a booking
 */
export const getBookingTrackingHistory = cache(async (bookingId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("gps_locations")
    .select("*")
    .eq("booking_id", bookingId)
    .order("recorded_at", { ascending: true })

  if (error) throw error
  return data || []
})

/**
 * Fetch booking invoice
 */
export const getBookingInvoice = cache(async (bookingId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("invoice")
    .select("*")
    .eq("reference_id", bookingId)
    .eq("reference_type", "booking")
    .single()

  if (error && error.code !== "PGRST116") throw error // 116 = no rows found
  return data
})

/**
 * Fetch booking payments
 */
export const getBookingPayments = cache(async (bookingId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("booking_payments")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
})

/**
 * Get bookings for a machine (availability)
 */
export const getMachineBookings = cache(async (machineId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("machine_id", machineId)
    .in("booking_state", ["confirmed", "in_progress", "completed"])
    .order("starts_at", { ascending: true })

  if (error) throw error
  return data || []
})

/**
 * Get available slots for a machine
 */
export const getMachineAvailability = cache(async (machineId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("machine_id", machineId)
    .eq("slot_status", "available")
    .gte("ends_at", new Date().toISOString())
    .order("starts_at", { ascending: true })

  if (error) throw error
  return data || []
})

/**
 * Search bookings by booking number
 */
export const searchBookingsByNumber = cache(async (bookingNumber: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .ilike("booking_number", `%${bookingNumber}%`)
    .limit(10)

  if (error) throw error
  return data || []
})

/**
 * Get machinery catalog with pricing and availability
 */
export const getMachineryCatalog = cache(async (filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  limit?: number
  offset?: number
}) => {
  const supabase = await createClient()
  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase
    .from("v_machine_catalog")
    .select("*")

  if (filters?.category) {
    query = query.eq("category_id", filters.category)
  }

  if (filters?.minPrice) {
    query = query.gte("min_price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("min_price", filters.maxPrice)
  }

  const { data, error } = await query
    .order("rating_avg", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data || []
})
