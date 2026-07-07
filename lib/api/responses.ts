/**
 * Standardized API response formats
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  timestamp: string
  meta?: {
    total?: number
    limit?: number
    offset?: number
    page?: number
  }
}

/**
 * Success response with data
 */
export function successResponse<T>(
  data: T,
  status = 200,
  meta?: {
    total?: number
    limit?: number
    offset?: number
    page?: number
  },
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...(meta && { meta }),
    },
    { status },
  )
}

/**
 * Paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number,
  status = 200,
): NextResponse<ApiResponse<T[]>> {
  const page = Math.floor(offset / limit) + 1
  return NextResponse.json(
    {
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
      meta: {
        total,
        limit,
        offset,
        page,
      },
    },
    { status },
  )
}

/**
 * Error response
 */
export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation error',
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: 422 },
  )
}

/**
 * Not found response
 */
export function notFoundResponse(message = 'Resource not found'): NextResponse<ApiResponse> {
  return errorResponse(message, 404)
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return errorResponse('Unauthorized', 401)
}

/**
 * Forbidden response
 */
export function forbiddenResponse(): NextResponse<ApiResponse> {
  return errorResponse('Forbidden', 403)
}

/**
 * Server error response
 */
export function serverErrorResponse(message = 'Internal server error'): NextResponse<ApiResponse> {
  return errorResponse(message, 500)
}

/**
 * Created response (201)
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201)
}

/**
 * No content response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Conflict response (409)
 */
export function conflictResponse(message = 'Resource already exists'): NextResponse<ApiResponse> {
  return errorResponse(message, 409)
}

/**
 * Rate limit response (429)
 */
export function rateLimitResponse(): NextResponse<ApiResponse> {
  return errorResponse('Too many requests', 429)
}
