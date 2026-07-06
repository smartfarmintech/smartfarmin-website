"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, X } from "lucide-react"
import { transitionBooking } from "@/lib/operator/actions"
import { BOOKING_TRANSITIONS, label } from "@/lib/operator/constants"
import { formatCurrency, formatDateTime } from "@/lib/operator/format"
import type { Booking, BookingStatusEvent, Operator } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "./status-badge"

export function BookingDetailClient({
  booking,
  timeline,
  operators,
}: {
  booking: Booking
  timeline: BookingStatusEvent[]
  operators: Operator[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [operatorId, setOperatorId] = useState("")

  const nextStates = BOOKING_TRANSITIONS[booking.booking_state] ?? []

  function run(toState: string) {
    setError(null)
    startTransition(async () => {
      const res = await transitionBooking({
        bookingId: booking.id,
        toState,
        operatorId: toState === "operator_assigned" ? operatorId || null : null,
        note: note || null,
      })
      if (res?.ok) {
        setNote("")
        router.refresh()
      } else {
        setError(res?.error ?? "Something went wrong")
      }
    })
  }

  const needsOperator = nextStates.includes("operator_assigned")

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/operator/bookings"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">{booking.machine?.name ?? "Booking"}</h1>
          <p className="text-sm text-muted-foreground">{booking.booking_number}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge value={booking.payment_status} />
          <StatusBadge value={booking.booking_state} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-card-foreground">Job details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Starts</dt>
                <dd className="font-medium text-foreground">{formatDateTime(booking.starts_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ends</dt>
                <dd className="font-medium text-foreground">{formatDateTime(booking.ends_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Units</dt>
                <dd className="font-medium text-foreground">
                  {booking.units ?? "—"} {label(booking.unit_type)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Assigned operator</dt>
                <dd className="font-medium text-foreground">{booking.operator?.full_name ?? "Unassigned"}</dd>
              </div>
              {booking.notes ? (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd className="font-medium text-foreground">{booking.notes}</dd>
                </div>
              ) : null}
              {booking.cancel_reason ? (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Cancellation reason</dt>
                  <dd className="font-medium text-destructive">{booking.cancel_reason}</dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-card-foreground">Payment</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Unit price</dt>
                <dd className="text-foreground">{formatCurrency(booking.unit_price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Operator fee</dt>
                <dd className="text-foreground">{formatCurrency(booking.operator_fee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="text-foreground">- {formatCurrency(booking.discount_amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="text-foreground">{formatCurrency(booking.tax_amount)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrency(booking.total_amount)}</dd>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>Advance paid</dt>
                <dd>{formatCurrency(booking.advance_amount)}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-card-foreground">Timeline</h2>
            {timeline.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No status changes recorded yet.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {timeline.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {e.from_state ? `${label(e.from_state)} → ` : ""}
                        {label(e.to_state)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(e.created_at)}</p>
                      {e.note ? <p className="text-xs text-muted-foreground">{e.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h2 className="text-sm font-semibold text-card-foreground">Manage status</h2>
          {nextStates.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              This booking is {label(booking.booking_state).toLowerCase()} and cannot change state.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {needsOperator && (
                <div className="space-y-1.5">
                  <Label>Assign operator</Label>
                  <Select value={operatorId} onValueChange={setOperatorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this change"
                />
              </div>

              <div className="flex flex-col gap-2">
                {nextStates.map((s) => {
                  const isNegative = ["cancelled", "rejected", "no_show"].includes(s)
                  return (
                    <Button
                      key={s}
                      variant={isNegative ? "outline" : "default"}
                      disabled={isPending || (s === "operator_assigned" && !operatorId)}
                      onClick={() => run(s)}
                      className={isNegative ? "text-destructive hover:text-destructive" : ""}
                    >
                      {isNegative ? <X className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />}
                      Mark {label(s)}
                    </Button>
                  )
                })}
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
