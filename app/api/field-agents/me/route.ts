import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/field-agents/me
 * Get current field agent's profile
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

    const { data: agent, error } = await supabase
      .from("field_agents")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error("[v0] Get field agent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/field-agents/me/visits
 * Get field agent's visits
 */
export async function GET_VISITS(request: NextRequest) {
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
      .from("visits")
      .select("*", { count: "exact" })
      .eq("agent_id", user.id)

    if (status) {
      query = query.eq("status", status)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("scheduled_at", { ascending: false })

    const { data: visits, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: visits,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get visits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/field-agents/me/attendance
 * Get field agent's attendance
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
      .from("attendance")
      .select("*")
      .eq("agent_id", user.id)
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

    // Calculate summary
    const totalDays = attendance.length
    const presentDays = attendance.filter((a: any) => a.status === "present").length
    const workMinutes = attendance.reduce((sum: number, a: any) => sum + (a.worked_minutes || 0), 0)

    return NextResponse.json({
      attendance,
      summary: {
        totalDays,
        presentDays,
        presentPercentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
        totalWorkMinutes: workMinutes,
        totalWorkHours: Math.round(workMinutes / 60),
      },
    })
  } catch (error) {
    console.error("[v0] Get attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/field-agents/me/activity
 * Get field agent activity summary
 */
export async function GET_ACTIVITY(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: activity, error } = await supabase
      .from("v_field_agent_activity")
      .select("*")
      .eq("agent_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error("[v0] Get activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
