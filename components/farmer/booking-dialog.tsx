"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBooking, checkMachineAvailability } from "@/lib/farmer/actions"
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
import { formatMachineRate, formatBookingAmount } from "@/lib/farmer/format"
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

  const [formData, setFormData] = useState({
    startsAt: "",
    endsAt: "",
    serviceAddress: "",
    notes: "",
  })

  const calculateTotalAmount = () => {
    if (!formData.startsAt || !formData.endsAt) return 0

    const start = new Date(formData.startsAt)
    const end = new Date(formData.endsAt)
    const diffMs = end.getTime() - start.getTime()

    if (diffMs <= 0) return 0

    const hours = Math.ceil(diffMs / 3600000)
    return hours * machine.hourly_rate
  }

  const handleDateChange = async (field: "startsAt" | "endsAt", value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)

    // Check availability
    if (newData.startsAt && newData.endsAt) {
      try {
        const result = await checkMachineAvailability(
          machine.id,
          newData.startsAt,
          newData.endsAt,
        )
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

    const totalAmount = calculateTotalAmount()

    try {
      const result = await createBooking({
        machineId: machine.id,
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        hourlyRate: machine.hourly_rate,
        dailyRate: machine.daily_rate,
        unitType: "hourly",
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

  const totalAmount = calculateTotalAmount()

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
          {totalAmount > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
              <div className="text-sm font-semibold">Booking Summary</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate:</span>
                <span>{formatMachineRate(machine.hourly_rate, "hr")}</span>
              </div>
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
