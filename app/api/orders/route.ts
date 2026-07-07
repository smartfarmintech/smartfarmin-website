import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const createOrderSchema = z.object({
  cartId: z.string().uuid(),
  shippingAddressId: z.string().uuid(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * GET /api/orders
 * Get user's orders with pagination
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
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")

    let query = supabase
      .from("v_order_summary")
      .select("*", { count: "exact" })
      .eq("buyer_id", user.id)

    if (status) {
      query = query.eq("order_status", status)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("placed_at", { ascending: false })

    const { data: orders, error, count } = await query

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
 * POST /api/orders
 * Create a new order from cart
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

    const { cartId, shippingAddressId, couponCode, notes } = parsed.data

    // Get cart items
    const { data: cartItems } = await supabase
      .from("v_cart_detail")
      .select("*")
      .eq("cart_id", cartId)
      .eq("user_id", user.id)

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    let taxAmount = 0
    cartItems.forEach((item: any) => {
      const itemTotal = item.line_total || 0
      subtotal += itemTotal
      if (item.tax_rate) {
        taxAmount += (itemTotal * item.tax_rate) / 100
      }
    })

    const shippingAmount = 0 // Can be calculated based on rules
    const discountAmount = couponCode ? 100 : 0 // Placeholder
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

    // Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        shipping_address_id: shippingAddressId,
        order_status: "pending",
        payment_status: "unpaid",
        fulfillment: "unfulfilled",
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        coupon_code: couponCode || null,
        notes: notes || null,
        placed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create order items from cart items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      seller_id: item.seller_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_amount: (item.line_total || 0) * (item.tax_rate || 0) / 100,
      line_total: item.line_total,
      item_status: "pending",
    }))

    await supabase.from("order_items").insert(orderItems)

    // Clear cart
    await supabase.from("cart_items").delete().eq("cart_id", cartId)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
