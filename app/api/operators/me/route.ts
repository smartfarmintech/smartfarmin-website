import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/operators/me
 * Get current operator's profile
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

    const { data: operator, error } = await supabase
      .from("operators")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(operator)
  } catch (error) {
    console.error("[v0] Get operator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/operators/me/machines
 * Get operator's machinery
 */
export async function GET_MACHINES(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: machines, error } = await supabase
      .from("machines")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(machines)
  } catch (error) {
    console.error("[v0] Get machines error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/operators/me/bookings
 * Get operator's machinery bookings
 */
export async function GET_BOOKINGS(request: NextRequest) {
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
      .from("v_booking_summary")
      .select("*", { count: "exact" })
      .eq("owner_id", user.id)

    if (status) {
      query = query.eq("booking_state", status)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

    const { data: bookings, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/operators/me/reviews
 * Get reviews for operator's machinery
 */
export async function GET_REVIEWS(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: reviews, error } = await supabase
      .from("machine_reviews")
      .select("*")
      .eq("operator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate summary
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0

    return NextResponse.json({
      reviews,
      summary: {
        totalReviews: reviews.length,
        averageRating: Math.round(avgRating * 100) / 100,
      },
    })
  } catch (error) {
    console.error("[v0] Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
