import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FieldForm } from '@/components/farmer/fields/field-form'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edit Field | Farmer Dashboard | Rythu360'
}

export default async function EditFieldPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login/farmer')

  const { data: farmer } = await supabase
    .from('farmers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!farmer) redirect('/login/farmer')

  const { data: land } = await supabase
    .from('lands')
    .select('*')
    .eq('id', id)
    .eq('farmer_id', farmer.id)
    .single()

  if (!land) redirect('/dashboard/farmer/fields')

  const { data: villages } = await supabase.from('villages').select('*')

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/farmer/fields">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Field</h1>
          <p className="text-muted-foreground">Update your field details</p>
        </div>
      </div>

      <Card className="p-6">
        <FieldForm 
          farmerId={farmer.id} 
          villages={villages || []} 
          mode="edit"
          initialData={land}
        />
      </Card>
    </div>
  )
}
