/**
 * Bookings API endpoints
 * GET    /api/v1/bookings          - List user's bookings
 * POST   /api/v1/bookings          - Create booking
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserBookings } from '@/lib/supabase/queries-live'
import {
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  createdResponse,
} from '@/lib/api/responses'
import { getPaginationFromQuery, CommonSchemas } from '@/lib/api/validation'
import { getAuthenticatedUser, requirePermission } from '@/lib/security/api-protection'
import { Resource, Action } from '@/lib/security/rbac'
import { z } from 'zod'

// GET /api/v1/bookings - List user's bookings
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { searchParams } = new URL(request.url)
    const { limit, offset } = getPaginationFromQuery(Object.fromEntries(searchParams))

    const role = (searchParams.get('role') as 'renter' | 'owner' | 'operator') || 'renter'

    const data = await getUserBookings(user.id, role)

    if (!data) {
      return paginatedResponse([], 0, limit, offset)
    }

    return paginatedResponse(data, data.length, limit, offset)
  } catch (error) {
    console.error('Bookings GET error:', error)
    return serverErrorResponse()
  }
}

// POST /api/v1/bookings - Create booking
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { authorized } = await requirePermission(user.id, Resource.BOOKING, Action.CREATE)

    if (!authorized) {
      return unauthorizedResponse()
    }

    const schema = z.object({
      machinery_id: z.string().uuid(),
      starts_at: z.string().datetime(),
      ends_at: z.string().datetime(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
      }),
      booking_type: z.enum(['hourly', 'daily', 'monthly']),
      notes: z.string().optional(),
    })

    const body = await request.json()
    const validated = schema.parse(body)

    // Validate date range
    const startDate = new Date(validated.starts_at)
    const endDate = new Date(validated.ends_at)

    if (startDate >= endDate) {
      return validationErrorResponse({
        ends_at: ['End date must be after start date'],
      })
    }

    if (startDate < new Date()) {
      return validationErrorResponse({
        starts_at: ['Start date must be in the future'],
      })
    }

    const supabase = await createClient()

    // Check machinery availability
    const { data: machinery } = await supabase
      .from('machines')
      .select('id, availability_status')
      .eq('id', validated.machinery_id)
      .single()

    if (!machinery || machinery.availability_status !== 'available') {
      return validationErrorResponse({
        machinery_id: ['Machinery not available for booking'],
      })
    }

    // Create booking
    const { data, error } = await supabase.from('bookings').insert([
      {
        renter_id: user.id,
        machinery_id: validated.machinery_id,
        starts_at: validated.starts_at,
        ends_at: validated.ends_at,
        booking_location: validated.location,
        booking_type: validated.booking_type,
        notes: validated.notes,
        booking_state: 'pending',
      },
    ])

    if (error) {
      throw error
    }

    return createdResponse(data?.[0] || {})
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = [err.message]
      })
      return validationErrorResponse(errors)
    }
    console.error('Bookings POST error:', error)
    return serverErrorResponse()
  }
}
