"use client"

import { CloudOff, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { cn } from "@/lib/utils"

export function OfflineIndicator() {
  const online = useOnlineStatus()
  const [showBackOnline, setShowBackOnline] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!online) {
      setWasOffline(true)
      return
    }
    if (wasOffline) {
      setShowBackOnline(true)
      const t = setTimeout(() => setShowBackOnline(false), 3000)
      return () => clearTimeout(t)
    }
  }, [online, wasOffline])

  if (online && !showBackOnline) return null

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-medium",
        online ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent-foreground",
      )}
    >
      {online ? (
        <>
          <Wifi className="size-3.5" aria-hidden />
          Back online — your changes are syncing.
        </>
      ) : (
        <>
          <CloudOff className="size-3.5" aria-hidden />
          {"You're offline. Showing saved data; changes will sync when you reconnect."}
        </>
      )}
    </div>
  )
}
