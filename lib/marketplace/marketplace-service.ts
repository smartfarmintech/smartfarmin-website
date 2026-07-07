"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const ProductCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().unique().optional(),
  category_id: z.string().uuid(),
  price: z.number().positive(),
  compare_at_price: z.number().optional(),
  unit: z.string(),
  tags: z.array(z.string()).optional(),
})

const OrderCreateSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().positive(),
  })),
  shipping_address_id: z.string().uuid().optional(),
})

const ReviewSchema = z.object({
  product_id: z.string().uuid(),
  order_item_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().optional(),
})

/**
 * Create product (seller)
 */
export async function createProduct(data: z.infer<typeof ProductCreateSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = ProductCreateSchema.parse(data)

    // Get seller profile
    const { data: seller } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!seller) {
      return { ok: false, error: "Seller profile not found" }
    }

    // Create product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        seller_id: seller.id,
        ...validated,
        status: "active",
        product_status: "active",
        currency: "INR",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("products")
    return { ok: true, product }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create product" }
  }
}

/**
 * Update product
 */
export async function updateProduct(productId: string, data: Partial<z.infer<typeof ProductCreateSchema>>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: product, error } = await supabase
      .from("products")
      .update({
        ...data,
        updated_by: user.id,
      })
      .eq("id", productId)
      .select()
      .single()

    if (error) throw error

    revalidateTag("products")
    return { ok: true, product }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update product" }
  }
}

/**
 * Create order from cart
 */
export async function createOrder(data: z.infer<typeof OrderCreateSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = OrderCreateSchema.parse(data)

    // Get cart
    const { data: cart } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!cart) {
      return { ok: false, error: "Cart not found" }
    }

    // Calculate totals from cart items
    let subtotal = 0
    let tax = 0
    const orderItems = []

    for (const item of validated.items) {
      const { data: product } = await supabase
        .from("products")
        .select("price, tax_rate")
        .eq("id", item.product_id)
        .single()

      if (product) {
        const lineTotal = (product.price || 0) * item.quantity
        const itemTax = lineTotal * ((product.tax_rate || 18) / 100)
        subtotal += lineTotal
        tax += itemTax
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          tax_rate: product.tax_rate,
        })
      }
    }

    const shipping = subtotal > 2000 ? 0 : 150
    const totalAmount = subtotal + tax + shipping
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        order_number: orderNumber,
        order_status: "pending",
        payment_status: "pending",
        shipping_address_id: data.shipping_address_id,
        subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        total_amount: totalAmount,
        currency: "INR",
        placed_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    for (const item of orderItems) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        ...item,
        item_status: "pending",
        tax_amount: (item.unit_price * item.quantity * (item.tax_rate || 18)) / 100,
        line_total: item.unit_price * item.quantity,
        created_by: user.id,
      })
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("cart_id", cart.id)

    revalidateTag("orders")
    revalidateTag("cart")
    return { ok: true, order }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create order" }
  }
}

/**
 * Leave product review
 */
export async function leaveReview(data: z.infer<typeof ReviewSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = ReviewSchema.parse(data)

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        ...validated,
        review_status: "pending",
        is_verified_purchase: true,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("reviews")
    return { ok: true, review }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to leave review" }
  }
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: wishlist, error } = await supabase
      .from("wishlist")
      .insert({
        user_id: user.id,
        product_id: productId,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("wishlist")
    return { ok: true, wishlist }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to add to wishlist" }
  }
}

/**
 * Remove from wishlist
 */
export async function removeFromWishlist(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)

    if (error) throw error

    revalidateTag("wishlist")
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to remove from wishlist" }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const updateData: any = {
      order_status: newStatus,
      updated_by: user.id,
    }

    if (newStatus === "shipped") {
      updateData.shipped_at = new Date().toISOString()
    } else if (newStatus === "delivered") {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error

    revalidateTag("orders")
    return { ok: true, order }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update order" }
  }
}
