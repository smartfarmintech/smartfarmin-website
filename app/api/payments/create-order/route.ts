import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"
import { z } from "zod"

const createOrderSchema = z.object({
  amount: z.number().positive(),
  description: z.string(),
  transaction_type: z.enum(["wallet_topup", "order_payment", "booking_payment"]),
  reference_id: z.string().optional(),
})

/**
 * POST /api/payments/create-order
 * Create Razorpay payment order
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
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { amount, description, transaction_type, reference_id } = parsed.data

    // Get Razorpay credentials from environment
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("[v0] Razorpay credentials missing")
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      )
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        transaction_type,
        reference_id: reference_id || "",
      },
    }

    // Create order via Razorpay API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64"),
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      console.error("[v0] Razorpay API error:", response.statusText)
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 }
      )
    }

    const razorpayOrder = await response.json()

    // Store payment transaction in database
    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .insert({
        user_id: user.id,
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency: "INR",
        status: "pending",
        description,
        transaction_type,
        reference_id: reference_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      transaction,
      razorpay_order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    })
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
