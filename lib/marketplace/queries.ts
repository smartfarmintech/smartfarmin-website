"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Product, Order, OrderItem } from "./types"

const PRODUCT_COLUMNS = `
  id, name, slug, description, short_description, sku, category_id, brand_id, 
  seller_id, price, compare_at_price, cost_price, currency, unit, weight_grams,
  product_status, status, rating_avg, rating_count, is_featured, tags,
  metadata, created_at, updated_at
`

const ORDER_COLUMNS = `
  id, order_number, buyer_id, seller_id, order_status, payment_status, 
  subtotal, discount_amount, tax_amount, shipping_amount, total_amount,
  currency, placed_at, confirmed_at, shipped_at, delivered_at, cancelled_at,
  shipping_address_id, coupon_code, notes, metadata, created_at
`

/**
 * Fetch all products with filters
 */
export const getProducts = cache(async (filters?: {
  category?: string
  seller?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<Product[]> => {
  const supabase = await createClient()
  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase.from("products").select(PRODUCT_COLUMNS)

  if (filters?.category) {
    query = query.eq("category_id", filters.category)
  }
  if (filters?.seller) {
    query = query.eq("seller_id", filters.seller)
  }
  if (filters?.status) {
    query = query.eq("product_status", filters.status)
  }

  const { data, error } = await query
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as Product[]) ?? []
})

/**
 * Fetch featured products for homepage
 */
export const getFeaturedProducts = cache(async (limit = 6): Promise<Product[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_featured", true)
    .eq("status", "active")
    .order("rating_avg", { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as Product[]) ?? []
})

/**
 * Fetch single product with images
 */
export const getProductById = cache(async (id: string): Promise<Product | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .single()

  if (error) throw error
  return (data as Product) ?? null
})

/**
 * Fetch orders for authenticated user
 */
export const getUserOrders = cache(async (): Promise<Order[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("buyer_id", user.id)
    .order("placed_at", { ascending: false })

  if (error) throw error
  return (data as Order[]) ?? []
})

/**
 * Fetch single order with items
 */
export const getOrderById = cache(async (id: string): Promise<(Order & { items: OrderItem[] }) | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(
      `${ORDER_COLUMNS},
      order_items!inner (
        id, product_id, quantity, unit_price, discount_amount, tax_amount, tax_rate, 
        line_total, item_status, product:products(name, sku, image_url)
      )`
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return (data as any) ?? null
})

/**
 * Get cart for authenticated user
 */
export const getCart = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("cart")
    .select(
      `id, coupon_id,
      cart_items (
        id, product_id, quantity, unit_price,
        product:products(id, name, price, currency)
      )`
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) throw error
  return data
})

/**
 * Search products by name or description
 */
export const searchProducts = cache(async (query: string, limit = 10): Promise<Product[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
    .eq("status", "active")
    .limit(limit)

  if (error) throw error
  return (data as Product[]) ?? []
})
