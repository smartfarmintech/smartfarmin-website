"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CloudUpload, Fuel, Gauge, MapPin, Pencil, Plus, Search, Tractor, Trash2 } from "lucide-react"
import { deleteMachine, upsertMachineData } from "@/lib/operator/actions"
import { MACHINE_STATUSES, label } from "@/lib/operator/constants"
import { formatNumber } from "@/lib/operator/format"
import type { Machine, MachineryCategory } from "@/lib/operator/types"
import { useSyncQueue } from "@/hooks/use-sync-queue"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "./status-badge"
import { MachineFormDialog, type MachineFormValues } from "./machine-form-dialog"

type MachineOp =
  | { kind: "upsert"; serverId?: string; data: MachineFormValues }
  | { kind: "delete"; serverId: string }

function toInput(v: MachineFormValues) {
  return {
    name: v.name,
    categoryId: v.categoryId || undefined,
    machineStatus: v.machineStatus,
    ownershipType: v.ownershipType,
    brand: v.brand,
    model: v.model,
    manufactureYear: v.manufactureYear,
    registrationNo: v.registrationNo,
    fuel: v.fuel,
    powerHp: v.powerHp,
    description: v.description,
    implementsIncluded: v.implementsIncluded,
    operatorIncluded: v.operatorIncluded,
    baseLocation: v.baseLocation,
    serviceRadiusKm: v.serviceRadiusKm,
    latitude: "",
    longitude: "",
    imageUrl: v.imageUrl,
    minBookingHours: v.minBookingHours,
  }
}

export function MachinesManager({
  initialMachines,
  categories,
}: {
  initialMachines: Machine[]
  categories: MachineryCategory[]
}) {
  const router = useRouter()
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Machine | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { pending, enqueue } = useSyncQueue<MachineOp>("rythu360:machine-ops", async (op) => {
    if (op.kind === "delete") {
      if (op.serverId.startsWith("temp-")) return { ok: true }
      const res = await deleteMachine(op.serverId)
      if (res?.ok) router.refresh()
      return res
    }
    const realId = op.serverId && !op.serverId.startsWith("temp-") ? op.serverId : undefined
    const res = await upsertMachineData(toInput(op.data), realId)
    if (res?.ok) router.refresh()
    return res
  })

  useEffect(() => {
    if (pending.length === 0) {
      setMachines(initialMachines)
      setPendingIds(new Set())
    }
  }, [initialMachines, pending.length])

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const matchesStatus = statusFilter === "all" || m.machine_status === statusFilter
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.brand ?? "").toLowerCase().includes(q) ||
        (m.model ?? "").toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [machines, search, statusFilter])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(m: Machine) {
    setEditing(m)
    setDialogOpen(true)
  }

  function handleSubmit(values: MachineFormValues) {
    const category = values.categoryId ? categoryById.get(values.categoryId) : null
    if (editing) {
      const updated: Machine = {
        ...editing,
        name: values.name,
        category_id: values.categoryId || null,
        machine_status: values.machineStatus as Machine["machine_status"],
        ownership_type: values.ownershipType as Machine["ownership_type"],
        brand: values.brand || null,
        model: values.model || null,
        manufacture_year: values.manufactureYear ? Number(values.manufactureYear) : null,
        registration_no: values.registrationNo || null,
        fuel: values.fuel as Machine["fuel"],
        power_hp: values.powerHp ? Number(values.powerHp) : null,
        description: values.description || null,
        implements_included: values.implementsIncluded
          ? values.implementsIncluded.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        operator_included: values.operatorIncluded,
        base_location: values.baseLocation || null,
        service_radius_km: values.serviceRadiusKm ? Number(values.serviceRadiusKm) : null,
        min_booking_hours: values.minBookingHours ? Number(values.minBookingHours) : null,
        image_url: values.imageUrl || null,
        category: category ? { id: category.id, name: category.name } : editing.category,
      }
      setMachines((prev) => prev.map((m) => (m.id === editing.id ? updated : m)))
      setPendingIds((prev) => new Set(prev).add(editing.id))
      enqueue({ kind: "upsert", serverId: editing.id, data: values })
    } else {
      const tempId = `temp-${crypto.randomUUID()}`
      const created: Machine = {
        id: tempId,
        owner_id: "",
        category_id: values.categoryId || null,
        name: values.name,
        slug: null,
        machine_status: values.machineStatus as Machine["machine_status"],
        ownership_type: values.ownershipType as Machine["ownership_type"],
        brand: values.brand || null,
        model: values.model || null,
        manufacture_year: values.manufactureYear ? Number(values.manufactureYear) : null,
        registration_no: values.registrationNo || null,
        fuel: values.fuel as Machine["fuel"],
        power_hp: values.powerHp ? Number(values.powerHp) : null,
        description: values.description || null,
        implements_included: values.implementsIncluded
          ? values.implementsIncluded.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        operator_included: values.operatorIncluded,
        base_location: values.baseLocation || null,
        service_radius_km: values.serviceRadiusKm ? Number(values.serviceRadiusKm) : null,
        latitude: null,
        longitude: null,
        image_url: values.imageUrl || null,
        gallery_urls: [],
        min_booking_hours: values.minBookingHours ? Number(values.minBookingHours) : null,
        rating_avg: 0,
        rating_count: 0,
        total_bookings: 0,
        status: "active",
        created_at: new Date().toISOString(),
        category: category ? { id: category.id, name: category.name } : null,
      }
      setMachines((prev) => [created, ...prev])
      setPendingIds((prev) => new Set(prev).add(tempId))
      enqueue({ kind: "upsert", data: values })
    }
  }

  function handleDelete(m: Machine) {
    setMachines((prev) => prev.filter((x) => x.id !== m.id))
    enqueue({ kind: "delete", serverId: m.id })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Machines</h1>
          <p className="text-sm text-muted-foreground">
            {machines.length} machine{machines.length === 1 ? "" : "s"}
            {pending.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent-foreground">
                <CloudUpload className="size-3.5" aria-hidden /> {pending.length} pending sync
              </span>
            )}
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" aria-hidden /> Add machine
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search machines…"
            className="pl-9"
            aria-label="Search machines"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {MACHINE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {label(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <Tractor className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {machines.length === 0 ? "No machines yet. Add your first machine." : "No machines match your filters."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.id} className="overflow-hidden p-0">
              <div className="flex items-start justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-card-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[m.brand, m.model].filter(Boolean).join(" ") || label(m.category?.name)}
                  </p>
                </div>
                <StatusBadge value={m.machine_status} />
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-border px-4 py-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Gauge className="size-3.5" aria-hidden /> {m.power_hp ? `${m.power_hp} HP` : "—"}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Fuel className="size-3.5" aria-hidden /> {label(m.fuel)}
                </span>
                <span className="flex items-center gap-1 truncate text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden /> {m.base_location || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border px-4 py-2">
                {pendingIds.has(m.id) ? (
                  <span className="inline-flex items-center gap-1 text-xs text-accent-foreground">
                    <CloudUpload className="size-3.5" aria-hidden /> Syncing
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(m.total_bookings)} bookings · ★ {m.rating_count > 0 ? m.rating_avg.toFixed(1) : "—"}
                  </span>
                )}
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(m)} aria-label={`Edit ${m.name}`}>
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(m)}
                    aria-label={`Delete ${m.name}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MachineFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
