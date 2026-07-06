"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BOOKING_TRANSITIONS } from "./constants"
import {
  availabilitySchema,
  gpsPingSchema,
  loginSchema,
  machineSchema,
  maintenanceSchema,
  operatorDocumentSchema,
  operatorSchema,
  pricingSchema,
  profileSchema,
  registerSchema,
} from "./schemas"

export type ActionState = { ok: boolean; error?: string; fieldErrors?: Record<string, string> } | null

function flattenFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  const fe = error.flatten().fieldErrors
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(fe)) if (v && v[0]) out[k] = v[0]
  return out
}

function revalidateOwner(...paths: string[]) {
  revalidatePath("/operator")
  for (const p of paths) revalidatePath(p)
}

/**
 * Idempotently ensures the machinery owner's user_profile row exists.
 * Machines/operators/bookings key directly off auth.uid(), so no extra table.
 */
export async function ensureOwnerBootstrap(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  await supabase.from("user_profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: (meta.full_name as string) ?? null,
      phone: (meta.phone as string) ?? null,
    },
    { onConflict: "id", ignoreDuplicates: true },
  )
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

/* ----------------------------- auth ----------------------------- */

export async function registerOwner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    businessName: formData.get("businessName"),
    ownershipType: formData.get("ownershipType"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
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
        business_name: parsed.data.businessName,
        ownership_type: parsed.data.ownershipType,
        role: "machinery_owner",
      },
    },
  })
  if (error) return { ok: false, error: error.message }

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })
    if (signInError) {
      return { ok: false, error: "Account created. Please check your email to confirm, then log in." }
    }
  }

  await ensureOwnerBootstrap()
  redirect("/operator")
}

export async function loginOwner(_prev: ActionState, formData: FormData): Promise<ActionState> {
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

  await ensureOwnerBootstrap()
  redirect("/operator")
}

export async function logoutOwner(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/operator/login")
}

/* ----------------------------- profile ----------------------------- */

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }

  const supabase = await createClient()
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
    .eq("id", userId)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/profile")
  return { ok: true }
}

/* ----------------------------- machines ----------------------------- */

export async function saveMachine(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = machineSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    owner_id: userId,
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    machine_status: parsed.data.machineStatus,
    ownership_type: parsed.data.ownershipType,
    brand: parsed.data.brand,
    model: parsed.data.model,
    manufacture_year: parsed.data.manufactureYear,
    registration_no: parsed.data.registrationNo,
    fuel: parsed.data.fuel,
    power_hp: parsed.data.powerHp,
    description: parsed.data.description,
    implements_included: parsed.data.implementsIncluded,
    operator_included: parsed.data.operatorIncluded,
    base_location: parsed.data.baseLocation,
    service_radius_km: parsed.data.serviceRadiusKm,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    image_url: parsed.data.imageUrl,
    min_booking_hours: parsed.data.minBookingHours,
  }

  const { error } = id
    ? await supabase.from("machines").update(payload).eq("id", id).eq("owner_id", userId)
    : await supabase.from("machines").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/machines")
  return { ok: true }
}

export async function deleteMachine(id: string): Promise<ActionState> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }
  const supabase = await createClient()
  const { error } = await supabase.from("machines").delete().eq("id", id).eq("owner_id", userId)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/machines")
  return { ok: true }
}

/**
 * Object-based machine upsert for the client manager (optimistic + offline replay).
 */
export async function upsertMachineData(input: unknown, id?: string): Promise<ActionState> {
  const parsed = machineSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }

  const supabase = await createClient()
  const payload = {
    owner_id: userId,
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    machine_status: parsed.data.machineStatus,
    ownership_type: parsed.data.ownershipType,
    brand: parsed.data.brand,
    model: parsed.data.model,
    manufacture_year: parsed.data.manufactureYear,
    registration_no: parsed.data.registrationNo,
    fuel: parsed.data.fuel,
    power_hp: parsed.data.powerHp,
    description: parsed.data.description,
    implements_included: parsed.data.implementsIncluded,
    operator_included: parsed.data.operatorIncluded,
    base_location: parsed.data.baseLocation,
    service_radius_km: parsed.data.serviceRadiusKm,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    image_url: parsed.data.imageUrl,
    min_booking_hours: parsed.data.minBookingHours,
  }

  const { error } = id
    ? await supabase.from("machines").update(payload).eq("id", id).eq("owner_id", userId)
    : await supabase.from("machines").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/machines")
  return { ok: true }
}

/* ----------------------------- operators (crew) ----------------------------- */

export async function saveOperator(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = operatorSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    owner_id: userId,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    operator_status: parsed.data.operatorStatus,
    years_experience: parsed.data.yearsExperience,
    skills: parsed.data.skills,
    daily_wage: parsed.data.dailyWage,
    photo_url: parsed.data.photoUrl,
  }

  const { error } = id
    ? await supabase.from("operators").update(payload).eq("id", id).eq("owner_id", userId)
    : await supabase.from("operators").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/operators")
  return { ok: true }
}

export async function deleteOperator(id: string): Promise<ActionState> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }
  const supabase = await createClient()
  const { error } = await supabase.from("operators").delete().eq("id", id).eq("owner_id", userId)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/operators")
  return { ok: true }
}

export async function saveOperatorDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = operatorDocumentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from("operator_documents").insert({
    operator_id: parsed.data.operatorId,
    doc_type: parsed.data.docType,
    verification_status: parsed.data.verificationStatus,
    document_number: parsed.data.documentNumber,
    document_url: parsed.data.documentUrl,
    issued_on: parsed.data.issuedOn,
    expires_on: parsed.data.expiresOn,
  })
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/operators")
  return { ok: true }
}

