import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type {
  AvailabilitySlot,
  Booking,
  BookingStatusEvent,
  GpsLocation,
  Machine,
  MachineReview,
  MachineryCategory,
  MaintenanceRecord,
  NotificationItem,
  Operator,
  OperatorDocument,
  OwnerDashboardStats,
  PricingRule,
  UserProfile,
} from "./types"

const MACHINE_COLUMNS =
  "id, owner_id, category_id, name, slug, machine_status, ownership_type, brand, model, manufacture_year, registration_no, fuel, power_hp, description, implements_included, operator_included, base_location, service_radius_km, latitude, longitude, image_url, gallery_urls, min_booking_hours, rating_avg, rating_count, total_bookings, status, created_at, category:machinery_categories(id, name)"

const BOOKING_COLUMNS =
  "id, booking_number, machine_id, owner_id, renter_id, operator_id, pricing_rule_id, booking_state, payment_status, starts_at, ends_at, units, unit_type, service_address, latitude, longitude, unit_price, operator_fee, discount_amount, tax_amount, total_amount, advance_amount, currency, notes, cancel_reason, confirmed_at, completed_at, cancelled_at, created_at, machine:machines(id, name, image_url), operator:operators(id, full_name)"

/**
 * Returns the authenticated user or null, validated against the auth server.
 */
export const getSessionUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/** Requires an authenticated machinery owner, otherwise redirects to login. */
export async function requireOwner(): Promise<{ userId: string }> {
  const user = await getSessionUser()
  if (!user) redirect("/operator/login")
  return { userId: user.id }
}

export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("user_profiles")
    .select(
      "id, full_name, display_name, email, phone, avatar_url, bio, preferred_language, pincode, address_line1, latitude, longitude",
    )
    .eq("id", user.id)
    .maybeSingle()
  return (data as UserProfile | null) ?? null
})

export const getCategories = cache(async (): Promise<MachineryCategory[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from("machinery_categories")
    .select("id, parent_id, name, slug, icon_url, display_order")
    .order("display_order", { ascending: true })
  return (data as MachineryCategory[]) ?? []
})

export async function getMachines(ownerId: string): Promise<Machine[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("machines")
    .select(MACHINE_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
  return (data as unknown as Machine[]) ?? []
}

export async function getMachine(id: string): Promise<Machine | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("machines").select(MACHINE_COLUMNS).eq("id", id).maybeSingle()
  return (data as unknown as Machine | null) ?? null
}

export async function getOperators(ownerId: string): Promise<Operator[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("operators")
    .select(
      "id, owner_id, user_id, full_name, phone, operator_status, years_experience, skills, daily_wage, photo_url, is_verified, rating_avg, rating_count, status, created_at",
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
  return (data as Operator[]) ?? []
}

export async function getOperatorDocuments(ownerId: string): Promise<OperatorDocument[]> {
  const supabase = await createClient()
  // RLS (owns_operator) already scopes rows to this owner's operators.
  const { data } = await supabase
    .from("operator_documents")
    .select(
      "id, operator_id, doc_type, verification_status, document_number, document_url, issued_on, expires_on, created_at, operator:operators(id, full_name)",
    )
    .order("created_at", { ascending: false })
  return (data as unknown as OperatorDocument[]) ?? []
}

export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("availability")
    .select("id, machine_id, slot_status, starts_at, ends_at, reason, created_at, machine:machines(id, name)")
    .order("starts_at", { ascending: true })
  return (data as unknown as AvailabilitySlot[]) ?? []
}

export async function getPricingRules(): Promise<PricingRule[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("pricing_rules")
    .select(
      "id, machine_id, name, unit, price, currency, min_units, max_units, operator_fee, fuel_included, season_start, season_end, valid_from, valid_until, is_active, priority, created_at, machine:machines(id, name)",
    )
    .order("priority", { ascending: false })
  return (data as unknown as PricingRule[]) ?? []
}

export async function getMaintenance(): Promise<MaintenanceRecord[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("maintenance")
    .select(
      "id, machine_id, maint_type, maint_status, title, description, scheduled_at, started_at, completed_at, cost, currency, service_provider, odometer_hours, created_at, machine:machines(id, name)",
    )
    .order("scheduled_at", { ascending: false, nullsFirst: false })
  return (data as unknown as MaintenanceRecord[]) ?? []
}

export async function getBookings(ownerId: string): Promise<Booking[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("bookings")
    .select(BOOKING_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
  return (data as unknown as Booking[]) ?? []
}

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("bookings").select(BOOKING_COLUMNS).eq("id", id).maybeSingle()
  return (data as unknown as Booking | null) ?? null
}

export async function getBookingTimeline(bookingId: string): Promise<BookingStatusEvent[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("booking_status")
    .select("id, booking_id, from_state, to_state, note, created_at")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true })
  return (data as BookingStatusEvent[]) ?? []
}

export async function getReviews(): Promise<MachineReview[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("machine_reviews")
    .select(
      "id, machine_id, booking_id, operator_id, user_id, rating, operator_rating, title, body, review_status, is_verified_booking, helpful_count, owner_response, responded_at, created_at, machine:machines(id, name)",
    )
    .order("created_at", { ascending: false })
  return (data as unknown as MachineReview[]) ?? []
}

export async function getRecentTracking(): Promise<GpsLocation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("gps_locations")
    .select(
      "id, machine_id, booking_id, latitude, longitude, speed_kmph, heading, accuracy_m, recorded_at, machine:machines(id, name)",
    )
    .order("recorded_at", { ascending: false })
    .limit(200)
  return (data as unknown as GpsLocation[]) ?? []
}

export async function getNotifications(limit = 30): Promise<NotificationItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("notifications")
    .select("id, category, channel, priority, status, title, body, action_url, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
  return (data as NotificationItem[]) ?? []
}

/** Aggregates headline numbers for the owner dashboard. */
export async function getDashboardStats(ownerId: string): Promise<OwnerDashboardStats> {
  const [machines, operators, bookings] = await Promise.all([
    getMachines(ownerId),
    getOperators(ownerId),
    getBookings(ownerId),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

  const activeBookings = bookings.filter((b) =>
    ["confirmed", "operator_assigned", "in_progress"].includes(b.booking_state),
  ).length
  const pendingRequests = bookings.filter((b) => b.booking_state === "requested").length
  const monthRevenue = bookings
    .filter((b) => b.booking_state === "completed" && new Date(b.created_at).getTime() >= monthStart)
    .reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  const rated = machines.filter((m) => m.rating_count > 0)
  const ratingCount = rated.reduce((s, m) => s + m.rating_count, 0)
  const ratingAvg =
    ratingCount > 0 ? rated.reduce((s, m) => s + m.rating_avg * m.rating_count, 0) / ratingCount : 0

  return {
    machineCount: machines.length,
    activeMachines: machines.filter((m) => m.machine_status === "active").length,
    operatorCount: operators.length,
    activeBookings,
    pendingRequests,
    monthRevenue,
    ratingAvg,
    ratingCount,
  }
}
