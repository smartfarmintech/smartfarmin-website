import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

/**
 * Booking creation payload schema
 */
const createBookingSchema = z.object({
  machineId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  units: z.number().positive(),
  unitType: z.enum(["per_hour", "per_day", "per_acre"]),
  unitPrice: z.number().positive(),
  operatorFee: z.number().default(0),
  taxAmount: z.number().default(0),
  totalAmount: z.number().positive(),
  serviceAddress: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * GET /api/bookings
 * List user's bookings
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
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    let query = supabase
      .from("v_booking_summary")
      .select("*", { count: "exact" })
      .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)

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
 * POST /api/bookings
 * Create a new booking
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
    const parsed = createBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const data = parsed.data

    // Check availability
    const { data: available } = await supabase.rpc("mach_is_machine_available", {
      p_machine_id: data.machineId,
      p_starts_at: data.startsAt,
      p_ends_at: data.endsAt,
    })

    if (!available) {
      return NextResponse.json(
        { error: "Machine is not available for the selected time period" },
        { status: 409 },
      )
    }

    // Get machine owner
    const { data: machine } = await supabase
      .from("machines")
      .select("owner_id")
      .eq("id", data.machineId)
      .maybeSingle()

    if (!machine) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        renter_id: user.id,
        machine_id: data.machineId,
        owner_id: machine.owner_id,
        starts_at: data.startsAt,
        ends_at: data.endsAt,
        booking_state: "requested",
        payment_status: "unpaid",
        units: data.units,
        unit_type: data.unitType,
        unit_price: data.unitPrice,
        operator_fee: data.operatorFee,
        tax_amount: data.taxAmount,
        total_amount: data.totalAmount,
        service_address: data.serviceAddress ? { address: data.serviceAddress } : null,
        notes: data.notes || null,
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
