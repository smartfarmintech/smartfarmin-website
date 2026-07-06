"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { PricingUnit } from "./types"
import {
  cropCycleSchema,
  documentSchema,
  landSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  topupSchema,
  weatherPrefsSchema,
} from "./schemas"

export type ActionState = { ok: boolean; error?: string; fieldErrors?: Record<string, string> } | null

function flattenFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  const fe = error.flatten().fieldErrors
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(fe)) if (v && v[0]) out[k] = v[0]
  return out
}

/**
 * Idempotently creates the rows a farmer needs: user_profile, farmer, wallet,
 * and weather preferences. Safe to call on every authenticated page load.
 */
export async function ensureFarmerBootstrap(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>

  // user_profiles (PK = auth uid)
  await supabase
    .from("user_profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: (meta.full_name as string) ?? null,
        phone: (meta.phone as string) ?? null,
      },
      { onConflict: "id", ignoreDuplicates: true },
    )

  // farmers (one per user)
  const { data: farmer } = await supabase.from("farmers").select("id").eq("user_id", user.id).maybeSingle()
  let farmerId = farmer?.id as string | undefined
  if (!farmerId) {
    const { data: inserted } = await supabase
      .from("farmers")
      .insert({
        user_id: user.id,
        farmer_type: (meta.farmer_type as string) ?? "owner",
        experience_years: Number(meta.experience_years ?? 0),
      })
      .select("id")
      .single()
    farmerId = inserted?.id as string | undefined
  }

  // wallet (one per user)
  const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", user.id).maybeSingle()
  if (!wallet) {
    await supabase.from("wallets").insert({ user_id: user.id })
  }

  // weather preferences (one per farmer)
  if (farmerId) {
    const { data: prefs } = await supabase
      .from("weather_preferences")
      .select("id")
      .eq("farmer_id", farmerId)
      .maybeSingle()
    if (!prefs) {
      await supabase.from("weather_preferences").insert({ farmer_id: farmerId })
    }
  }
}

export async function registerFarmer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    farmerType: formData.get("farmerType"),
    experienceYears: formData.get("experienceYears"),
  })
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        farmer_type: parsed.data.farmerType,
        experience_years: parsed.data.experienceYears,
      },
    },
  })
  if (error) return { ok: false, error: error.message }

  // If email confirmation is disabled, a session exists now.
  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })
    if (signInError) {
      return { ok: false, error: "Account created. Please check your email to confirm, then log in." }
    }
  }

  await ensureFarmerBootstrap()
  redirect("/farmer")
}

export async function loginFarmer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (error) return { ok: false, error: "Invalid email or password." }

  await ensureFarmerBootstrap()
  redirect("/farmer")
}

export async function logoutFarmer(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/farmer/login")
}

async function currentFarmerId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("farmers").select("id").eq("user_id", user.id).maybeSingle()
  return (data?.id as string) ?? null
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      bio: parsed.data.bio,
      pincode: parsed.data.pincode,
      address_line1: parsed.data.addressLine1,
      preferred_language: parsed.data.preferredLanguage,
    })
    .eq("id", user.id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/profile")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function createLand(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = landSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }

  const supabase = await createClient()
  const { error } = await supabase.from("lands").insert({
    farmer_id: farmerId,
    land_name: parsed.data.landName,
    survey_number: parsed.data.surveyNumber,
    area_value: parsed.data.areaValue,
    area_unit: parsed.data.areaUnit,
    ownership_type: parsed.data.ownershipType,
    land_type: parsed.data.landType,
    soil_type: parsed.data.soilType ?? null,
    water_source: parsed.data.waterSource ?? null,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/crops")
  revalidatePath("/farmer/profile")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function deleteLand(id: string): Promise<ActionState> {
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }
  const supabase = await createClient()
  const { error } = await supabase.from("lands").delete().eq("id", id).eq("farmer_id", farmerId)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/farmer/crops")
  revalidatePath("/farmer/profile")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function saveCropCycle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = cropCycleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    farmer_id: farmerId,
    land_id: parsed.data.landId,
    crop_name: parsed.data.cropName,
    variety: parsed.data.variety,
    season: parsed.data.season,
    status: parsed.data.status,
    sowing_date: parsed.data.sowingDate,
    expected_harvest_date: parsed.data.expectedHarvestDate,
    actual_harvest_date: parsed.data.actualHarvestDate,
    area_value: parsed.data.areaValue,
    area_unit: parsed.data.areaUnit,
    expected_yield: parsed.data.expectedYield,
    actual_yield: parsed.data.actualYield,
    yield_unit: parsed.data.yieldUnit,
    seed_source: parsed.data.seedSource,
  }

  const { error } = id
    ? await supabase.from("crop_cycles").update(payload).eq("id", id).eq("farmer_id", farmerId)
    : await supabase.from("crop_cycles").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/crops")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function deleteCropCycle(id: string): Promise<ActionState> {
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }
  const supabase = await createClient()
  const { error } = await supabase.from("crop_cycles").delete().eq("id", id).eq("farmer_id", farmerId)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/farmer/crops")
  revalidatePath("/farmer")
  return { ok: true }
}

