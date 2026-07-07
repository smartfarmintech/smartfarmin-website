import { createClient } from '@/lib/supabase/server'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'
export type LogCategory = 'api' | 'database' | 'auth' | 'ai' | 'payment' | 'system' | 'security' | 'performance'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  duration?: number
}

class Logger {
  private requestId: string

  constructor(requestId?: string) {
    this.requestId = requestId || this.generateRequestId()
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context,
      userId,
      requestId: this.requestId,
    }

    // Console output for development
    const colors = {
      debug: '\x1b[36m',    // Cyan
      info: '\x1b[32m',     // Green
      warn: '\x1b[33m',     // Yellow
      error: '\x1b[31m',    // Red
      critical: '\x1b[35m', // Magenta
    }
    
    const resetColor = '\x1b[0m'
    const color = colors[level]
    
    console.log(
      `${color}[${level.toUpperCase()}]${resetColor} ${category.toUpperCase()} - ${message}`,
      context ? JSON.stringify(context, null, 2) : ''
    )

    // Store critical logs in database
    if (level === 'error' || level === 'critical' || level === 'warn') {
      try {
        const supabase = await createClient()
        await supabase.from('system_logs').insert({
          level,
          category,
          message,
          context: context ? JSON.stringify(context) : null,
          user_id: userId,
          request_id: this.requestId,
          created_at: new Date().toISOString(),
        })
      } catch (dbError) {
        console.error('Failed to log to database:', dbError)
      }
    }
  }

  async debug(message: string, context?: Record<string, any>, userId?: string): Promise<void> {
    await this.log('debug', 'system', message, context, userId)
  }

  async info(message: string, category: LogCategory = 'system', context?: Record<string, any>, userId?: string): Promise<void> {
    await this.log('info', category, message, context, userId)
  }

  async warn(message: string, category: LogCategory = 'system', context?: Record<string, any>, userId?: string): Promise<void> {
    await this.log('warn', category, message, context, userId)
  }

  async error(message: string, category: LogCategory = 'system', error?: Error, context?: Record<string, any>, userId?: string): Promise<void> {
    await this.log('error', category, message, {
      ...context,
      errorMessage: error?.message,
      errorStack: error?.stack,
    }, userId)
  }

  async critical(message: string, category: LogCategory = 'system', error?: Error, context?: Record<string, any>, userId?: string): Promise<void> {
    await this.log('critical', category, message, {
      ...context,
      errorMessage: error?.message,
      errorStack: error?.stack,
    }, userId)
  }

  withRequestId(requestId: string): Logger {
    const logger = new Logger(requestId)
    return logger
  }
}

export const createLogger = (requestId?: string): Logger => {
  return new Logger(requestId)
}

// Performance monitoring
export class PerformanceMonitor {
  private startTime: number
  private logger: Logger

  constructor(logger: Logger) {
    this.startTime = Date.now()
    this.logger = logger
  }

  async end(operation: string, category: LogCategory = 'performance'): Promise<number> {
    const duration = Date.now() - this.startTime
    
    if (duration > 1000) {
      await this.logger.warn(
        `Slow operation detected: ${operation} took ${duration}ms`,
        category,
        { duration, operation }
      )
    } else {
      await this.logger.debug(
        `Operation completed: ${operation} in ${duration}ms`,
        { duration, operation }
      )
    }

    return duration
  }
}

export const createPerformanceMonitor = (logger: Logger): PerformanceMonitor => {
  return new PerformanceMonitor(logger)
}

// Error reporting
export class ErrorReporter {
  private logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async reportAPIError(
    endpoint: string,
    statusCode: number,
    error: Error,
    context?: Record<string, any>
  ): Promise<void> {
    await this.logger.error(
      `API Error: ${endpoint} returned ${statusCode}`,
      'api',
      error,
      { endpoint, statusCode, ...context }
    )
  }

  async reportDatabaseError(
    operation: string,
    error: Error,
    context?: Record<string, any>
  ): Promise<void> {
    await this.logger.error(
      `Database Error: ${operation}`,
      'database',
      error,
      { operation, ...context }
    )
  }

  async reportAuthError(
    reason: string,
    error?: Error,
    context?: Record<string, any>
  ): Promise<void> {
    await this.logger.error(
      `Authentication Error: ${reason}`,
      'auth',
      error,
      { reason, ...context }
    )
  }

  async reportPaymentError(
    operation: string,
    error: Error,
    context?: Record<string, any>
  ): Promise<void> {
    await this.logger.error(
      `Payment Error: ${operation}`,
      'payment',
      error,
      { operation, ...context }
    )
  }

  async reportSecurityIncident(
    incident: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    context?: Record<string, any>
  ): Promise<void> {
    const logLevel = severity === 'critical' ? 'critical' : 'warn'
    await this.logger.log(
      logLevel,
      'security',
      `Security Incident (${severity}): ${incident}`,
      { incident, severity, ...context }
    )
  }
}

export const createErrorReporter = (logger: Logger): ErrorReporter => {
  return new ErrorReporter(logger)
}

// Metrics collection
export class MetricsCollector {
  private logger: Logger
  private metrics: Map<string, number[]> = new Map()

  constructor(logger: Logger) {
    this.logger = logger
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  async flush(): Promise<void> {
    const supabase = await createClient()

    for (const [name, values] of this.metrics) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      const max = Math.max(...values)
      const min = Math.min(...values)

      try {
        await supabase.from('metrics').insert({
          name,
          avg,
          max,
          min,
          count: values.length,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        await this.logger.error('Failed to store metrics', 'system', error as Error)
      }
    }

    this.metrics.clear()
  }

  getMetrics(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const result: Record<string, { avg: number; max: number; min: number; count: number }> = {}

    for (const [name, values] of this.metrics) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          max: Math.max(...values),
          min: Math.min(...values),
          count: values.length,
        }
      }
    }

    return result
  }
}

export const createMetricsCollector = (logger: Logger): MetricsCollector => {
  return new MetricsCollector(logger)
}
