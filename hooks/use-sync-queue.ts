"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface QueuedOp<T> {
  id: string
  payload: T
}

/**
 * A durable (localStorage-backed) queue of write operations. Ops are flushed
 * through `handler` when online; failed ops stay queued and retry on reconnect.
 * Returns the pending ops plus an `enqueue` helper.
 */
export function useSyncQueue<T>(
  storageKey: string,
  handler: (payload: T) => Promise<{ ok: boolean } | null | void>,
) {
  const [pending, setPending] = useState<QueuedOp<T>[]>([])
  const [flushing, setFlushing] = useState(false)
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  // Hydrate from storage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setPending(JSON.parse(raw) as QueuedOp<T>[])
    } catch {
      // ignore corrupt cache
    }
  }, [storageKey])

  const persist = useCallback(
    (ops: QueuedOp<T>[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(ops))
      } catch {
        // ignore quota errors
      }
    },
    [storageKey],
  )

  const flush = useCallback(async () => {
    if (flushing) return
    if (typeof navigator !== "undefined" && !navigator.onLine) return
    setFlushing(true)
    try {
      let current = [...pending]
      for (const op of [...current]) {
        try {
          const res = await handlerRef.current(op.payload)
          if (res && res.ok === false) break // validation/server error — stop, keep in queue
          current = current.filter((o) => o.id !== op.id)
          setPending(current)
          persist(current)
        } catch {
          break // network error — retry later
        }
      }
    } finally {
      setFlushing(false)
    }
  }, [flushing, pending, persist])

  const enqueue = useCallback(
    (payload: T) => {
      const op: QueuedOp<T> = { id: crypto.randomUUID(), payload }
      setPending((prev) => {
        const next = [...prev, op]
        persist(next)
        return next
      })
    },
    [persist],
  )

  // Flush whenever we come online or the queue grows.
  useEffect(() => {
    if (pending.length === 0) return
    void flush()
    const onOnline = () => void flush()
    window.addEventListener("online", onOnline)
    return () => window.removeEventListener("online", onOnline)
  }, [pending.length, flush])

  return { pending, enqueue, flush, flushing }
}
