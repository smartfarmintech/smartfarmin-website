import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/notifications
 * Get user's notifications with pagination
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || "all"

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .or(`user_id.eq.${user.id},farmer_id.eq.${user.id},agent_id.eq.${user.id}`)

    if (status !== "all") {
      query = query.eq("status", status)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

    const { data: notifications, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${user.id},farmer_id.eq.${user.id},agent_id.eq.${user.id}`)
      .eq("status", "unread")

    return NextResponse.json({
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a notification as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notificationId = request.nextUrl.pathname.split("/")[3]

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const { data: notification, error: getError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .single()

    if (getError || !notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Check ownership
    const isOwner = [notification.user_id, notification.farmer_id, notification.agent_id].includes(user.id)
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: updated, error } = await supabase
      .from("notifications")
      .update({ status: "read", read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Mark notification read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function POST_MARK_ALL(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("notifications")
      .update({ status: "read", read_at: new Date().toISOString() })
      .or(`user_id.eq.${user.id},farmer_id.eq.${user.id},agent_id.eq.${user.id}`)
      .eq("status", "unread")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark all read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
