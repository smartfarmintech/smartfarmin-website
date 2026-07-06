"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBooking, checkAvailability } from "@/lib/farmer/actions"
import type { MachineDetail } from "@/lib/farmer/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatMachineRate, formatBookingAmount, pricingUnitLabel } from "@/lib/farmer/format"
import { AlertCircle, Loader2 } from "lucide-react"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  machine: MachineDetail
}

export function BookingDialog({ open, onOpenChange, machine }: BookingDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [available, setAvailable] = useState(true)

  // Primary pricing rule (rules are ordered by priority ascending)
  const rule = machine.pricing_rules[0] ?? null

  const [formData, setFormData] = useState({
    startsAt: "",
    endsAt: "",
    quantity: "1",
    serviceAddress: "",
    notes: "",
  })

  /** Derive billable units for the selected pricing rule and date range */
  const calculateUnits = (): number => {
    if (!rule) return 0
    if (rule.unit === "flat") return 1
    if (rule.unit === "per_acre" || rule.unit === "per_km") {
      return Math.max(Number(formData.quantity) || 0, rule.min_units ?? 0)
    }
    // Time-based units
    if (!formData.startsAt || !formData.endsAt) return 0
    const diffMs = new Date(formData.endsAt).getTime() - new Date(formData.startsAt).getTime()
    if (diffMs <= 0) return 0
    const units = rule.unit === "per_day" ? Math.ceil(diffMs / 86400000) : Math.ceil(diffMs / 3600000)
    return Math.max(units, rule.min_units ?? 0)
  }

  const units = calculateUnits()
  const operatorFee = machine.operator_included ? (rule?.operator_fee ?? 0) : 0
  const subtotal = rule ? units * rule.price + operatorFee : 0
  const totalAmount = subtotal

  const needsQuantity = rule?.unit === "per_acre" || rule?.unit === "per_km"

  const handleDateChange = async (field: "startsAt" | "endsAt", value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)

    // Check availability
    if (newData.startsAt && newData.endsAt) {
      try {
        const result = await checkAvailability(machine.machine_id, newData.startsAt, newData.endsAt)
        setAvailable(result)
      } catch (err) {
        setError("Failed to check availability")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!rule) {
      setError("This machine has no active pricing available")
      setLoading(false)
      return
    }

    if (!formData.startsAt || !formData.endsAt) {
      setError("Please select start and end dates")
      setLoading(false)
      return
    }

    if (!available) {
      setError("This machine is not available for the selected time period")
      setLoading(false)
      return
    }

    if (units <= 0) {
      setError("Please enter a valid duration or quantity")
      setLoading(false)
      return
    }

    try {
      const result = await createBooking({
        machineId: machine.machine_id,
        ownerId: machine.owner_id,
        pricingRuleId: rule.id,
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        units,
        unitType: rule.unit,
        unitPrice: rule.price,
        operatorFee,
        totalAmount,
        serviceAddress: formData.serviceAddress,
        notes: formData.notes,
      })

      if (result.ok && result.bookingId) {
        onOpenChange(false)
        router.push(`/farmer/bookings/${result.bookingId}`)
      } else {
        setError(result.error || "Failed to create booking")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {machine.name}</DialogTitle>
          <DialogDescription>
            Enter your booking details and we'll send a request to the machine owner
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="starts_at">Start Date & Time</Label>
            <Input
              id="starts_at"
              type="datetime-local"
              value={formData.startsAt}
              onChange={(e) => handleDateChange("startsAt", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ends_at">End Date & Time</Label>
            <Input
              id="ends_at"
              type="datetime-local"
              value={formData.endsAt}
              onChange={(e) => handleDateChange("endsAt", e.target.value)}
              required
            />
          </div>

          {/* Quantity (for per-acre / per-km rules) */}
          {needsQuantity && (
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity ({rule?.unit === "per_acre" ? "acres" : "km"})
              </Label>
              <Input
                id="quantity"
                type="number"
                min={rule?.min_units ?? 1}
                step="0.5"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          )}

          {/* Availability Status */}
          {formData.startsAt && formData.endsAt && (
            <div
              className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                available
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{available ? "✓ Machine is available" : "✗ Machine is not available"}</span>
            </div>
          )}

          {/* Service Address */}
          <div className="space-y-2">
            <Label htmlFor="service_address">Service Address</Label>
            <Textarea
              id="service_address"
              placeholder="Where will the machine be used?"
              value={formData.serviceAddress}
              onChange={(e) => setFormData({ ...formData, serviceAddress: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or questions?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Pricing Summary */}
          {rule && totalAmount > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
              <div className="text-sm font-semibold">Booking Summary</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate:</span>
                <span>{formatMachineRate(rule.price, rule.unit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Units:</span>
                <span>
                  {units} {pricingUnitLabel(rule.unit)}
                </span>
              </div>
              {operatorFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Operator fee:</span>
                  <span>{formatBookingAmount(operatorFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="font-semibold">Estimated Total:</span>
                <span className="font-semibold">{formatBookingAmount(totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !available}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Request Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
