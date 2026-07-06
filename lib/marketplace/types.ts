export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string | null
  category_id: string | null
  brand_id: string | null
  seller_id: string
  price: number
  compare_at_price: number | null
  cost_price: number | null
  currency: string
  unit: string | null
  weight_grams: number | null
  product_status: "active" | "inactive" | "discontinued"
  status: "active" | "draft" | "archived"
  rating_avg: number
  rating_count: number
  is_featured: boolean
  tags: string[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  buyer_id: string
  seller_id: string
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  subtotal: number
  discount_amount: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  currency: string
  placed_at: string
  confirmed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  shipping_address_id: string | null
  coupon_code: string | null
  notes: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  discount_amount: number
  tax_amount: number
  tax_rate: number
  line_total: number
  item_status: string
  product?: {
    name: string
    sku: string | null
    image_url: string | null
  }
}

export interface Cart {
  id: string
  user_id: string
  coupon_id: string | null
  cart_items: Array<{
    id: string
    product_id: string
    quantity: number
    unit_price: number
    product?: {
      id: string
      name: string
      price: number
      currency: string
    }
  }>
}
