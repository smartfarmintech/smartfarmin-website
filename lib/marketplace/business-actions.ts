// ======================== MARKETPLACE & PRODUCT OPERATIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== CART MANAGEMENT ===================

export async function addToCart(
  productId: string,
  quantity: number,
  variant?: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Get or create cart
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  let cartId = cart?.id

  if (!cartId) {
    const { data: newCart, error: cartError } = await supabase
      .from('carts')
      .insert({ user_id: user.id, status: 'active' })
      .select('id')
      .single()

    if (cartError) return { ok: false, error: cartError.message }
    cartId = newCart.id
  }

  // Add item to cart
  const { error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: productId,
      quantity,
      variant_data: variant || {},
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removeFromCart(cartItemId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== ORDER MANAGEMENT ===================

export async function createOrder(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Get active cart
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!cart) return { ok: false, error: 'No active cart' }

  // Get cart items
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('product_id, quantity, variant_data')
    .eq('cart_id', cart.id)

  if (!cartItems || cartItems.length === 0) {
    return { ok: false, error: 'Cart is empty' }
  }

  // Calculate total
  const { data: products } = await supabase
    .from('products')
    .select('id, price')
    .in(
      'id',
      cartItems.map(item => item.product_id),
    )

  const productMap = Object.fromEntries(products?.map(p => [p.id, p.price]) || [])
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (productMap[item.product_id] || 0) * item.quantity,
    0,
  )

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      shipping_address: formData.get('shipping_address'),
      payment_method: formData.get('payment_method'),
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (orderError) return { ok: false, error: orderError.message }

  // Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: productMap[item.product_id],
    variant_data: item.variant_data,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return { ok: false, error: itemsError.message }

  // Mark cart as complete
  await supabase
    .from('carts')
    .update({ status: 'completed' })
    .eq('id', cart.id)

  return { ok: true, data: { orderId: order.id, totalAmount } }
}

export async function cancelOrder(orderId: string, reason: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== PRODUCT REVIEWS ===================

export async function submitProductReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const review = {
    product_id: formData.get('product_id'),
    user_id: user.id,
    rating: parseInt(formData.get('rating') as string),
    title: formData.get('title'),
    body: formData.get('body'),
    review_status: 'pending_approval',
  }

  const { error } = await supabase
    .from('product_reviews')
    .insert(review)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== WISHLIST ===================

export async function addProductToWishlist(productId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('product_wishlist')
    .insert({
      user_id: user.id,
      product_id: productId,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removeProductFromWishlist(productId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('product_wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
