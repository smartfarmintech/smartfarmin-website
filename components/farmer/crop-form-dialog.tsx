"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AREA_UNITS, CROP_CYCLE_STATUSES, CROP_SEASONS, label } from "@/lib/farmer/constants"
import type { CropCycle, Land } from "@/lib/farmer/types"

export interface CropFormValues {
  landId: string
  cropName: string
  variety: string
  season: string
  status: string
  sowingDate: string
  expectedHarvestDate: string
  actualHarvestDate: string
  areaValue: string
  areaUnit: string
  expectedYield: string
  yieldUnit: string
  seedSource: string
}

function emptyValues(lands: Land[]): CropFormValues {
  return {
    landId: lands[0]?.id ?? "",
    cropName: "",
    variety: "",
    season: "kharif",
    status: "planned",
    sowingDate: "",
    expectedHarvestDate: "",
    actualHarvestDate: "",
    areaValue: "",
    areaUnit: lands[0]?.area_unit ?? "acre",
    expectedYield: "",
    yieldUnit: "kg",
    seedSource: "",
  }
}

function fromCrop(c: CropCycle): CropFormValues {
  return {
    landId: c.land_id,
    cropName: c.crop_name,
    variety: c.variety ?? "",
    season: c.season,
    status: c.status,
    sowingDate: c.sowing_date ?? "",
    expectedHarvestDate: c.expected_harvest_date ?? "",
    actualHarvestDate: c.actual_harvest_date ?? "",
    areaValue: c.area_value != null ? String(c.area_value) : "",
    areaUnit: c.area_unit,
    expectedYield: c.expected_yield != null ? String(c.expected_yield) : "",
    yieldUnit: c.yield_unit ?? "kg",
    seedSource: c.seed_source ?? "",
  }
}

export function CropFormDialog({
  open,
  onOpenChange,
  lands,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lands: Land[]
  editing: CropCycle | null
  onSubmit: (values: CropFormValues) => void
}) {
  const [values, setValues] = useState<CropFormValues>(editing ? fromCrop(editing) : emptyValues(lands))
  const [error, setError] = useState<string | null>(null)

  // Re-seed the form each time the dialog opens for a different record.
  const [seedKey, setSeedKey] = useState<string>("")
  const currentKey = `${open}-${editing?.id ?? "new"}`
  if (open && currentKey !== seedKey) {
    setSeedKey(currentKey)
    setValues(editing ? fromCrop(editing) : emptyValues(lands))
    setError(null)
  }

  const set = (k: keyof CropFormValues, v: string) => setValues((prev) => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!values.landId) return setError("Please select a land parcel. Add land first if you have none.")
    if (!values.cropName.trim()) return setError("Crop name is required.")
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit crop cycle" : "Add crop cycle"}</DialogTitle>
          <DialogDescription>Track sowing, growth stage and expected harvest for a crop.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="cropName">Crop name</Label>
              <Input id="cropName" value={values.cropName} onChange={(e) => set("cropName", e.target.value)} placeholder="Paddy, Cotton…" />
            </div>
            <div>
              <Label htmlFor="variety">Variety</Label>
              <Input id="variety" value={values.variety} onChange={(e) => set("variety", e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <Label>Land parcel</Label>
              <Select value={values.landId} onValueChange={(v) => set("landId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder={lands.length ? "Select land" : "No land — add one"} />
                </SelectTrigger>
                <SelectContent>
                  {lands.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.land_name || l.survey_number || `Parcel ${l.id.slice(0, 4)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Season</Label>
              <Select value={values.season} onValueChange={(v) => set("season", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROP_SEASONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {label(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={values.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROP_CYCLE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {label(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sowingDate">Sowing date</Label>
              <Input id="sowingDate" type="date" value={values.sowingDate} onChange={(e) => set("sowingDate", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="expectedHarvestDate">Expected harvest</Label>
              <Input
                id="expectedHarvestDate"
                type="date"
                value={values.expectedHarvestDate}
                onChange={(e) => set("expectedHarvestDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="areaValue">Area</Label>
              <Input id="areaValue" type="number" step="0.01" min="0" value={values.areaValue} onChange={(e) => set("areaValue", e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <Label>Area unit</Label>
              <Select value={values.areaUnit} onValueChange={(v) => set("areaUnit", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AREA_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {label(u)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expectedYield">Expected yield</Label>
              <Input id="expectedYield" type="number" step="0.01" min="0" value={values.expectedYield} onChange={(e) => set("expectedYield", e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="seedSource">Seed source</Label>
              <Input id="seedSource" value={values.seedSource} onChange={(e) => set("seedSource", e.target.value)} placeholder="Optional" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{editing ? "Save changes" : "Add crop"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
