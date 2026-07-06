import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const droneBookingSchema = z.object({
  landId: z.string().uuid(),
  serviceType: z.enum(["survey", "spraying", "analysis"]),
  acres: z.number().positive(),
  cropType: z.string(),
  startDate: z.string().date(),
  notes: z.string().optional(),
})

/**
 * GET /api/drone-services/bookings
 * Get drone booking history
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

    const from = (page - 1) * limit

    // Get farmer ID
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    // Query bookings (assuming drone bookings are in a separate table or marked in bookings)
    const { data: bookings, error, count } = await supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("renter_id", user.id)
      .contains("metadata", { service_type: "drone" })
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

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
    console.error("[v0] Get drone bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/drone-services/bookings
 * Book a drone service
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
    const parsed = droneBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { landId, serviceType, acres, cropType, startDate, notes } = parsed.data

    // Get farmer ID
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    // Create drone service booking
    // For now, creating as a regular booking with metadata to indicate drone service
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        renter_id: user.id,
        owner_id: user.id, // Placeholder, can be drone operator
        booking_state: "requested",
        payment_status: "unpaid",
        units: acres,
        unit_type: "per_acre",
        unit_price: 0, // Will be set by operator
        total_amount: 0,
        service_address: { type: "land", land_id: landId },
        metadata: {
          service_type: "drone",
          drone_service: serviceType,
          crop_type: cropType,
          acres,
        },
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Create drone booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
