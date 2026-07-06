import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon } from "lucide-react"
import { requireFarmer, getWallet, getWalletTransactions } from "@/lib/farmer/queries"
import { computeBalance, formatCurrency } from "@/lib/farmer/finance"
import { formatDateTime } from "@/lib/farmer/format"
import { label } from "@/lib/farmer/constants"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TopUpDialog } from "@/components/farmer/topup-dialog"

export const dynamic = "force-dynamic"

export default async function FinancePage() {
  await requireFarmer()
  const [wallet, txns] = await Promise.all([getWallet(), getWalletTransactions(50)])
  const balance = computeBalance(wallet, txns)
  const currency = wallet?.currency ?? "INR"

  const credited = txns
    .filter((t) => t.txn_type === "credit" && t.txn_status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0)
  const debited = txns
    .filter((t) => t.txn_type === "debit" && t.txn_status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Finance</h1>
          <p className="text-sm text-muted-foreground">Manage your wallet and view transaction history.</p>
        </div>
        <TopUpDialog />
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <WalletIcon className="size-4" />
            Available balance
          </div>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(balance, currency)}</p>
          <p className="mt-1 text-xs opacity-80">Wallet status: {wallet?.wallet_status ?? "active"}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownLeft className="size-4 text-primary" />
            Total credited
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(credited, currency)}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpRight className="size-4 text-destructive" />
            Total spent
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(debited, currency)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Transaction history</h2>
        </div>
        {txns.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No transactions yet. Add money to your wallet to get started.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {txns.map((t) => {
              const isCredit = t.txn_type === "credit"
              return (
                <li key={t.id} className="flex items-center gap-3 p-4">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      isCredit ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isCredit ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {t.description || label(t.category)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(t.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${isCredit ? "text-primary" : "text-destructive"}`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatCurrency(Number(t.amount), currency)}
                    </p>
                    {t.txn_status !== "completed" ? (
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">
                        {t.txn_status}
                      </Badge>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
