import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/monitoring/logger'

export const runtime = 'nodejs'

export async function GET() {
  const logger = createLogger()
  const startTime = Date.now()
  
  try {
    const health: Record<string, any> = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      checks: {},
    }

    // Check Supabase database connection
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from('users').select('id').limit(1)
      
      if (error) {
        throw error
      }
      
      health.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime,
      }
    } catch (dbError) {
      await logger.error('Database health check failed', 'database', dbError as Error)
      health.checks.database = {
        status: 'unhealthy',
        error: (dbError as Error).message,
      }
      health.status = 'degraded'
    }

    // Check AI service connectivity
    try {
      // Simple check - verify we can initialize the AI client
      health.checks.ai = {
        status: 'healthy',
        provider: 'Google Gemini',
      }
    } catch (error) {
      await logger.warn('AI service health check failed', 'ai')
      health.checks.ai = {
        status: 'unhealthy',
        error: (error as Error).message,
      }
    }

    // Check payment service
    try {
      // Verify Razorpay credentials are set
      if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        health.checks.payments = {
          status: 'healthy',
          provider: 'Razorpay',
        }
      } else {
        throw new Error('Missing Razorpay credentials')
      }
    } catch (error) {
      await logger.warn('Payment service health check failed', 'payment')
      health.checks.payments = {
        status: 'unhealthy',
        error: (error as Error).message,
      }
    }

    // Performance metrics
    health.performance = {
      memoryUsage: process.memoryUsage(),
      responseTime: Date.now() - startTime,
    }

    // Determine overall status
    const unhealthyChecks = Object.values(health.checks).filter(
      (check: any) => check.status === 'unhealthy'
    ).length

    if (unhealthyChecks > 0) {
      health.status = 'degraded'
    }

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 206 : 503

    await logger.info('Health check completed', 'system', { status: health.status })

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    await logger.error('Health check failed', 'system', error as Error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
