export interface Wallet {
  id: string
  user_id: string
  balance: number
  reserved_balance: number
  total_credited: number
  total_debited: number
  currency: string
  wallet_status: "active" | "suspended" | "closed"
  last_txn_at: string | null
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  user_id: string
  txn_type: "credit" | "debit"
  category: string
  amount: number
  balance_after: number
  description: string | null
  reference_type: string | null
  reference_id: string | null
  txn_status: "pending" | "completed" | "failed" | "reversed"
  currency: string
  created_at: string
  idempotency_key: string | null
}

export interface WalletOverview {
  balance: number
  available_balance: number
  reserved_balance: number
  total_credited: number
  total_debited: number
  reward_points_balance: number
  last_txn_at: string | null
  wallet_status: string
}
