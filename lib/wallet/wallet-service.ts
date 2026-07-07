"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const WalletTransactionSchema = z.object({
  amount: z.number().positive(),
  txn_type: z.enum(["credit", "debit"]),
  category: z.string(),
  description: z.string().optional(),
  reference_type: z.string().optional(),
  reference_id: z.string().optional(),
})

const WalletRechargeSchema = z.object({
  amount: z.number().positive().min(10),
  payment_method: z.string(),
  reference_number: z.string().optional(),
})

/**
 * Get user wallet overview
 */
export async function getWalletOverview() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("v_wallet_overview")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

/**
 * Get wallet transactions
 */
export async function getWalletTransactions(limit = 50) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Add wallet transaction (debit for booking, credit for refund)
 */
export async function addWalletTransaction(
  data: z.infer<typeof WalletTransactionSchema>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = WalletTransactionSchema.parse(data)

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", user.id)
      .single()

    if (!wallet) {
      return { ok: false, error: "Wallet not found" }
    }

    // Check balance for debit
    if (validated.txn_type === "debit" && wallet.balance < validated.amount) {
      return { ok: false, error: "Insufficient wallet balance" }
    }

    // Calculate balance after transaction
    const balanceAfter =
      validated.txn_type === "credit"
        ? wallet.balance + validated.amount
        : wallet.balance - validated.amount

    // Create transaction
    const { data: transaction, error: txnError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        amount: validated.amount,
        txn_type: validated.txn_type,
        txn_status: "completed",
        category: validated.category,
        description: validated.description,
        reference_type: validated.reference_type,
        reference_id: validated.reference_id,
        balance_after: balanceAfter,
        currency: "INR",
        created_by: user.id,
      })
      .select()
      .single()

    if (txnError) throw txnError

    // Update wallet balance
    await supabase
      .from("wallets")
      .update({
        balance: balanceAfter,
        last_txn_at: new Date().toISOString(),
      })
      .eq("id", wallet.id)

    revalidateTag("wallet", "max")
    return { ok: true, transaction }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to add transaction" }
  }
}

/**
 * Recharge wallet
 */
export async function rechargeWallet(data: z.infer<typeof WalletRechargeSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = WalletRechargeSchema.parse(data)

    // Create payment request
    const { data: paymentRequest, error: paymentError } = await supabase
      .from("payment_requests")
      .insert({
        user_id: user.id,
        amount: validated.amount,
        channel: "wallet",
        reference_type: "wallet",
        request_status: "pending",
        gateway: "razorpay",
        purpose: "Wallet Recharge",
        currency: "INR",
        created_by: user.id,
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    revalidateTag("wallet", "max")
    return { ok: true, paymentRequest }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to recharge wallet" }
  }
}

/**
 * Request withdrawal
 */
export async function requestWithdrawal(
  amount: number,
  bankAccount: {
    account_name: string
    account_number: string
    bank_ifsc: string
    upi_id?: string
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", user.id)
      .single()

    if (!wallet || wallet.balance < amount) {
      return { ok: false, error: "Insufficient balance" }
    }

    const { data: withdrawal, error } = await supabase
      .from("withdraw_requests")
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        amount,
        bank_account_name: bankAccount.account_name,
        bank_account_no: bankAccount.account_number,
        bank_ifsc: bankAccount.bank_ifsc,
        upi_id: bankAccount.upi_id,
        withdraw_status: "pending",
        currency: "INR",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // Reserve balance
    await supabase
      .from("wallets")
      .update({
        reserved_balance: wallet.balance - (wallet.balance - amount),
      })
      .eq("id", wallet.id)

    revalidateTag("wallet", "max")
    return { ok: true, withdrawal }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to request withdrawal" }
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single()

  return wallet?.balance || 0
}
