export type Trend = "up" | "down"

export type Kpi = {
  id: string
  label: string
  value: string
  sub: string
  delta: number
  trend: Trend
  spark: number[]
  tint: string
}

export const KPIS: Kpi[] = [
  {
    id: "revenue",
    label: "Net Revenue",
    value: "₹4.82 Cr",
    sub: "This quarter",
    delta: 18.4,
    trend: "up",
    spark: [28, 31, 30, 36, 38, 43, 41, 48],
    tint: "bg-primary/12 text-primary",
  },
  {
    id: "gmv",
    label: "GMV",
    value: "₹21.6 Cr",
    sub: "Gross merchandise value",
    delta: 12.1,
    trend: "up",
    spark: [120, 128, 134, 141, 150, 148, 162, 173],
    tint: "bg-chart-2/15 text-chart-2",
  },
  {
    id: "users",
    label: "Active Users",
    value: "1.84 L",
    sub: "Monthly active",
    delta: 9.7,
    trend: "up",
    spark: [140, 148, 151, 158, 163, 169, 176, 184],
    tint: "bg-chart-3/15 text-chart-3",
  },
  {
    id: "operators",
    label: "Operators",
    value: "6,240",
    sub: "Verified & active",
    delta: 6.3,
    trend: "up",
    spark: [52, 54, 55, 57, 58, 60, 61, 62],
    tint: "bg-accent/15 text-accent",
  },
  {
    id: "orders",
    label: "Orders",
    value: "94.2 K",
    sub: "Fulfilled this quarter",
    delta: 14.8,
    trend: "up",
    spark: [64, 68, 70, 74, 79, 83, 88, 94],
    tint: "bg-chart-1/12 text-chart-1",
  },
  {
    id: "churn",
    label: "Sub. Churn",
    value: "2.1%",
    sub: "Monthly churn rate",
    delta: 0.6,
    trend: "down",
    spark: [4.1, 3.8, 3.4, 3.1, 2.8, 2.6, 2.3, 2.1],
    tint: "bg-destructive/12 text-destructive",
  },
]

export const REVENUE_GMV = [
  { label: "Jan", gmv: 1420000, revenue: 320000 },
  { label: "Feb", gmv: 1580000, revenue: 356000 },
  { label: "Mar", gmv: 1810000, revenue: 402000 },
  { label: "Apr", gmv: 1720000, revenue: 388000 },
  { label: "May", gmv: 2040000, revenue: 452000 },
  { label: "Jun", gmv: 2260000, revenue: 498000 },
  { label: "Jul", gmv: 2180000, revenue: 486000 },
  { label: "Aug", gmv: 2480000, revenue: 552000 },
]

export const REVENUE_STREAMS = [
  { label: "Apr", marketplace: 210000, subscriptions: 108000, commissions: 70000 },
  { label: "May", marketplace: 246000, subscriptions: 122000, commissions: 84000 },
  { label: "Jun", marketplace: 268000, subscriptions: 136000, commissions: 94000 },
  { label: "Jul", marketplace: 258000, subscriptions: 142000, commissions: 86000 },
  { label: "Aug", marketplace: 296000, subscriptions: 154000, commissions: 102000 },
]

export const AI_USAGE = [
  { label: "Mon", queries: 12400, scans: 3200 },
  { label: "Tue", queries: 13800, scans: 3600 },
  { label: "Wed", queries: 15200, scans: 4100 },
  { label: "Thu", queries: 14600, scans: 3900 },
  { label: "Fri", queries: 16800, scans: 4600 },
  { label: "Sat", queries: 18200, scans: 5200 },
  { label: "Sun", queries: 15400, scans: 4300 },
]

export type Region = {
  id: string
  name: string
  // percentage position on the stylized map (0-100)
  x: number
  y: number
  gmvShare: number // % of total GMV
  users: number
  operators: number
  growth: number
}

