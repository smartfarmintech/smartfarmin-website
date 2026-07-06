/**
 * API request validation helpers
 */

import { z, ZodSchema } from 'zod'
import { NextRequest } from 'next/server'

export class ValidationError extends Error {
  constructor(
    public errors: Record<string, string[]>,
  ) {
    super('Validation error')
    this.name = 'ValidationError'
  }
}

/**
 * Validate request body against schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema,
): Promise<T> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    return validated as T
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      throw new ValidationError(errors)
    }
    throw error
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(query: Record<string, any>, schema: ZodSchema): T {
  try {
    const validated = schema.parse(query)
    return validated as T
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      throw new ValidationError(errors)
    }
    throw error
  }
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // Pagination
  pagination: z.object({
    limit: z.coerce.number().min(1).max(100).default(50),
    offset: z.coerce.number().min(0).default(0),
    page: z.coerce.number().min(1).optional(),
  }),

  // IDs
  uuid: z.string().uuid(),
  slug: z.string().min(1).max(100),

  // Email & Phone
  email: z.string().email(),
  phone: z.string().regex(/^[0-9+\-\s()]*$/).min(10).max(20),

  // Amounts
  amount: z.number().positive(),
  currency: z.enum(['INR', 'USD']).default('INR'),

  // Dates
  dateRange: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),

  // Status enums
  bookingStatus: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']),
}

/**
 * Validate and extract pagination from query
 */
export function getPaginationFromQuery(query: Record<string, any>) {
  try {
    const { limit, offset, page } = validateQuery(
      query,
      CommonSchemas.pagination,
    )
    const actualOffset = page ? (page - 1) * limit : offset
    return { limit, offset: actualOffset }
  } catch (error) {
    return { limit: 50, offset: 0 }
  }
}
