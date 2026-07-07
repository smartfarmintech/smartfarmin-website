'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Search, Sliders } from 'lucide-react'

export default function MachinerySearch() {
  const [machineType, setMachineType] = useState('')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('all')

  const machineTypes = [
    { id: 'tractor', label: 'Tractor' },
    { id: 'harvester', label: 'Harvester' },
    { id: 'rotavator', label: 'Rotavator' },
    { id: 'cultivator', label: 'Cultivator' },
    { id: 'seed-drill', label: 'Seed Drill' },
    { id: 'sprayer', label: 'Sprayer' },
    { id: 'power-tiller', label: 'Power Tiller' },
    { id: 'mini-tractor', label: 'Mini Tractor' },
    { id: 'jcb', label: 'JCB' },
    { id: 'excavator', label: 'Excavator' },
  ]

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Search & Filter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Machine Type</label>
            <select
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">All Types</option>
              {machineTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">District/Village</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Daily Rate</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Prices</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="2000+">₹2000+</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button className="w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Machinery
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  )
}
