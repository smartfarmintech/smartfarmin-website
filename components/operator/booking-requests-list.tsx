'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, MapPin, User, Phone, AlertCircle, Check, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BookingRequest {
  id: string
  booking_number: string
  farmer_name: string
  farmer_phone: string
  machine_name: string
  start_date: string
  end_date: string
  service_location: string
  total_amount: number
  units: number
  request_status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

const mockRequests: BookingRequest[] = [
  {
    id: '1',
    booking_number: 'BK001',
    farmer_name: 'Ramakrishna Reddy',
    farmer_phone: '+91 98765 43210',
    machine_name: 'Tractor - 50HP',
    start_date: '2024-07-25',
    end_date: '2024-07-28',
    service_location: 'Hyderabad, Telangana',
    total_amount: 4500,
    units: 3,
    request_status: 'pending',
    created_at: '2024-07-15 09:30',
  },
  {
    id: '2',
    booking_number: 'BK002',
    farmer_name: 'Venkat Kumar',
    farmer_phone: '+91 87654 32109',
    machine_name: 'Rotavator - 7FT',
    start_date: '2024-07-22',
    end_date: '2024-07-23',
    service_location: 'Vijayawada, Andhra Pradesh',
    total_amount: 2400,
    units: 2,
    request_status: 'pending',
    created_at: '2024-07-15 11:45',
  },
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  accepted: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
}

export default function BookingRequestsList() {
  const [requests, setRequests] = useState(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      // API call here
      setRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, request_status: 'accepted' } : r)
      )
      setDialogOpen(false)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      // API call here
      setRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, request_status: 'rejected' } : r)
      )
      setDialogOpen(false)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingRequests = requests.filter(r => r.request_status === 'pending')

  return (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <Alert>
          <AlertDescription>
            No pending booking requests at the moment.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(request => (
            <Card key={request.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Booking Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{request.machine_name}</h3>
                      <p className="text-xs text-muted-foreground">#{request.booking_number}</p>
                    </div>
                    <Badge className={statusColors[request.request_status]}>
                      {request.request_status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.start_date).toLocaleDateString()}
                      {' '}-{' '}
                      {new Date(request.end_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {request.service_location}
                    </div>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Farmer Details</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span>{request.farmer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${request.farmer_phone}`} className="text-primary hover:underline">
                        {request.farmer_phone}
                      </a>
                    </div>
                  </div>

                  <Dialog open={dialogOpen && selectedRequest?.id === request.id} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedRequest(request)}
                        >
                          View Details
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Booking Request Details</DialogTitle>
                      </DialogHeader>
                      {selectedRequest && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground font-medium">Duration</p>
                              <p className="font-semibold">{selectedRequest.units} days</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">Total Amount</p>
                              <p className="font-semibold text-primary">₹{selectedRequest.total_amount}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Amount & Actions */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">₹{request.total_amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{request.units} days</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      disabled={actionLoading === request.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id)}
                      disabled={actionLoading === request.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function Label({ children, ...props }: any) {
  return <label {...props}>{children}</label>
}
