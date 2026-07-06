import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"
import { z } from "zod"

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
})

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = verifyPaymentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = parsed.data

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeySecret) {
      console.error("[v0] Razorpay key secret missing")
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 500 }
      )
    }

    // Verify signature
    const body_string = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected_signature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_string)
      .digest("hex")

    if (expected_signature !== razorpay_signature) {
      console.error("[v0] Invalid payment signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get transaction from database
    const { data: transaction, error: txnError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single()

    if (txnError || !transaction) {
      console.error("[v0] Transaction not found:", txnError)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Update transaction status
    const { data: updatedTxn, error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: "completed",
        razorpay_payment_id,
        razorpay_signature,
        completed_at: new Date().toISOString(),
      })
      .eq("id", transaction.id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Transaction update error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Handle wallet topup
    if (transaction.transaction_type === "wallet_topup") {
      // Get or create wallet
      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", transaction.user_id)
        .single()

      if (wallet) {
        // Update wallet balance
        const newBalance = wallet.balance + transaction.amount

        await supabase
          .from("wallets")
          .update({
            balance: newBalance,
            last_txn_at: new Date().toISOString(),
          })
          .eq("id", wallet.id)

        // Create wallet transaction record
        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          user_id: transaction.user_id,
          txn_type: "credit",
          category: "wallet_topup",
          description: `Wallet topup via Razorpay - Order ${razorpay_order_id}`,
          amount: transaction.amount,
          balance_after: newBalance,
          txn_status: "completed",
        })
      }
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTxn,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("[v0] Verify payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
