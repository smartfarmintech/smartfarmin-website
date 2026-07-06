"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Wallet, WalletTransaction } from "./types"

/**
 * Get wallet for authenticated user
 */
export const getWallet = cache(async (): Promise<Wallet | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("wallets")
    .select(
      `id, user_id, balance, reserved_balance, total_credited, total_debited, 
      currency, wallet_status, last_txn_at, created_at, updated_at`
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) throw error
  return (data as Wallet) ?? null
})

/**
 * Get wallet transactions for authenticated user
 */
export const getWalletTransactions = cache(async (filters?: {
  category?: string
  limit?: number
  offset?: number
}): Promise<WalletTransaction[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase
    .from("wallet_transactions")
    .select(
      `id, wallet_id, user_id, txn_type, category, amount, balance_after,
      description, reference_type, reference_id, txn_status, currency, 
      created_at, idempotency_key`
    )
    .eq("user_id", user.id)

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as WalletTransaction[]) ?? []
})

/**
 * Get wallet statistics
 */
export const getWalletStats = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("v_wallet_overview")
    .select(
      `balance, available_balance, reserved_balance, total_credited, 
      total_debited, reward_points_balance, last_txn_at, wallet_status`
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) throw error
  return data
})

/**
 * Get cashback earned
 */
export const getCashback = cache(async (): Promise<any[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("cashback")
    .select("id, amount, reason, credited_at, cashback_status, expires_at")
    .eq("user_id", user.id)
    .eq("cashback_status", "credited")
    .order("credited_at", { ascending: false })
    .limit(5)

  if (error) throw error
  return data ?? []
})

/**
 * Get reward points
 */
export const getRewardPoints = cache(async (): Promise<any[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("reward_points")
    .select("id, points, reason, reward_type, created_at, expires_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return data ?? []
})
