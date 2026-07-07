import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { FieldsList } from '@/components/farmer/fields/fields-list'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Fields | Farmer Dashboard | Rythu360',
  description: 'Manage your farm fields and land details'
}

export default async function FieldsPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/roles')
  }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!farmer) {
    redirect('/login/farmer')
  }

  const { data: lands } = await supabase
    .from('lands')
    .select('*, crop_cycles(*)')
    .eq('farmer_id', farmer.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Fields</h1>
          <p className="text-muted-foreground">Manage your farm land and crop cycles</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/farmer/fields/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Link>
        </Button>
      </div>

      {/* Fields List */}
      <Suspense fallback={<div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
        ))}
      </div>}>
        <FieldsList lands={lands || []} farmerId={farmer.id} />
      </Suspense>
    </div>
  )
}
