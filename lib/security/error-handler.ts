/**
 * Comprehensive error handling for production
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export enum ErrorCode {
  // Auth errors
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Validation errors
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_FIELD = "MISSING_FIELD",
  VALIDATION_FAILED = "VALIDATION_FAILED",

  // Resource errors
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",

  // Business logic errors
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  UNAVAILABLE = "UNAVAILABLE",
  LIMIT_EXCEEDED = "LIMIT_EXCEEDED",

  // Server errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",
}

export interface APIError {
  code: ErrorCode
  message: string
  statusCode: number
  details?: Record<string, any>
}

/**
 * Create standardized API error responses
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  statusCode: number = 400,
  details?: Record<string, any>,
): APIError {
  return {
    code,
    message,
    statusCode,
    details,
  }
}

/**
 * Convert error to API response
 */
export function errorToResponse(error: APIError): Response {
  return NextResponse.json(
    {
      error: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
    { status: error.statusCode },
  )
}

/**
 * Log error to database for monitoring
 */
export async function logError(
  error: Error | APIError,
  request: NextRequest,
  userId?: string,
): Promise<void> {
  try {
    const supabase = await createClient()

    const isAPIError = "code" in error
    const errorData = {
      level: isAPIError ? "warning" : "error",
      message: error.message,
      source: "api",
      url: request.nextUrl.pathname,
      user_id: userId,
      context: {
        method: request.method,
        userAgent: request.headers.get("user-agent"),
        timestamp: new Date().toISOString(),
      },
      ...(isAPIError && { code: (error as APIError).code }),
      stack: !isAPIError ? (error as Error).stack : undefined,
    }

    await supabase.from("error_logs").insert(errorData)
  } catch (logError) {
    console.error("[v0] Failed to log error:", logError)
  }
}

/**
 * Handle unexpected errors and convert to proper responses
 */
export async function handleApiError(
  error: unknown,
  request: NextRequest,
  userId?: string,
): Promise<Response> {
  console.error("[v0] API Error:", error)

  // Log to database
  if (error instanceof Error) {
    await logError(error, request, userId)
  }

  // Handle Supabase errors
  if (error && typeof error === "object") {
    const err = error as Record<string, any>

    if (err.code === "PGRST116") {
      const apiError = createErrorResponse(
        ErrorCode.NOT_FOUND,
        "Resource not found",
        404,
      )
      return errorToResponse(apiError)
    }

    if (err.code === "23505") {
      // Unique constraint violation
      const apiError = createErrorResponse(
        ErrorCode.ALREADY_EXISTS,
        "Record already exists",
        409,
      )
      return errorToResponse(apiError)
    }

    if (err.code === "23503") {
      // Foreign key constraint violation
      const apiError = createErrorResponse(
        ErrorCode.CONFLICT,
        "Related record not found",
        409,
      )
      return errorToResponse(apiError)
    }

    if (err.message?.includes("JWT")) {
      const apiError = createErrorResponse(
        ErrorCode.SESSION_EXPIRED,
        "Session expired",
        401,
      )
      return errorToResponse(apiError)
    }
  }

  // Default error response
  const apiError = createErrorResponse(
    ErrorCode.INTERNAL_ERROR,
    "An unexpected error occurred",
    500,
  )
  return errorToResponse(apiError)
}

/**
 * Validation error helper
 */
export function validationError(
  fieldErrors: Record<string, string>,
  message: string = "Validation failed",
): Response {
  const apiError = createErrorResponse(
    ErrorCode.VALIDATION_FAILED,
    message,
    400,
    { fieldErrors },
  )
  return errorToResponse(apiError)
}

/**
 * Authorization error helper
 */
export function authorizationError(message: string = "Unauthorized"): Response {
  const apiError = createErrorResponse(
    ErrorCode.UNAUTHORIZED,
    message,
    401,
  )
  return errorToResponse(apiError)
}

/**
 * Not found error helper
 */
export function notFoundError(resource: string = "Resource"): Response {
  const apiError = createErrorResponse(
    ErrorCode.NOT_FOUND,
    `${resource} not found`,
    404,
  )
  return errorToResponse(apiError)
}

/**
 * Conflict error helper
 */
export function conflictError(message: string = "Conflict"): Response {
  const apiError = createErrorResponse(
    ErrorCode.CONFLICT,
    message,
    409,
  )
  return errorToResponse(apiError)
}
