import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const walletTransactionSchema = z.object({
  amount: z.number().positive(),
  txnType: z.enum(["credit", "debit"]),
  category: z.string(),
  description: z.string(),
})

/**
 * GET /api/wallet
 * Get wallet overview
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

    const { data: wallet, error } = await supabase
      .from("v_wallet_overview")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error || !wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("[v0] Get wallet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/wallet/transactions
 * Get wallet transaction history
 */
export async function GET_TRANSACTIONS(request: NextRequest) {
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

    const { data: transactions, error, count } = await supabase
      .from("wallet_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/wallet/topup
 * Top up wallet (create credit transaction)
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
    const parsed = walletTransactionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { amount, txnType, category, description } = parsed.data

    // Get user's wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", user.id)
      .single()

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    // Create transaction
    const newBalance = txnType === "credit" ? wallet.balance + amount : wallet.balance - amount

    if (txnType === "debit" && newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 },
      )
    }

    const { data: transaction, error } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        txn_type: txnType,
        category,
        description,
        amount,
        balance_after: newBalance,
        txn_status: "completed",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update wallet balance
    await supabase
      .from("wallets")
      .update({ balance: newBalance, last_txn_at: new Date().toISOString() })
      .eq("id", wallet.id)

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("[v0] Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
