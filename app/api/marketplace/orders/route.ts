import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const orderSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive(),
  delivery_address: z.string(),
  phone: z.string(),
})

/**
 * GET /api/marketplace/orders
 * Get user's orders
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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const from = (page - 1) * limit

    let query = supabase
      .from("marketplace_orders")
      .select(
        `*,
        product:marketplace_products(*),
        seller:marketplace_products!inner(farmer_id, farmer_profiles(name, phone))`
      )
      .eq("buyer_id", user.id)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: orders, error, count } = await query
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/marketplace/orders
 * Create new order
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
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { product_id, quantity, delivery_address, phone } = parsed.data

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check stock
    if (product.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Calculate total
    const total = product.price * quantity

    // Create order
    const { data: order, error } = await supabase
      .from("marketplace_orders")
      .insert({
        product_id,
        buyer_id: user.id,
        seller_id: product.farmer_id,
        quantity,
        total_amount: total,
        status: "pending",
        delivery_address,
        buyer_phone: phone,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
