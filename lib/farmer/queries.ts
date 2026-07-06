import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type {
  Booking,
  BookingWithMachine,
  CropCycle,
  Farmer,
  FarmDocument,
  Land,
  MachineCatalogItem,
  MachineDetail,
  NotificationItem,
  UserProfile,
  Wallet,
  WalletTransaction,
  WeatherPreferences,
} from "./types"

/**
 * Returns the authenticated user or null. Uses getUser() so the session is
 * validated against the Supabase auth server (not just the cookie).
 */
export const getSessionUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Loads the farmer row linked to the current auth user. All farmer-scoped
 * tables key off this id via the owns_farmer() RLS helper.
 */
export const getCurrentFarmer = cache(async (): Promise<Farmer | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("farmers")
    .select(
      "id, user_id, village_id, farmer_code, registration_number, farmer_type, experience_years, is_verified, status, created_at",
    )
    .eq("user_id", user.id)
    .maybeSingle()

  return (data as Farmer | null) ?? null
})

/** Requires an authenticated farmer, otherwise redirects to login. */
export async function requireFarmer(): Promise<{ farmer: Farmer; userId: string }> {
  const user = await getSessionUser()
  if (!user) redirect("/farmer/login")
  const farmer = await getCurrentFarmer()
  if (!farmer) redirect("/farmer/onboarding")
  return { farmer, userId: user.id }
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
      "id, full_name, display_name, first_name, last_name, email, phone, avatar_url, bio, preferred_language, pincode, address_line1, latitude, longitude",
    )
    .eq("id", user.id)
    .maybeSingle()
  return (data as UserProfile | null) ?? null
})

export async function getLands(farmerId: string): Promise<Land[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("lands")
    .select(
      "id, farmer_id, land_name, survey_number, khata_number, area_value, area_unit, ownership_type, land_type, soil_type, water_source, latitude, longitude, is_active, created_at",
    )
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: true })
  return (data as Land[]) ?? []
}

export async function getCropCycles(farmerId: string): Promise<CropCycle[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("crop_cycles")
    .select(
      "id, land_id, farmer_id, crop_name, variety, season, status, sowing_date, expected_harvest_date, actual_harvest_date, area_value, area_unit, expected_yield, actual_yield, yield_unit, seed_source, created_at, land:lands(id, land_name)",
    )
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false })
  return (data as unknown as CropCycle[]) ?? []
}

export async function getWeatherPreferences(farmerId: string): Promise<WeatherPreferences | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("weather_preferences")
    .select(
      "id, farmer_id, alerts_enabled, rainfall_alerts, temperature_alerts, wind_alerts, temperature_unit, preferred_time, latitude, longitude",
    )
    .eq("farmer_id", farmerId)
    .maybeSingle()
  return (data as WeatherPreferences | null) ?? null
}

export const getWallet = cache(async (): Promise<Wallet | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("wallets")
    .select(
      "id, user_id, wallet_status, currency, balance, reserved_balance, total_credited, total_debited, last_txn_at",
    )
    .eq("user_id", user.id)
    .maybeSingle()
  return (data as Wallet | null) ?? null
})

export async function getWalletTransactions(limit = 25): Promise<WalletTransaction[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("wallet_transactions")
    .select(
      "id, wallet_id, user_id, txn_type, category, txn_status, amount, balance_after, currency, description, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit)
  return (data as WalletTransaction[]) ?? []
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

export async function getDocuments(farmerId: string): Promise<FarmDocument[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("farm_documents")
    .select(
      "id, farmer_id, land_id, document_type, title, file_url, issued_by, issue_date, expiry_date, verification_status, created_at",
    )
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false })
  return (data as FarmDocument[]) ?? []
}

// Machinery & Booking Queries

/** Get list of available machines from the catalog view */
export async function getMachineryCatalog(): Promise<MachineCatalogItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("v_machine_catalog")
    .select(
      "id, name, category, owner_id, owner_name, operating_area, warranty, hourly_rate, daily_rate, weekly_rate, currency, image_url, description, avg_rating, total_reviews",
    )
    .order("name", { ascending: true })
  return (data as MachineCatalogItem[]) ?? []
}

/** Get detailed machine info including reviews and pricing */
export async function getMachineDetail(machineId: string): Promise<MachineDetail | null> {
  const supabase = await createClient()
  const { data: machineData } = await supabase
    .from("v_machine_catalog")
    .select(
      "id, name, category, owner_id, owner_name, operating_area, warranty, hourly_rate, daily_rate, weekly_rate, currency, image_url, description, avg_rating, total_reviews",
    )
    .eq("id", machineId)
    .maybeSingle()

  if (!machineData) return null

  // Get full machine details including status
  const { data: fullMachine } = await supabase
    .from("machines")
    .select("id, machine_status, status, description, features, certifications, warranty_details")
    .eq("id", machineId)
    .maybeSingle()

  // Get reviews
  const { data: reviews } = await supabase
    .from("machine_reviews")
    .select("id, machine_id, reviewer_name, rating, comment, created_at")
    .eq("machine_id", machineId)
    .eq("publication_status", "published")
    .order("created_at", { ascending: false })

  // Get pricing rules
  const { data: pricing } = await supabase
    .from("pricing_rules")
    .select("id, machine_id, unit, rate, currency, min_duration, is_active")
    .eq("machine_id", machineId)
    .eq("is_active", true)

  return {
    ...machineData,
    machine_status: fullMachine?.machine_status ?? "active",
    status: fullMachine?.status ?? "active",
    description: fullMachine?.description ?? machineData.description,
    features: fullMachine?.features ?? null,
    certifications: fullMachine?.certifications ?? null,
    warranty_details: fullMachine?.warranty_details ?? null,
    reviews: (reviews as any[]) ?? [],
    pricing_rules: (pricing as any[]) ?? [],
  } as MachineDetail
}

/** Get farmer's bookings */
export async function getFarmerBookings(): Promise<BookingWithMachine[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("bookings")
    .select(
      `id, booking_number, renter_id, machine_id, owner_id, operator_id, starts_at, ends_at, booking_state, payment_status, 
       payment_method, total_amount, hourly_rate, daily_rate, unit_type, tax_amount, service_address, metadata, notes, created_at, updated_at,
       machine:machines(id, name, category, owner_name, image_url)`,
    )
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })

  return (data as unknown as BookingWithMachine[]) ?? []
}

/** Get a specific booking by ID */
export async function getBooking(bookingId: string): Promise<BookingWithMachine | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, booking_number, renter_id, machine_id, owner_id, operator_id, starts_at, ends_at, booking_state, payment_status, 
       payment_method, total_amount, hourly_rate, daily_rate, unit_type, tax_amount, service_address, metadata, notes, created_at, updated_at,
       machine:machines(id, name, category, owner_name, image_url)`,
    )
    .eq("id", bookingId)
    .maybeSingle()

  return (data as unknown as BookingWithMachine | null) ?? null
}

/** Check if a machine is available for the given time range */
export async function checkMachineAvailability(
  machineId: string,
  startsAt: string,
  endsAt: string,
): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.rpc("mach_is_machine_available", {
    p_machine_id: machineId,
    p_starts_at: startsAt,
    p_ends_at: endsAt,
  })
  return data ?? false
}
