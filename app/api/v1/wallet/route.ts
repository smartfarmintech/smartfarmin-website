/**
 * Wallet API endpoints
 * GET    /api/v1/wallet            - Get wallet info
 * GET    /api/v1/wallet/transactions - Get transaction history
 * POST   /api/v1/wallet/transfer   - Transfer funds
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWalletInfo, getWalletTransactions } from '@/lib/supabase/queries-live'
import {
  successResponse,
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/responses'
import { getPaginationFromQuery, CommonSchemas } from '@/lib/api/validation'
import { getAuthenticatedUser, requirePermission } from '@/lib/security/api-protection'
import { Resource, Action } from '@/lib/security/rbac'
import { z } from 'zod'

// GET /api/v1/wallet - Get wallet info
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    const wallet = await getWalletInfo(user.id)

    if (!wallet) {
      return successResponse({
        user_id: user.id,
        balance: 0,
        available_balance: 0,
        pending_amount: 0,
        currency: 'INR',
      })
    }

    return successResponse(wallet)
  } catch (error) {
    console.error('Wallet GET error:', error)
    return serverErrorResponse()
  }
}

// GET /api/v1/wallet/transactions - Get transaction history
export async function getTransactions(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { searchParams } = new URL(request.url)
    const { limit, offset } = getPaginationFromQuery(Object.fromEntries(searchParams))

    const { data, count } = await getWalletTransactions(user.id, limit, offset)

    return paginatedResponse(data || [], count || 0, limit, offset)
  } catch (error) {
    console.error('Wallet transactions error:', error)
    return serverErrorResponse()
  }
}

// POST /api/v1/wallet/transfer - Transfer funds
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { authorized } = await requirePermission(user.id, Resource.WALLET, Action.UPDATE)

    if (!authorized) {
      return unauthorizedResponse()
    }

    const url = new URL(request.url)
    const action = url.pathname.split('/').pop()

    if (action === 'transfer') {
      return handleTransfer(request, user)
    }

    return serverErrorResponse('Invalid wallet action')
  } catch (error) {
    console.error('Wallet POST error:', error)
    return serverErrorResponse()
  }
}

async function handleTransfer(request: NextRequest, user: any) {
  const schema = z.object({
    recipient_id: z.string().uuid(),
    amount: z.number().positive().min(1),
    description: z.string().optional(),
  })

  const body = await request.json()
  const validated = schema.parse(body)

  if (validated.recipient_id === user.id) {
    return validationErrorResponse({
      recipient_id: ['Cannot transfer to yourself'],
    })
  }

  const supabase = await createClient()

  // Check wallet balance
  const wallet = await getWalletInfo(user.id)

  if (!wallet || wallet.available_balance < validated.amount) {
    return validationErrorResponse({
      amount: ['Insufficient balance'],
    })
  }

  // Check recipient exists
  const { data: recipient } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', validated.recipient_id)
    .single()

  if (!recipient) {
    return validationErrorResponse({
      recipient_id: ['Recipient not found'],
    })
  }

  // Create transfer transaction
  const { error } = await supabase.from('wallet_transactions').insert([
    {
      user_id: user.id,
      transaction_type: 'transfer_sent',
      amount: validated.amount,
      description: validated.description || 'Transfer to user',
      metadata: {
        recipient_id: validated.recipient_id,
      },
    },
    {
      user_id: validated.recipient_id,
      transaction_type: 'transfer_received',
      amount: validated.amount,
      description: `Transfer from user ${user.id}`,
      metadata: {
        sender_id: user.id,
      },
    },
  ])

  if (error) {
    throw error
  }

  return successResponse({
    message: 'Transfer successful',
    transaction: {
      from: user.id,
      to: validated.recipient_id,
      amount: validated.amount,
    },
  })
}
