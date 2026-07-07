import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/telecallers/me
 * Get current telecaller's profile
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

    const { data: telecaller, error } = await supabase
      .from("telecallers")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(telecaller)
  } catch (error) {
    console.error("[v0] Get telecaller error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/telecallers/me/leads
 * Get leads assigned to telecaller
 */
export async function GET_LEADS(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")

    let query = supabase
      .from("v_lead_pipeline")
      .select("*", { count: "exact" })
      .eq("assigned_telecaller", user.id)

    if (status) {
      query = query.eq("status_name", status)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("last_contacted_at", { ascending: false })

    const { data: leads, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get leads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/telecallers/me/calls
 * Get call history
 */
export async function GET_CALLS(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const from = (page - 1) * limit

    const { data: calls, error, count } = await supabase
      .from("call_logs")
      .select("*", { count: "exact" })
      .eq("telecaller_id", user.id)
      .range(from, from + limit - 1)
      .order("started_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: calls,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get calls error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/telecallers/me/performance
 * Get telecaller's performance metrics
 */
export async function GET_PERFORMANCE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: performance, error } = await supabase
      .from("performance")
      .select("*")
      .eq("telecaller_id", user.id)
      .order("period_start", { ascending: false })
      .limit(12)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate current month summary if available
    const currentPerformance = performance?.[0]

    return NextResponse.json({
      performance,
      current: currentPerformance,
      summary: currentPerformance
        ? {
            totalCalls: currentPerformance.total_calls || 0,
            connectedCalls: currentPerformance.connected_calls || 0,
            conversions: currentPerformance.conversions || 0,
            followupsCompleted: currentPerformance.followups_completed || 0,
            totalTalkSeconds: currentPerformance.total_talk_seconds || 0,
            revenueGenerated: currentPerformance.revenue_generated || 0,
            leadsWorked: currentPerformance.leads_worked || 0,
            score: currentPerformance.score || 0,
          }
        : null,
    })
  } catch (error) {
    console.error("[v0] Get performance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/telecallers/me/attendance
 * Get telecaller attendance
 */
export async function GET_ATTENDANCE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString())

    const { data: attendance, error } = await supabase
      .from("telecaller_attendance")
      .select("*")
      .eq("telecaller_id", user.id)
      .gte("attendance_date", `${year}-${String(month).padStart(2, "0")}-01`)
      .lt(
        "attendance_date",
        month === 12
          ? `${year + 1}-01-01`
          : `${year}-${String(month + 1).padStart(2, "0")}-01`,
      )
      .order("attendance_date", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const presentDays = attendance.filter((a: any) => a.attendance_status === "present").length
    const totalWorkMinutes = attendance.reduce((sum: number, a: any) => sum + (a.worked_minutes || 0), 0)

    return NextResponse.json({
      attendance,
      summary: {
        totalDays: attendance.length,
        presentDays,
        presentPercentage: attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0,
        totalWorkMinutes,
        totalWorkHours: Math.round(totalWorkMinutes / 60),
      },
    })
  } catch (error) {
    console.error("[v0] Get attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
