"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Log visit for farmer
 */
export async function logVisit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const farmerId = formData.get("farmerId") as string
  const visitType = formData.get("visitType") as string
  const purpose = formData.get("purpose") as string
  const notes = formData.get("notes") as string

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const { data: agent } = await supabase
      .from("field_agents")
      .select("id, village_id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!agent) throw new Error("Field agent profile not found")

    const { error } = await supabase.from("visits").insert({
      farmer_id: farmerId,
      agent_id: agent.id,
      village_id: agent.village_id,
      visit_type: visitType,
      purpose,
      status: "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      notes,
    })

    if (error) throw error

    revalidatePath("/app/crm/visits")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Submit expense claim
 */
export async function submitExpenseClaim(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const amount = Number(formData.get("amount") ?? 0)
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const expenseDate = formData.get("expenseDate") as string

  if (amount <= 0) {
    return { ok: false, error: "Amount must be greater than 0" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const { data: agent } = await supabase
      .from("field_agents")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!agent) throw new Error("Field agent profile not found")

    const { error } = await supabase.from("expense_claims").insert({
      agent_id: agent.id,
      amount,
      category,
      description,
      expense_date: expenseDate,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/app/crm/expenses")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Check in for attendance
 */
export async function checkIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const { data: agent } = await supabase
      .from("field_agents")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!agent) throw new Error("Field agent profile not found")

    const today = new Date().toISOString().split("T")[0]

    // Check if already checked in today
    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("agent_id", agent.id)
      .eq("attendance_date", today)
      .maybeSingle()

    if (existing) {
      throw new Error("Already checked in today")
    }

    const { error } = await supabase.from("attendance").insert({
      agent_id: agent.id,
      attendance_date: today,
      status: "present",
      check_in_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/app/crm/attendance")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Check out for attendance
 */
export async function checkOut(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const { data: agent } = await supabase
      .from("field_agents")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!agent) throw new Error("Field agent profile not found")

    const today = new Date().toISOString().split("T")[0]

    const { data: attendance, error: getError } = await supabase
      .from("attendance")
      .select("id, check_in_at")
      .eq("agent_id", agent.id)
      .eq("attendance_date", today)
      .maybeSingle()

    if (getError || !attendance) {
      throw new Error("No check-in found for today")
    }

    const checkOutTime = new Date()
    const checkInTime = new Date(attendance.check_in_at)
    const workedMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 1000 / 60)

    const { error } = await supabase
      .from("attendance")
      .update({
        check_out_at: checkOutTime.toISOString(),
        worked_minutes: workedMinutes,
      })
      .eq("id", attendance.id)

    if (error) throw error

    revalidatePath("/app/crm/attendance")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const leadId = formData.get("leadId") as string
  const statusId = formData.get("statusId") as string

  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("leads")
      .update({
        status_id: statusId,
        last_contacted_at: new Date().toISOString(),
      })
      .eq("id", leadId)

    if (error) throw error

    revalidatePath("/app/crm/leads")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
