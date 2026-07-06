"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Tag, Trash2 } from "lucide-react"
import { deletePricing, savePricing } from "@/lib/operator/actions"
import { PRICING_UNITS, PRICING_UNIT_SUFFIX, label } from "@/lib/operator/constants"
import { formatCurrency } from "@/lib/operator/format"
import type { Machine, PricingRule } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  name: "",
  unit: "per_hour",
  price: "",
  operatorFee: "",
  minUnits: "",
  maxUnits: "",
  priority: "0",
  fuelIncluded: false,
  isActive: true,
}

export function PricingManager({
  initialRules,
  machines,
}: {
  initialRules: PricingRule[]
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

  function openEdit(r: PricingRule) {
    setForm({
      id: r.id,
      machineId: r.machine_id,
      name: r.name ?? "",
      unit: r.unit,
      price: String(r.price),
      operatorFee: String(r.operator_fee),
      minUnits: r.min_units != null ? String(r.min_units) : "",
      maxUnits: r.max_units != null ? String(r.max_units) : "",
      priority: String(r.priority),
      fuelIncluded: r.fuel_included,
      isActive: r.is_active,
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
    fd.set("name", form.name)
    fd.set("unit", form.unit)
    fd.set("price", form.price)
    fd.set("operatorFee", form.operatorFee || "0")
    fd.set("minUnits", form.minUnits)
    fd.set("maxUnits", form.maxUnits)
    fd.set("priority", form.priority || "0")
    if (form.fuelIncluded) fd.set("fuelIncluded", "on")
    if (form.isActive) fd.set("isActive", "on")
    startTransition(async () => {
      const res = await savePricing(null, fd)
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
      const res = await deletePricing(id)
      if (res?.ok) router.refresh()
    })
  }

  const machineName = (id: string) => machines.find((m) => m.id === id)?.name ?? "Machine"
  const noMachines = machines.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Pricing</h1>
          <p className="text-sm text-muted-foreground">Set rental rates per machine and unit.</p>
        </div>
        <Button onClick={openAdd} disabled={noMachines}>
          <Plus className="size-4" aria-hidden /> Add rate
        </Button>
      </div>

      {noMachines && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Add a machine before creating pricing rules.</p>
        </Card>
      )}

      {initialRules.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Tag className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No pricing rules yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {initialRules.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-card-foreground">{r.name || label(r.unit)}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.machine?.name ?? machineName(r.machine_id)}</p>
                </div>
                <StatusBadge value={r.is_active ? "active" : "inactive"} />
              </div>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatCurrency(r.price)}{" "}
                <span className="text-sm font-normal text-muted-foreground">{PRICING_UNIT_SUFFIX[r.unit]}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {r.operator_fee > 0 && <span>+ {formatCurrency(r.operator_fee)} operator</span>}
                {r.fuel_included && <span>Fuel included</span>}
              </div>
              <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(r)} aria-label="Edit rate">
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(r.id)}
                  disabled={isPending}
                  aria-label="Delete rate"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit rate" : "Add rate"}</DialogTitle>
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
              <Label htmlFor="p-name">Label (optional)</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Peak season rate"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {label(u)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price (₹)</Label>
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="p-opfee">Operator fee (₹)</Label>
                <Input
                  id="p-opfee"
                  type="number"
                  step="0.01"
                  value={form.operatorFee}
                  onChange={(e) => setForm((f) => ({ ...f, operatorFee: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-priority">Priority</Label>
                <Input
                  id="p-priority"
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label htmlFor="p-fuel">Fuel included</Label>
              <Switch
                id="p-fuel"
                checked={form.fuelIncluded}
                onCheckedChange={(v) => setForm((f) => ({ ...f, fuelIncluded: v }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label htmlFor="p-active">Active</Label>
              <Switch
                id="p-active"
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.machineId}>
                {form.id ? "Save changes" : "Add rate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
