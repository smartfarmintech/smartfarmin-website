"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash2, Wrench } from "lucide-react"
import { deleteMaintenance, saveMaintenance } from "@/lib/operator/actions"
import { MAINTENANCE_STATUSES, MAINTENANCE_TYPES, label } from "@/lib/operator/constants"
import { formatCurrency, formatDate } from "@/lib/operator/format"
import type { Machine, MaintenanceRecord } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

const EMPTY = {
  id: "",
  machineId: "",
  maintType: "routine",
  maintStatus: "scheduled",
  title: "",
  description: "",
  scheduledAt: "",
  cost: "",
  serviceProvider: "",
}

export function MaintenanceManager({
  initialRecords,
  machines,
}: {
  initialRecords: MaintenanceRecord[]
  machines: Machine[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY })

  function openAdd() {
    setForm({ ...EMPTY })
    setError(null)
    setOpen(true)
  }

  function openEdit(r: MaintenanceRecord) {
    setForm({
      id: r.id,
      machineId: r.machine_id,
      maintType: r.maint_type,
      maintStatus: r.maint_status,
      title: r.title,
      description: r.description ?? "",
      scheduledAt: r.scheduled_at ? r.scheduled_at.slice(0, 10) : "",
      cost: r.cost != null ? String(r.cost) : "",
      serviceProvider: r.service_provider ?? "",
    })
    setError(null)
    setOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    if (form.id) fd.set("id", form.id)
    fd.set("machineId", form.machineId)
    fd.set("maintType", form.maintType)
    fd.set("maintStatus", form.maintStatus)
    fd.set("title", form.title)
    fd.set("description", form.description)
    fd.set("scheduledAt", form.scheduledAt)
    fd.set("cost", form.cost)
    fd.set("serviceProvider", form.serviceProvider)
    startTransition(async () => {
      const res = await saveMaintenance(null, fd)
      if (res?.ok) {
        setOpen(false)
        router.refresh()
      } else {
        setError(res?.error ?? Object.values(res?.fieldErrors ?? {})[0] ?? "Something went wrong")
      }
    })
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteMaintenance(id)
      if (res?.ok) router.refresh()
    })
  }

  const machineName = (id: string) => machines.find((m) => m.id === id)?.name ?? "Machine"
  const noMachines = machines.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Maintenance</h1>
          <p className="text-sm text-muted-foreground">Track service, repairs, and inspections.</p>
        </div>
        <Button onClick={openAdd} disabled={noMachines}>
          <Plus className="size-4" aria-hidden /> Log maintenance
        </Button>
      </div>

      {noMachines && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Add a machine before logging maintenance.</p>
        </Card>
      )}

      {initialRecords.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Wrench className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No maintenance records yet.</p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-border p-0">
          {initialRecords.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-card-foreground">{r.title}</p>
                  <StatusBadge value={r.maint_type} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {r.machine?.name ?? machineName(r.machine_id)}
                  {r.scheduled_at ? ` · ${formatDate(r.scheduled_at)}` : ""}
                  {r.cost != null ? ` · ${formatCurrency(r.cost)}` : ""}
                </p>
              </div>
              <StatusBadge value={r.maint_status} />
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(r)} aria-label="Edit record">
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(r.id)}
                  disabled={isPending}
                  aria-label="Delete record"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit maintenance" : "Log maintenance"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Machine</Label>
              <Select value={form.machineId} onValueChange={(v) => setForm((f) => ({ ...f, machineId: v }))}>
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
              <Label htmlFor="m-title">Title</Label>
              <Input
                id="m-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.maintType} onValueChange={(v) => setForm((f) => ({ ...f, maintType: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {label(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.maintStatus} onValueChange={(v) => setForm((f) => ({ ...f, maintStatus: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {label(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="m-sched">Scheduled date</Label>
                <Input
                  id="m-sched"
                  type="date"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-cost">Cost (₹)</Label>
                <Input
                  id="m-cost"
                  type="number"
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-provider">Service provider</Label>
              <Input
                id="m-provider"
                value={form.serviceProvider}
                onChange={(e) => setForm((f) => ({ ...f, serviceProvider: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-desc">Description</Label>
              <Textarea
                id="m-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.machineId}>
                {form.id ? "Save changes" : "Log maintenance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
