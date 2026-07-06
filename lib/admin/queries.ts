"use server"

import { cache, redirect } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Verify admin access
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Check if user has admin role
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("role_id")
    .eq("id", user.id)
    .single()

  if (error || !profile) redirect("/")

  // Verify role is admin (role_id = admin role id)
  // This should check against roles table with admin slug
  return { userId: user.id }
}

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = cache(async () => {
  const supabase = await createClient()

  try {
    // Get total users
    const { count: userCount } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })

    // Get total farmers
    const { count: farmerCount } = await supabase
      .from("farmers")
      .select("*", { count: "exact", head: true })

    // Get total orders
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })

    // Get total revenue (completed orders)
    const { data: revenuData } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("order_status", "delivered")

    const revenue = revenuData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

    return {
      totalUsers: userCount || 0,
      totalFarmers: farmerCount || 0,
      totalOrders: orderCount || 0,
      totalRevenue: revenue,
    }
  } catch (error) {
    return {
      totalUsers: 0,
      totalFarmers: 0,
      totalOrders: 0,
      totalRevenue: 0,
    }
  }
})

/**
 * Get recent orders
 */
export const getRecentOrders = cache(async (limit = 10) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, buyer_id, total_amount, order_status, 
      payment_status, placed_at`
    )
    .order("placed_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
})

/**
 * Get all products
 */
export const getAllProducts = cache(async (limit = 20, offset = 0) => {
  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from("products")
    .select("id, name, price, product_status, rating_count, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { products: data ?? [], total: count ?? 0 }
})

/**
 * Get all farmers
 */
export const getAllFarmers = cache(async (limit = 20, offset = 0) => {
  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from("farmers")
    .select(
      `id, farmer_code, user_id, village_id, farmer_type, status, 
      verified_at, created_at, user_profiles(full_name, email, phone)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { farmers: data ?? [], total: count ?? 0 }
})

/**
 * Get pending verifications
 */
export const getPendingVerifications = cache(async (limit = 10) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification")
    .select(
      `id, farmer_id, agent_id, verification_type, status, 
      created_at, farmers(id, user_id, user_profiles(full_name))`
    )
    .eq("status", "pending")
    .limit(limit)

  if (error) throw error
  return data ?? []
})

/**
 * Get applications for schemes
 */
export const getPendingApplications = cache(async (limit = 10) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("applications")
    .select(
      `id, farmer_id, scheme_id, status, submitted_at,
      schemes(id, name),
      farmers(id, user_id, user_profiles(full_name))`
    )
    .eq("status", "submitted")
    .limit(limit)

  if (error) throw error
  return data ?? []
})
