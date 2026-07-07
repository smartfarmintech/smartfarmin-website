import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const bookingSchema = z.object({
  machine_id: z.string(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  delivery_location: z.string(),
  field_area: z.number().positive(),
  notes: z.string().optional(),
})

/**
 * GET /api/machinery/bookings
 * Get user's machinery bookings
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
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const from = (page - 1) * limit

    let query = supabase
      .from("machinery_bookings")
      .select(
        `*,
        machine:machines(*, operator:operator_profiles(name, phone, location))`
      )
      .eq("farmer_id", user.id)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: bookings, error, count } = await query
      .range(from, from + limit - 1)
      .order("start_date", { ascending: false })

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
 * POST /api/machinery/bookings
 * Create new machinery booking
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { machine_id, start_date, end_date, delivery_location, field_area, notes } = parsed.data

    // Verify machine exists
    const { data: machine } = await supabase
      .from("machines")
      .select("*")
      .eq("id", machine_id)
      .single()

    if (!machine) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 })
    }

    // Get farmer profile
    const { data: farmer } = await supabase
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer profile not found" }, { status: 404 })
    }

    // Calculate booking duration (in hours)
    const start = new Date(start_date)
    const end = new Date(end_date)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    if (hours <= 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }

    // Calculate total cost
    const total_cost = machine.hourly_rate * hours

    const { data: booking, error } = await supabase
      .from("machinery_bookings")
      .insert({
        farmer_id: farmer.id,
        machine_id,
        operator_id: machine.operator_id,
        start_date,
        end_date,
        delivery_location,
        field_area,
        notes,
        total_cost,
        status: "pending",
        booking_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
