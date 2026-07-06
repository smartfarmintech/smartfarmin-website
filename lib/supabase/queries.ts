/**
 * SmartFarmin - Core Database Query Layer
 * This file demonstrates the query patterns needed for all CRUD operations
 * Each entity (farmers, bookings, orders, etc.) follows this pattern
 */

import { createClient } from '@supabase/supabase-js'

// Initialize server-side Supabase client (use in API routes)
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * ============================================
 * FARMER QUERIES - Template for other entities
 * ============================================
 */

// GET all farmers (with pagination and filters)
export async function getFarmers({
  page = 1,
  limit = 20,
  search = '',
  status = null,
  sortBy = 'created_at',
  sortOrder = 'desc',
}: {
  page?: number
  limit?: number
  search?: string
  status?: string | null
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} = {}) {
  let query = supabaseServer.from('farmers').select(
    `
      *,
      user_profiles(full_name, email, phone),
      farmer_profiles(annual_income, aadhaar_last4),
      villages(name)
    `,
    { count: 'exact' }
  )

  // Apply filters
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone.ilike.%${search}%,farmer_code.ilike.%${search}%`
    )
  }

  if (status) {
    query = query.eq('status', status)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const { from, to } = {
    from: (page - 1) * limit,
    to: (page - 1) * limit + limit - 1,
  }

  const { data, error, count } = await query.range(from, to)

  if (error) throw error

  return {
    data,
    count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// GET single farmer
export async function getFarmerById(farmerId: string) {
  const { data, error } = await supabaseServer
    .from('farmers')
    .select(
      `
      *,
      user_profiles(*),
      farmer_profiles(*),
      lands(*),
      crop_cycles(*),
      villages(*)
    `
    )
    .eq('id', farmerId)
    .single()

  if (error) throw error
  return data
}

// CREATE farmer
export async function createFarmer(
  userId: string,
  villageId: string,
  data: {
    farmer_type: string
    experience_years: number
    registration_number?: string
  }
) {
  const { data: farmer, error } = await supabaseServer
    .from('farmers')
    .insert({
      user_id: userId,
      village_id: villageId,
      farmer_type: data.farmer_type,
      experience_years: data.experience_years,
      registration_number: data.registration_number,
      status: 'active',
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return farmer
}

// UPDATE farmer
export async function updateFarmer(
  farmerId: string,
  updates: Partial<{
    farmer_type: string
    experience_years: number
    status: string
  }>,
  userId: string
) {
  const { data, error } = await supabaseServer
    .from('farmers')
    .update({
      ...updates,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', farmerId)
    .select()
    .single()

  if (error) throw error
  return data
}

// DELETE farmer
export async function deleteFarmer(farmerId: string, userId: string) {
  const { data, error } = await supabaseServer
    .from('farmers')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq('id', farmerId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * ============================================
 * BOOKING QUERIES
 * ============================================
 */

export async function createBooking(
  userId: string,
  data: {
    machine_id: string
    renter_id: string
    operator_id?: string
    starts_at: string
    ends_at: string
    units: number
    unit_price: number
    total_amount: number
    service_address?: Record<string, any>
  }
) {
  const { data: booking, error } = await supabaseServer
    .from('bookings')
    .insert({
      ...data,
      owner_id: userId,
      booking_state: 'pending',
      payment_status: 'pending',
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return booking
}

export async function getBookings(userId: string, role: string) {
  let query = supabaseServer
    .from('bookings')
    .select(
      `
      *,
      machines(name, brand, image_url),
      operators(full_name, phone),
      users(full_name)
    `
    )

  // Filter by user role
  if (role === 'farmer') {
    query = query.eq('renter_id', userId)
  } else if (role === 'operator') {
    query = query.eq('operator_id', userId)
  } else if (role === 'machinery_owner') {
    query = query.eq('owner_id', userId)
  }

  const { data, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) throw error
  return data
}

/**
 * ============================================
 * ORDER QUERIES
 * ============================================
 */

export async function createOrder(
  buyerId: string,
  data: {
    items: Array<{
      product_id: string
      seller_id: string
      quantity: number
      unit_price: number
    }>
    shipping_address_id: string
    total_amount: number
    currency: string
  }
) {
  const { data: order, error } = await supabaseServer
    .from('orders')
    .insert({
      buyer_id: buyerId,
      order_status: 'pending',
      payment_status: 'pending',
      fulfillment: 'unfulfilled',
      subtotal: data.total_amount,
      total_amount: data.total_amount,
      currency: data.currency,
      shipping_address_id: data.shipping_address_id,
      placed_at: new Date().toISOString(),
      created_by: buyerId,
    })
    .select()
    .single()

  if (error) throw error

  // Create order items
  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    seller_id: item.seller_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.quantity * item.unit_price,
    item_status: 'pending',
    created_by: buyerId,
  }))

  const { error: itemsError } = await supabaseServer
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

/**
 * ============================================
 * WALLET QUERIES
 * ============================================
 */

export async function getWalletBalance(userId: string) {
  const { data, error } = await supabaseServer
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function addWalletTransaction(
  userId: string,
  data: {
    amount: number
    txn_type: 'credit' | 'debit'
    category: string
    description: string
    reference_type?: string
    reference_id?: string
  }
) {
  // Get current balance
  const wallet = await getWalletBalance(userId)

  const newBalance =
    data.txn_type === 'credit'
      ? wallet.balance + data.amount
      : wallet.balance - data.amount

  // Create transaction
  const { data: txn, error: txnError } = await supabaseServer
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      user_id: userId,
      amount: data.amount,
      txn_type: data.txn_type,
      category: data.category,
      description: data.description,
      reference_type: data.reference_type,
      reference_id: data.reference_id,
      balance_after: newBalance,
      txn_status: 'completed',
      created_by: userId,
    })
    .select()
    .single()

  if (txnError) throw txnError

  // Update wallet balance
  const { error: updateError } = await supabaseServer
    .from('wallets')
    .update({
      balance: newBalance,
      total_credited:
        data.txn_type === 'credit'
          ? wallet.total_credited + data.amount
          : wallet.total_credited,
      total_debited:
        data.txn_type === 'debit'
          ? wallet.total_debited + data.amount
          : wallet.total_debited,
      last_txn_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq('id', wallet.id)

  if (updateError) throw updateError

  return txn
}

/**
 * ============================================
 * NOTIFICATION QUERIES
 * ============================================
 */

export async function createNotification(
  userId: string,
  data: {
    title: string
    body: string
    category: string
    channel: string
    action_url?: string
    image_url?: string
    priority?: string
  }
) {
  const { data: notification, error } = await supabaseServer
    .from('notifications')
    .insert({
      user_id: userId,
      ...data,
      status: 'delivered',
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return notification
}

export async function getNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50
) {
  let query = supabaseServer
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.is('read_at', null)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabaseServer
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Note: This file demonstrates the query patterns needed.
 * To complete the backend, replicate these patterns for all 40+ entities
 * in the schema. See BACKEND_IMPLEMENTATION_GUIDE.md for full entity list.
 */
