import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/monitoring/logger'

export interface APIMetrics {
  endpoint: string
  method: string
  statusCode: number
  duration: number
  userId?: string
  errorMessage?: string
  timestamp: string
  requestId: string
}

export async function trackAPICall(
  request: NextRequest,
  response: NextResponse,
  duration: number,
  userId?: string,
  error?: Error
): Promise<void> {
  const logger = createLogger()
  
  const metrics: APIMetrics = {
    endpoint: new URL(request.url).pathname,
    method: request.method,
    statusCode: response.status,
    duration,
    userId,
    timestamp: new Date().toISOString(),
    requestId: request.headers.get('x-request-id') || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }

  if (error) {
    metrics.errorMessage = error.message
  }

  try {
    const supabase = await createClient()
    await supabase.from('api_usage').insert({
      endpoint: metrics.endpoint,
      method: metrics.method,
      status_code: metrics.statusCode,
      duration_ms: metrics.duration,
      user_id: metrics.userId,
      error_message: metrics.errorMessage,
      timestamp: metrics.timestamp,
      request_id: metrics.requestId,
    })
  } catch (dbError) {
    await logger.error('Failed to track API call', 'system', dbError as Error)
  }

  // Log slow requests
  if (duration > 1000) {
    await logger.warn(
      `Slow API request: ${metrics.endpoint} took ${duration}ms`,
      'api',
      metrics,
      userId
    )
  }

  // Log errors
  if (response.status >= 400) {
    await logger.warn(
      `API error: ${metrics.endpoint} returned ${response.status}`,
      'api',
      metrics,
      userId
    )
  }
}

export function getRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id') || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function addRequestId(response: NextResponse, requestId: string): NextResponse {
  response.headers.set('x-request-id', requestId)
  return response
}
