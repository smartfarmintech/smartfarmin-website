// ======================== WALLET & FINANCIAL OPERATIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== WALLET TRANSACTIONS ===================

export async function addWalletBalance(
  userId: string,
  amount: number,
  reason: string,
  reference?: string,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount,
      transaction_type: 'credit',
      reason,
      reference_id: reference,
      created_at: new Date().toISOString(),
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function debitWalletBalance(
  userId: string,
  amount: number,
  reason: string,
  reference?: string,
): Promise<ActionState> {
  const supabase = await createClient()

  // Check balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (!wallet || wallet.balance < amount) {
    return { ok: false, error: 'Insufficient wallet balance' }
  }

  const { error } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount,
      transaction_type: 'debit',
      reason,
      reference_id: reference,
      created_at: new Date().toISOString(),
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== PAYMENT METHODS ===================

export async function addPaymentMethod(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const paymentMethod = {
    user_id: user.id,
    method_type: formData.get('method_type'), // card, upi, bank_transfer
    is_primary: formData.get('is_primary') === 'true',
    is_active: true,
    // Sensitive data should be stored encrypted/tokenized in production
    last_four: formData.get('last_four'),
    expiry_month: formData.get('expiry_month'),
    expiry_year: formData.get('expiry_year'),
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('payment_methods')
    .insert(paymentMethod)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removePaymentMethod(paymentMethodId: string): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('payment_methods')
    .update({ is_active: false })
    .eq('id', paymentMethodId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== TRANSACTION HISTORY ===================

export async function getWalletBalance(): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  return { ok: true, data: { balance: wallet?.balance || 0 } }
}

export async function getTransactionHistory(limit = 50, offset = 0): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { ok: true, data: transactions || [] }
}

// =================== REFUNDS & CANCELLATIONS ===================

export async function processRefund(
  transactionId: string,
  refundAmount: number,
  reason: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Create refund transaction
  const { error: refundError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      amount: refundAmount,
      transaction_type: 'refund',
      reason,
      reference_id: transactionId,
      created_at: new Date().toISOString(),
    })

  if (refundError) return { ok: false, error: refundError.message }

  // Mark original as refunded
  const { error: updateError } = await supabase
    .from('wallet_transactions')
    .update({ is_refunded: true })
    .eq('id', transactionId)

  if (updateError) return { ok: false, error: updateError.message }

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Refund Processed',
      message: `₹${refundAmount} refund has been credited to your wallet`,
      notification_type: 'refund_processed',
      is_read: false,
    })

  return { ok: true }
}

// =================== BILLING & INVOICES ===================

export async function generateInvoice(
  bookingId: string,
): Promise<ActionState> {
  const supabase = await createClient()

  // Get booking details
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (!booking) return { ok: false, error: 'Booking not found' }

  // Create invoice record
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      booking_id: bookingId,
      user_id: booking.user_id,
      amount: booking.total_amount,
      tax: booking.total_amount * 0.18, // 18% GST
      total: booking.total_amount * 1.18,
      invoice_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { invoiceId: invoice.id } }
}

// =================== SUBSCRIPTION & RECURRING PAYMENTS ===================

export async function setupRecurringPayment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const recurring = {
    user_id: user.id,
    amount: parseFloat(formData.get('amount') as string),
    frequency: formData.get('frequency'), // daily, weekly, monthly
    next_charge_date: formData.get('next_charge_date'),
    status: 'active',
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('recurring_payments')
    .insert(recurring)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== CASHBACK & REWARDS ===================

export async function addRewardPoints(
  userId: string,
  points: number,
  reason: string,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('reward_points')
    .insert({
      user_id: userId,
      points,
      reason,
      earned_at: new Date().toISOString(),
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function redeemRewardPoints(
  points: number,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // 1 point = ₹1
  const redemptionAmount = points

  const { error } = await supabase
    .from('reward_redemptions')
    .insert({
      user_id: user.id,
      points,
      amount: redemptionAmount,
      redeemed_at: new Date().toISOString(),
    })

  if (error) return { ok: false, error: error.message }

  // Add to wallet
  await supabase
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      amount: redemptionAmount,
      transaction_type: 'reward_redemption',
      reason: `${points} reward points redeemed`,
      created_at: new Date().toISOString(),
    })

  return { ok: true }
}