export async function deleteOperatorDocument(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase.from("operator_documents").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/operators")
  return { ok: true }
}

/* ----------------------------- availability ----------------------------- */

export async function saveAvailability(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = availabilitySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    machine_id: parsed.data.machineId,
    slot_status: parsed.data.slotStatus,
    starts_at: new Date(parsed.data.startsAt).toISOString(),
    ends_at: new Date(parsed.data.endsAt).toISOString(),
    reason: parsed.data.reason,
  }

  const { error } = id
    ? await supabase.from("availability").update(payload).eq("id", id)
    : await supabase.from("availability").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/availability")
  return { ok: true }
}

export async function deleteAvailability(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase.from("availability").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/availability")
  return { ok: true }
}

/* ----------------------------- pricing ----------------------------- */

export async function savePricing(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = pricingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    machine_id: parsed.data.machineId,
    name: parsed.data.name,
    unit: parsed.data.unit,
    price: parsed.data.price,
    min_units: parsed.data.minUnits,
    max_units: parsed.data.maxUnits,
    operator_fee: parsed.data.operatorFee,
    fuel_included: parsed.data.fuelIncluded,
    season_start: parsed.data.seasonStart,
    season_end: parsed.data.seasonEnd,
    valid_from: parsed.data.validFrom,
    valid_until: parsed.data.validUntil,
    is_active: parsed.data.isActive,
    priority: parsed.data.priority,
  }

  const { error } = id
    ? await supabase.from("pricing_rules").update(payload).eq("id", id)
    : await supabase.from("pricing_rules").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/pricing")
  return { ok: true }
}

export async function deletePricing(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase.from("pricing_rules").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/pricing")
  return { ok: true }
}

/* ----------------------------- maintenance ----------------------------- */

export async function saveMaintenance(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = maintenanceSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const id = formData.get("id") as string | null
  const payload = {
    machine_id: parsed.data.machineId,
    maint_type: parsed.data.maintType,
    maint_status: parsed.data.maintStatus,
    title: parsed.data.title,
    description: parsed.data.description,
    scheduled_at: parsed.data.scheduledAt,
    started_at: parsed.data.startedAt,
    completed_at: parsed.data.completedAt,
    cost: parsed.data.cost,
    service_provider: parsed.data.serviceProvider,
    odometer_hours: parsed.data.odometerHours,
  }

  const { error } = id
    ? await supabase.from("maintenance").update(payload).eq("id", id)
    : await supabase.from("maintenance").insert(payload)
  if (error) return { ok: false, error: error.message }

  revalidateOwner("/operator/maintenance")
  return { ok: true }
}

export async function deleteMaintenance(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase.from("maintenance").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/maintenance")
  return { ok: true }
}

/* ----------------------------- bookings ----------------------------- */

/**
 * Transitions a booking to a new state (owner-driven). Validates the transition,
 * assigns an operator when moving to operator_assigned, and stamps lifecycle times.
 */
export async function transitionBooking(input: {
  bookingId: string
  toState: string
  operatorId?: string | null
  note?: string | null
}): Promise<ActionState> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Not authenticated" }

  const supabase = await createClient()
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, booking_state")
    .eq("id", input.bookingId)
    .eq("owner_id", userId)
    .maybeSingle()
  if (!booking) return { ok: false, error: "Booking not found" }

  const allowed = BOOKING_TRANSITIONS[booking.booking_state as keyof typeof BOOKING_TRANSITIONS] ?? []
  if (!allowed.includes(input.toState as never)) {
    return { ok: false, error: `Cannot move from ${booking.booking_state} to ${input.toState}` }
  }

  const now = new Date().toISOString()
  const patch: Record<string, unknown> = { booking_state: input.toState }
  if (input.toState === "confirmed") patch.confirmed_at = now
  if (input.toState === "operator_assigned" && input.operatorId) patch.operator_id = input.operatorId
  if (input.toState === "completed") patch.completed_at = now
  if (["cancelled", "rejected", "no_show"].includes(input.toState)) {
    patch.cancelled_at = now
    if (input.note) patch.cancel_reason = input.note
  }

  const { error } = await supabase.from("bookings").update(patch).eq("id", input.bookingId).eq("owner_id", userId)
  if (error) return { ok: false, error: error.message }

  // Best-effort timeline entry (may also be handled by a DB trigger).
  await supabase.from("booking_status").insert({
    booking_id: input.bookingId,
    from_state: booking.booking_state,
    to_state: input.toState,
    note: input.note ?? null,
  })

  revalidateOwner("/operator/bookings", `/operator/bookings/${input.bookingId}`)
  return { ok: true }
}

/* ----------------------------- reviews ----------------------------- */

export async function respondToReview(id: string, response: string): Promise<ActionState> {
  const trimmed = response.trim()
  if (!trimmed) return { ok: false, error: "Response cannot be empty" }
  const supabase = await createClient()
  const { error } = await supabase
    .from("machine_reviews")
    .update({ owner_response: trimmed, responded_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/reviews")
  return { ok: true }
}

/* ----------------------------- tracking ----------------------------- */

export async function logGpsPing(input: unknown): Promise<ActionState> {
  const parsed = gpsPingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: flattenFieldErrors(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from("gps_locations").insert({
    machine_id: parsed.data.machineId,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    speed_kmph: parsed.data.speedKmph,
    recorded_at: new Date().toISOString(),
  })
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/tracking")
  return { ok: true }
}

/* ----------------------------- notifications ----------------------------- */

export async function markNotificationRead(id: string): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/notifications")
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionState> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("status", "unread")
  if (error) return { ok: false, error: error.message }
  revalidateOwner("/operator/notifications")
  return { ok: true }
}
