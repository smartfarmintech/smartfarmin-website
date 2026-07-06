"use server"

import { cache, redirect } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Get field agent details
 */
export async function getFieldAgent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("field_agents")
    .select(
      `id, user_id, full_name, email, phone, employee_code, team, status,
      district, state, village_id, joined_at, current_lat, current_lng`
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Get assigned farmers for agent
 */
export const getAssignedFarmers = cache(async (limit = 20, offset = 0) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { farmers: [], total: 0 }

  const { data: agent } = await supabase
    .from("field_agents")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!agent) return { farmers: [], total: 0 }

  const { data, count, error } = await supabase
    .from("assigned_farmers")
    .select(
      `id, farmer_id, assigned_at, notes, is_active,
      farmers!inner(id, farmer_code, status, user_profiles(full_name, phone, email))`,
      { count: "exact" }
    )
    .eq("agent_id", agent.id)
    .eq("is_active", true)
    .order("assigned_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { farmers: data ?? [], total: count ?? 0 }
})

/**
 * Get visits for agent
 */
export const getAgentVisits = cache(async (filters?: {
  status?: string
  limit?: number
  offset?: number
}) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: agent } = await supabase
    .from("field_agents")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!agent) return []

  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase
    .from("visits")
    .select(
      `id, visit_number, farmer_id, visit_type, status, purpose, 
      scheduled_at, started_at, ended_at, duration_minutes, 
      farmers(id, user_profiles(full_name))`
    )
    .eq("agent_id", agent.id)

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query
    .order("started_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data ?? []
})

/**
 * Get expenses for agent
 */
export const getAgentExpenses = cache(async (limit = 20) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: agent } = await supabase
    .from("field_agents")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!agent) return []

  const { data, error } = await supabase
    .from("expense_claims")
    .select(
      `id, amount, category, expense_date, status, 
      receipt_url, description, submitted_at`
    )
    .eq("agent_id", agent.id)
    .order("expense_date", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
})

/**
 * Get agent attendance
 */
export const getAgentAttendance = cache(async (limit = 30) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: agent } = await supabase
    .from("field_agents")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!agent) return []

  const { data, error } = await supabase
    .from("attendance")
    .select(
      `id, attendance_date, status, check_in_at, check_out_at, 
      worked_minutes, notes`
    )
    .eq("agent_id", agent.id)
    .order("attendance_date", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
})

/**
 * Get agent performance metrics
 */
export const getAgentPerformance = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: agent } = await supabase
    .from("field_agents")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!agent) return null

  // Get this month's metrics
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("agent_id", agent.id)
    .gte("attendance_date", monthStart.toISOString().split("T")[0])

  if (error) throw error

  const attendance = data ?? []
  const presentDays = attendance.filter((a) => a.status === "present").length
  const totalWorkedMinutes = attendance.reduce((sum, a) => sum + (a.worked_minutes || 0), 0)

  return {
    presentDays,
    totalWorkedMinutes,
    averageHours: (totalWorkedMinutes / 60 / Math.max(presentDays, 1)).toFixed(1),
  }
})

/**
 * Get farmer leads for agent
 */
export const getAgentLeads = cache(async (limit = 15) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("leads")
    .select(
      `id, lead_number, full_name, phone, email, district, state, 
      priority, temperature, score, status_id, created_at, last_contacted_at`
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
})
