"use client"

import { useEffect, useState } from "react"
import type { Machine, MachineryCategory } from "@/lib/operator/types"
import {
  FUEL_TYPES,
  MACHINE_OWNERSHIP_TYPES,
  MACHINE_STATUSES,
  label,
} from "@/lib/operator/constants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MachineFormValues {
  name: string
  categoryId: string
  machineStatus: string
  ownershipType: string
  brand: string
  model: string
  manufactureYear: string
  registrationNo: string
  fuel: string
  powerHp: string
  description: string
  implementsIncluded: string
  operatorIncluded: boolean
  baseLocation: string
  serviceRadiusKm: string
  minBookingHours: string
  imageUrl: string
}

function toValues(m: Machine | null): MachineFormValues {
  return {
    name: m?.name ?? "",
    categoryId: m?.category_id ?? "",
    machineStatus: m?.machine_status ?? "draft",
    ownershipType: m?.ownership_type ?? "individual",
    brand: m?.brand ?? "",
    model: m?.model ?? "",
    manufactureYear: m?.manufacture_year ? String(m.manufacture_year) : "",
    registrationNo: m?.registration_no ?? "",
    fuel: m?.fuel ?? "diesel",
    powerHp: m?.power_hp ? String(m.power_hp) : "",
    description: m?.description ?? "",
    implementsIncluded: (m?.implements_included ?? []).join(", "),
    operatorIncluded: m?.operator_included ?? false,
    baseLocation: m?.base_location ?? "",
    serviceRadiusKm: m?.service_radius_km ? String(m.service_radius_km) : "",
    minBookingHours: m?.min_booking_hours ? String(m.min_booking_hours) : "",
    imageUrl: m?.image_url ?? "",
  }
}

export function MachineFormDialog({
  open,
  onOpenChange,
  editing,
  categories,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: Machine | null
  categories: MachineryCategory[]
  onSubmit: (values: MachineFormValues) => void
}) {
  const [values, setValues] = useState<MachineFormValues>(toValues(editing))

  useEffect(() => {
    if (open) setValues(toValues(editing))
  }, [open, editing])

  function set<K extends keyof MachineFormValues>(key: K, val: MachineFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.name.trim()) return
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit machine" : "Add machine"}</DialogTitle>
          <DialogDescription>Details renters see when browsing your equipment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="m-name">Name</Label>
            <Input
              id="m-name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. John Deere 5310 Tractor"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={values.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={values.machineStatus} onValueChange={(v) => set("machineStatus", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MACHINE_STATUSES.map((s) => (
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
              <Label htmlFor="m-brand">Brand</Label>
              <Input id="m-brand" value={values.brand} onChange={(e) => set("brand", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-model">Model</Label>
              <Input id="m-model" value={values.model} onChange={(e) => set("model", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Ownership</Label>
              <Select value={values.ownershipType} onValueChange={(v) => set("ownershipType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MACHINE_OWNERSHIP_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {label(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fuel</Label>
              <Select value={values.fuel} onValueChange={(v) => set("fuel", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {label(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="m-year">Year</Label>
              <Input
                id="m-year"
                type="number"
                value={values.manufactureYear}
                onChange={(e) => set("manufactureYear", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-hp">Power (HP)</Label>
              <Input
                id="m-hp"
                type="number"
                value={values.powerHp}
                onChange={(e) => set("powerHp", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-reg">Reg. no.</Label>
              <Input
                id="m-reg"
                value={values.registrationNo}
                onChange={(e) => set("registrationNo", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="m-loc">Base location</Label>
              <Input
                id="m-loc"
                value={values.baseLocation}
                onChange={(e) => set("baseLocation", e.target.value)}
                placeholder="Village / town"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-radius">Service radius (km)</Label>
              <Input
                id="m-radius"
                type="number"
                value={values.serviceRadiusKm}
                onChange={(e) => set("serviceRadiusKm", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-impl">Implements included</Label>
            <Input
              id="m-impl"
              value={values.implementsIncluded}
              onChange={(e) => set("implementsIncluded", e.target.value)}
              placeholder="Comma separated, e.g. Rotavator, Plough"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-desc">Description</Label>
            <Textarea
              id="m-desc"
              rows={3}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <Label htmlFor="m-op">Operator included</Label>
              <p className="text-xs text-muted-foreground">Machine comes with a trained operator.</p>
            </div>
            <Switch
              id="m-op"
              checked={values.operatorIncluded}
              onCheckedChange={(v) => set("operatorIncluded", v)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Save changes" : "Add machine"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
