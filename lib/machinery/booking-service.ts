"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// ============ VALIDATION SCHEMAS ============

const BookingCreateSchema = z.object({
  machine_id: z.string().uuid(),
  renter_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  units: z.number().positive(),
  unit_type: z.enum(["hours", "days", "acres"]),
  service_address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  latitude: z.number(),
  longitude: z.number(),
})

const BookingApproveSchema = z.object({
  booking_id: z.string().uuid(),
  operator_id: z.string().uuid().optional(),
})

// ============ BOOKING MANAGEMENT ============

/**
 * Create a new machinery booking
 */
export async function createBooking(data: z.infer<typeof BookingCreateSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    // Validate input
    const validated = BookingCreateSchema.parse(data)

    // Check machine availability
    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("machine_id", validated.machine_id)
      .gte("ends_at", validated.starts_at)
      .lte("starts_at", validated.ends_at)
      .eq("slot_status", "available")

    if (!availability || availability.length === 0) {
      return { ok: false, error: "Machine not available for selected dates" }
    }

    // Get pricing rule
    const { data: machine } = await supabase
      .from("machines")
      .select("*, pricing_rules(*)")
      .eq("id", validated.machine_id)
      .single()

    if (!machine) {
      return { ok: false, error: "Machine not found" }
    }

    // Calculate price
    const pricingRule = machine.pricing_rules?.[0]
    const unitPrice = pricingRule?.price || 0
    const operatorFee = pricingRule?.operator_fee || 0
    const subtotal = unitPrice * validated.units
    const tax = subtotal * 0.18 // 18% GST
    const totalAmount = subtotal + operatorFee + tax

    // Generate booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        machine_id: validated.machine_id,
        owner_id: machine.owner_id,
        renter_id: validated.renter_id,
        unit_type: validated.unit_type,
        units: validated.units,
        unit_price: unitPrice,
        operator_fee: operatorFee,
        tax_amount: tax,
        total_amount: totalAmount,
        advance_amount: Math.ceil(totalAmount * 0.25), // 25% advance
        service_address: validated.service_address,
        latitude: validated.latitude,
        longitude: validated.longitude,
        starts_at: validated.starts_at,
        ends_at: validated.ends_at,
        booking_state: "pending",
        payment_status: "pending",
        created_by: user.id,
        currency: "INR",
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // Create booking status record
    await supabase.from("booking_status").insert({
      booking_id: booking.id,
      from_state: null,
      to_state: "pending",
      changed_by: user.id,
      note: "Booking created",
    })

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking }
  } catch (error) {
    console.error("[Booking Error]", error)
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create booking" }
  }
}

/**
 * Approve a machinery booking
 */
export async function approveBooking(data: z.infer<typeof BookingApproveSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    const validated = BookingApproveSchema.parse(data)

    // Update booking state
    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        booking_state: "confirmed",
        confirmed_at: new Date().toISOString(),
        operator_id: validated.operator_id,
        updated_by: user.id,
      })
      .eq("id", validated.booking_id)
      .select()
      .single()

    if (updateError) throw updateError

    // Record status transition
    await supabase.from("booking_status").insert({
      booking_id: validated.booking_id,
      from_state: "pending",
      to_state: "confirmed",
      changed_by: user.id,
      note: validated.operator_id ? `Assigned operator and approved` : "Booking approved",
    })

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking }
  } catch (error) {
    console.error("[Approve Booking Error]", error)
    return { ok: false, error: error instanceof Error ? error.message : "Failed to approve booking" }
  }
}

/**
 * Assign operator to a booking
 */
export async function assignOperator(bookingId: string, operatorId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        operator_id: operatorId,
        updated_by: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) throw error

    await supabase.from("booking_status").insert({
      booking_id: bookingId,
      from_state: booking.booking_state,
      to_state: booking.booking_state,
      changed_by: user.id,
      note: `Operator assigned`,
    })

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to assign operator" }
  }
}

/**
 * Update booking status and record transition
 */
export async function updateBookingStatus(
  bookingId: string,
  newState: string,
  note?: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    // Get current booking state
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("booking_state")
      .eq("id", bookingId)
      .single()

    if (fetchError) throw fetchError

    const updateData: any = {
      booking_state: newState,
      updated_by: user.id,
    }

    // Set completion timestamp for completed bookings
    if (newState === "completed") {
      updateData.completed_at = new Date().toISOString()
    }

    if (newState === "cancelled") {
      updateData.cancelled_at = new Date().toISOString()
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select()
      .single()

    if (updateError) throw updateError

    // Record status transition
    await supabase.from("booking_status").insert({
      booking_id: bookingId,
      from_state: booking.booking_state,
      to_state: newState,
      changed_by: user.id,
      note: note || `Status changed to ${newState}`,
    })

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking: updatedBooking }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update booking" }
  }
}

/**
 * Cancel a booking with refund calculation
 */
