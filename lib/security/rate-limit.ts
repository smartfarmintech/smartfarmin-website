/**
 * Rate limiting for production API endpoints
 * Uses in-memory store for now, can be replaced with Redis
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitStore.get(key)

  // Initialize or check if window has expired
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    })
    return {
      allowed: true,
      remaining: limit - 1,
      resetIn: windowSeconds,
    }
  }

  // Increment count
  entry.count++

  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Standard rate limits for different endpoint types
 */
export const RATE_LIMITS = {
  // Auth endpoints: 5 attempts per minute
  auth: {
    limit: 5,
    window: 60,
  },
  // API endpoints: 100 requests per minute
  api: {
    limit: 100,
    window: 60,
  },
  // Public endpoints: 1000 requests per hour
  public: {
    limit: 1000,
    window: 3600,
  },
  // File uploads: 10 per minute
  upload: {
    limit: 10,
    window: 60,
  },
  // Payment endpoints: 20 per minute
  payment: {
    limit: 20,
    window: 60,
  },
}

/**
 * Get identifier from request (IP, user ID, etc.)
 */
export function getIdentifier(request: Request): string {
  // Try to get from user session first
  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    return `auth:${authHeader.substring(0, 20)}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return `ip:${forwarded.split(",")[0].trim()}`
  }

  return `ip:${request.headers.get("x-real-ip") || "unknown"}`
}

/**
 * Middleware to apply rate limiting to Route Handlers
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  limitConfig = RATE_LIMITS.api,
) {
  return async (request: Request) => {
    const identifier = getIdentifier(request)
    const rateLimit = checkRateLimit(identifier, limitConfig.limit, limitConfig.window)

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: rateLimit.resetIn,
        }),
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetIn),
            "X-RateLimit-Limit": String(limitConfig.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000 + rateLimit.resetIn)),
          },
        },
      )
    }

    const response = await handler(request)

    // Add rate limit headers to response
    response.headers.set("X-RateLimit-Limit", String(limitConfig.limit))
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining))
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(Date.now() / 1000 + rateLimit.resetIn)),
    )

    return response
  }
}

/**
 * Cleanup old entries from rate limit store (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every 10 minutes
if (typeof window === "undefined") {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}
