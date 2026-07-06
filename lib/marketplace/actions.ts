"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Add product to cart
 */
export async function addToCart(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const productId = formData.get("productId") as string
  const quantity = Number(formData.get("quantity") ?? 1)

  if (!productId || quantity < 1) {
    return { ok: false, error: "Invalid product or quantity" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in to add to cart" }
  }

  try {
    // Get or create cart
    let { data: cart } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from("cart")
        .insert({ user_id: user.id })
        .select("id")
        .single()

      if (cartError) throw cartError
      cart = newCart
    }

    // Add to cart items
    const { error } = await supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id: productId,
      quantity,
    })

    if (error) throw error

    revalidatePath("/app/cart")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const itemId = formData.get("itemId") as string
  const quantity = Number(formData.get("quantity") ?? 1)

  if (!itemId || quantity < 0) {
    return { ok: false, error: "Invalid item or quantity" }
  }

  const supabase = await createClient()

  try {
    if (quantity === 0) {
      // Delete item
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)
      if (error) throw error
    } else {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId)
      if (error) throw error
    }

    revalidatePath("/app/cart")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(_prev: ActionState, itemId: string): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)
    if (error) throw error

    revalidatePath("/app/cart")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Checkout and create order
 */
export async function checkout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    // Get cart with items
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select(
        `id, cart_items (
          id, product_id, quantity, 
          product:products(price, currency)
        )`
      )
      .eq("user_id", user.id)
      .maybeSingle()

    if (cartError || !cart || !cart.cart_items?.length) {
      throw new Error("Cart is empty")
    }

    // Calculate totals
    let subtotal = 0
    for (const item of cart.cart_items) {
      const itemProduct = Array.isArray(item.product) ? item.product[0] : item.product
      subtotal += (itemProduct?.price ?? 0) * item.quantity
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100
    const shipping = 0
    const total = subtotal + tax + shipping

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        seller_id: cart.cart_items[0].product_id, // Default to first product's seller
        order_status: "pending",
        payment_status: "pending",
        subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        total_amount: total,
        currency: "INR",
        placed_at: new Date().toISOString(),
      })
      .select("id, order_number")
      .single()

    if (orderError) throw orderError

    // Create order items
    for (const cartItem of cart.cart_items) {
      const product = Array.isArray(cartItem.product) ? cartItem.product[0] : cartItem.product
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        unit_price: product?.price ?? 0,
        tax_rate: 5,
      })
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("cart_id", cart.id)

    revalidatePath("/app/orders")
    redirect(`/app/orders/${order.id}`)
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(_prev: ActionState, orderId: string): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("orders")
      .update({
        order_status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) throw error

    revalidatePath(`/app/orders/${orderId}`)
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
