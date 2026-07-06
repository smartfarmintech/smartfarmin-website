"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Scheme, SchemeCategory, SchemeApplication } from "./types"

/**
 * Get all scheme categories
 */
export const getSchemeCategories = cache(async (): Promise<SchemeCategory[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("scheme_categories")
    .select("id, name, name_te, description, code, icon, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return (data as SchemeCategory[]) ?? []
})

/**
 * Get all schemes with optional filtering
 */
export const getSchemes = cache(async (filters?: {
  categoryId?: string
  limit?: number
  offset?: number
}): Promise<Scheme[]> => {
  const supabase = await createClient()
  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase
    .from("schemes")
    .select(
      `id, name, name_te, description, summary, code, department, level,
      category_id, status, budget, max_beneficiaries, helpline, application_url,
      application_start, application_end, valid_from, valid_to, tags, created_at`
    )

  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId)
  }

  const { data, error } = await query
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as Scheme[]) ?? []
})

/**
 * Get scheme by ID with benefits and eligibility
 */
export const getSchemeById = cache(async (id: string) => {
  const supabase = await createClient()

  const { data: scheme, error: schemeError } = await supabase
    .from("schemes")
    .select("*")
    .eq("id", id)
    .single()

  if (schemeError) throw schemeError

  // Get benefits
  const { data: benefits } = await supabase
    .from("benefits")
    .select("id, name, description, amount, unit, max_amount, frequency, currency")
    .eq("scheme_id", id)

  // Get eligibility criteria
  const { data: eligibility } = await supabase
    .from("eligibility")
    .select("id, criterion, description, value, operator, field_key, is_mandatory")
    .eq("scheme_id", id)

  return {
    scheme,
    benefits: benefits ?? [],
    eligibility: eligibility ?? [],
  }
})

/**
 * Get farmer's scheme applications
 */
export const getFarmerSchemeApplications = cache(async (): Promise<SchemeApplication[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // Get farmer id for this user
  const { data: farmer } = await supabase
    .from("farmers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!farmer) return []

  const { data, error } = await supabase
    .from("applications")
    .select(
      `id, reference_no, scheme_id, status, form_data, is_eligible,
      submitted_at, approved_at, rejected_at, approval_notes: review_notes,
      schemes(id, name, code)`
    )
    .eq("farmer_id", farmer.id)
    .order("submitted_at", { ascending: false })

  if (error) throw error
  return (data as any[]) ?? []
})

/**
 * Search schemes
 */
export const searchSchemes = cache(async (query: string, limit = 10): Promise<Scheme[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("schemes")
    .select("id, name, code, description, department")
    .or(`name.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%`)
    .eq("status", "active")
    .limit(limit)

  if (error) throw error
  return (data as Scheme[]) ?? []
})
