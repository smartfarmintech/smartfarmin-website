export type MarketCategory = "Grains" | "Vegetables" | "Cash Crops" | "Dairy & Poultry" | "Fuel"

export type Commodity = {
  id: string
  name: string
  category: MarketCategory
  unit: string
  price: number
  changePct: number
  district: string
  mandi: string
  emoji?: string
}

export const DISTRICTS = [
  "All Districts",
  "Warangal",
  "Karimnagar",
  "Nizamabad",
  "Khammam",
  "Nalgonda",
] as const

export const MANDIS = [
  "All Mandis",
  "Enumamula",
  "Jammikunta",
  "Bodhan",
  "Khammam Central",
  "Miryalaguda",
] as const

export const CATEGORIES: Array<"All" | MarketCategory> = [
  "All",
  "Grains",
  "Vegetables",
  "Cash Crops",
  "Dairy & Poultry",
  "Fuel",
]

export const commodities: Commodity[] = [
  { id: "paddy", name: "Paddy", category: "Grains", unit: "₹/qtl", price: 2483, changePct: 1.8, district: "Warangal", mandi: "Enumamula" },
  { id: "rice", name: "Rice", category: "Grains", unit: "₹/qtl", price: 4120, changePct: 0.6, district: "Karimnagar", mandi: "Jammikunta" },
  { id: "tomato", name: "Tomato", category: "Vegetables", unit: "₹/qtl", price: 1850, changePct: -4.2, district: "Nalgonda", mandi: "Miryalaguda" },
  { id: "onion", name: "Onion", category: "Vegetables", unit: "₹/qtl", price: 2340, changePct: 3.1, district: "Nizamabad", mandi: "Bodhan" },
  { id: "cotton", name: "Cotton", category: "Cash Crops", unit: "₹/qtl", price: 7290, changePct: 2.4, district: "Khammam", mandi: "Khammam Central" },
  { id: "groundnut", name: "Groundnut", category: "Cash Crops", unit: "₹/qtl", price: 6180, changePct: -1.1, district: "Warangal", mandi: "Enumamula" },
  { id: "milk", name: "Milk", category: "Dairy & Poultry", unit: "₹/L", price: 62, changePct: 0.4, district: "Karimnagar", mandi: "Jammikunta" },
  { id: "egg", name: "Egg", category: "Dairy & Poultry", unit: "₹/100", price: 585, changePct: 1.2, district: "Nizamabad", mandi: "Bodhan" },
  { id: "chicken", name: "Chicken", category: "Dairy & Poultry", unit: "₹/kg", price: 178, changePct: -2.6, district: "Khammam", mandi: "Khammam Central" },
  { id: "petrol", name: "Petrol", category: "Fuel", unit: "₹/L", price: 109.66, changePct: 0.2, district: "Warangal", mandi: "—" },
  { id: "diesel", name: "Diesel", category: "Fuel", unit: "₹/L", price: 97.82, changePct: -0.3, district: "Warangal", mandi: "—" },
  { id: "cng", name: "CNG", category: "Fuel", unit: "₹/kg", price: 94.5, changePct: 0.9, district: "Warangal", mandi: "—" },
]

/**
 * Deterministic pseudo-random series generator seeded off the commodity id + base price.
 * Produces a smooth-ish price walk so sparklines and detail charts stay stable across renders.
 */
function seededSeries(seed: string, base: number, points: number, volatility: number): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100000
  const rand = () => {
    h = (h * 1103515245 + 12345) % 2147483648
    return h / 2147483648
  }
  const out: number[] = []
  let value = base * (0.9 + rand() * 0.06)
  for (let i = 0; i < points; i++) {
    const drift = (base - value) * 0.08
    const noise = (rand() - 0.5) * base * volatility
    value = Math.max(base * 0.75, value + drift + noise)
    out.push(Math.round(value * 100) / 100)
  }
  out[out.length - 1] = base
  return out
}

export function getSparkline(c: Commodity): number[] {
  return seededSeries(c.id, c.price, 24, 0.03)
}

export type RangeKey = "1W" | "1M" | "3M" | "1Y"

const RANGE_POINTS: Record<RangeKey, { points: number; labelFor: (i: number, n: number) => string }> = {
  "1W": { points: 7, labelFor: (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] ?? `${i}` },
  "1M": { points: 30, labelFor: (i) => `${i + 1}` },
  "3M": { points: 12, labelFor: (i) => `W${i + 1}` },
  "1Y": { points: 12, labelFor: (i) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i] ?? `${i}` },
}

export function getHistory(c: Commodity, range: RangeKey): Array<{ label: string; price: number }> {
  const cfg = RANGE_POINTS[range]
  const vol = range === "1W" ? 0.02 : range === "1M" ? 0.035 : range === "3M" ? 0.05 : 0.08
  const series = seededSeries(`${c.id}-${range}`, c.price, cfg.points, vol)
  return series.map((price, i) => ({ label: cfg.labelFor(i, cfg.points), price }))
}

export function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 })
}
