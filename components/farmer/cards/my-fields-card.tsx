import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export async function MyFieldsCard({ farmer }: any) {
  const supabase = await createClient()
  
  const { data: lands } = await supabase
    .from('lands')
    .select('*')
    .eq('farmer_id', farmer.id)
    .limit(3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">My Fields</CardTitle>
        <CardDescription>{lands?.length || 0} fields active</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {lands && lands.length > 0 ? (
            lands.map((land) => (
              <div key={land.id} className="p-2 rounded border border-border">
                <p className="text-sm font-medium">{land.land_name}</p>
                <p className="text-xs text-muted-foreground">{land.area_value} {land.area_unit}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No fields added yet</p>
          )}
        </div>
        <Button asChild className="w-full" size="sm">
          <Link href="/dashboard/farmer/fields">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
