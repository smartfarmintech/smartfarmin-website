"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Get founder dashboard metrics
 */
export const getFounderMetrics = cache(async (dateRange?: {
  from: string
  to: string
}) => {
  const supabase = await createClient()

  // Revenue metrics
  const { data: bookings } = await supabase
    .from("bookings")
    .select("total_amount", { count: "exact" })
    .gte("created_at", dateRange?.from || "2024-01-01")
    .lte("created_at", dateRange?.to || new Date().toISOString())

  // User growth
  const { data: farmers, count: farmerCount } = await supabase
    .from("farmers")
    .select("id", { count: "exact" })
    .gte("created_at", dateRange?.from || "2024-01-01")

  const { count: operatorCount } = await supabase
    .from("operators")
    .select("id", { count: "exact" })
    .gte("created_at", dateRange?.from || "2024-01-01")

  // Marketplace orders
  const { data: orders } = await supabase
    .from("orders")
    .select("total_amount", { count: "exact" })
    .gte("created_at", dateRange?.from || "2024-01-01")

  // AI usage
  const { count: aiCount } = await supabase
    .from("ai_conversations")
    .select("id", { count: "exact" })
    .gte("created_at", dateRange?.from || "2024-01-01")

  const totalRevenue = [
    ...(bookings || []),
    ...(orders || []),
  ].reduce((sum, item) => sum + (item.total_amount || 0), 0)

  return {
    totalRevenue,
    bookingRevenue: bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
    marketplaceRevenue: orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
    totalFarmers: farmerCount || 0,
    totalOperators: operatorCount || 0,
    aiUsageCount: aiCount || 0,
  }
})

/**
 * Get admin dashboard metrics
 */
export const getAdminMetrics = cache(async (dateRange?: {
  from: string
  to: string
}) => {
  const supabase = await createClient()

  // Active users
  const { count: totalFarmers } = await supabase
    .from("farmers")
    .select("id", { count: "exact" })

  const { count: totalOperators } = await supabase
    .from("operators")
    .select("id", { count: "exact" })

  // Active bookings
  const { count: activeBookings } = await supabase
    .from("bookings")
    .select("id", { count: "exact" })
    .in("status", ["confirmed", "in_progress"])

  // Active orders
  const { count: activeOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact" })
    .in("status", ["pending", "confirmed"])

  // Pending verifications
  const { count: pendingVerifications } = await supabase
    .from("operators")
    .select("id", { count: "exact" })
    .eq("verification_status", "pending")

  return {
    totalFarmers: totalFarmers || 0,
    totalOperators: totalOperators || 0,
    activeBookings: activeBookings || 0,
    activeOrders: activeOrders || 0,
    pendingVerifications: pendingVerifications || 0,
  }
})

/**
 * Get operator dashboard metrics
 */
export const getOperatorMetrics = cache(async (operatorId: string, dateRange?: {
  from: string
  to: string
}) => {
  const supabase = await createClient()

  // Machines
  const { count: totalMachines } = await supabase
    .from("machines")
    .select("id", { count: "exact" })
    .eq("operator_id", operatorId)

  // Bookings
  const { data: bookings, count: bookingCount } = await supabase
    .from("bookings")
    .select("total_amount")
    .eq("operator_id", operatorId)
    .gte("created_at", dateRange?.from || "2024-01-01")

  // Earnings
  const earnings = (bookings || []).reduce((sum, b) => sum + (b.total_amount || 0), 0)

  // Reviews
  const { data: reviews } = await supabase
    .from("operator_reviews")
    .select("rating")
    .eq("operator_id", operatorId)

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return {
    totalMachines: totalMachines || 0,
    totalBookings: bookingCount || 0,
    totalEarnings: earnings,
    averageRating: parseFloat(avgRating.toFixed(2)),
    reviewCount: reviews?.length || 0,
  }
})

/**
 * Get drone dashboard metrics
 */
export const getDroneMetrics = cache(async (operatorId: string, dateRange?: {
  from: string
  to: string
}) => {
  const supabase = await createClient()

  // Total drones
  const { count: totalDrones } = await supabase
    .from("drones")
    .select("id", { count: "exact" })
    .eq("operator_id", operatorId)

  // Completed missions
  const { count: completedMissions } = await supabase
    .from("drone_missions")
    .select("id", { count: "exact" })
    .eq("operator_id", operatorId)
    .eq("status", "completed")
    .gte("created_at", dateRange?.from || "2024-01-01")

  // Area covered (acres)
  const { data: missions } = await supabase
    .from("drone_missions")
    .select("area_acres")
    .eq("operator_id", operatorId)
    .eq("status", "completed")

  const areaCovered = (missions || []).reduce((sum, m) => sum + (m.area_acres || 0), 0)

  // Flight hours
  const { data: flights } = await supabase
    .from("drone_flights")
    .select("flight_duration_minutes")
    .eq("operator_id", operatorId)

  const flightHours = (flights || []).reduce((sum, f) => sum + (f.flight_duration_minutes || 0), 0) / 60

  return {
    totalDrones: totalDrones || 0,
    completedMissions: completedMissions || 0,
    areaCovered: parseFloat(areaCovered.toFixed(2)),
    flightHours: parseFloat(flightHours.toFixed(1)),
  }
})

/**
 * Get marketplace dashboard metrics
 */
export const getMarketplaceMetrics = cache(async (dateRange?: {
  from: string
  to: string
}) => {
  const supabase = await createClient()

  // Total products
  const { count: totalProducts } = await supabase
    .from("products")
    .select("id", { count: "exact" })

  // Total orders
  const { data: orders, count: orderCount } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", dateRange?.from || "2024-01-01")

  // Revenue
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total_amount || 0), 0)

  // Active sellers
  const { count: activeSellers } = await supabase
    .from("products")
    .select("seller_id", { count: "exact" })
    .neq("seller_id", null)

  return {
    totalProducts: totalProducts || 0,
    totalOrders: orderCount || 0,
    totalRevenue,
    activeSellers: activeSellers || 0,
  }
})