/**
 * Object-based crop upsert used by the client manager for optimistic writes and
 * offline queue replay. `id` present => update, otherwise insert.
 */
export async function upsertCropData(input: unknown, id?: string): Promise<ActionState> {
  const parsed = cropCycleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }

  const supabase = await createClient()
  const payload = {
    farmer_id: farmerId,
    land_id: parsed.data.landId,
    crop_name: parsed.data.cropName,
    variety: parsed.data.variety,
    season: parsed.data.season,
    status: parsed.data.status,
    sowing_date: parsed.data.sowingDate,
    expected_harvest_date: parsed.data.expectedHarvestDate,
    actual_harvest_date: parsed.data.actualHarvestDate,
    area_value: parsed.data.areaValue,
    area_unit: parsed.data.areaUnit,
    expected_yield: parsed.data.expectedYield,
    actual_yield: parsed.data.actualYield,
    yield_unit: parsed.data.yieldUnit,
    seed_source: parsed.data.seedSource,
  }

  const { error } = id
    ? await supabase.from("crop_cycles").update(payload).eq("id", id).eq("farmer_id", farmerId)
    : await supabase.from("crop_cycles").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/crops")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function saveWeatherPreferences(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const isOn = (v: FormDataEntryValue | null) => v === "on" || v === "true"
  const parsed = weatherPrefsSchema.safeParse({
    alertsEnabled: isOn(formData.get("alerts_enabled")),
    rainfallAlerts: isOn(formData.get("rainfall_alerts")),
    temperatureAlerts: isOn(formData.get("temperature_alerts")),
    windAlerts: isOn(formData.get("wind_alerts")),
    temperatureUnit: formData.get("temperature_unit"),
    preferredTime: formData.get("preferred_time"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  })
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("weather_preferences")
    .update({
      alerts_enabled: parsed.data.alertsEnabled,
      rainfall_alerts: parsed.data.rainfallAlerts,
      temperature_alerts: parsed.data.temperatureAlerts,
      wind_alerts: parsed.data.windAlerts,
      temperature_unit: parsed.data.temperatureUnit,
      preferred_time: parsed.data.preferredTime,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
    })
    .eq("farmer_id", farmerId)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/weather")
  return { ok: true }
}

