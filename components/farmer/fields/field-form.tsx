'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'

const fieldSchema = z.object({
  land_name: z.string().min(2, 'Field name must be at least 2 characters'),
  survey_number: z.string().optional(),
  village_id: z.string().uuid('Please select a village'),
  soil_type: z.string().optional(),
  water_source: z.string().optional(),
  area_value: z.coerce.number().positive('Area must be positive'),
  area_unit: z.string().default('acres'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

type FieldFormData = z.infer<typeof fieldSchema>

interface FieldFormProps {
  farmerId: string
  villages: any[]
  mode: 'create' | 'edit'
  initialData?: any
}

const SOIL_TYPES = [
  { label: 'Red Soil', value: 'red_soil' },
  { label: 'Black Soil', value: 'black_soil' },
  { label: 'Laterite Soil', value: 'laterite_soil' },
  { label: 'Alluvial Soil', value: 'alluvial_soil' },
  { label: 'Loamy Soil', value: 'loamy_soil' },
]

const WATER_SOURCES = [
  { label: 'Well', value: 'well' },
  { label: 'Borewell', value: 'borewell' },
  { label: 'Pond', value: 'pond' },
  { label: 'Canal', value: 'canal' },
  { label: 'River', value: 'river' },
  { label: 'Rainwater', value: 'rainwater' },
]

export function FieldForm({ farmerId, villages, mode, initialData }: FieldFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: initialData || {
      land_name: '',
      survey_number: '',
      village_id: '',
      soil_type: '',
      water_source: '',
      area_value: 0,
      area_unit: 'acres',
      latitude: 0,
      longitude: 0,
    }
  })

  const onSubmit = async (data: FieldFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        const { error } = await supabase.from('lands').insert({
          ...data,
          farmer_id: farmerId,
          land_type: 'agricultural',
          ownership_type: 'owned',
          is_active: true,
          status: 'active',
        })

        if (error) throw error
        toast.success('Field added successfully')
      } else {
        const { error } = await supabase
          .from('lands')
          .update(data)
          .eq('id', initialData.id)
          .eq('farmer_id', farmerId)

        if (error) throw error
        toast.success('Field updated successfully')
      }

      router.push('/dashboard/farmer/fields')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save field')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Field Name */}
        <FormField
          control={form.control}
          name="land_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., North Plot, Rice Field" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Survey Number */}
        <FormField
          control={form.control}
          name="survey_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Survey Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123/456" {...field} />
              </FormControl>
              <FormDescription>From your land deed or patta</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Village */}
        <FormField
          control={form.control}
          name="village_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Village *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your village" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {villages.map((village) => (
                    <SelectItem key={village.id} value={village.id}>
                      {village.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Area */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="area_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="guntas">Guntas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Soil Type */}
        <FormField
          control={form.control}
          name="soil_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soil Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SOIL_TYPES.map((soil) => (
                    <SelectItem key={soil.value} value={soil.value}>
                      {soil.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Water Source */}
        <FormField
          control={form.control}
          name="water_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {WATER_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GPS Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.0001" placeholder="e.g., 17.3850" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.0001" placeholder="e.g., 78.4867" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Field' : 'Update Field'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
