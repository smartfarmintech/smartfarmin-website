"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, ClipboardList, Search } from "lucide-react"
import { BOOKING_STATES, label } from "@/lib/operator/constants"
import { formatCurrency, formatDateTime } from "@/lib/operator/format"
import type { Booking } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "./status-badge"

export function BookingsManager({ initialBookings }: { initialBookings: Booking[] }) {
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("all")

  const filtered = useMemo(() => {
    return initialBookings.filter((b) => {
      const matchesState = stateFilter === "all" || b.booking_state === stateFilter
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        b.booking_number.toLowerCase().includes(q) ||
        (b.machine?.name ?? "").toLowerCase().includes(q)
      return matchesState && matchesSearch
    })
  }, [initialBookings, search, stateFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground">Review requests and manage the job lifecycle.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking no. or machine…"
            className="pl-9"
            aria-label="Search bookings"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {BOOKING_STATES.map((s) => (
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
            <ClipboardList className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {initialBookings.length === 0 ? "No bookings yet." : "No bookings match your filters."}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-border p-0">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/operator/bookings/${b.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {b.machine?.name ?? "Machine"}
                  </p>
                  <span className="text-xs text-muted-foreground">{b.booking_number}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(b.starts_at)} → {formatDateTime(b.ends_at)}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">{formatCurrency(b.total_amount)}</p>
                <StatusBadge value={b.payment_status} className="mt-0.5" />
              </div>
              <StatusBadge value={b.booking_state} />
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </Card>
      )}
    </div>
  )
}
