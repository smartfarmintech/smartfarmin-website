import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { recordGPSLocation } from "@/lib/machinery/booking-service"
import { z } from "zod"

const GPSLocationSchema = z.object({
  booking_id: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().optional(),
  heading: z.number().optional(),
  accuracy: z.number().optional(),
})

/**
 * GET /api/machinery/gps?booking_id=xxx
 * Fetch GPS locations for a booking
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const bookingId = req.nextUrl.searchParams.get("booking_id")

    if (!bookingId) {
      return NextResponse.json(
        { error: "booking_id is required" },
        { status: 400 }
      )
    }

    const { data: locations, error } = await supabase
      .from("gps_locations")
      .select("*")
      .eq("booking_id", bookingId)
      .order("recorded_at", { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ locations })
  } catch (error) {
    console.error("[GPS GET Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/machinery/gps
 * Record a new GPS location for tracking
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = GPSLocationSchema.parse(body)

    const result = await recordGPSLocation(
      validated.booking_id,
      validated.latitude,
      validated.longitude,
      validated.speed,
      validated.heading,
      validated.accuracy
    )

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GPS POST Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record location" },
      { status: 500 }
    )
  }
}
