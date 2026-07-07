'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, Trash2, MapPin, Sprout } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface FieldsListProps {
  lands: any[]
  farmerId: string
}

export function FieldsList({ lands, farmerId }: FieldsListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (landId: string) => {
    setIsDeleting(landId)
    try {
      const { error } = await supabase
        .from('lands')
        .delete()
        .eq('id', landId)
        .eq('farmer_id', farmerId)

      if (error) throw error
      toast.success('Field deleted successfully')
      window.location.reload()
    } catch (error) {
      toast.error('Failed to delete field')
    } finally {
      setIsDeleting(null)
    }
  }

  if (!lands || lands.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No fields added yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first field to track crops and weather</p>
          <Button asChild>
            <Link href="/dashboard/farmer/fields/new">Add Your First Field</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {lands.map((land) => (
        <Card key={land.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{land.land_name}</CardTitle>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Survey: {land.survey_number || '-'}
                  </div>
                  <div>Village: {land.village_id ? 'Assigned' : '-'}</div>
                  <div className="flex items-center gap-1">
                    <Sprout className="w-4 h-4" />
                    Soil: {land.soil_type || '-'}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Area</p>
                <p className="font-semibold">{land.area_value} {land.area_unit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Water Source</p>
                <p className="font-semibold capitalize">{land.water_source || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold capitalize text-green-600">{land.status || 'Active'}</p>
              </div>
            </div>

            {land.crop_cycles && land.crop_cycles.length > 0 && (
              <div className="mb-4 p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Active Crops</p>
                <div className="flex flex-wrap gap-2">
                  {land.crop_cycles.map((crop: any) => (
                    <span key={crop.id} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {crop.crop_name} - {crop.season}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/farmer/fields/${land.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(land.id)}
                disabled={isDeleting === land.id}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting === land.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
