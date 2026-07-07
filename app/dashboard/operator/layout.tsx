import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OperatorNav from '@/components/operator/operator-nav'
import LoadingSpinner from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Operator Dashboard | Rythu360',
}

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSpinner />}>
        <OperatorNav />
      </Suspense>
      <main>{children}</main>
    </div>
  )
}
