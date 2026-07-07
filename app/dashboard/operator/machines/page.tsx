import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LoadingSpinner from '@/components/ui/loading-spinner'
import OperatorMachines from '@/components/operator/operator-machines'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Machine Management | Operator Dashboard | Rythu360',
  description: 'Add, edit, and manage your machinery inventory'
}

export default async function OperatorMachinesPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Machine Management</h1>
        <p className="text-muted-foreground">Add, edit, and manage your machinery inventory</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <OperatorMachines />
      </Suspense>
    </div>
  )
}
