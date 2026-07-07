'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Check } from 'lucide-react'

interface MachineFormProps {
  machine?: {
    id: string
    name: string
    brand: string
    model: string
  } | null
  onClose: () => void
}

export default function MachineForm({ machine, onClose }: MachineFormProps) {
  const [formData, setFormData] = useState({
    name: machine?.name || '',
    brand: machine?.brand || '',
    model: machine?.model || '',
    power_hp: '',
    fuel: 'diesel',
    registration_no: '',
    service_radius_km: '50',
    daily_rate: '',
    hourly_rate: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API call here
      console.log('Machine data:', formData)
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
            {machine ? 'Machine updated' : 'Machine added'} successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to save machine. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="font-semibold">Machine Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tractor - 50HP"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="brand" className="font-semibold">Brand *</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., John Deere"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model" className="font-semibold">Model *</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., 5050D"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="registration_no" className="font-semibold">Registration No *</Label>
            <Input
              id="registration_no"
              name="registration_no"
              value={formData.registration_no}
              onChange={handleChange}
              placeholder="e.g., TS-09-XY-1234"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="power_hp" className="font-semibold">Power (HP) *</Label>
            <Input
              id="power_hp"
              name="power_hp"
              type="number"
              value={formData.power_hp}
              onChange={handleChange}
              placeholder="e.g., 50"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fuel" className="font-semibold">Fuel Type *</Label>
            <select
              id="fuel"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-background mt-1"
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="daily_rate" className="font-semibold">Daily Rate (₹) *</Label>
            <Input
              id="daily_rate"
              name="daily_rate"
              type="number"
              value={formData.daily_rate}
              onChange={handleChange}
              placeholder="e.g., 1500"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hourly_rate" className="font-semibold">Hourly Rate (₹) *</Label>
            <Input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={handleChange}
              placeholder="e.g., 200"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="service_radius_km" className="font-semibold">Service Radius (km)</Label>
          <Input
            id="service_radius_km"
            name="service_radius_km"
            type="number"
            value={formData.service_radius_km}
            onChange={handleChange}
            placeholder="e.g., 50"
            className="mt-1"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Saving...' : machine ? 'Update Machine' : 'Add Machine'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
