// ======================== RAZORPAY PAYMENT INTEGRATION ========================

import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// =================== ORDER CREATION ===================

export interface CreateOrderParams {
  amount: number // In rupees
  currency?: string
  receipt?: string
  description?: string
  customer_notify?: 0 | 1
  notes?: Record<string, any>
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: params.currency || 'INR',
      receipt: params.receipt || `order_${Date.now()}`,
      description: params.description,
      customer_notify: params.customer_notify || 1,
      notes: params.notes || {},
    })

    return { success: true, order }
  } catch (error) {
    console.error('[v0] Razorpay order creation error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Order creation failed' }
  }
}

// =================== PAYMENT VERIFICATION ===================

export interface VerifyPaymentParams {
  payment_id: string
  order_id: string
  signature: string
}

export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  try {
    const { payment_id, order_id, signature } = params
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    hmac.update(`${order_id}|${payment_id}`)
    const generated_signature = hmac.digest('hex')
    return generated_signature === signature
  } catch (error) {
    console.error('[v0] Signature verification error:', error)
    return false
  }
}

// =================== PAYMENT CAPTURE ===================

export async function capturePayment(paymentId: string, amount: number) {
  try {
    const payment = await razorpay.payments.capture(paymentId, Math.round(amount * 100), 'INR')
    return { success: true, payment }
  } catch (error) {
    console.error('[v0] Payment capture error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Payment capture failed' }
  }
}

// =================== PAYMENT REFUNDS ===================

export async function refundPayment(
  paymentId: string,
  amount?: number,
  notes?: Record<string, any>,
) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
      notes,
    })

    return { success: true, refund }
  } catch (error) {
    console.error('[v0] Refund error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Refund failed' }
  }
}

export async function getRefundStatus(refundId: string) {
  try {
    const refund = await razorpay.refunds.fetch(refundId)
    return { success: true, refund }
  } catch (error) {
    console.error('[v0] Refund fetch error:', error)
    return { success: false, error: 'Failed to fetch refund status' }
  }
}

// =================== PAYMENT DETAILS ===================

export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return { success: true, payment }
  } catch (error) {
    console.error('[v0] Payment fetch error:', error)
    return { success: false, error: 'Failed to fetch payment details' }
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const order = await razorpay.orders.fetch(orderId)
    return { success: true, order }
  } catch (error) {
    console.error('[v0] Order fetch error:', error)
    return { success: false, error: 'Failed to fetch order details' }
  }
}

// =================== SUBSCRIPTION MANAGEMENT ===================

export interface CreateSubscriptionParams {
  plan_id: string
  customer_notify?: 0 | 1
  quantity?: number
  total_count?: number
  start_at?: number
  notes?: Record<string, any>
}

export async function createSubscription(params: CreateSubscriptionParams) {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: params.plan_id,
      customer_notify: params.customer_notify || 1,
      quantity: params.quantity,
      total_count: params.total_count,
      start_at: params.start_at,
      notes: params.notes,
    })

    return { success: true, subscription }
  } catch (error) {
    console.error('[v0] Subscription creation error:', error)
    return { success: false, error: 'Subscription creation failed' }
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId)
    return { success: true, subscription }
  } catch (error) {
    console.error('[v0] Subscription cancellation error:', error)
    return { success: false, error: 'Subscription cancellation failed' }
  }
}

// =================== CUSTOMER MANAGEMENT ===================

export interface CreateCustomerParams {
  email: string
  contact: string
  name?: string
  notes?: Record<string, any>
}

export async function createRazorpayCustomer(params: CreateCustomerParams) {
  try {
    const customer = await razorpay.customers.create({
      email: params.email,
      contact: params.contact,
      name: params.name,
      notes: params.notes,
    })

    return { success: true, customer }
  } catch (error) {
    console.error('[v0] Customer creation error:', error)
    return { success: false, error: 'Customer creation failed' }
  }
}

// =================== INVOICE MANAGEMENT ===================

export interface CreateInvoiceParams {
  order_id?: string
  customer_id?: string
  amount: number
  currency?: string
  description?: string
  notes?: Record<string, any>
  due_date?: number
}

export async function createRazorpayInvoice(params: CreateInvoiceParams) {
  try {
    const invoice = await razorpay.invoices.create({
      order_id: params.order_id,
      customer_id: params.customer_id,
      amount: Math.round(params.amount * 100),
      currency: params.currency || 'INR',
      description: params.description,
      notes: params.notes,
      due_date: params.due_date,
      sms_notify: 1,
      email_notify: 1,
    })

    return { success: true, invoice }
  } catch (error) {
    console.error('[v0] Invoice creation error:', error)
    return { success: false, error: 'Invoice creation failed' }
  }
}

export async function sendInvoiceReminder(invoiceId: string, medium: 'sms' | 'email' = 'email') {
  try {
    const response = await razorpay.invoices.notifyBy(invoiceId, medium)
    return { success: true, response }
  } catch (error) {
    console.error('[v0] Invoice reminder error:', error)
    return { success: false, error: 'Failed to send reminder' }
  }
}

// =================== SETTLEMENT & PAYOUTS ===================

export async function getSettlementDetails(settleId: string) {
  try {
    const settlement = await razorpay.settlements.fetch(settleId)
    return { success: true, settlement }
  } catch (error) {
    console.error('[v0] Settlement fetch error:', error)
    return { success: false, error: 'Failed to fetch settlement details' }
  }
}

// =================== DISPUTE HANDLING ===================

export async function getDisputeDetails(disputeId: string) {
  try {
    const dispute = await razorpay.disputes.fetch(disputeId)
    return { success: true, dispute }
  } catch (error) {
    console.error('[v0] Dispute fetch error:', error)
    return { success: false, error: 'Failed to fetch dispute details' }
  }
}

export async function submitDisputeEvidence(
  disputeId: string,
  evidence: Record<string, any>,
) {
  try {
    const response = await razorpay.disputes.createEvidence(disputeId, evidence)
    return { success: true, response }
  } catch (error) {
    console.error('[v0] Evidence submission error:', error)
    return { success: false, error: 'Failed to submit evidence' }
  }
}
