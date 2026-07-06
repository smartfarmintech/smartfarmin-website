"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const OperatorProfileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string(),
  daily_wage: z.number().optional(),
  years_experience: z.number().optional(),
  skills: z.array(z.string()).optional(),
})

const OperatorDocumentSchema = z.object({
  doc_type: z.string(),
  document_number: z.string(),
  document_url: z.string(),
  issued_on: z.string().optional(),
  expires_on: z.string().optional(),
})

/**
 * Get operator profile
 */
export async function getOperatorProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

/**
 * Update operator profile
 */
export async function updateOperatorProfile(data: z.infer<typeof OperatorProfileSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = OperatorProfileSchema.parse(data)

    // Update operator profile
    const { data: operator, error } = await supabase
      .from("operators")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    // Update user profile
    await supabase.from("user_profiles").update({
      full_name: validated.full_name,
      phone: validated.phone,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id)

    revalidateTag("operator-profile")
    return { ok: true, operator }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

/**
 * Add operator document for verification
 */
export async function addOperatorDocument(data: z.infer<typeof OperatorDocumentSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = OperatorDocumentSchema.parse(data)

    const { data: operator } = await supabase
      .from("operators")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!operator) {
      return { ok: false, error: "Operator not found" }
    }

    const { data: document, error } = await supabase
      .from("operator_documents")
      .insert({
        operator_id: operator.id,
        ...validated,
        status: "pending",
        verification_status: "pending",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("operator-documents")
    return { ok: true, document }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to add document" }
  }
}

/**
 * Accept a booking as operator
 */
export async function acceptBooking(bookingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: operator } = await supabase
      .from("operators")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!operator) {
      return { ok: false, error: "Operator not found" }
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        operator_id: operator.id,
        booking_state: "in_progress",
        updated_by: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) throw error

    revalidateTag("operator-bookings")
    return { ok: true, booking }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to accept booking" }
  }
}

/**
 * Complete a booking as operator
 */
export async function completeBooking(bookingId: string, notes?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        booking_state: "completed",
        completed_at: new Date().toISOString(),
        notes,
        updated_by: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) throw error

    // Record status
    await supabase.from("booking_status").insert({
      booking_id: bookingId,
      from_state: "in_progress",
      to_state: "completed",
      changed_by: user.id,
      note: notes || "Booking completed",
    })

    revalidateTag("operator-bookings")
    return { ok: true, booking }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to complete booking" }
  }
}
