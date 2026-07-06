// ======================== RAZORPAY WEBHOOK HANDLER ========================

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    hmac.update(JSON.stringify(body))
    const expectedSignature = hmac.digest('hex')

    if (expectedSignature !== signature) {
      console.error('[v0] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = await createClient()
    const event = body.event
    const data = body.payload

    console.log(`[v0] Processing webhook event: ${event}`)

    // Process different webhook events
    switch (event) {
      case 'payment.authorized': {
        await handlePaymentAuthorized(supabase, data)
        break
      }

      case 'payment.failed': {
        await handlePaymentFailed(supabase, data)
        break
      }

      case 'payment.captured': {
        await handlePaymentCaptured(supabase, data)
        break
      }

      case 'refund.created': {
        await handleRefundCreated(supabase, data)
        break
      }

      case 'refund.failed': {
        await handleRefundFailed(supabase, data)
        break
      }

      case 'order.paid': {
        await handleOrderPaid(supabase, data)
        break
      }

      case 'subscription.charged': {
        await handleSubscriptionCharged(supabase, data)
        break
      }

      case 'invoice.paid': {
        await handleInvoicePaid(supabase, data)
        break
      }

      default:
        console.log(`[v0] Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    )
  }
}

async function handlePaymentAuthorized(supabase: any, data: any) {
  const payment = data.payment.entity

  await supabase
    .from('payment_intents')
    .update({
      status: 'authorized',
      razorpay_payment_id: payment.id,
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_order_id', payment.order_id)
}

async function handlePaymentFailed(supabase: any, data: any) {
  const payment = data.payment.entity

  const { data: paymentIntent } = await supabase
    .from('payment_intents')
    .select('user_id, order_id')
    .eq('razorpay_order_id', payment.order_id)
    .single()

  if (paymentIntent) {
    await supabase
      .from('payment_intents')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', payment.order_id)

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: paymentIntent.user_id,
        title: 'Payment Failed',
        message: `Payment for order ${paymentIntent.order_id} has failed. Please try again.`,
        notification_type: 'payment_failed',
        is_read: false,
      })
  }
}

async function handlePaymentCaptured(supabase: any, data: any) {
  const payment = data.payment.entity

  await supabase
    .from('payment_intents')
    .update({
      status: 'captured',
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_payment_id', payment.id)
}

async function handleRefundCreated(supabase: any, data: any) {
  const refund = data.refund.entity

  // Update refund status in database
  const { data: refundRequest } = await supabase
    .from('refund_requests')
    .select('user_id')
    .eq('razorpay_refund_id', refund.id)
    .single()

  if (refundRequest) {
    await supabase
      .from('refund_requests')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_refund_id', refund.id)

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: refundRequest.user_id,
        title: 'Refund Initiated',
        message: `Your refund of ₹${refund.amount / 100} has been initiated. It may take 3-5 business days to appear in your account.`,
        notification_type: 'refund_initiated',
        is_read: false,
      })
  }
}

async function handleRefundFailed(supabase: any, data: any) {
  const refund = data.refund.entity

  const { data: refundRequest } = await supabase
    .from('refund_requests')
    .select('user_id')
    .eq('razorpay_refund_id', refund.id)
    .single()

  if (refundRequest) {
    await supabase
      .from('refund_requests')
      .update({
        status: 'failed',
        failure_reason: refund.reason || 'Refund processing failed',
      })
      .eq('razorpay_refund_id', refund.id)

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: refundRequest.user_id,
        title: 'Refund Failed',
        message: 'Your refund could not be processed. Please contact support.',
        notification_type: 'refund_failed',
        is_read: false,
      })
  }
}

async function handleOrderPaid(supabase: any, data: any) {
  const order = data.order.entity

  const { data: paymentIntent } = await supabase
    .from('payment_intents')
    .select('user_id, order_id')
    .eq('razorpay_order_id', order.id)
    .single()

  if (paymentIntent) {
    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentIntent.order_id)
      .catch(() => {
        // Fallback for bookings
        return supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
          })
          .eq('id', paymentIntent.order_id)
      })

    // Notify user
    await supabase
      .from('notifications')
      .insert({
        user_id: paymentIntent.user_id,
        title: 'Order Confirmed',
        message: `Your order ${paymentIntent.order_id} has been confirmed and is being processed.`,
        notification_type: 'order_confirmed',
        is_read: false,
      })
  }
}

async function handleSubscriptionCharged(supabase: any, data: any) {
  const subscription = data.subscription.entity
  const payment = data.payment?.entity

  if (payment) {
    // Log subscription payment
    await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.id,
        razorpay_payment_id: payment.id,
        amount: payment.amount,
        charged_at: new Date().toISOString(),
      })

    // Update wallet if needed
    const { data: recurringPayment } = await supabase
      .from('recurring_payments')
      .select('user_id')
      .eq('razorpay_subscription_id', subscription.id)
      .single()

    if (recurringPayment) {
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: recurringPayment.user_id,
          amount: payment.amount / 100,
          transaction_type: 'subscription_charge',
          reason: 'Subscription payment',
          reference_id: subscription.id,
          created_at: new Date().toISOString(),
        })
    }
  }
}

async function handleInvoicePaid(supabase: any, data: any) {
  const invoice = data.invoice.entity

  await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('razorpay_invoice_id', invoice.id)
}
