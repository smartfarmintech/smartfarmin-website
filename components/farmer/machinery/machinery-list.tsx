'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, User, Calendar, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import MachineryBookingDialog from './machinery-booking-dialog'

interface Machine {
  id: string
  name: string
  brand: string
  model: string
  category_id: string
  image_url: string
  base_location: string
  rating_avg: number
  rating_count: number
  operator?: {
    id: string
    full_name: string
    rating_avg: number
    rating_count: number
  }
  pricing_rules?: Array<{
    id: string
    price: number
    unit: string
  }>
  service_radius_km: number
  operator_included: boolean
  fuel: string
  power_hp: number
  latitude: number
  longitude: number
}

export default function MachineryList() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  // Mock data - replace with real Supabase data
  const machineries: Machine[] = [
    {
      id: '1',
      name: 'Tractor - 50HP',
      brand: 'John Deere',
      model: '5050D',
      category_id: 'tractor',
      image_url: '/images/tractor.jpg',
      base_location: 'Hyderabad, Telangana',
      rating_avg: 4.8,
      rating_count: 124,
      operator: {
        id: 'op1',
        full_name: 'Rajesh Kumar',
        rating_avg: 4.7,
        rating_count: 98,
      },
      pricing_rules: [
        { id: 'p1', price: 1500, unit: 'day' },
        { id: 'p2', price: 200, unit: 'hour' },
      ],
      service_radius_km: 50,
      operator_included: true,
      fuel: 'diesel',
      power_hp: 50,
      latitude: 17.3850,
      longitude: 78.4867,
    },
    {
      id: '2',
      name: 'Rotavator - 7FT',
      brand: 'Farmtrac',
      model: 'RT-210',
      category_id: 'rotavator',
      image_url: '/images/rotavator.jpg',
      base_location: 'Vijayawada, Andhra Pradesh',
      rating_avg: 4.6,
      rating_count: 89,
      operator: {
        id: 'op2',
        full_name: 'Mohan Singh',
        rating_avg: 4.5,
        rating_count: 76,
      },
      pricing_rules: [
        { id: 'p3', price: 1200, unit: 'day' },
        { id: 'p4', price: 150, unit: 'hour' },
      ],
      service_radius_km: 40,
      operator_included: true,
      fuel: 'diesel',
      power_hp: 35,
      latitude: 16.5062,
      longitude: 80.6480,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {machineries.length} available machinery
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machineries.map(machine => (
          <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <Image
                src={machine.image_url}
                alt={machine.name}
                fill
                className="object-cover"
                unoptimized
              />
              {machine.operator_included && (
                <Badge className="absolute top-2 right-2 bg-primary">
                  Operator Included
                </Badge>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">{machine.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {machine.brand} {machine.model}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{machine.rating_avg}</span>
                  <span className="text-muted-foreground">({machine.rating_count})</span>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {machine.base_location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  {machine.operator?.full_name}
                </div>
              </div>

              {machine.pricing_rules && machine.pricing_rules.length > 0 && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Pricing</p>
                  <div className="space-y-1">
                    {machine.pricing_rules.map(rule => (
                      <div key={rule.id} className="text-sm font-semibold">
                        ₹{rule.price}/{rule.unit}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Dialog open={bookingOpen && selectedMachine?.id === machine.id} onOpenChange={setBookingOpen}>
                <DialogTrigger asChild>
                  <div>
                    <Button
                      onClick={() => setSelectedMachine(machine)}
                      className="w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Book {machine.name}</DialogTitle>
                  </DialogHeader>
                  {selectedMachine && (
                    <MachineryBookingDialog
                      machine={selectedMachine}
                      onClose={() => setBookingOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
