import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
  api: { requests: 100, window: 60000 }, // 100 requests per minute
  auth: { requests: 5, window: 300000 }, // 5 attempts per 5 minutes
  search: { requests: 30, window: 60000 }, // 30 requests per minute
}

const rateLimitStore = new Map<string, Array<{ timestamp: number }>>()

/**
 * Check rate limit
 */
export function checkRateLimit(
  identifier: string,
  type: "api" | "auth" | "search" = "api"
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = RATE_LIMITS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }

  const requests = rateLimitStore.get(key)!
  const recentRequests = requests.filter((req) => now - req.timestamp < limit.window)

  if (recentRequests.length >= limit.requests) {
    const resetTime = recentRequests[0].timestamp + limit.window
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    }
  }

  recentRequests.push({ timestamp: now })
  rateLimitStore.set(key, recentRequests)

  return {
    allowed: true,
    remaining: limit.requests - recentRequests.length,
    resetTime: now + limit.window,
  }
}

/**
 * Input validation and sanitization
 */
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .trim()
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {}
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key])
      }
    }
    return sanitized
  }

  return input
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers")
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain special characters (!@#$%^&*)")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * CSRF token generation and validation
 */
const csrfTokens = new Map<string, { token: string; timestamp: number }>()

export function generateCSRFToken(sessionId: string): string {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  csrfTokens.set(sessionId, {
    token,
    timestamp: Date.now(),
  })

  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)

  if (!stored) {
    return false
  }

  // Token expires after 1 hour
  if (Date.now() - stored.timestamp > 3600000) {
    csrfTokens.delete(sessionId)
    return false
  }

  return stored.token === token
}

/**
 * Security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  }
}

/**
 * Session security validation
 */
export async function validateSession(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  // Check IP consistency (basic security measure)
  const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
  
  // Store and validate against session IP
  // In production, implement proper IP tracking with grace periods for mobile networks

  return session
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  event: string,
  userId: string | null,
  ipAddress: string | null,
  details: Record<string, any>
) {
  const supabase = await createClient()

  try {
    await supabase.from("security_logs").insert({
      event,
      user_id: userId,
      ip_address: ipAddress,
      details,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Failed to log security event:", error)
  }
}

/**
 * Detect suspicious activity
 */
export function detectSuspiciousActivity(
  activityType: string,
  userId: string,
  metadata: Record<string, any>
): boolean {
  const suspiciousPatterns = [
    // Multiple failed login attempts
    { type: "failed_login", threshold: 5, window: 300000 }, // 5 in 5 minutes
    // Rapid API calls from different IPs
    { type: "api_spike", threshold: 50, window: 60000 }, // 50 in 1 minute
    // Unusual geolocation
    { type: "geo_anomaly", threshold: 1, window: 3600000 }, // Once per hour
  ]

  // Implement detection logic
  return false
}
