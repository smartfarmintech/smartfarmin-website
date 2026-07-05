export type Trend = "up" | "down"

export type KpiId = "users" | "revenue" | "approvals" | "uptime"

export type Kpi = {
  id: KpiId
  label: string
  value: string
  delta: number
  trend: Trend
  /** true when a downward delta is the good outcome */
  invert?: boolean
  spark: number[]
  hint: string
}

export const kpis: Kpi[] = [
  {
    id: "users",
    label: "Active Users",
    value: "84,210",
    delta: 6.4,
    trend: "up",
    spark: [52, 55, 58, 61, 63, 68, 72, 78, 81, 84],
    hint: "30-day active across all roles",
  },
  {
    id: "revenue",
    label: "Revenue (MTD)",
    value: "₹3.92 Cr",
    delta: 9.1,
    trend: "up",
    spark: [180, 210, 240, 260, 300, 320, 350, 372, 388, 392],
    hint: "Net of refunds & payouts",
  },
  {
    id: "approvals",
    label: "Pending Approvals",
    value: "37",
    delta: 12,
    trend: "down",
    invert: true,
    spark: [72, 68, 60, 58, 54, 49, 46, 43, 40, 37],
    hint: "Across KYC, payouts & content",
  },
  {
    id: "uptime",
    label: "Platform Uptime",
    value: "99.98%",
    delta: 0.03,
    trend: "up",
    spark: [99.9, 99.92, 99.95, 99.9, 99.97, 99.98, 99.96, 99.99, 99.98, 99.98],
    hint: "Rolling 30-day SLA",
  },
]

/* ---------------- Users & access ---------------- */

export type RoleRow = {
  id: string
  name: string
  users: number
  color: string
  active: number // % currently online
}

export const roleRows: RoleRow[] = [
  { id: "farmer", name: "Farmers", users: 71240, color: "var(--chart-1)", active: 42 },
  { id: "operator", name: "Operators", users: 8420, color: "var(--chart-2)", active: 55 },
  { id: "telecaller", name: "Telecallers", users: 210, color: "var(--chart-3)", active: 78 },
  { id: "field-agent", name: "Field Agents", users: 96, color: "var(--chart-4)", active: 64 },
  { id: "admin", name: "Admins", users: 24, color: "var(--chart-5)", active: 88 },
]

export const totalUsers = roleRows.reduce((s, r) => s + r.users, 0)

/* Permission matrix — role x capability */
export const capabilities = [
  "View Data",
  "Edit Records",
  "Approve",
  "Payouts",
  "Manage Users",
  "System Config",
] as const

export type Capability = (typeof capabilities)[number]

export type PermissionRole = {
  id: string
  name: string
  perms: Record<Capability, boolean>
}

const P = (v: boolean[]): Record<Capability, boolean> =>
  Object.fromEntries(capabilities.map((c, i) => [c, v[i]])) as Record<Capability, boolean>

export const permissionRoles: PermissionRole[] = [
  { id: "super-admin", name: "Super Admin", perms: P([true, true, true, true, true, true]) },
  { id: "admin", name: "Admin", perms: P([true, true, true, true, true, false]) },
  { id: "telecaller", name: "Telecaller", perms: P([true, true, false, false, false, false]) },
  { id: "field-agent", name: "Field Agent", perms: P([true, true, true, false, false, false]) },
  { id: "operator", name: "Operator", perms: P([true, true, false, true, false, false]) },
  { id: "farmer", name: "Farmer", perms: P([true, false, false, false, false, false]) },
]

/* ---------------- Server / platform health ---------------- */

export type ServiceStatus = "operational" | "degraded" | "down"

export type Service = {
  id: string
  name: string
  status: ServiceStatus
  latency: string
  uptime: string
}

export const services: Service[] = [
  { id: "api", name: "Core API", status: "operational", latency: "82 ms", uptime: "99.99%" },
  { id: "payments", name: "Payments", status: "operational", latency: "140 ms", uptime: "99.97%" },
  { id: "ai", name: "AI Inference", status: "degraded", latency: "610 ms", uptime: "99.82%" },
  { id: "db", name: "Database", status: "operational", latency: "18 ms", uptime: "100%" },
  { id: "storage", name: "Media Storage", status: "operational", latency: "56 ms", uptime: "99.98%" },
  { id: "sms", name: "SMS Gateway", status: "operational", latency: "220 ms", uptime: "99.90%" },
]

export type Resource = {
  id: string
  label: string
  value: number // percent
  detail: string
}

