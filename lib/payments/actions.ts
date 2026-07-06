// ======================== PAYMENT SERVER ACTIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  capturePayment,
  refundPayment,
  createRazorpayCustomer,
  createRazorpayInvoice,
} from './razorpay'

// =================== INITIATE PAYMENT ===================

export async function initiatePayment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const amount = parseFloat(formData.get('amount') as string)
  const orderId = formData.get('order_id') as string
  const description = formData.get('description') as string

  // Create Razorpay order
  const razorpayResult = await createRazorpayOrder({
    amount,
    description,
    receipt: orderId,
    notes: {
      user_id: user.id,
      order_id: orderId,
    },
  })

  if (!razorpayResult.success) {
    return { ok: false, error: razorpayResult.error }
  }

  // Store payment intent in database
  const { error: dbError } = await supabase
    .from('payment_intents')
    .insert({
      user_id: user.id,
      order_id: orderId,
      razorpay_order_id: razorpayResult.order.id,
      amount,
      status: 'initiated',
      created_at: new Date().toISOString(),
    })

  if (dbError) return { ok: false, error: dbError.message }

  return {
    ok: true,
    data: {
      razorpay_order_id: razorpayResult.order.id,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
    },
  }
}

// =================== VERIFY PAYMENT ===================

export async function verifyPayment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const paymentId = formData.get('razorpay_payment_id') as string
  const orderId = formData.get('razorpay_order_id') as string
  const signature = formData.get('razorpay_signature') as string

  // Verify signature
  const isValid = verifyPaymentSignature({
    payment_id: paymentId,
    order_id: orderId,
    signature,
  })

  if (!isValid) {
    return { ok: false, error: 'Invalid payment signature' }
  }

  // Update payment intent
  const { error: updateError } = await supabase
    .from('payment_intents')
    .update({
      razorpay_payment_id: paymentId,
      status: 'verified',
    })
    .eq('razorpay_order_id', orderId)
    .eq('user_id', user.id)

  if (updateError) return { ok: false, error: updateError.message }

  // Get the payment intent to find the order ID
  const { data: paymentIntent } = await supabase
    .from('payment_intents')
    .select('order_id, amount')
    .eq('razorpay_order_id', orderId)
    .single()

  if (!paymentIntent) return { ok: false, error: 'Payment intent not found' }

  // Update order status
  const { error: orderError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_id: paymentId,
      payment_date: new Date().toISOString(),
    })
    .eq('id', paymentIntent.order_id)

  if (orderError) {
    // Try bookings table if orders table fails
    await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
      })
      .eq('id', paymentIntent.order_id)
  }

  // Add to wallet
  await supabase
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      amount: paymentIntent.amount,
      transaction_type: 'debit',
      reason: 'Payment for order',
      reference_id: paymentIntent.order_id,
      created_at: new Date().toISOString(),
    })

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Payment Successful',
      message: `Payment of ₹${paymentIntent.amount} has been processed successfully`,
      notification_type: 'payment_successful',
      is_read: false,
    })

  return { ok: true, data: { orderId: paymentIntent.order_id } }
}

// =================== REQUEST REFUND ===================

export async function requestRefund(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const paymentId = formData.get('payment_id') as string
  const reason = formData.get('reason') as string
  const amount = parseFloat(formData.get('amount') as string)

  // Process refund via Razorpay
  const refundResult = await refundPayment(paymentId, amount, {
    reason,
    user_id: user.id,
  })

  if (!refundResult.success) {
    return { ok: false, error: refundResult.error }
  }

  // Store refund request in database
  const { error: dbError } = await supabase
    .from('refund_requests')
    .insert({
      user_id: user.id,
      payment_id: paymentId,
      razorpay_refund_id: refundResult.refund.id,
      amount,
      reason,
      status: 'processed',
      created_at: new Date().toISOString(),
    })

  if (dbError) return { ok: false, error: dbError.message }

  // Add refund to wallet
  await supabase
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      amount,
      transaction_type: 'refund',
      reason: `Refund: ${reason}`,
      reference_id: paymentId,
      created_at: new Date().toISOString(),
    })

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Refund Processed',
      message: `₹${amount} has been refunded to your wallet`,
      notification_type: 'refund_processed',
      is_read: false,
    })

  return { ok: true, data: { refund_id: refundResult.refund.id } }
}

// =================== PAYMENT HISTORY ===================

export async function getPaymentHistory(limit = 50, offset = 0): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: payments } = await supabase
    .from('payment_intents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { ok: true, data: payments || [] }
}

// =================== INVOICE GENERATION ===================

export async function generateInvoice(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const amount = parseFloat(formData.get('amount') as string)
  const orderId = formData.get('order_id') as string
  const description = formData.get('description') as string

  // Get user email for invoice
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('email, phone')
    .eq('user_id', user.id)
    .single()

  if (!profile) return { ok: false, error: 'User profile not found' }

  // Create Razorpay customer if not exists
  const { data: customer } = await supabase
    .from('razorpay_customers')
    .select('customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = customer?.customer_id

  if (!customerId) {
    const customerResult = await createRazorpayCustomer({
      email: profile.email,
      contact: profile.phone,
      name: profile.email,
    })

    if (customerResult.success) {
      customerId = customerResult.customer.id
      await supabase
        .from('razorpay_customers')
        .insert({ user_id: user.id, customer_id: customerId })
    }
  }

  // Create invoice
  const invoiceResult = await createRazorpayInvoice({
    customer_id: customerId,
    amount,
    description,
    order_id: orderId,
    notes: {
      user_id: user.id,
    },
  })

  if (!invoiceResult.success) {
    return { ok: false, error: invoiceResult.error }
  }

  // Store in database
  const { error: dbError } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      razorpay_invoice_id: invoiceResult.invoice.id,
      order_id: orderId,
      amount,
      status: 'issued',
      created_at: new Date().toISOString(),
    })

  if (dbError) return { ok: false, error: dbError.message }

  return {
    ok: true,
    data: {
      invoice_id: invoiceResult.invoice.id,
      short_url: invoiceResult.invoice.short_url,
    },
  }
}

// =================== SETUP RECURRING PAYMENT ===================

export async function setupRecurringPayment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Store recurring payment setup in database
  const { error } = await supabase
    .from('recurring_payments')
    .insert({
      user_id: user.id,
      amount: parseFloat(formData.get('amount') as string),
      frequency: formData.get('frequency'),
      start_date: formData.get('start_date'),
      status: 'active',
      created_at: new Date().toISOString(),
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
