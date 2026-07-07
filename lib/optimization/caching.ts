import { cache } from "react"

/**
 * Request-level caching for database queries
 * Automatically deduplicates identical requests within the same render
 */
export const requestCache = cache

/**
 * Manual memory cache with TTL support
 */
class CacheStore {
  private store: Map<string, { value: any; expiresAt: number }> = new Map()

  set(key: string, value: any, ttlSeconds: number = 3600): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  get(key: string): any {
    const item = this.store.get(key)
    if (!item) return null

    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }

    return item.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key)
      }
    }
  }
}

export const queryCache = new CacheStore()

/**
 * Cache key generator for consistent caching
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(":").toLowerCase()
}

/**
 * Batch request optimization - collect requests and process once
 */
export function createBatchProcessor<T, R>(
  processor: (items: T[]) => Promise<R[]>,
  batchSize: number = 50,
  delayMs: number = 10
) {
  let batch: T[] = []
  let timer: NodeJS.Timeout | null = null
  let resolveQueue: ((value: R[]) => void)[] = []

  function processBatch() {
    if (batch.length === 0) return

    const currentBatch = batch
    const currentResolvers = resolveQueue
    batch = []
    resolveQueue = []

    processor(currentBatch).then((results) => {
      currentResolvers.forEach((resolve) => resolve(results))
    })
  }

  function schedule() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(processBatch, delayMs)
  }

  return (item: T): Promise<R> => {
    batch.push(item)

    if (batch.length >= batchSize) {
      if (timer) clearTimeout(timer)
      processBatch()
    } else {
      schedule()
    }

    return new Promise((resolve) => {
      resolveQueue.push((results) => {
        const index = batch.indexOf(item)
        resolve(results[index])
      })
    })
  }
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null
  let lastPromise: Promise<any> | null = null

  return (...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (timeout) clearTimeout(timeout)

      timeout = setTimeout(() => {
        lastPromise = fn(...args)
        lastPromise.then(resolve).catch(reject)
      }, delayMs)
    })
  }
}

/**
 * Memoization for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options?: { maxSize?: number; ttl?: number }
): T {
  const cache = new Map<string, { value: any; expiresAt: number }>()
  const maxSize = options?.maxSize || 100
  const ttl = options?.ttl || 3600

  return ((...args: any[]) => {
    const key = JSON.stringify(args)

    // Check cache
    const cached = cache.get(key)
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value
    }

    // Call function
    const result = fn(...args)

    // Store in cache
    cache.set(key, {
      value: result,
      expiresAt: Date.now() + ttl * 1000,
    })

    // Limit cache size
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value as string | undefined
      if (firstKey) {
        cache.delete(firstKey)
      }
    }

    return result
  }) as T
}

/**
 * Lazy loading for components
 * Use with React.lazy and Suspense in your component
 */
export function lazyLoad(loader: () => Promise<{ default: any }>) {
  // Import React in the component that uses this
  // const LazyComponent = React.lazy(() => lazyLoad(loader))
  return loader()
}

/**
 * Connection pooling configuration
 */
export interface PoolConfig {
  min: number
  max: number
  idleTimeoutMs: number
}

export const defaultPoolConfig: PoolConfig = {
  min: 2,
  max: 10,
  idleTimeoutMs: 30000,
}

/**
 * Image optimization utilities
 */
export function getOptimizedImageUrl(url: string, width: number, quality: number = 80): string {
  // For Supabase Storage images
  if (url.includes("supabase")) {
    return `${url}?w=${width}&q=${quality}`
  }
  return url
}

/**
 * Query parameter compression (for URLs with many parameters)
 */
export function compressQueryParams(params: Record<string, any>): string {
  const compressed = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`)
    .join("&")

  return compressed
}

/**
 * Database query optimization helpers
 */
export const queryOptimizations = {
  /**
   * Use SELECT * sparingly - specify only needed columns
   */
  selectSpecificColumns: (columns: string[]) => columns.join(", "),

  /**
   * Use indexes on frequently filtered columns
   */
  suggestIndexes: (table: string, filterColumns: string[]) => {
    return filterColumns.map((col) => `CREATE INDEX idx_${table}_${col} ON ${table}(${col});`)
  },

  /**
   * Pagination for large result sets
   */
  paginationQuery: (page: number, pageSize: number) => ({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }),

  /**
   * Use aggregation in database, not application
   */
  aggregateInDatabase: true,
}


