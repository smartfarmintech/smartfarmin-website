/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // HTML entities escaping for basic XSS prevention
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(trimmed) ? trimmed : null
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhoneNumber(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length === 10 ? cleaned : null
}

/**
 * Rate limiting check
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (record.count < limit) {
    record.count++
    return true
  }

  return false
}

/**
 * Sanitize filename for file uploads
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 255)
}

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number, maxSizeMB: number = 10): boolean {
  return fileSize <= maxSizeMB * 1024 * 1024
}

/**
 * Validate file type
 */
export function validateFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * Hash sensitive data for audit logs
 */
export function hashSensitiveData(data: string): string {
  // For production, use a proper hashing library
  // This is just a placeholder
  return Buffer.from(data).toString("base64").slice(0, 16)
}

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return data
  const masked = "*".repeat(data.length - visibleChars)
  return masked + data.slice(-visibleChars)
}

/**
 * Validate geographic coordinates
 */
export function validateCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

/**
 * Check for SQL injection patterns
 */
export function checkSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
    /(-{2}|\/\*|\*\/)/,
    /(;|\|{2}|&&)/,
  ]
  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Encrypt sensitive fields (placeholder - use proper encryption in production)
 */
export function encryptSensitiveField(value: string, key: string): string {
  // Placeholder implementation
  // In production, use a proper encryption library like crypto-js or libsodium
  return Buffer.from(value).toString("base64")
}

/**
 * Decrypt sensitive fields (placeholder - use proper decryption in production)
 */
export function decryptSensitiveField(encrypted: string, key: string): string {
  // Placeholder implementation
  return Buffer.from(encrypted, "base64").toString("utf-8")
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length]
  }
  return token
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  ipAddress?: string
  timestamp: Date
  status: "success" | "failure"
}

/**
 * Create audit log entry (implement persistence as needed)
 */
export function createAuditLog(entry: AuditLogEntry): void {
  console.log("[AUDIT]", JSON.stringify(entry))
  // In production, save to database or audit log service
}

/**
 * Validate API key format
 */
export function validateAPIKey(key: string): boolean {
  return /^[A-Za-z0-9_-]{32,}$/.test(key)
}

/**
 * Validate JWT token expiration
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}