/**
 * Get district-wise analytics
 */
export const getDistrictAnalytics = cache(async () => {
  const supabase = await createClient()

  const { data } = await supabase
    .from("farmers")
    .select("location->district, count:id")
    .group_by("location->district")
    .order("count", { ascending: false })

  return data || []
})

/**
 * Get time-series data for revenue
 */
export const getRevenueTimeSeries = cache(async (
  type: "daily" | "weekly" | "monthly",
  days: number = 30
) => {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: bookings } = await supabase
    .from("bookings")
    .select("created_at, total_amount")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  // Group by date
  const grouped: Record<string, number> = {}

  ;[...(bookings || []), ...(orders || [])].forEach((item) => {
    const date = new Date(item.created_at).toLocaleDateString()
    grouped[date] = (grouped[date] || 0) + (item.total_amount || 0)
  })

  return Object.entries(grouped).map(([date, amount]) => ({
    date,
    amount,
  }))
})

/**
 * Export dashboard data as CSV
 */
export const generateDashboardCSV = async (
  type: "founder" | "admin" | "operator" | "drone" | "marketplace",
  operatorId?: string,
  dateRange?: { from: string; to: string }
) => {
  let data: string[][] = []

  if (type === "founder") {
    const metrics = await getFounderMetrics(dateRange)
    data = [
      ["Metric", "Value"],
      ["Total Revenue", `₹${metrics.totalRevenue.toLocaleString()}`],
      ["Booking Revenue", `₹${metrics.bookingRevenue.toLocaleString()}`],
      ["Marketplace Revenue", `₹${metrics.marketplaceRevenue.toLocaleString()}`],
      ["Total Farmers", metrics.totalFarmers.toString()],
      ["Total Operators", metrics.totalOperators.toString()],
      ["AI Usage", metrics.aiUsageCount.toString()],
    ]
  } else if (type === "admin") {
    const metrics = await getAdminMetrics(dateRange)
    data = [
      ["Metric", "Value"],
      ["Total Farmers", metrics.totalFarmers.toString()],
      ["Total Operators", metrics.totalOperators.toString()],
      ["Active Bookings", metrics.activeBookings.toString()],
      ["Active Orders", metrics.activeOrders.toString()],
      ["Pending Verifications", metrics.pendingVerifications.toString()],
    ]
  }

  // Convert to CSV format
  return data.map((row) => row.join(",")).join("\n")
}
