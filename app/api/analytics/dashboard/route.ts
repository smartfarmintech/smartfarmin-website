import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/analytics/dashboard
 * Get role-specific dashboard analytics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role to determine which analytics to return
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role_id")
      .eq("id", user.id)
      .single()

    const analytics: Record<string, any> = {}

    // Farmer dashboard
    if (profile?.role_id) {
      const { data: farmerOverview } = await supabase
        .from("v_farmer_overview")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (farmerOverview) {
        analytics.farmer = farmerOverview
      }
    }

    // Get common metrics for all users
    const { data: bookingMetrics } = await supabase
      .from("bookings")
      .select("booking_state", { count: "exact" })
      .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
      .then(async ({ data }) => {
        const metrics: Record<string, number> = {}
        if (Array.isArray(data)) {
          for (const booking of data) {
            metrics[booking.booking_state] = (metrics[booking.booking_state] || 0) + 1
          }
        }
        return { data: metrics }
      })

    analytics.bookings = bookingMetrics?.data || {}

    // Get wallet info
    const { data: wallet } = await supabase
      .from("v_wallet_overview")
      .select("balance, total_credited, total_debited, reward_points_balance")
      .eq("user_id", user.id)
      .single()

    analytics.wallet = wallet || {}

    // Get recent notifications count
    const { count: unreadNotifications } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${user.id},farmer_id.eq.${user.id},agent_id.eq.${user.id}`)
      .eq("status", "unread")

    analytics.unreadNotifications = unreadNotifications || 0

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[v0] Get analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/analytics/metrics
 * Get time-series metrics for charts
 */
export async function GET_METRICS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "daily" // daily, weekly, monthly
    const metricKey = searchParams.get("metric") || "bookings"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query
    if (period === "daily") {
      query = supabase
        .from("daily_metrics")
        .select("*")
        .eq("metric_key", metricKey)
        .order("metric_date", { ascending: false })
        .limit(30)
    } else if (period === "monthly") {
      query = supabase
        .from("monthly_metrics")
        .select("*")
        .eq("metric_key", metricKey)
        .order("year, month", { ascending: false })
        .limit(12)
    } else {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 })
    }

    const { data: metrics, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      period,
      metric: metricKey,
      data: metrics,
    })
  } catch (error) {
    console.error("[v0] Get metrics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/analytics/export
 * Export analytics data as CSV or PDF
 */
export async function GET_EXPORT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const dataType = searchParams.get("type") || "bookings"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query
    if (dataType === "bookings") {
      query = supabase
        .from("bookings")
        .select("*")
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
    } else if (dataType === "transactions") {
      query = supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
    } else {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (format === "json") {
      return NextResponse.json(data)
    } else if (format === "csv") {
      // Convert to CSV
      if (!data || data.length === 0) {
        return NextResponse.json({ error: "No data to export" }, { status: 400 })
      }

      const headers = Object.keys(data[0]).join(",")
      const rows = data.map((row: any) =>
        Object.values(row)
          .map((v: any) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      )
      const csv = [headers, ...rows].join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="export.csv"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Export analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
