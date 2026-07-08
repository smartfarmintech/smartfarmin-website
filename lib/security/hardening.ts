"use server"

import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  // Token should be bound to session and have not expired
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken)) || false
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(self), microphone=(self), camera=(self), payment=(self), usb=(), magnetometer=()",
}

/**
 * Input sanitization
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  return input
    .trim()
    .replace(/[<>"']/g, (char) => {
      const htmlEscapeMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      }
      return htmlEscapeMap[char] || char
    })
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/ // India phone numbers
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isStrong: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) errors.push("Password must be at least 8 characters")
  if (!/[A-Z]/.test(password)) errors.push("Password must contain uppercase letters")
  if (!/[a-z]/.test(password)) errors.push("Password must contain lowercase letters")
  if (!/[0-9]/.test(password)) errors.push("Password must contain numbers")
  if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain special characters")

  return {
    isStrong: errors.length === 0,
    errors,
  }
}

/**
 * Detect SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|\bEXEC\b|\bSHELL\b)/i,
    /('.*?--)/,
    /(;.*?DROP)/i,
    /(1\s*=\s*1)/,
    /(\*\s*\*\s*\*)/,
    /(xp_)/i,
    /(sp_)/i,
    /(;.*?EXEC)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Detect XSS patterns
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /on\w+\s*=/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<img[^>]*src[^>]*>/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

/**
 * Rate limiting check
 */
export async function checkRateLimit(
  identifier: string,
  action: "auth" | "api" | "search",
  limit: number = 100
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const supabase = await createClient()

  try {
    const key = `rate_limit:${action}:${identifier}`
    const now = Date.now()
    const windowSize = 60 * 1000 // 1 minute window

    // Get current count from cache/db
    const { data, error } = await supabase
      .from("rate_limit_logs")
      .select("count, created_at")
      .eq("identifier", identifier)
      .eq("action", action)
      .gt("created_at", new Date(now - windowSize).toISOString())
      .single()

    if (error && error.code !== "PGRST116") throw error

    const currentCount = data?.count || 0
    const allowed = currentCount < limit

    // Update count
    if (allowed) {
      await supabase.from("rate_limit_logs").upsert({
        identifier,
        action,
        count: currentCount + 1,
        created_at: new Date().toISOString(),
      })
    }

    return {
      allowed,
      remaining: Math.max(0, limit - currentCount - 1),
      resetTime: new Date(now + windowSize).getTime(),
    }
  } catch (err) {
    // On error, allow request but log
    console.error("Rate limit check error:", err)
    return { allowed: true, remaining: limit - 1, resetTime: Date.now() + 60000 }
  }
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  userId: string | null,
  eventType: string,
  severity: "info" | "warning" | "error" | "critical",
  details: Record<string, any>
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("security_audit_logs").insert({
      user_id: userId,
      event_type: eventType,
      severity,
      details,
      ip_address: details.ipAddress || null,
      user_agent: details.userAgent || null,
      timestamp: new Date().toISOString(),
    })

    if (error) throw error

    // Alert on critical security events
    if (severity === "critical") {
      console.error(`CRITICAL SECURITY EVENT: ${eventType}`, details)
      // In production, trigger alerting system
    }

    return { ok: true }
  } catch (err: any) {
    console.error("Failed to log security event:", err)
    return { ok: false, error: err.message }
  }
}

/**
 * Validate JWT token
 */
export async function validateJWTToken(token: string): Promise<{ valid: boolean; decoded?: any; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error) throw error

    return { valid: !!user, decoded: user }
  } catch (err: any) {
    return { valid: false, error: err.message }
  }
}

/**
 * Verify request IP for session hijacking detection
 */
export function verifyRequestIP(storedIP: string, currentIP: string): boolean {
  // Allow same IP or minor subnet variations
  const storedParts = storedIP.split(".")
  const currentParts = currentIP.split(".")

  if (storedParts.length !== 4 || currentParts.length !== 4) return false

  // First 3 octets must match
  return (
    storedParts[0] === currentParts[0] &&
    storedParts[1] === currentParts[1] &&
    storedParts[2] === currentParts[2]
  )
}

/**
 * Enforce secure cookies
 */
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

/**
 * Log authentication attempt
 */
export async function logAuthAttempt(
  email: string,
  success: boolean,
  ipAddress?: string
): Promise<{ ok: boolean; error?: string }> {
  return logSecurityEvent(
    null,
    success ? "auth_success" : "auth_failure",
    success ? "info" : "warning",
    {
      email: sanitizeInput(email),
      ipAddress,
      timestamp: new Date().toISOString(),
    }
  )
}

/**
 * Check for suspicious account activity
 */
export async function checkSuspiciousActivity(userId: string): Promise<{
  suspicious: boolean
  reasons: string[]
}> {
  const supabase = await createClient()

  try {
    const reasons: string[] = []

    // Check for multiple failed login attempts in last 30 minutes
    const { data: failedAttempts } = await supabase
      .from("security_audit_logs")
      .select("*")
      .eq("event_type", "auth_failure")
      .eq("user_id", userId)
      .gt("timestamp", new Date(Date.now() - 30 * 60 * 1000).toISOString())

    if ((failedAttempts?.length || 0) > 5) {
      reasons.push("Multiple failed login attempts")
    }

    // Check for unusual geographic location
    const { data: recentLogins } = await supabase
      .from("security_audit_logs")
      .select("*")
      .eq("event_type", "auth_success")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(2)

    if (recentLogins && recentLogins.length >= 2) {
      const timeDiff = new Date(recentLogins[0].timestamp).getTime() - new Date(recentLogins[1].timestamp).getTime()
      if (timeDiff < 3600000) {
        // Less than 1 hour apart
        if (recentLogins[0].ip_address !== recentLogins[1].ip_address) {
          reasons.push("Login from different IP address within short time")
        }
      }
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
    }
  } catch (err) {
    console.error("Error checking suspicious activity:", err)
    return { suspicious: false, reasons: [] }
  }
}
