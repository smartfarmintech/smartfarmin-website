"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CloudUpload, Pencil, Plus, Search, Sprout, Trash2 } from "lucide-react"
import { deleteCropCycle, upsertCropData } from "@/lib/farmer/actions"
import { CROP_CYCLE_STATUSES, label } from "@/lib/farmer/constants"
import { formatDate } from "@/lib/farmer/format"
import type { CropCycle, Land } from "@/lib/farmer/types"
import { useSyncQueue } from "@/hooks/use-sync-queue"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CropStatusBadge } from "./crop-status-badge"
import { CropFormDialog, type CropFormValues } from "./crop-form-dialog"

type CropOp =
  | { kind: "upsert"; serverId?: string; data: CropFormValues }
  | { kind: "delete"; serverId: string }

export function CropsManager({
  initialCrops,
  lands,
}: {
  initialCrops: CropCycle[]
  lands: Land[]
}) {
  const router = useRouter()
  const [crops, setCrops] = useState<CropCycle[]>(initialCrops)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CropCycle | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { pending, enqueue } = useSyncQueue<CropOp>("rythu360:crop-ops", async (op) => {
    if (op.kind === "delete") {
      if (op.serverId.startsWith("temp-")) return { ok: true }
      const res = await deleteCropCycle(op.serverId)
      if (res?.ok) router.refresh()
      return res
    }
    const realId = op.serverId && !op.serverId.startsWith("temp-") ? op.serverId : undefined
    const res = await upsertCropData(op.data, realId)
    if (res?.ok) router.refresh()
    return res
  })

  // Reconcile with canonical server data once there are no in-flight writes.
  useEffect(() => {
    if (pending.length === 0) {
      setCrops(initialCrops)
      setPendingIds(new Set())
    }
  }, [initialCrops, pending.length])

  const landById = useMemo(() => new Map(lands.map((l) => [l.id, l])), [lands])

  const filtered = useMemo(() => {
    return crops.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter
      const matchesSearch =
        !search.trim() ||
        c.crop_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.variety ?? "").toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [crops, search, statusFilter])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(crop: CropCycle) {
    setEditing(crop)
    setDialogOpen(true)
  }

  function handleSubmit(values: CropFormValues) {
    const land = landById.get(values.landId)
    if (editing) {
      const updated: CropCycle = {
        ...editing,
        land_id: values.landId,
        crop_name: values.cropName,
        variety: values.variety || null,
        season: values.season as CropCycle["season"],
        status: values.status as CropCycle["status"],
        sowing_date: values.sowingDate || null,
        expected_harvest_date: values.expectedHarvestDate || null,
        actual_harvest_date: values.actualHarvestDate || null,
        area_value: values.areaValue ? Number(values.areaValue) : null,
        area_unit: values.areaUnit as CropCycle["area_unit"],
        expected_yield: values.expectedYield ? Number(values.expectedYield) : null,
        yield_unit: values.yieldUnit || null,
        seed_source: values.seedSource || null,
        land: land ? { id: land.id, land_name: land.land_name } : editing.land,
      }
      setCrops((prev) => prev.map((c) => (c.id === editing.id ? updated : c)))
      setPendingIds((prev) => new Set(prev).add(editing.id))
      enqueue({ kind: "upsert", serverId: editing.id, data: values })
    } else {
      const tempId = `temp-${crypto.randomUUID()}`
      const created: CropCycle = {
        id: tempId,
        land_id: values.landId,
        farmer_id: "",
        crop_name: values.cropName,
        variety: values.variety || null,
        season: values.season as CropCycle["season"],
        status: values.status as CropCycle["status"],
        sowing_date: values.sowingDate || null,
        expected_harvest_date: values.expectedHarvestDate || null,
        actual_harvest_date: values.actualHarvestDate || null,
        area_value: values.areaValue ? Number(values.areaValue) : null,
        area_unit: values.areaUnit as CropCycle["area_unit"],
        expected_yield: values.expectedYield ? Number(values.expectedYield) : null,
        actual_yield: null,
        yield_unit: values.yieldUnit || null,
        seed_source: values.seedSource || null,
        created_at: new Date().toISOString(),
        land: land ? { id: land.id, land_name: land.land_name } : null,
      }
      setCrops((prev) => [created, ...prev])
      setPendingIds((prev) => new Set(prev).add(tempId))
      enqueue({ kind: "upsert", data: values })
    }
  }

  function handleDelete(crop: CropCycle) {
    setCrops((prev) => prev.filter((c) => c.id !== crop.id))
    enqueue({ kind: "delete", serverId: crop.id })
  }

  const noLands = lands.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">My crops</h1>
          <p className="text-sm text-muted-foreground">
            {crops.length} crop cycle{crops.length === 1 ? "" : "s"}
            {pending.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent-foreground">
                <CloudUpload className="size-3.5" aria-hidden /> {pending.length} pending sync
              </span>
            )}
          </p>
        </div>
        <Button onClick={openAdd} disabled={noLands}>
          <Plus className="size-4" aria-hidden /> Add crop
        </Button>
      </div>

      {noLands && (
        <Card className="[--card-spacing:--spacing(4)]">
          <div className="px-(--card-spacing) text-sm text-muted-foreground">
            You need at least one land parcel before adding crops. Add land from the{" "}
            <a href="/farmer/profile" className="font-medium text-primary hover:underline">
              Profile
            </a>{" "}
            page.
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops…"
            className="pl-9"
            aria-label="Search crops"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {CROP_CYCLE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {label(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="[--card-spacing:--spacing(6)]">
          <div className="flex flex-col items-center gap-2 px-(--card-spacing) py-8 text-center">
            <Sprout className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {crops.length === 0 ? "No crops yet. Add your first crop cycle." : "No crops match your filters."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((crop) => (
            <Card key={crop.id} className="[--card-spacing:--spacing(4)]">
              <div className="flex flex-col gap-3 px-(--card-spacing)">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{crop.crop_name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {crop.variety ? `${crop.variety} · ` : ""}
                      {crop.land?.land_name || "Unassigned"}
                    </p>
                  </div>
                  <CropStatusBadge status={crop.status} />
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Season</dt>
                    <dd className="font-medium">{label(crop.season)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Sowing</dt>
                    <dd className="font-medium">{formatDate(crop.sowing_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Harvest</dt>
                    <dd className="font-medium">{formatDate(crop.expected_harvest_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Area</dt>
                    <dd className="font-medium">
                      {crop.area_value ? `${crop.area_value} ${label(crop.area_unit)}` : "—"}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  {pendingIds.has(crop.id) ? (
                    <span className="inline-flex items-center gap-1 text-xs text-accent-foreground">
                      <CloudUpload className="size-3.5" aria-hidden /> Syncing
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Added {formatDate(crop.created_at)}</span>
                  )}
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(crop)} aria-label={`Edit ${crop.crop_name}`}>
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(crop)}
                      aria-label={`Delete ${crop.crop_name}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CropFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lands={lands}
        editing={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
