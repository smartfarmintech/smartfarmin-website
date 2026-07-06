/**
 * Machinery API endpoints
 * GET    /api/v1/machinery          - List machinery catalog
 * POST   /api/v1/machinery          - Create machinery (admin only)
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMachineryCatalog } from '@/lib/supabase/queries-live'
import {
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/responses'
import { getPaginationFromQuery, validateQuery, CommonSchemas } from '@/lib/api/validation'
import { getAuthenticatedUser, requirePermission } from '@/lib/security/api-protection'
import { Resource, Action } from '@/lib/security/rbac'
import { z } from 'zod'

// GET /api/v1/machinery - List machinery
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { limit, offset } = getPaginationFromQuery(Object.fromEntries(searchParams))

    const filters = {
      category: searchParams.get('category') || undefined,
      searchTerm: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    }

    const { data, count } = await getMachineryCatalog(filters, limit, offset)

    return paginatedResponse(data || [], count || 0, limit, offset)
  } catch (error) {
    console.error('Machinery GET error:', error)
    return serverErrorResponse()
  }
}

// POST /api/v1/machinery - Create machinery (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { authorized } = await requirePermission(user.id, Resource.MACHINERY, Action.CREATE)

    if (!authorized) {
      return unauthorizedResponse()
    }

    const schema = z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      category_id: z.string().uuid(),
      image_url: z.string().url().optional(),
      features: z.array(z.string()).optional(),
      hourly_rate: z.number().positive(),
      daily_rate: z.number().positive(),
      monthly_rate: z.number().positive(),
    })

    const body = await request.json()
    const validated = schema.parse(body)

    const supabase = await createClient()
    const { data, error } = await supabase.from('machines').insert([
      {
        ...validated,
        created_by: user.id,
      },
    ])

    if (error) {
      throw error
    }

    return paginatedResponse(data || [], 1, 1, 0, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = [err.message]
      })
      return validationErrorResponse(errors)
    }
    console.error('Machinery POST error:', error)
    return serverErrorResponse()
  }
}
