import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import OperatorEarnings from '@/components/operator/operator-earnings'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Earnings & Payouts | Operator Dashboard | Rythu360',
  description: 'View your earnings, commissions, and payment history'
}

export default async function OperatorEarningsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
        <p className="text-muted-foreground">View your earnings, commissions, and payment history</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <OperatorEarnings />
      </Suspense>
    </div>
  )
}
