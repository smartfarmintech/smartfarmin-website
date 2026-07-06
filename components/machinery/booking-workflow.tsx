'use client'

import React, { useState } from 'react'
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Phone,
  Star,
  Loader2,
  Download,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import type { MachineDetail, BookingWithMachine } from '@/lib/farmer/types'

type BookingStep =
  | 'search'
  | 'filters'
  | 'details'
  | 'operator'
  | 'calendar'
  | 'booking'
  | 'confirmation'
  | 'payment'
  | 'tracking'
  | 'completion'
  | 'review'
  | 'invoice'
  | 'history'
  | 'notifications'
  | 'support'

interface BookingWorkflowProps {
  machines?: MachineDetail[]
  bookings?: BookingWithMachine[]
  onBookingComplete?: (booking: BookingWithMachine) => void
}

const STEPS: { value: BookingStep; label: string }[] = [
  { value: 'search', label: 'Search' },
  { value: 'filters', label: 'Filter' },
  { value: 'details', label: 'Details' },
  { value: 'operator', label: 'Operator' },
  { value: 'calendar', label: 'Availability' },
  { value: 'booking', label: 'Book' },
  { value: 'confirmation', label: 'Confirm' },
  { value: 'payment', label: 'Payment' },
  { value: 'tracking', label: 'Track' },
  { value: 'completion', label: 'Complete' },
  { value: 'review', label: 'Review' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'history', label: 'History' },
  { value: 'notifications', label: 'Alerts' },
  { value: 'support', label: 'Support' },
]

