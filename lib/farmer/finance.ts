import type { Wallet, WalletTransaction } from "./types"

/**
 * The wallet.balance column is maintained by backend/admin processes (RLS blocks
 * farmer updates). To always show a correct figure we derive the balance from the
 * completed transaction ledger and fall back to the stored balance if higher.
 */
export function computeBalance(wallet: Wallet | null, txns: WalletTransaction[]): number {
  const ledger = txns
    .filter((t) => t.txn_status === "completed")
    .reduce((sum, t) => sum + (t.txn_type === "credit" ? Number(t.amount) : -Number(t.amount)), 0)
  const stored = wallet ? Number(wallet.balance) : 0
  return Math.max(ledger, stored)
}

export function formatCurrency(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `₹${amount.toFixed(2)}`
  }
}
