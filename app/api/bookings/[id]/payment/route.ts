import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, payment_type, is_advance } = body // payment_type: 'full' | 'partial' | 'remaining'

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Validate amount
    if (amount <= 0 || amount > booking.total_amount) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      )
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `BKPAY_${booking.id}_${Date.now()}`,
      notes: {
        booking_id: booking.id,
        booking_number: booking.booking_number,
        is_advance,
        payment_type,
      },
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64'),
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    const razorpayOrder = await response.json()

    // Store payment request
    const { data: paymentRequest, error: paymentError } = await supabase
      .from('payment_requests')
      .insert([
        {
          user_id: user.id,
          amount,
          currency: 'INR',
          gateway: 'razorpay',
          gateway_order_id: razorpayOrder.id,
          request_status: 'initiated',
          channel: 'booking_payment',
          reference_type: 'booking',
          reference_id: id,
          metadata: {
            is_advance,
            payment_type,
          },
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json(
        { error: paymentError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      payment_request: paymentRequest,
      razorpay_order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    })
  } catch (error) {
    console.error('Booking payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()

    const { data: payments, error } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching booking payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
