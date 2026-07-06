"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { createLand, deleteLand, type ActionState } from "@/lib/farmer/actions"
import { AREA_UNITS, LAND_OWNERSHIP_TYPES, LAND_TYPES, SOIL_TYPES, WATER_SOURCES, label } from "@/lib/farmer/constants"
import type { Land } from "@/lib/farmer/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubmitButton } from "./submit-button"

export function LandsManager({ lands }: { lands: Land[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState<ActionState, FormData>(createLand, null)
  const [areaUnit, setAreaUnit] = useState<string>("acre")
  const [ownershipType, setOwnershipType] = useState<string>("owned")
  const [landType, setLandType] = useState<string>("irrigated")
  const [soilType, setSoilType] = useState<string>("")
  const [waterSource, setWaterSource] = useState<string>("")

  useEffect(() => {
    if (state?.ok) {
      setOpen(false)
      router.refresh()
    }
  }, [state, router])

  async function handleDelete(land: Land) {
    await deleteLand(land.id)
    router.refresh()
  }

  return (
    <Card className="[--card-spacing:--spacing(5)]">
      <div className="flex flex-col gap-4 px-(--card-spacing)">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">Land parcels</h2>
            <p className="text-sm text-muted-foreground">
              {lands.length} parcel{lands.length === 1 ? "" : "s"} registered
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm"><Plus className="size-4" aria-hidden /> Add land</Button>} />
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add land parcel</DialogTitle>
                <DialogDescription>Register a parcel so you can attach crop cycles to it.</DialogDescription>
              </DialogHeader>
              <form action={formAction} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="landName">Land name</Label>
                  <Input id="landName" name="landName" placeholder="e.g. North field" required />
                  {state?.fieldErrors?.landName && (
                    <p className="text-xs text-destructive">{state.fieldErrors.landName}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="surveyNumber">Survey number</Label>
                  <Input id="surveyNumber" name="surveyNumber" placeholder="Optional" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="areaValue">Area</Label>
                    <Input id="areaValue" name="areaValue" type="number" step="0.01" min="0" required />
                    {state?.fieldErrors?.areaValue && (
                      <p className="text-xs text-destructive">{state.fieldErrors.areaValue}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label>Unit</Label>
                    <input type="hidden" name="areaUnit" value={areaUnit} />
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Ownership</Label>
                    <input type="hidden" name="ownershipType" value={ownershipType} />
                    <Select value={ownershipType} onValueChange={setOwnershipType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAND_OWNERSHIP_TYPES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {label(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Land type</Label>
                    <input type="hidden" name="landType" value={landType} />
                    <Select value={landType} onValueChange={setLandType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAND_TYPES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {label(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Soil type</Label>
                    {soilType ? <input type="hidden" name="soilType" value={soilType} /> : null}
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOIL_TYPES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {label(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Water source</Label>
                    {waterSource ? <input type="hidden" name="waterSource" value={waterSource} /> : null}
                    <Select value={waterSource} onValueChange={setWaterSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {WATER_SOURCES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {label(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" type="number" step="any" placeholder="Optional" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" type="number" step="any" placeholder="Optional" />
                  </div>
                </div>

                {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

                <DialogFooter>
                  <SubmitButton>Save parcel</SubmitButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {lands.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
            <MapPin className="size-7 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No land parcels yet. Add one to start tracking crops.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {lands.map((land) => (
              <li
                key={land.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{land.land_name || "Unnamed parcel"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {land.area_value} {label(land.area_unit)} · {label(land.land_type)} · {label(land.ownership_type)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(land)}
                  aria-label={`Delete ${land.land_name || "parcel"}`}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