export async function cancelBooking(bookingId: string, cancelReason: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (fetchError) throw fetchError

    if (booking.booking_state === "completed" || booking.booking_state === "cancelled") {
      return { ok: false, error: "Cannot cancel a completed or already cancelled booking" }
    }

    // Calculate refund based on cancellation time
    let refundAmount = booking.total_amount
    const bookingStartTime = new Date(booking.starts_at).getTime()
    const cancellationTime = Date.now()
    const hoursBeforeStart = (bookingStartTime - cancellationTime) / (1000 * 60 * 60)

    if (hoursBeforeStart < 24) {
      refundAmount = 0 // No refund if cancelled within 24 hours
    } else if (hoursBeforeStart < 48) {
      refundAmount = booking.total_amount * 0.5 // 50% refund
    }

    // Update booking
    const { data: updatedBooking } = await supabase
      .from("bookings")
      .update({
        booking_state: "cancelled",
        cancel_reason: cancelReason,
        cancelled_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single()

    // Record status transition
    await supabase.from("booking_status").insert({
      booking_id: bookingId,
      from_state: booking.booking_state,
      to_state: "cancelled",
      changed_by: user.id,
      note: `Cancelled: ${cancelReason}`,
    })

    // Create wallet transaction for refund if applicable
    if (refundAmount > 0 && booking.renter_id) {
      await supabase.from("wallet_transactions").insert({
        user_id: booking.renter_id,
        wallet_id: (await supabase
          .from("wallets")
          .select("id")
          .eq("user_id", booking.renter_id)
          .single()).data?.id,
        amount: refundAmount,
        txn_type: "credit",
        txn_status: "completed",
        category: "refund",
        reference_type: "booking",
        reference_id: bookingId,
        description: `Refund for cancelled booking ${booking.booking_number}`,
        created_by: user.id,
        currency: "INR",
      })
    }

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking: updatedBooking, refundAmount }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to cancel booking" }
  }
}

/**
 * Reschedule a booking
 */
export async function rescheduleBooking(
  bookingId: string,
  newStartsAt: string,
  newEndsAt: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (fetchError) throw fetchError

    if (booking.booking_state === "completed" || booking.booking_state === "cancelled") {
      return { ok: false, error: "Cannot reschedule a completed or cancelled booking" }
    }

    // Check new availability
    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("machine_id", booking.machine_id)
      .gte("ends_at", newStartsAt)
      .lte("starts_at", newEndsAt)
      .eq("slot_status", "available")

    if (!availability || availability.length === 0) {
      return { ok: false, error: "Machine not available for new dates" }
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        starts_at: newStartsAt,
        ends_at: newEndsAt,
        updated_by: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (updateError) throw updateError

    // Record status change
    await supabase.from("booking_status").insert({
      booking_id: bookingId,
      from_state: booking.booking_state,
      to_state: booking.booking_state,
      changed_by: user.id,
      note: `Rescheduled from ${booking.starts_at} to ${newStartsAt}`,
    })

    revalidateTag("machinery-bookings", "max")
    return { ok: true, booking: updatedBooking }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to reschedule booking" }
  }
}

/**
 * Generate invoice for a booking
 */
export async function generateBookingInvoice(bookingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "User not authenticated" }
  }

  try {
    // Get booking with details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(
        `*,
        machine:machine_id (name, brand, model),
        renter:renter_id (id),
        owner:owner_id (id)`
      )
      .eq("id", bookingId)
      .single()

    if (fetchError) throw fetchError

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoice")
      .insert({
        user_id: booking.renter_id,
        reference_type: "booking",
        reference_id: bookingId,
        invoice_number: `INV-${booking.booking_number}`,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        billing_name: `Booking: ${booking.machine?.name}`,
        subtotal: booking.total_amount - booking.tax_amount - booking.operator_fee,
        tax_amount: booking.tax_amount,
        total_amount: booking.total_amount,
        currency: booking.currency,
        line_items: [
          {
            description: `${booking.machine?.name} rental for ${booking.units} ${booking.unit_type}`,
            quantity: booking.units,
            unit_price: booking.unit_price,
            amount: booking.unit_price * booking.units,
          },
        ],
        invoice_status: "issued",
        created_by: user.id,
        metadata: {
          booking_number: booking.booking_number,
          machine_details: booking.machine,
          booking_dates: {
            starts_at: booking.starts_at,
            ends_at: booking.ends_at,
          },
        },
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    revalidateTag("machinery-bookings", "max")
    return { ok: true, invoice }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to generate invoice" }
  }
}

/**
 * Track booking in real-time
 */
export async function recordGPSLocation(
  bookingId: string,
  latitude: number,
  longitude: number,
  speed?: number,
  heading?: number,
  accuracy?: number
) {
  const supabase = await createClient()

  try {
    // Get machine from booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("machine_id")
      .eq("id", bookingId)
      .single()

    if (!booking) {
      return { ok: false, error: "Booking not found" }
    }

    // Record GPS location
    const { data: location, error } = await supabase
      .from("gps_locations")
      .insert({
        booking_id: bookingId,
        machine_id: booking.machine_id,
        latitude,
        longitude,
        speed_kmph: speed,
        heading,
        accuracy_m: accuracy,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return { ok: true, location }
  } catch (error) {
    console.error("[GPS Location Error]", error)
    return { ok: false, error: error instanceof Error ? error.message : "Failed to record location" }
  }
}
