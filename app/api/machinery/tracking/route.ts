import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const gpsTrackingSchema = z.object({
  booking_id: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  speed: z.number().min(0).optional(),
})

/**
 * POST /api/machinery/tracking
 * Record GPS tracking data for active booking
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
    const parsed = gpsTrackingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { booking_id, latitude, longitude, accuracy, speed } = parsed.data

    // Verify booking exists and user is authorized
    const { data: booking } = await supabase
      .from("machinery_bookings")
      .select("*, machine:machines(operator_id)")
      .eq("id", booking_id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Get operator profile to check authorization
    const { data: operator } = await supabase
      .from("operator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!operator || booking.machine.operator_id !== operator.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Record tracking data
    const { data: tracking, error } = await supabase
      .from("machinery_gps_tracking")
      .insert({
        booking_id,
        latitude,
        longitude,
        accuracy,
        speed,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(tracking, { status: 201 })
  } catch (error) {
    console.error("[v0] Record GPS tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/machinery/tracking
 * Get GPS tracking data for a booking
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
    const bookingId = searchParams.get("booking_id")
    const limit = parseInt(searchParams.get("limit") || "100")

    if (!bookingId) {
      return NextResponse.json({ error: "booking_id is required" }, { status: 400 })
    }

    // Verify booking exists and user is authorized
    const { data: booking } = await supabase
      .from("machinery_bookings")
      .select("*, machine:machines(operator_id), farmer:farmer_profiles(user_id)")
      .eq("id", bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Get operator and farmer profiles
    const { data: operator } = await supabase
      .from("operator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    const { data: farmer } = await supabase
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    // Check authorization - operator or farmer can view
    if (
      (operator && booking.machine.operator_id !== operator.id) &&
      (farmer && booking.farmer_id !== farmer.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: tracking, error } = await supabase
      .from("machinery_gps_tracking")
      .select("*")
      .eq("booking_id", bookingId)
      .order("recorded_at", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(tracking)
  } catch (error) {
    console.error("[v0] Get GPS tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