export async function topUpWallet(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = topupSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated" }

  const { data: wallet } = await supabase.from("wallets").select("id, balance").eq("user_id", user.id).maybeSingle()
  if (!wallet) return { ok: false, error: "Wallet not found" }

  const { error } = await supabase.from("wallet_transactions").insert({
    wallet_id: wallet.id,
    user_id: user.id,
    txn_type: "credit",
    category: "topup",
    txn_status: "completed",
    amount: parsed.data.amount,
    description: parsed.data.description ?? "Wallet top-up",
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/finance")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function addDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = documentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const farmerId = await currentFarmerId()
  if (!farmerId) return { ok: false, error: "No farmer profile found" }

  const supabase = await createClient()
  const { error } = await supabase.from("farm_documents").insert({
    farmer_id: farmerId,
    land_id: parsed.data.landId,
    document_type: parsed.data.documentType,
    title: parsed.data.title,
    file_url: parsed.data.fileUrl,
    issued_by: parsed.data.issuedBy,
    issue_date: parsed.data.issueDate,
    expiry_date: parsed.data.expiryDate,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/documents")
  return { ok: true }
}

export async function markNotificationRead(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/farmer/notifications")
  revalidatePath("/farmer")
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("status", "unread")
  if (error) return { ok: false, error: error.message }
  revalidatePath("/farmer/notifications")
  revalidatePath("/farmer")
  return { ok: true }
}

// Booking Actions

/**
 * Create a new machinery booking. Validates availability and creates a booking request.
 */
export async function createBooking(input: {
  machineId: string
  ownerId?: string
  pricingRuleId?: string | null
  startsAt: string
  endsAt: string
  units: number
  unitType: PricingUnit
  unitPrice: number
  operatorFee?: number
  taxAmount?: number
  totalAmount: number
  serviceAddress?: string
  notes?: string
}): Promise<ActionState & { bookingId?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated" }

  // Check availability using the DB function
  const { data: available } = await supabase.rpc("mach_is_machine_available", {
    p_machine_id: input.machineId,
    p_starts_at: input.startsAt,
    p_ends_at: input.endsAt,
  })

  if (!available) {
    return { ok: false, error: "This machine is not available for the selected time period" }
  }

  // Resolve the machine owner (required, NOT NULL on bookings)
  let ownerId = input.ownerId
  if (!ownerId) {
    const { data: machine } = await supabase
      .from("machines")
      .select("id, owner_id")
      .eq("id", input.machineId)
      .maybeSingle()
    if (!machine) return { ok: false, error: "Machine not found" }
    ownerId = machine.owner_id
  }

  // Create booking. `booking_number` is auto-populated by the mach_gen_booking_number trigger.
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      renter_id: user.id,
      machine_id: input.machineId,
      owner_id: ownerId,
      pricing_rule_id: input.pricingRuleId ?? null,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      booking_state: "requested",
      payment_status: "unpaid",
      units: input.units,
      unit_type: input.unitType,
      unit_price: input.unitPrice,
      operator_fee: input.operatorFee ?? 0,
      tax_amount: input.taxAmount ?? 0,
      total_amount: input.totalAmount,
      service_address: input.serviceAddress ? { address: input.serviceAddress } : null,
      notes: input.notes ?? null,
    })
    .select("id")
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/machinery")
  revalidatePath("/farmer/bookings")
  revalidatePath("/farmer")

  return { ok: true, bookingId: booking.id }
}

/**
 * Cancel a pending booking
 */
export async function cancelBooking(bookingId: string): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("bookings")
    .update({ booking_state: "cancelled" })
    .eq("id", bookingId)
    .eq("renter_id", user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath("/farmer/bookings")
  revalidatePath("/farmer")
  return { ok: true }
}

/**
 * Check if a machine is available for the given time range (callable from client)
 */
export async function checkAvailability(
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

// =================== AUTH ACTIONS (Password Reset, Email Verification) ===================

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string
  if (!email) return { ok: false, error: "Email is required" }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/farmer/reset-password`,
  })

  if (error) {
    // Don't leak if email exists or not
    return { ok: true, error: undefined }
  }

  return { ok: true, error: undefined }
}

export async function resetPasswordWithToken(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { ok: false, error: "Password and confirmation are required" }
  }

  if (password !== confirmPassword) {
    return { ok: false, fieldErrors: { confirmPassword: "Passwords do not match" } }
  }

  if (password.length < 8) {
    return { ok: false, fieldErrors: { password: "Password must be at least 8 characters" } }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { ok: false, error: error.message }

  redirect("/farmer/login?message=Password%20reset%20successful")
}

export async function verifyEmail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string
  const token = formData.get("token") as string

  if (!email || !token) {
    return { ok: false, error: "Email and verification token are required" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })

  if (error) return { ok: false, error: error.message }

  await ensureFarmerBootstrap()
  redirect("/farmer?message=Email%20verified%20successfully")
}

export async function resendVerificationEmail(): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return { ok: false, error: "User email not found" }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: user.email,
  })

  if (error) return { ok: false, error: error.message }

  return { ok: true }
}
