"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Add money to wallet
 */
export async function addMoneyToWallet(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const amount = Number(formData.get("amount") ?? 0)
  const paymentMethod = formData.get("paymentMethod") as string

  if (amount < 100 || amount > 100000) {
    return { ok: false, error: "Amount must be between ₹100 and ₹1,00,000" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    // Create payment request
    const { data: paymentReq, error: paymentError } = await supabase
      .from("payment_requests")
      .insert({
        user_id: user.id,
        amount,
        currency: "INR",
        reference_type: "wallet_topup",
        channel: paymentMethod === "upi" ? "upi" : "card",
        request_status: "pending",
        idempotency_key: `wallet-topup-${user.id}-${Date.now()}`,
      })
      .select("id")
      .single()

    if (paymentError) throw paymentError

    // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
    // For now, automatically complete the transaction
    const { error: txnError } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      txn_type: "credit",
      category: "add-money",
      amount,
      currency: "INR",
      description: `Money added via ${paymentMethod}`,
      reference_type: "payment_request",
      reference_id: paymentReq.id,
      txn_status: "completed",
    })

    if (txnError) throw txnError

    revalidatePath("/app/wallet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Withdraw money from wallet
 */
export async function withdrawMoney(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const amount = Number(formData.get("amount") ?? 0)
  const accountType = formData.get("accountType") as string
  const accountNumber = formData.get("accountNumber") as string

  if (amount < 100) {
    return { ok: false, error: "Minimum withdrawal amount is ₹100" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    // Get wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (walletError || !wallet || wallet.balance < amount) {
      throw new Error("Insufficient wallet balance")
    }

    // Create withdraw request
    const { error: withdrawError } = await supabase.from("withdraw_requests").insert({
      user_id: user.id,
      wallet_id: wallet.id,
      amount,
      currency: "INR",
      bank_account_no: accountNumber,
      withdraw_status: "pending",
    })

    if (withdrawError) throw withdrawError

    revalidatePath("/app/wallet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Redeem reward points
 */
export async function redeemRewardPoints(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const pointsToRedeem = Number(formData.get("points") ?? 0)

  if (pointsToRedeem < 100) {
    return { ok: false, error: "Minimum 100 points required to redeem" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    // Calculate equivalent amount (1 point = 1 rupee typically)
    const redeemAmount = pointsToRedeem

    // Create transaction for redemption
    const { error } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      txn_type: "credit",
      category: "cashback",
      amount: redeemAmount,
      currency: "INR",
      description: `Redeemed ${pointsToRedeem} reward points`,
      reference_type: "reward_redemption",
      txn_status: "completed",
    })

    if (error) throw error

    revalidatePath("/app/wallet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
