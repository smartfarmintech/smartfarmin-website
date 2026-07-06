"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Crosshair, MapPin, Navigation } from "lucide-react"
import { logGpsPing } from "@/lib/operator/actions"
import { formatNumber, relativeTime } from "@/lib/operator/format"
import type { GpsLocation, Machine } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "./empty-state"

export function TrackingClient({
  initialPings,
  machines,
}: {
  initialPings: GpsLocation[]
  machines: Machine[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [machineId, setMachineId] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  // Latest ping per machine for the fleet summary.
  const latestByMachine = useMemo(() => {
    const map = new Map<string, GpsLocation>()
    for (const p of initialPings) {
      if (!map.has(p.machine_id)) map.set(p.machine_id, p)
    }
    return map
  }, [initialPings])

  function shareLocation() {
    setStatus(null)
    if (!machineId) {
      setStatus("Select a machine first.")
      return
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("Geolocation is not available on this device.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        startTransition(async () => {
          const res = await logGpsPing({
            machineId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            speedKmph: pos.coords.speed != null ? pos.coords.speed * 3.6 : undefined,
          })
          if (res?.ok) {
            setStatus("Location recorded.")
            router.refresh()
          } else {
            setStatus(res?.error ?? "Could not record location.")
          }
        })
      },
      () => setStatus("Permission denied. Enable location access to share position."),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Live tracking</h1>
        <p className="text-sm text-muted-foreground">Record and review machine locations in the field.</p>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Share this device&apos;s location</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the operator&apos;s phone at the job site to log a GPS ping for a machine.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label>Machine</Label>
            <Select value={machineId} onValueChange={setMachineId}>
              <SelectTrigger>
                <SelectValue placeholder="Select machine" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={shareLocation} disabled={isPending || !machineId}>
            <Crosshair className="size-4" aria-hidden /> {isPending ? "Recording…" : "Record location"}
          </Button>
        </div>
        {status ? <p className="mt-2 text-sm text-muted-foreground">{status}</p> : null}
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Fleet positions</h2>
        {machines.length === 0 ? (
          <EmptyState icon={MapPin} title="No machines to track" description="Add machines to start tracking positions." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {machines.map((m) => {
              const ping = latestByMachine.get(m.id)
              return (
                <Card key={m.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium text-card-foreground">{m.name}</p>
                    <Navigation
                      className={ping ? "size-4 text-primary" : "size-4 text-muted-foreground"}
                      aria-hidden
                    />
                  </div>
                  {ping ? (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden />
                        {ping.latitude.toFixed(5)}, {ping.longitude.toFixed(5)}
                      </p>
                      <p>Speed: {ping.speed_kmph != null ? formatNumber(Math.round(ping.speed_kmph), "km/h") : "—"}</p>
                      <p>Updated {relativeTime(ping.recorded_at)}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">No location recorded yet.</p>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {initialPings.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Recent pings</h2>
          <Card className="divide-y divide-border p-0">
            {initialPings.slice(0, 20).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="truncate font-medium text-card-foreground">{p.machine?.name ?? "Machine"}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)} · {relativeTime(p.recorded_at)}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}