export const resources: Resource[] = [
  { id: "cpu", label: "CPU Load", value: 46, detail: "12 vCPU cluster" },
  { id: "mem", label: "Memory", value: 63, detail: "48 / 64 GB" },
  { id: "db", label: "DB Connections", value: 38, detail: "190 / 500 pool" },
  { id: "net", label: "Bandwidth", value: 71, detail: "1.4 Gbps peak" },
]

/* ---------------- Notifications ---------------- */

export type NotifKind = "alert" | "success" | "info"

export type Notification = {
  id: string
  kind: NotifKind
  title: string
  detail: string
  time: string
}

export const notifications: Notification[] = [
  { id: "n1", kind: "alert", title: "AI inference latency high", detail: "p95 crossed 600 ms in ap-south-1", time: "4m ago" },
  { id: "n2", kind: "success", title: "Payout batch settled", detail: "₹42.6 L to 1,204 operators", time: "22m ago" },
  { id: "n3", kind: "info", title: "New district onboarded", detail: "Adilabad live with 3 mandis", time: "1h ago" },
  { id: "n4", kind: "alert", title: "Fraud rule triggered", detail: "6 accounts flagged for review", time: "2h ago" },
  { id: "n5", kind: "success", title: "Backup completed", detail: "Snapshot stored across 3 regions", time: "3h ago" },
]

/* ---------------- Approvals queue ---------------- */

export type ApprovalType = "KYC" | "Payout" | "Content" | "Refund"

export type Approval = {
  id: string
  type: ApprovalType
  subject: string
  meta: string
  amount?: string
  priority: "high" | "medium" | "low"
}

export const approvals: Approval[] = [
  { id: "a1", type: "Payout", subject: "Operator settlement · Warangal", meta: "batch #4821", amount: "₹8.4 L", priority: "high" },
  { id: "a2", type: "KYC", subject: "Ramesh Traders", meta: "GST + PAN verified", priority: "medium" },
  { id: "a3", type: "Refund", subject: "Order #RB-99321", meta: "damaged goods claim", amount: "₹2,140", priority: "medium" },
  { id: "a4", type: "Content", subject: "Scheme banner · Rabi 2025", meta: "marketing upload", priority: "low" },
  { id: "a5", type: "KYC", subject: "Suvarna Cold Storage", meta: "license pending scan", priority: "high" },
]

/* ---------------- District & State analytics ---------------- */

export type District = {
  id: string
  name: string
  users: number
  revenue: string
  growth: number
  health: number // 0-100 composite
}

export const districts: District[] = [
  { id: "d1", name: "Warangal", users: 12840, revenue: "₹64 L", growth: 12.4, health: 92 },
  { id: "d2", name: "Karimnagar", users: 10120, revenue: "₹52 L", growth: 9.8, health: 88 },
  { id: "d3", name: "Nizamabad", users: 8760, revenue: "₹41 L", growth: 7.1, health: 81 },
  { id: "d4", name: "Khammam", users: 7430, revenue: "₹38 L", growth: 14.2, health: 90 },
  { id: "d5", name: "Nalgonda", users: 6980, revenue: "₹33 L", growth: 5.4, health: 76 },
  { id: "d6", name: "Adilabad", users: 4120, revenue: "₹18 L", growth: 21.6, health: 84 },
]

export type StateRegion = {
  id: string
  name: string
  x: number
  y: number
  share: number // % of national GMV
  users: string
}

export const stateRegions: StateRegion[] = [
  { id: "ts", name: "Telangana", x: 46, y: 44, share: 34, users: "62k" },
  { id: "ap", name: "Andhra Pradesh", x: 52, y: 62, share: 22, users: "38k" },
  { id: "ka", name: "Karnataka", x: 34, y: 60, share: 16, users: "24k" },
  { id: "mh", name: "Maharashtra", x: 32, y: 34, share: 18, users: "29k" },
  { id: "tn", name: "Tamil Nadu", x: 44, y: 82, share: 10, users: "14k" },
]

/* charts */
export const uptimeSeries = [
  { label: "00h", api: 82, ai: 320 },
  { label: "04h", api: 76, ai: 300 },
  { label: "08h", api: 120, ai: 480 },
  { label: "12h", api: 140, ai: 610 },
  { label: "16h", api: 110, ai: 540 },
  { label: "20h", api: 90, ai: 360 },
  { label: "now", api: 82, ai: 610 },
]

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n)
}