export const REGIONS: Region[] = [
  { id: "tg", name: "Telangana", x: 50, y: 46, gmvShare: 24, users: 44200, operators: 1520, growth: 19.2 },
  { id: "ap", name: "Andhra Pradesh", x: 54, y: 66, gmvShare: 21, users: 38600, operators: 1340, growth: 16.8 },
  { id: "ka", name: "Karnataka", x: 40, y: 62, gmvShare: 17, users: 31200, operators: 1080, growth: 14.1 },
  { id: "mh", name: "Maharashtra", x: 34, y: 40, gmvShare: 15, users: 27800, operators: 940, growth: 12.4 },
  { id: "tn", name: "Tamil Nadu", x: 48, y: 82, gmvShare: 13, users: 22400, operators: 760, growth: 11.2 },
  { id: "mp", name: "Madhya Pradesh", x: 42, y: 24, gmvShare: 10, users: 16800, operators: 600, growth: 21.6 },
]

export type MarketplaceStat = { label: string; value: string; sub: string }

export const MARKETPLACE: MarketplaceStat[] = [
  { label: "GMV / order", value: "₹2,293", sub: "+8.2% vs last qtr" },
  { label: "Take rate", value: "9.4%", sub: "Blended commission" },
  { label: "Repeat rate", value: "61%", sub: "Returning buyers" },
  { label: "Fulfilment", value: "97.3%", sub: "On-time delivery" },
]

export type CategoryShare = { name: string; share: number; tint: string }

export const CATEGORY_SHARE: CategoryShare[] = [
  { name: "Seeds & Inputs", share: 34, tint: "bg-chart-1" },
  { name: "Machinery Rentals", share: 26, tint: "bg-chart-2" },
  { name: "Organic Produce", share: 22, tint: "bg-chart-3" },
  { name: "Animal & Solar", share: 18, tint: "bg-accent" },
]

export type Plan = {
  name: string
  members: string
  mrr: string
  share: number
  tint: string
}

export const SUBSCRIPTIONS: Plan[] = [
  { name: "Kisan Free", members: "1.42 L", mrr: "₹0", share: 100, tint: "bg-muted-foreground/40" },
  { name: "Kisan Plus", members: "38,400", mrr: "₹46.1 L", share: 62, tint: "bg-chart-2" },
  { name: "Kisan Pro", members: "12,800", mrr: "₹51.2 L", share: 34, tint: "bg-chart-1" },
  { name: "Enterprise", members: "640", mrr: "₹38.4 L", share: 14, tint: "bg-accent" },
]

export type AiMetric = { label: string; value: string; sub: string; pct: number }

export const AI_METRICS: AiMetric[] = [
  { label: "Akanksha queries", value: "1.06 M", sub: "This month", pct: 82 },
  { label: "Crop scans", value: "294 K", sub: "Disease + soil", pct: 64 },
  { label: "Voice minutes", value: "182 K", sub: "Regional languages", pct: 48 },
  { label: "Resolution rate", value: "91.4%", sub: "Auto-resolved", pct: 91 },
]

export type TopOperator = {
  rank: number
  name: string
  region: string
  gmv: string
  jobs: number
  rating: number
}

export const TOP_OPERATORS: TopOperator[] = [
  { rank: 1, name: "Sri Balaji Agro Services", region: "Warangal, TG", gmv: "₹18.4 L", jobs: 1240, rating: 4.9 },
  { rank: 2, name: "Green Harvest Machinery", region: "Guntur, AP", gmv: "₹16.1 L", jobs: 1080, rating: 4.8 },
  { rank: 3, name: "Annapurna Farm Tech", region: "Mysuru, KA", gmv: "₹14.7 L", jobs: 960, rating: 4.8 },
  { rank: 4, name: "Deccan Agri Rentals", region: "Nashik, MH", gmv: "₹12.9 L", jobs: 870, rating: 4.7 },
  { rank: 5, name: "Kaveri Krishi Kendra", region: "Salem, TN", gmv: "₹11.2 L", jobs: 760, rating: 4.7 },
]

export function totalGmvShare() {
  return REGIONS.reduce((s, r) => s + r.gmvShare, 0)
}
