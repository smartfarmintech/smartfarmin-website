export type TxnType = "credit" | "debit"
export type TxnCategory =
  | "add-money"
  | "withdraw"
  | "booking"
  | "subscription"
  | "shopping"
  | "cashback"
  | "sale"
  | "upi"

export type Transaction = {
  id: string
  title: string
  subtitle: string
  amount: number
  type: TxnType
  category: TxnCategory
  method: string
  date: string // ISO
  status: "completed" | "pending" | "failed"
}

export type UpiId = {
  id: string
  handle: string
  bank: string
  primary: boolean
}

export type SavedCard = {
  id: string
  bank: string
  network: "RuPay" | "Visa" | "Mastercard"
  last4: string
  expiry: string
  variant: "primary" | "accent" | "dark"
  type: "Debit" | "Credit"
}

export type BankAccount = {
  id: string
  bank: string
  accountMasked: string
  ifsc: string
  type: "Savings" | "Current"
  primary: boolean
}

export type Reward = {
  id: string
  title: string
  detail: string
  points: number
  kind: "cashback" | "voucher" | "scratch" | "milestone"
  claimed: boolean
}

export const walletBalance = 48250.75
export const rewardPoints = 3420
export const cashbackEarned = 1875
export const monthlyInflow = 62400
export const monthlyOutflow = 41300

export const transactions: Transaction[] = [
  {
    id: "t1",
    title: "Paddy sale — Warangal Mandi",
    subtitle: "Credited to wallet",
    amount: 28400,
    type: "credit",
    category: "sale",
    method: "Bank transfer",
    date: "2026-07-05T09:12:00",
    status: "completed",
  },
  {
    id: "t2",
    title: "Drone spray booking",
    subtitle: "Ramesh Agri Services",
    amount: 2100,
    type: "debit",
    category: "booking",
    method: "Wallet",
    date: "2026-07-04T16:40:00",
    status: "completed",
  },
  {
    id: "t3",
    title: "Cashback — Machinery booking",
    subtitle: "2% instant cashback",
    amount: 42,
    type: "credit",
    category: "cashback",
    method: "Rewards",
    date: "2026-07-04T16:41:00",
    status: "completed",
  },
  {
    id: "t4",
    title: "Rythu360 Plus",
    subtitle: "Monthly subscription",
    amount: 199,
    type: "debit",
    category: "subscription",
    method: "UPI · HDFC",
    date: "2026-07-03T08:00:00",
    status: "completed",
  },
  {
    id: "t5",
    title: "Kisan Bazaar order",
    subtitle: "Seeds & fertilizer · 3 items",
    amount: 3480,
    type: "debit",
    category: "shopping",
    method: "Wallet",
    date: "2026-07-02T18:22:00",
    status: "completed",
  },
  {
    id: "t6",
    title: "Added money",
    subtitle: "From SBI ••4412",
    amount: 10000,
    type: "credit",
    category: "add-money",
    method: "UPI",
    date: "2026-07-01T11:05:00",
    status: "completed",
  },
  {
    id: "t7",
    title: "Paid to Krishna Nursery",
    subtitle: "UPI payment",
    amount: 640,
    type: "debit",
    category: "upi",
    method: "UPI · HDFC",
    date: "2026-06-30T13:15:00",
    status: "completed",
  },
  {
    id: "t8",
    title: "Withdrawn to bank",
    subtitle: "To SBI ••4412",
    amount: 15000,
    type: "debit",
    category: "withdraw",
    method: "IMPS",
    date: "2026-06-28T10:30:00",
    status: "completed",
  },
  {
    id: "t9",
    title: "Organic store payout",
    subtitle: "Direct-to-consumer sale",
    amount: 5260,
    type: "credit",
    category: "sale",
    method: "Wallet",
    date: "2026-06-27T19:48:00",
    status: "completed",
  },
  {
    id: "t10",
    title: "Festival cashback bonus",
    subtitle: "Harvest rewards program",
    amount: 250,
    type: "credit",
    category: "cashback",
    method: "Rewards",
    date: "2026-06-26T12:00:00",
    status: "completed",
  },
]

export const upiIds: UpiId[] = [
  { id: "u1", handle: "ravikumar@rythu", bank: "Rythu360 Wallet", primary: true },
  { id: "u2", handle: "ravikumar9@okhdfcbank", bank: "HDFC Bank", primary: false },
]

export const savedCards: SavedCard[] = [
  { id: "c1", bank: "HDFC Bank", network: "RuPay", last4: "4821", expiry: "09/28", variant: "primary", type: "Debit" },
  { id: "c2", bank: "State Bank of India", network: "Visa", last4: "4412", expiry: "04/27", variant: "dark", type: "Debit" },
  { id: "c3", bank: "Axis Kisan Credit", network: "Mastercard", last4: "7730", expiry: "12/29", variant: "accent", type: "Credit" },
]

export const bankAccounts: BankAccount[] = [
  { id: "b1", bank: "State Bank of India", accountMasked: "••••4412", ifsc: "SBIN0004821", type: "Savings", primary: true },
  { id: "b2", bank: "HDFC Bank", accountMasked: "••••9930", ifsc: "HDFC0001204", type: "Savings", primary: false },
]

export const rewards: Reward[] = [
  { id: "r1", title: "₹50 cashback", detail: "On next machinery booking", points: 500, kind: "cashback", claimed: false },
  { id: "r2", title: "Kisan Bazaar voucher", detail: "₹100 off orders above ₹999", points: 800, kind: "voucher", claimed: false },
  { id: "r3", title: "Scratch card", detail: "Win up to ₹200", points: 300, kind: "scratch", claimed: false },
  { id: "r4", title: "Harvest milestone", detail: "10 sales completed", points: 1000, kind: "milestone", claimed: true },
]

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
}

export function txnDateLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date("2026-07-05T23:59:00")
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
  if (diff <= 0) return `Today · ${time}`
  if (diff === 1) return `Yesterday · ${time}`
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ` · ${time}`
}
