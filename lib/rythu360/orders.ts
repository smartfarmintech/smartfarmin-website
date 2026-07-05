export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered"

export type OrderItem = {
  name: string
  qty: number
  price: number
  image: string
}

export type TimelineStep = {
  status: OrderStatus | "Ordered"
  label: string
  note: string
  at: string | null // null = not reached yet
}

export type Order = {
  id: string
  placedOn: string
  status: OrderStatus
  seller: string
  items: OrderItem[]
  subtotal: number
  delivery: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
  address: {
    name: string
    line: string
    city: string
    phone: string
  }
  courier: string
  awb: string
  eta: string
  timeline: TimelineStep[]
}

export const ORDER_TABS: Array<OrderStatus | "All"> = [
  "All",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
]

const IMG = {
  seeds: "/shop/seeds.png",
  fertilizers: "/shop/fertilizers.png",
  pesticides: "/shop/pesticides.png",
  machinery: "/shop/machinery.png",
  animal: "/shop/animal-care.png",
  solar: "/shop/solar.png",
  irrigation: "/shop/irrigation.png",
}

function buildTimeline(status: OrderStatus, dates: string[]): TimelineStep[] {
  // dates: [ordered, packed, shipped, delivered]
  const order = ["Ordered", "Packed", "Shipped", "Delivered"] as const
  const reachedIndex: Record<OrderStatus, number> = {
    Processing: 0,
    Packed: 1,
    Shipped: 2,
    Delivered: 3,
  }
  const notes: Record<string, string> = {
    Ordered: "Order confirmed & payment received",
    Packed: "Items packed at the warehouse",
    Shipped: "Handed over to the courier partner",
    Delivered: "Package delivered to your address",
  }
  const labels: Record<string, string> = {
    Ordered: "Order placed",
    Packed: "Packed",
    Shipped: "Shipped",
    Delivered: "Delivered",
  }
  return order.map((s, i) => ({
    status: s === "Ordered" ? "Ordered" : (s as OrderStatus),
    label: labels[s],
    note: notes[s],
    at: i <= reachedIndex[status] ? (dates[i] ?? null) : null,
  }))
}

export const ORDERS: Order[] = [
  {
    id: "RY-24817",
    placedOn: "3 Jul 2026",
    status: "Processing",
    seller: "AgriMart Wholesale",
    items: [
      { name: "Hybrid Paddy Seeds (5 kg)", qty: 2, price: 1180, image: IMG.seeds },
      { name: "Bio NPK Fertilizer (25 kg)", qty: 1, price: 940, image: IMG.fertilizers },
    ],
    subtotal: 3300,
    delivery: 0,
    discount: 300,
    tax: 150,
    total: 3150,
    paymentMethod: "Rythu360 Wallet",
    address: { name: "Ravi Kumar", line: "H.No 4-21, Kesamudram", city: "Warangal, Telangana 506112", phone: "+91 98765 43210" },
    courier: "Rythu Express",
    awb: "RE7789452110",
    eta: "Arriving by 7 Jul",
    timeline: buildTimeline("Processing", ["3 Jul, 10:24 AM", "", "", ""]),
  },
  {
    id: "RY-24788",
    placedOn: "1 Jul 2026",
    status: "Packed",
    seller: "GreenGrow Supplies",
    items: [
      { name: "Battery Knapsack Sprayer", qty: 1, price: 3450, image: IMG.machinery },
    ],
    subtotal: 3450,
    delivery: 60,
    discount: 200,
    tax: 172,
    total: 3482,
    paymentMethod: "UPI · ravi@ybl",
    address: { name: "Ravi Kumar", line: "H.No 4-21, Kesamudram", city: "Warangal, Telangana 506112", phone: "+91 98765 43210" },
    courier: "BlueDart",
    awb: "BD5521907744",
    eta: "Arriving by 6 Jul",
    timeline: buildTimeline("Packed", ["1 Jul, 6:10 PM", "2 Jul, 11:30 AM", "", ""]),
  },
  {
    id: "RY-24710",
    placedOn: "28 Jun 2026",
    status: "Shipped",
    seller: "AgriMart Wholesale",
    items: [
      { name: "Drip Irrigation Kit (1 acre)", qty: 1, price: 4200, image: IMG.irrigation },
      { name: "Neem Oil Pesticide (1 L)", qty: 3, price: 380, image: IMG.pesticides },
    ],
    subtotal: 5340,
    delivery: 0,
    discount: 340,
    tax: 250,
    total: 5250,
    paymentMethod: "Rythu360 Wallet",
    address: { name: "Ravi Kumar", line: "H.No 4-21, Kesamudram", city: "Warangal, Telangana 506112", phone: "+91 98765 43210" },
    courier: "Delhivery",
    awb: "DL9087612345",
    eta: "Arriving tomorrow",
    timeline: buildTimeline("Shipped", ["28 Jun, 9:02 AM", "29 Jun, 4:45 PM", "30 Jun, 8:15 AM", ""]),
  },
  {
    id: "RY-24655",
    placedOn: "22 Jun 2026",
    status: "Delivered",
    seller: "SolarKrishi",
    items: [
      { name: "Solar Water Pump (2 HP)", qty: 1, price: 18500, image: IMG.solar },
    ],
    subtotal: 18500,
    delivery: 0,
    discount: 1500,
    tax: 900,
    total: 17900,
    paymentMethod: "UPI · ravi@ybl",
    address: { name: "Ravi Kumar", line: "H.No 4-21, Kesamudram", city: "Warangal, Telangana 506112", phone: "+91 98765 43210" },
    courier: "Delhivery",
    awb: "DL6612349087",
    eta: "Delivered on 26 Jun",
    timeline: buildTimeline("Delivered", ["22 Jun, 2:30 PM", "23 Jun, 10:00 AM", "24 Jun, 7:20 AM", "26 Jun, 1:05 PM"]),
  },
  {
    id: "RY-24590",
    placedOn: "15 Jun 2026",
    status: "Delivered",
    seller: "GreenGrow Supplies",
    items: [
      { name: "Cattle Mineral Mixture (5 kg)", qty: 2, price: 640, image: IMG.animal },
      { name: "Organic Compost (50 kg)", qty: 4, price: 420, image: IMG.fertilizers },
    ],
    subtotal: 2960,
    delivery: 40,
    discount: 160,
    tax: 140,
    total: 2980,
    paymentMethod: "Rythu360 Wallet",
    address: { name: "Ravi Kumar", line: "H.No 4-21, Kesamudram", city: "Warangal, Telangana 506112", phone: "+91 98765 43210" },
    courier: "Rythu Express",
    awb: "RE4478120093",
    eta: "Delivered on 18 Jun",
    timeline: buildTimeline("Delivered", ["15 Jun, 5:12 PM", "16 Jun, 9:40 AM", "16 Jun, 6:00 PM", "18 Jun, 11:22 AM"]),
  },
]

export const STATUS_META: Record<
  OrderStatus,
  { label: string; tint: string; dot: string; step: number }
> = {
  Processing: { label: "Processing", tint: "bg-accent/15 text-accent", dot: "bg-accent", step: 1 },
  Packed: { label: "Packed", tint: "bg-chart-3/15 text-chart-3", dot: "bg-chart-3", step: 2 },
  Shipped: { label: "Shipped", tint: "bg-chart-4/15 text-chart-4", dot: "bg-chart-4", step: 3 },
  Delivered: { label: "Delivered", tint: "bg-primary/12 text-primary", dot: "bg-primary", step: 4 },
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

export function orderItemCount(o: Order) {
  return o.items.reduce((s, i) => s + i.qty, 0)
}
