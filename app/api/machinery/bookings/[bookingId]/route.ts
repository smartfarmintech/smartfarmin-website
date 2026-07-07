import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const updateBookingSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  notes: z.string().optional(),
})

/**
 * GET /api/machinery/bookings/[bookingId]
 * Get booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: booking, error } = await supabase
      .from("machinery_bookings")
      .select(
        `*,
        machine:machines(*, operator:operator_profiles(*)),
        farmer:farmer_profiles(*)`
      )
      .eq("id", bookingId)
      .or(`farmer_id.eq.${user.id},operator_id.eq.${user.id}`)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Get booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/machinery/bookings/[bookingId]
 * Update booking status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get booking and verify permission
    const { data: booking } = await supabase
      .from("machinery_bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Get user's farmer and operator profiles
    const { data: farmer } = await supabase
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    const { data: operator } = await supabase
      .from("operator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    // Verify user is authorized
    if (farmer?.id !== booking.farmer_id && operator?.id !== booking.operator_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { data: updatedBooking, error } = await supabase
      .from("machinery_bookings")
      .update({
        status: parsed.data.status,
        notes: parsed.data.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("[v0] Update booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
