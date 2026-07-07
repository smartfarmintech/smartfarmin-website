'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Zap, Plus, Edit, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'
import MachineForm from './machine-form'

interface Machine {
  id: string
  name: string
  brand: string
  model: string
  image_url: string
  status: 'available' | 'busy' | 'maintenance'
  total_bookings: number
  rating_avg: number
  rating_count: number
  daily_rate: number
  location: string
  power_hp: number
}

const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Tractor - 50HP',
    brand: 'John Deere',
    model: '5050D',
    image_url: '/images/tractor.jpg',
    status: 'available',
    total_bookings: 145,
    rating_avg: 4.8,
    rating_count: 127,
    daily_rate: 1500,
    location: 'Hyderabad, Telangana',
    power_hp: 50,
  },
  {
    id: '2',
    name: 'Rotavator - 7FT',
    brand: 'Farmtrac',
    model: 'RT-210',
    image_url: '/images/rotavator.jpg',
    status: 'busy',
    total_bookings: 98,
    rating_avg: 4.6,
    rating_count: 89,
    daily_rate: 1200,
    location: 'Vijayawada, Andhra Pradesh',
    power_hp: 35,
  },
  {
    id: '3',
    name: 'Power Tiller',
    brand: 'Kirloskar',
    model: 'PT-2000',
    image_url: '/images/power-tiller.jpg',
    status: 'maintenance',
    total_bookings: 67,
    rating_avg: 4.4,
    rating_count: 56,
    daily_rate: 800,
    location: 'Hyderabad, Telangana',
    power_hp: 12,
  },
]

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-300',
  busy: 'bg-blue-100 text-blue-800 border-blue-300',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

const statusIcons = {
  available: <CheckCircle className="w-4 h-4" />,
  busy: <Zap className="w-4 h-4" />,
  maintenance: <AlertTriangle className="w-4 h-4" />,
}

export default function OperatorMachines() {
  const [machines, setMachines] = useState(mockMachines)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const handleAddMachine = () => {
    setEditingMachine(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {machines.length} machine{machines.length !== 1 ? 's' : ''} registered
        </p>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <div>
              <Button onClick={handleAddMachine} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Machine
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMachine ? 'Edit Machine' : 'Add New Machine'}
              </DialogTitle>
            </DialogHeader>
            <MachineForm machine={editingMachine} onClose={() => setFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map(machine => (
          <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <Image
                src={machine.image_url}
                alt={machine.name}
                fill
                className="object-cover"
                unoptimized
              />
              <Badge className={`absolute top-2 right-2 ${statusColors[machine.status]}`}>
                {statusIcons[machine.status]}
                <span className="ml-1 capitalize">{machine.status}</span>
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg">{machine.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {machine.brand} {machine.model}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-muted p-2 rounded-lg">
                <div>
                  <p className="text-muted-foreground">Total Bookings</p>
                  <p className="font-semibold">{machine.total_bookings}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-semibold">
                    {machine.rating_avg}★ ({machine.rating_count})
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Daily Rate</p>
                <p className="text-xl font-bold text-primary">₹{machine.daily_rate}</p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingMachine(machine)
                          setFormOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </DialogTrigger>
                </Dialog>

                <Button variant="outline" size="sm" className="flex-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