function SearchStep({
  onNext,
  searchQuery,
  setSearchQuery,
}: {
  onNext: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Find Machinery for Your Farm</h2>
        <p className="text-muted-foreground mb-6">Search for the machinery and equipment you need</p>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by machinery type, location, or owner..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onNext()}
            />
          </div>
          <Button onClick={onNext} size="lg">
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Tractor', 'Harvester', 'Sprayer', 'Drone'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSearchQuery(type)
              onNext()
            }}
            className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <p className="font-semibold">{type}</p>
            <p className="text-sm text-muted-foreground">Quick search</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function FiltersStep({
  onNext,
  filters,
  setFilters,
}: {
  onNext: () => void
  filters: any
  setFilters: (f: any) => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Filter className="h-6 w-6" />
          Refine Your Search
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-2">Machinery Type</label>
            <select
              className="w-full rounded-lg border border-border px-3 py-2"
              value={filters.type || ''}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="tractor">Tractor</option>
              <option value="harvester">Harvester</option>
              <option value="sprayer">Sprayer</option>
              <option value="drone">Drone</option>
              <option value="jcb">JCB</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Max Price (₹/hour)</label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Distance (km)</label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={filters.distance || ''}
              onChange={(e) => setFilters({ ...filters, distance: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Min Rating</label>
            <select
              className="w-full rounded-lg border border-border px-3 py-2"
              value={filters.minRating || ''}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm font-medium">Verified Operators Only</span>
            </label>
          </div>
        </div>

        <Button onClick={onNext} className="w-full mt-6">
          Apply Filters & View Results
        </Button>
      </div>
    </div>
  )
}

function DetailsStep({
  selectedMachine,
  onNext,
}: {
  selectedMachine: MachineDetail | null
  onNext: () => void
}) {
  if (!selectedMachine) {
    return <div className="text-center py-12">No machine selected</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border overflow-hidden bg-muted h-64">
          {selectedMachine.image_url ? (
            <img src={selectedMachine.image_url} alt={selectedMachine.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold">{selectedMachine.name}</h2>
            <p className="text-muted-foreground">{selectedMachine.category}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{selectedMachine.avg_rating?.toFixed(1) || 'N/A'}</span>
              <span className="text-sm text-muted-foreground">({selectedMachine.total_reviews || 0})</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hourly Rate:</span>
              <span className="font-semibold">₹{selectedMachine.hourly_rate}/hour</span>
            </div>
            {selectedMachine.daily_rate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Rate:</span>
                <span className="font-semibold">₹{selectedMachine.daily_rate}/day</span>
              </div>
            )}
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            View Operator Details
          </Button>
        </div>
      </div>

      {selectedMachine.specs && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3">Specifications</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedMachine.specs}</p>
        </div>
      )}

      {selectedMachine.description && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3">Description</h3>
          <p className="text-sm whitespace-pre-line">{selectedMachine.description}</p>
        </div>
      )}
    </div>
  )
}

function OperatorStep({
  selectedMachine,
  onNext,
}: {
  selectedMachine: MachineDetail | null
  onNext: () => void
}) {
  if (!selectedMachine) return null

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <User className="h-6 w-6" />
          Operator Information
        </h2>
        <p className="text-muted-foreground mb-6">Meet the person who will operate the machinery</p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {selectedMachine.owner_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold">{selectedMachine.owner_name || 'Not specified'}</h3>
              <p className="text-sm text-muted-foreground mb-4">Verified Operator</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91-9876543210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">
                    {selectedMachine.avg_rating?.toFixed(1) || 'N/A'} ({selectedMachine.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Available Now
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-3">Experience & Reviews</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedMachine.total_reviews || 0} bookings completed with excellent feedback
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Punctuality</span>
                <div className="flex items-center gap-1">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-yellow-400">
                      {star}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Reliability</span>
                <div className="flex items-center gap-1">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-yellow-400">
                      {star}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Check Availability Calendar
          </Button>
        </div>
      </div>
    </div>
  )
}

function CalendarStep({
  selectedDate,
  setSelectedDate,
  onNext,
}: {
  selectedDate: string
  setSelectedDate: (date: string) => void
  onNext: () => void
}) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Check Availability
        </h2>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <CheckCircle className="h-5 w-5" />
              Available Today
            </div>
            <p className="text-sm text-green-700">This machinery is available for booking today onwards</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Select Start Date</label>
            <Input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Suggested Dates</h3>
            <div className="grid gap-2 md:grid-cols-3">
              {[0, 1, 2].map((i) => {
                const date = new Date()
                date.setDate(date.getDate() + i)
                const dateStr = date.toISOString().split('T')[0]
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedDate === dateStr
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <p className="font-medium text-sm">{new Date(dateStr).toLocaleDateString('en-IN')}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3 bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-sm">Availability Calendar</h3>
            <div className="grid gap-1 grid-cols-7">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-xs font-semibold text-center text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`text-xs p-2 rounded text-center ${
                    Math.random() > 0.3 ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={onNext} disabled={!selectedDate} className="w-full" size="lg">
            Proceed to Booking
          </Button>
        </div>
      </div>
    </div>
  )
}

function BookingStep({
  selectedDate,
  formData,
  setFormData,
  onNext,
}: {
  selectedDate: string
  formData: any
  setFormData: (f: any) => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Date & Time</label>
              <Input type="datetime-local" value={formData.startTime || ''} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">End Date & Time</label>
              <Input type="datetime-local" value={formData.endTime || ''} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Service Location</label>
            <Input
              placeholder="Enter the address where machinery will be used"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Special Requirements / Notes</label>
            <Textarea
              placeholder="e.g., soil type, field conditions, any specific instructions for the operator..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Estimated Cost:</strong> ₹5,200 (8 hours × ₹650/hour)
            </p>
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Review Booking Summary
          </Button>
        </div>
      </div>
    </div>
  )
}

function ConfirmationStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Booking Summary
        </h2>

        <div className="space-y-4 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Machinery</p>
              <p className="font-semibold">Mahindra 575 DI Tractor</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Operator</p>
              <p className="font-semibold">Ramesh Yadav</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
              <p className="font-semibold">Jan 15, 2024 • 8:00 AM</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-semibold">8 hours</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-3">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>8 hours × ₹650/hour</span>
                <span className="font-semibold">₹5,200</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-semibold">₹50</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%)</span>
                <span className="font-semibold">₹468</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-lg">₹5,718</span>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}

function PaymentStep({ onNext }: { onNext: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Payment
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900">Amount to Pay: ₹5,718</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Select Payment Method</label>
            <div className="space-y-2">
              {[
                { id: 'upi', label: 'UPI / PhonePe / Google Pay', icon: '₹' },
                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                { id: 'wallet', label: 'SmartFarmin Wallet', icon: '👛' },
                { id: 'bank', label: 'Net Banking', icon: '🏦' },
              ].map((method) => (
                <label key={method.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="rounded-full"
                  />
                  <span className="text-lg">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Secure payment gateway. Your payment information is protected.
            </p>
          </div>

          <Button onClick={handlePayment} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Pay ₹5,718
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrackingStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <CheckCircle className="h-5 w-5" />
            Payment Successful
          </div>
          <p className="text-sm text-green-700">Booking Reference: BK-2024-001234</p>
        </div>

        <h3 className="font-semibold mb-4">Booking Status Timeline</h3>
        <div className="space-y-4">
          {[
            { status: 'Confirmed', time: 'Just now', icon: '✓', completed: true },
            { status: 'Operator Assigned', time: 'In 10 mins', icon: '👤', completed: false },
            { status: 'In Progress', time: 'Jan 15, 8:00 AM', icon: '▶', completed: false },
            { status: 'Completed', time: 'Jan 15, 4:00 PM', icon: '✓', completed: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  item.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.status}</p>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onNext} className="w-full mt-6" size="lg">
          Next Steps
        </Button>
      </div>
    </div>
  )
}

function ReviewStep({ onNext }: { onNext: () => void }) {
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">How was your experience?</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Rate this machinery & operator</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Write a review</label>
            <Textarea
              placeholder="Share your experience with this machinery and operator..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Recommend to other farmers</span>
            </label>
          </div>

          <Button onClick={onNext} className="w-full" size="lg" disabled={!reviewText}>
            Submit Review & Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

function InvoiceStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Download className="h-6 w-6" />
          Invoice & Receipt
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg border border-border mb-6 font-mono text-sm">
          <div className="flex justify-between mb-4 pb-4 border-b border-gray-300">
            <div>
              <p className="font-bold">SmartFarmin</p>
              <p className="text-gray-600">Bill To: Farmer Account</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Invoice #BK-2024-001234</p>
              <p className="text-gray-600">Jan 15, 2024</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-bold mb-2">Description</p>
            <div className="flex justify-between">
              <span>Machinery Rental - Mahindra 575 DI</span>
              <span>8 hrs</span>
              <span>₹5,200</span>
            </div>
          </div>

          <div className="space-y-1 border-t border-gray-300 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹5,200</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span>₹468</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹5,718</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1">
            Share Invoice
          </Button>
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          View Booking History
        </Button>
      </div>
    </div>
  )
}

function HistoryStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Your Booking History</h2>

        <div className="space-y-3">
          {[
            { id: 1, machinery: 'Mahindra 575 DI', operator: 'Ramesh Yadav', date: 'Jan 15, 2024', status: 'Completed', rating: 5 },
            { id: 2, machinery: 'John Deere Harvester', operator: 'Suresh Reddy', date: 'Jan 8, 2024', status: 'Completed', rating: 4.5 },
            { id: 3, machinery: 'Drone Sprayer', operator: 'Ravi Kumar', date: 'Dec 28, 2023', status: 'Completed', rating: 4 },
          ].map((booking) => (
            <div key={booking.id} className="p-4 rounded-lg border border-border hover:border-primary cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{booking.machinery}</p>
                  <p className="text-sm text-muted-foreground">Operator: {booking.operator}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                  <p className="text-xs">⭐ {booking.rating}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{booking.status}</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NotificationsStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Notifications & Alerts</h2>

        <div className="space-y-3">
          {[
            { type: 'success', title: 'Booking Confirmed', message: 'Your machinery booking is confirmed for Jan 15, 2024', time: '5 mins ago' },
            { type: 'info', title: 'Operator Assigned', message: 'Ramesh Yadav has been assigned as your operator', time: '2 mins ago' },
            { type: 'warning', title: 'Payment Received', message: 'Payment of ₹5,718 has been processed successfully', time: 'Just now' },
          ].map((notif, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                notif.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : notif.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
              }`}
            >
              <p className="font-semibold">{notif.title}</p>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
            </div>
          ))}
        </div>

        <Button onClick={onNext} className="w-full mt-6" size="lg">
          Next
        </Button>
      </div>
    </div>
  )
}

function SupportStep() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Support & Help
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Need Help?</p>
            <p className="text-sm text-blue-900 mb-3">We&apos;re here to assist you with any questions or issues</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                📞 Call Support: 1800-FARMING
              </Button>
              <Button variant="outline" className="w-full justify-start">
                💬 Chat with Us
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📧 Email Support
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">FAQ</h3>
            <div className="space-y-2">
              {[
                'How do I cancel a booking?',
                'What if the operator doesn&apos;t show up?',
                'How are payments processed?',
                'Can I modify my booking?',
              ].map((faq, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border hover:border-primary cursor-pointer">
                  <p className="text-sm font-medium">{faq}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>Emergency Support:</strong> Available 24/7 for urgent machinery issues
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MachineryBookingWorkflow({ machines = [], bookings = [] }: BookingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [selectedMachine, setSelectedMachine] = useState<MachineDetail | null>(machines[0] || null)
  const [selectedDate, setSelectedDate] = useState('')
  const [formData, setFormData] = useState({})

  const currentStepIndex = STEPS.findIndex((s) => s.value === currentStep)

  const handleNext = (step: BookingStep) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStepComponent = () => {
    switch (currentStep) {
      case 'search':
        return <SearchStep onNext={() => handleNext('filters')} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      case 'filters':
        return <FiltersStep onNext={() => handleNext('details')} filters={filters} setFilters={setFilters} />
      case 'details':
        return (
          <DetailsStep
            selectedMachine={selectedMachine}
            onNext={() => handleNext('operator')}
          />
        )
      case 'operator':
        return (
          <OperatorStep
            selectedMachine={selectedMachine}
            onNext={() => handleNext('calendar')}
          />
        )
      case 'calendar':
        return (
          <CalendarStep
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onNext={() => handleNext('booking')}
          />
        )
      case 'booking':
        return (
          <BookingStep
            selectedDate={selectedDate}
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext('confirmation')}
          />
        )
      case 'confirmation':
        return <ConfirmationStep onNext={() => handleNext('payment')} />
      case 'payment':
        return <PaymentStep onNext={() => handleNext('tracking')} />
      case 'tracking':
        return <TrackingStep onNext={() => handleNext('completion')} />
      case 'completion':
        return <ReviewStep onNext={() => handleNext('invoice')} />
      case 'invoice':
        return <InvoiceStep onNext={() => handleNext('history')} />
      case 'history':
        return <HistoryStep onNext={() => handleNext('notifications')} />
      case 'notifications':
        return <NotificationsStep onNext={() => handleNext('support')} />
      case 'support':
        return <SupportStep />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.value}>
              <button
                onClick={() => handleNext(step.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  idx <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.label}
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current Step Component */}
      {getStepComponent()}
    </div>
  )
}
