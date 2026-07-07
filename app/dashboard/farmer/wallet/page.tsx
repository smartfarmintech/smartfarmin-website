export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Wallet | Farmer Dashboard | Rythu360',
  description: 'Manage your wallet, add money, and track transactions'
}

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { CreditCard, Send, TrendingDown } from 'lucide-react'

async function getWalletData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    wallet: wallet || { balance: 0, reserved_balance: 0, total_credited: 0, total_debited: 0, currency: 'INR' },
    transactions: transactions || []
  }
}

export default async function WalletPage() {
  const data = await getWalletData()

  if (!data) redirect('/login/farmer')

  const { wallet, transactions } = data
  const availableBalance = wallet.balance - wallet.reserved_balance

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-muted-foreground">Manage funds and payments for bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <h2 className="text-2xl font-bold">₹{availableBalance.toFixed(2)}</h2>
              <p className="text-xs text-muted-foreground mt-1">Reserved: ₹{wallet.reserved_balance.toFixed(2)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Credited</p>
              <h2 className="text-2xl font-bold">₹{wallet.total_credited.toFixed(2)}</h2>
            </div>
            <Send className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Debited</p>
              <h2 className="text-2xl font-bold">₹{wallet.total_debited.toFixed(2)}</h2>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild className="flex-1 md:flex-none">
          <a href="/wallet/add-money">Add Money</a>
        </Button>
        <Button asChild variant="outline" className="flex-1 md:flex-none">
          <a href="/wallet/withdraw">Withdraw Funds</a>
        </Button>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">Date</th>
                    <th className="text-left p-4 text-sm font-medium">Description</th>
                    <th className="text-left p-4 text-sm font-medium">Type</th>
                    <th className="text-right p-4 text-sm font-medium">Amount</th>
                    <th className="text-right p-4 text-sm font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((txn: any) => (
                      <tr key={txn.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 text-sm">{new Date(txn.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-sm">{txn.description}</td>
                        <td className="p-4 text-sm"><span className={txn.txn_type === 'credit' ? 'text-green-600' : 'text-red-600'}>{txn.txn_type}</span></td>
                        <td className="p-4 text-sm text-right">₹{txn.amount.toFixed(2)}</td>
                        <td className="p-4 text-sm text-right">₹{txn.balance_after.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
