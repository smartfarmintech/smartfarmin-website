import React from "react"
import { SWRConfiguration } from "swr"

/**
 * Local storage cache provider for offline-first SWR configuration.
 * Persists fetched data in localStorage for offline access.
 */
function createLocalStorageProvider() {
  const cache = new Map()

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("swr-cache")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([key, value]) => {
          cache.set(key, value)
        })
      } catch {
        // Ignore parsing errors
      }
    }
  }

  function persist() {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("swr-cache", JSON.stringify(Object.fromEntries(cache)))
    } catch {
      // localStorage quota exceeded - continue with in-memory cache
    }
  }

  // Return an object implementing SWR's Cache interface (keys/get/set/delete),
  // backed by an in-memory Map that is persisted to localStorage for offline use.
  return {
    keys: () => cache.keys(),
    get: (key: string) => cache.get(key),
    set: (key: string, value: unknown) => {
      cache.set(key, value)
      persist()
    },
    delete: (key: string) => {
      cache.delete(key)
      persist()
    },
  }
}

export const swrConfig: SWRConfiguration = {
  // Use local storage as cache provider for offline support
  provider: createLocalStorageProvider,

  // Revalidate on focus (even from offline)
  revalidateOnFocus: true,

  // Revalidate when connection is restored
  revalidateOnReconnect: true,

  // Retry failed requests with exponential backoff
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Deduplicate requests within this interval
  dedupingInterval: 60000, // 1 minute

  // Keep stale data while revalidating
  compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),

  // Fast refresh: show stale data first, then revalidate
  revalidateIfStale: true,

  // Consider data fresh for this duration (on-demand revalidation only)
  focusThrottleInterval: 300000, // 5 minutes

  // Suspense is opt-in per hook
  suspense: false,

  // Onload revalidation (fires when page loads/returns focus)
  revalidateOnMount: true,
}


