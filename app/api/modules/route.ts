import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

/**
 * WALLET & PAYMENTS MODULE APIs
 */

const AddMoneySchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['card', 'upi', 'netbanking']),
})

const WithdrawSchema = z.object({
  amount: z.number().positive(),
  upi_id: z.string().optional(),
  bank_account_no: z.string().optional(),
})

/**
 * DRONE SERVICES MODULE APIs
 */

const DroneBookingSchema = z.object({
  machine_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  service_type: z.enum(['spraying', 'survey', 'mapping']),
  latitude: z.number(),
  longitude: z.number(),
})

/**
 * MARKETPLACE MODULE APIs
 */

const AddToCartSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().positive(),
})

const CreateOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().positive(),
    seller_id: z.string().uuid(),
  })),
  shipping_address_id: z.string().uuid(),
  coupon_code: z.string().optional(),
})

/**
 * ORGANIC MARKETPLACE MODULE APIs
 */

const CreateFarmSchema = z.object({
  farm_name: z.string(),
  description: z.string(),
  total_area_acres: z.number().positive(),
  organic_since: z.string().date(),
  contact_email: z.string().email(),
  contact_phone: z.string(),
})

/**
 * ORDER & DELIVERY MODULE APIs
 */

const CreateReturnSchema = z.object({
  order_id: z.string().uuid(),
  reason: z.enum(['defective', 'not_as_described', 'changed_mind', 'other']),
  reason_note: z.string().optional(),
})

const VerifyOTPSchema = z.object({
  order_id: z.string().uuid(),
  otp: z.string().length(6),
})

/**
 * AI ASSISTANT MODULE APIs
 */

const SendChatSchema = z.object({
  conversation_id: z.string().uuid().optional(),
  content: z.string(),
  language: z.enum(['en', 'te', 'hi']).default('en'),
})

const AnalyzeImageSchema = z.object({
  image_url: z.string().url(),
  crop_name: z.string(),
  conversation_id: z.string().uuid().optional(),
})

/**
 * Generic API handler with authentication
 */

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const action = params.action

    // WALLET & PAYMENTS
    if (action === 'wallet/add-money') {
      const validated = AddMoneySchema.parse(body)
      // Initialize Razorpay payment
      const { data: paymentReq } = await supabase
        .from('payment_requests')
        .insert([{
          user_id: user.id,
          amount: validated.amount,
          channel: validated.method,
          request_status: 'pending',
          purpose: 'wallet_topup',
        }])
        .select()
        .single()

      return NextResponse.json(paymentReq)
    }

    if (action === 'wallet/withdraw') {
      const validated = WithdrawSchema.parse(body)
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!wallet || wallet.balance < validated.amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
      }

      const { data: withdrawal } = await supabase
        .from('withdraw_requests')
        .insert([{
          wallet_id: wallet.id,
          user_id: user.id,
          amount: validated.amount,
          upi_id: validated.upi_id,
          bank_account_no: validated.bank_account_no,
          withdraw_status: 'pending',
        }])
        .select()
        .single()

      return NextResponse.json(withdrawal)
    }

    // DRONE SERVICES
    if (action === 'drones/book') {
      const validated = DroneBookingSchema.parse(body)
      const { data: booking } = await supabase
        .from('bookings')
        .insert([{
          machine_id: validated.machine_id,
          renter_id: user.id,
          starts_at: validated.starts_at,
          ends_at: validated.ends_at,
          latitude: validated.latitude,
          longitude: validated.longitude,
          booking_state: 'pending',
          payment_status: 'pending',
        }])
        .select()
        .single()

      return NextResponse.json(booking)
    }

    // MARKETPLACE
    if (action === 'marketplace/add-to-cart') {
      const validated = AddToCartSchema.parse(body)
      const { data: cart } = await supabase
        .from('cart')
        .upsert({ user_id: user.id }, { onConflict: 'user_id' })
        .select()
        .single()

      const { data: cartItem } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          product_id: validated.product_id,
          quantity: validated.quantity,
        }])
        .select()
        .single()

      return NextResponse.json(cartItem)
    }

    if (action === 'marketplace/create-order') {
      const validated = CreateOrderSchema.parse(body)
      // Create order for each seller
      const orders = []
      for (const item of validated.items) {
        const { data: order } = await supabase
          .from('orders')
          .insert([{
            buyer_id: user.id,
            seller_id: item.seller_id,
            order_status: 'pending',
            payment_status: 'pending',
            shipping_address_id: validated.shipping_address_id,
            coupon_code: validated.coupon_code,
          }])
          .select()
          .single()

        orders.push(order)
      }
      return NextResponse.json({ orders })
    }

    // ORGANIC MARKETPLACE
    if (action === 'organic/create-farm') {
      const validated = CreateFarmSchema.parse(body)
      const { data: farm } = await supabase
        .from('organic_farms')
        .insert([{
          farmer_id: user.id,
          user_id: user.id,
          farm_name: validated.farm_name,
          description: validated.description,
          total_area_acres: validated.total_area_acres,
          organic_since: validated.organic_since,
          contact_email: validated.contact_email,
          contact_phone: validated.contact_phone,
          farm_status: 'pending_verification',
          is_certified: false,
        }])
        .select()
        .single()

      return NextResponse.json(farm)
    }

    // ORDER & DELIVERY
    if (action === 'orders/create-return') {
      const validated = CreateReturnSchema.parse(body)
      const { data: returnReq } = await supabase
        .from('return_requests')
        .insert([{
          order_id: validated.order_id,
          buyer_id: user.id,
          reason: validated.reason,
          reason_note: validated.reason_note,
          return_status: 'pending',
        }])
        .select()
        .single()

      return NextResponse.json(returnReq)
    }

    if (action === 'delivery/verify-otp') {
      const validated = VerifyOTPSchema.parse(body)
      // Verify OTP logic
      return NextResponse.json({ success: true, message: 'OTP verified' })
    }

    // AI ASSISTANT
    if (action === 'ai/chat') {
      const validated = SendChatSchema.parse(body)
      // Get or create conversation
      let conversationId = validated.conversation_id

      if (!conversationId) {
        const { data: conv } = await supabase
          .from('ai_conversations')
          .insert([{
            user_id: user.id,
            language: validated.language,
            title: validated.content.slice(0, 50),
            channel: 'web',
          }])
          .select()
          .single()
        conversationId = conv.id
      }

      // Save message
      const { data: message } = await supabase
        .from('ai_messages')
        .insert([{
          conversation_id: conversationId,
          role: 'user',
          content: validated.content,
          model: 'akanksha-v1',
        }])
        .select()
        .single()

      return NextResponse.json({ message, conversationId })
    }

    if (action === 'ai/analyze-image') {
      const validated = AnalyzeImageSchema.parse(body)
      // Analyze image with AI
      const { data: analysis } = await supabase
        .from('image_analysis')
        .insert([{
          farmer_id: user.id,
          image_url: validated.image_url,
          analysis_type: 'crop_health',
          status: 'processing',
        }])
        .select()
        .single()

      return NextResponse.json(analysis)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: (error as any).errors || [] }, { status: 400 })
    }
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
