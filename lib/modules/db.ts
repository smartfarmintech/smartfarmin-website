/**
 * Module Database Utilities
 * Centralized database operations for all 6 modules
 */

import { createClient } from '@/lib/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'

// ============ WALLET MODULE ============

export async function getWalletByUserId(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw new Error(`Failed to fetch wallet: ${error.message}`)
  return data
}

export async function addWalletTransaction(walletId: string, userId: string, amount: number, type: 'credit' | 'debit', description: string, referenceType?: string, referenceId?: string) {
  const supabase = await createClient()
  
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', walletId)
    .single()

  const newBalance = type === 'credit' ? (wallet?.balance || 0) + amount : (wallet?.balance || 0) - amount

  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert([{
      wallet_id: walletId,
      user_id: userId,
      amount,
      txn_type: type,
      txn_status: 'success',
      category: description,
      description,
      reference_type: referenceType,
      reference_id: referenceId,
      balance_after: newBalance
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to add transaction: ${error.message}`)
  
  await supabase
    .from('wallets')
    .update({ balance: newBalance, total_credited: type === 'credit' ? (wallet?.balance || 0) + amount : wallet?.balance })
    .eq('id', walletId)

  return data
}

// ============ DRONE MODULE ============

export async function getDronesByStatus(status: string, limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('machines')
    .select('*, pricing:pricing_rules(*)')
    .eq('machine_status', status)
    .limit(limit)

  if (error) throw new Error(`Failed to fetch drones: ${error.message}`)
  return data
}

export async function createDroneBooking(machineId: string, renterId: string, startsAt: string, endsAt: string, latitude: number, longitude: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      machine_id: machineId,
      renter_id: renterId,
      starts_at: startsAt,
      ends_at: endsAt,
      latitude,
      longitude,
      booking_state: 'pending',
      payment_status: 'pending'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create booking: ${error.message}`)
  return data
}

export async function getGPSLocation(machineId: string, bookingId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('gps_locations')
    .select('*')
    .eq('machine_id', machineId)

  if (bookingId) {
    query = query.eq('booking_id', bookingId)
  }

  const { data, error } = await query
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// ============ MARKETPLACE MODULE ============

export async function getProducts(filters?: { categoryId?: string; status?: string; limit?: number }) {
  const supabase = await createClient()
  
  let query = supabase.from('v_product_catalog').select('*')
  
  if (filters?.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters?.status) query = query.eq('product_status', filters.status)
  
  const { data, error } = await query.limit(filters?.limit || 20)
  
  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const supabase = await createClient()
  
  let { data: cart } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!cart) {
    const { data: newCart } = await supabase
      .from('cart')
      .insert([{ user_id: userId }])
      .select()
      .single()
    cart = newCart
  }

  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      [{ cart_id: cart.id, product_id: productId, quantity }],
      { onConflict: 'cart_id,product_id' }
    )
    .select()
    .single()

  if (error) throw new Error(`Failed to add to cart: ${error.message}`)
  return data
}

export async function createOrder(buyerId: string, sellerId: string, shippingAddressId: string, items: any[]) {
  const supabase = await createClient()
  
  const { data: order, error } = await supabase
    .from('orders')
    .insert([{
      buyer_id: buyerId,
      seller_id: sellerId,
      shipping_address_id: shippingAddressId,
      order_status: 'pending',
      payment_status: 'pending'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create order: ${error.message}`)
  
  for (const item of items) {
    await supabase
      .from('order_items')
      .insert([{
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.quantity * item.unit_price
      }])
  }

  return order
}

// ============ ORGANIC MODULE ============

export async function getOrganicProducts(filters?: { farmId?: string; certified?: boolean; limit?: number }) {
  const supabase = await createClient()
  
  let query = supabase.from('v_organic_catalog').select('*')
  
  if (filters?.farmId) query = query.eq('farm_id', filters.farmId)
  if (filters?.certified !== undefined) query = query.eq('farm_is_certified', filters.certified)
  
  const { data, error } = await query.limit(filters?.limit || 24)
  
  if (error) throw new Error(`Failed to fetch organic products: ${error.message}`)
  return data
}

export async function createOrganicFarm(farmerId: string, userId: string, farmData: any) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('organic_farms')
    .insert([{
      farmer_id: farmerId,
      user_id: userId,
      farm_name: farmData.farm_name,
      description: farmData.description,
      total_area_acres: farmData.total_area_acres,
      organic_since: farmData.organic_since,
      contact_email: farmData.contact_email,
      contact_phone: farmData.contact_phone,
      farm_status: 'pending_verification'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create farm: ${error.message}`)
  return data
}

// ============ DELIVERY MODULE ============

export async function getOrderTracking(orderId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tracking')
    .select('*')
    .eq('order_id', orderId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function createReturnRequest(orderId: string, buyerId: string, reason: string, reasonNote?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('return_requests')
    .insert([{
      order_id: orderId,
      buyer_id: buyerId,
      reason,
      reason_note: reasonNote,
      return_status: 'pending'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create return request: ${error.message}`)
  return data
}

// ============ AI MODULE ============

export async function getOrCreateConversation(userId: string, farmerId?: string, language = 'en') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert([{
      user_id: userId,
      farmer_id: farmerId,
      language,
      channel: 'web',
      title: 'New Conversation'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create conversation: ${error.message}`)
  return data
}

export async function saveAIMessage(conversationId: string, role: 'user' | 'assistant', content: string, model = 'akanksha-v1') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_messages')
    .insert([{
      conversation_id: conversationId,
      role,
      content,
      model
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to save message: ${error.message}`)
  return data
}

export async function createDiseasePrediction(farmerId: string, imageUrl: string, cropName: string, disease: string, confidence: number, diagnosis: string, treatment: any) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('disease_predictions')
    .insert([{
      farmer_id: farmerId,
      image_url: imageUrl,
      crop_name: cropName,
      predicted_disease: disease,
      confidence,
      severity: confidence > 0.8 ? 'severe' : confidence > 0.6 ? 'moderate' : 'mild',
      diagnosis,
      treatment,
      status: 'completed'
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create prediction: ${error.message}`)
  return data
}

// ============ SHARED UTILITIES ============

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getFarmerProfile(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

/**
 * Error handling helper
 */

export function handleDBError(error: PostgrestError): string {
  switch (error.code) {
    case 'PGRST116':
      return 'Record not found'
    case '23505':
      return 'Duplicate entry'
    case '23503':
      return 'Foreign key constraint violation'
    default:
      return error.message || 'Database error occurred'
  }
}
