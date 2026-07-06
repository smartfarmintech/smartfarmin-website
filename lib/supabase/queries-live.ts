/**
 * Live query helpers that replace mock implementations
 * Ensures all pages connect to real Supabase data
 */

import { createClient } from './server'

/**
 * Get farmer's complete profile with related data
 */
export async function getFarmerProfile(userId: string) {
  const supabase = await createClient()

  const { data: farmer } = await supabase
    .from('v_farmer_overview')
    .select('*')
    .eq('user_id', userId)
    .single()

  return farmer
}

/**
 * Get farmer's lands with crop cycles
 */
export async function getFarmerLands(farmerId: string, limit = 50, offset = 0) {
  const supabase = await createClient()

  const { data, count } = await supabase
    .from('v_active_crop_cycles')
    .select('*', { count: 'exact' })
    .eq('farmer_id', farmerId)
    .limit(limit)
    .offset(offset)

  return { data, count }
}

/**
 * Get machinery catalog with filtering
 */
export async function getMachineryCatalog(
  filters?: {
    category?: string
    searchTerm?: string
    minPrice?: number
    maxPrice?: number
  },
  limit = 50,
  offset = 0,
) {
  const supabase = await createClient()

  let query = supabase.from('v_machine_catalog').select('*', { count: 'exact' })

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.searchTerm) {
    query = query.ilike('name', `%${filters.searchTerm}%`)
  }

  if (filters?.minPrice) {
    query = query.gte('min_price', filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte('min_price', filters.maxPrice)
  }

  const { data, count } = await query.limit(limit).offset(offset)

  return { data, count }
}

/**
 * Get user's active bookings
 */
export async function getUserBookings(userId: string, role: 'renter' | 'owner' | 'operator' = 'renter') {
  const supabase = await createClient()

  const columnName = role === 'renter' ? 'renter_id' : role === 'owner' ? 'owner_id' : 'operator_id'

  const { data } = await supabase
    .from('v_booking_summary')
    .select('*')
    .eq(columnName, userId)
    .order('starts_at', { ascending: false })

  return data
}

/**
 * Get wallet overview and balance
 */
export async function getWalletInfo(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('v_wallet_overview')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data
}

/**
 * Get wallet transaction history
 */
export async function getWalletTransactions(userId: string, limit = 50, offset = 0) {
  const supabase = await createClient()

  const { data, count } = await supabase
    .from('wallet_transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .offset(offset)

  return { data, count }
}

/**
 * Get marketplace products with filters
 */
export async function getMarketplaceProducts(
  filters?: {
    category?: string
    seller?: string
    minPrice?: number
    maxPrice?: number
  },
  limit = 50,
  offset = 0,
) {
  const supabase = await createClient()

  let query = supabase.from('v_product_catalog').select('*', { count: 'exact' })

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.seller) {
    query = query.eq('seller_id', filters.seller)
  }

  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  const { data, count } = await query.limit(limit).offset(offset)

  return { data, count }
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string, role: 'buyer' | 'seller' = 'buyer', limit = 50, offset = 0) {
  const supabase = await createClient()

  const columnName = role === 'buyer' ? 'buyer_id' : 'seller_id'

  const { data, count } = await supabase
    .from('v_order_summary')
    .select('*', { count: 'exact' })
    .eq(columnName, userId)
    .order('placed_at', { ascending: false })
    .limit(limit)
    .offset(offset)

  return { data, count }
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(userId: string, unreadOnly = false, limit = 50, offset = 0) {
  const supabase = await createClient()

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.is('read_at', null)
  }

  const { data, count } = await query.limit(limit).offset(offset)

  return { data, count }
}

/**
 * Get CRM leads for telecaller
 */
export async function getTelecallerLeads(telecallerId: string, limit = 50, offset = 0) {
  const supabase = await createClient()

  const { data, count } = await supabase
    .from('v_lead_pipeline')
    .select('*', { count: 'exact' })
    .eq('assigned_telecaller', telecallerId)
    .order('next_followup_at', { ascending: true, nullsFirst: false })
    .limit(limit)
    .offset(offset)

  return { data, count }
}

/**
 * Get field agent activity summary
 */
export async function getFieldAgentActivity(agentId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('v_field_agent_activity')
    .select('*')
    .eq('agent_id', agentId)
    .single()

  return data
}

/**
 * Get analytics dashboard data
 */
export async function getDashboardMetrics(userId: string, role: string) {
  const supabase = await createClient()

  // Get relevant metrics based on role
  const { data: bookings } = await supabase
    .from('bookings')
    .select('booking_state, count(*)', { count: 'exact' })
    .group_by('booking_state')

  const { data: orders } = await supabase
    .from('orders')
    .select('order_status, count(*)', { count: 'exact' })
    .group_by('order_status')

  const { data: wallet } = await supabase
    .from('v_wallet_overview')
    .select('balance, available_balance')
    .eq('user_id', userId)
    .single()

  return { bookings, orders, wallet }
}
