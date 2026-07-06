"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarClock, Plus, Trash2 } from "lucide-react"
import { deleteAvailability, saveAvailability } from "@/lib/operator/actions"
import { AVAILABILITY_STATUSES, label } from "@/lib/operator/constants"
import { formatDateTime } from "@/lib/operator/format"
import type { AvailabilitySlot, Machine } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "./status-badge"

export function AvailabilityManager({
  initialSlots,
  machines,
}: {
  initialSlots: AvailabilitySlot[]
  machines: Machine[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [machineId, setMachineId] = useState("")
  const [slotStatus, setSlotStatus] = useState("blocked")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [reason, setReason] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.set("machineId", machineId)
    fd.set("slotStatus", slotStatus)
    fd.set("startsAt", startsAt)
    fd.set("endsAt", endsAt)
    fd.set("reason", reason)
    startTransition(async () => {
      const res = await saveAvailability(null, fd)
      if (res?.ok) {
        setOpen(false)
        setReason("")
        router.refresh()
      } else {
        setError(res?.error ?? Object.values(res?.fieldErrors ?? {})[0] ?? "Something went wrong")
      }
    })
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteAvailability(id)
      if (res?.ok) router.refresh()
    })
  }

  const noMachines = machines.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Availability</h1>
          <p className="text-sm text-muted-foreground">Block dates for maintenance, holidays, or personal use.</p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={noMachines}>
          <Plus className="size-4" aria-hidden /> Add slot
        </Button>
      </div>

      {noMachines && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Add a machine before setting availability.</p>
        </Card>
      )}

      {initialSlots.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <CalendarClock className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No availability slots yet.</p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-border p-0">
          {initialSlots.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">{s.machine?.name ?? "Machine"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(s.starts_at)} → {formatDateTime(s.ends_at)}
                  {s.reason ? ` · ${s.reason}` : ""}
                </p>
              </div>
              <StatusBadge value={s.slot_status} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => remove(s.id)}
                disabled={isPending}
                aria-label="Delete slot"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          ))}
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add availability slot</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={slotStatus} onValueChange={setSlotStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {label(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="a-start">Starts</Label>
                <Input
                  id="a-start"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-end">Ends</Label>
                <Input
                  id="a-end"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-reason">Reason (optional)</Label>
              <Input id="a-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !machineId}>
                Add slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
