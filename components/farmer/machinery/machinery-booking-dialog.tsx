'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Calendar, Clock, Users, MapPin, DollarSign, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Machine {
  id: string
  name: string
  brand: string
  model: string
  category_id: string
  operator_included: boolean
  service_radius_km: number
  power_hp: number
  fuel: string
  operator?: {
    id: string
    full_name: string
    phone: string
  }
  pricing_rules?: Array<{
    id: string
    price: number
    unit: string
  }>
}

interface MachineryBookingDialogProps {
  machine: Machine
  onClose: () => void
}

export default function MachineryBookingDialog({ machine, onClose }: MachineryBookingDialogProps) {
  const [bookingType, setBookingType] = useState('day')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [units, setUnits] = useState('1')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const dailyRate = machine.pricing_rules?.find(r => r.unit === 'day')?.price || 1500
  const hourlyRate = machine.pricing_rules?.find(r => r.unit === 'hour')?.price || 200

  const getRate = () => {
    return bookingType === 'day' ? dailyRate : hourlyRate
  }

  const calculateTotal = () => {
    return parseFloat(units) * getRate()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bookingData = {
        machine_id: machine.id,
        booking_type: bookingType,
        start_date: startDate,
        end_date: bookingType === 'day' ? endDate : startDate,
        start_time: startTime,
        end_time: endTime,
        units: parseFloat(units),
        rate: getRate(),
        total_amount: calculateTotal(),
        operator_required: true,
        notes,
      }

      // API call will be implemented
      console.log('Booking data:', bookingData)

      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Booking request submitted successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to submit booking. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Machine Summary */}
        <Card className="p-4 bg-muted/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground font-medium">Power</p>
              <p className="text-lg font-bold">{machine.power_hp} HP</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Fuel</p>
              <p className="text-lg font-bold capitalize">{machine.fuel}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Service Radius</p>
              <p className="text-lg font-bold">{machine.service_radius_km} km</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Operator</p>
              <p className="text-lg font-bold">{machine.operator_included ? '✓ Yes' : 'No'}</p>
            </div>
          </div>
        </Card>

        {/* Booking Type */}
        <div>
          <Label className="font-semibold mb-3 block">Booking Type</Label>
          <Tabs value={bookingType} onValueChange={setBookingType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="day">Daily</TabsTrigger>
              <TabsTrigger value="hour">Hourly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Date & Time Selection */}
        <div className="space-y-4">
          <Label className="font-semibold">Schedule</Label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 inline mr-1" />
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {bookingType === 'day' && (
              <div>
                <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            )}

            {bookingType === 'hour' && (
              <>
                <div>
                  <Label htmlFor="start-time" className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Start Time
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="end-time" className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    End Time
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor="units" className="text-xs text-muted-foreground font-semibold">
            <Users className="w-3 h-3 inline mr-1" />
            Duration ({bookingType === 'day' ? 'Days' : 'Hours'})
          </Label>
          <Input
            id="units"
            type="number"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {/* Pricing Summary */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate per {bookingType === 'day' ? 'day' : 'hour'}</span>
              <span className="font-medium">₹{getRate()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">× {units}</span>
              <span className="font-medium">units</span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex justify-between">
              <span className="font-bold">Total Amount</span>
              <span className="text-lg font-bold text-primary">₹{calculateTotal()}</span>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="font-semibold">Special Requests (Optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requirements or notes..."
            className="w-full p-2 border rounded-lg mt-1 resize-none"
            rows={3}
          />
        </div>

        {/* Operator Info */}
        {machine.operator && (
          <Card className="p-4 bg-muted/50">
            <Label className="font-semibold block mb-2">Operator Details</Label>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {machine.operator.full_name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {machine.operator.phone}</p>
            </div>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <DollarSign className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Proceed to Payment'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
