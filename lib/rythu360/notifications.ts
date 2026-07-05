import type { LucideIcon } from "lucide-react"
import {
  Bug,
  CloudLightning,
  CloudRain,
  CreditCard,
  Droplets,
  Gift,
  IndianRupee,
  Landmark,
  Package,
  Sparkles,
  Store,
  Sun,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react"

export type NotifCategory =
  | "weather"
  | "orders"
  | "marketplace"
  | "government"
  | "ai"
  | "payments"

export type NotifPriority = "urgent" | "high" | "normal"

export type Notification = {
  id: string
  category: NotifCategory
  icon: LucideIcon
  title: string
  body: string
  time: string
  minsAgo: number
  read: boolean
  priority: NotifPriority
  tag?: string
  amount?: string
  action?: string
}

export const CATEGORY_META: Record<
  NotifCategory,
  { label: string; icon: LucideIcon; tint: string; dot: string }
> = {
  weather: {
    label: "Weather",
    icon: CloudRain,
    tint: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  orders: {
    label: "Orders",
    icon: Package,
    tint: "bg-primary/12 text-primary",
    dot: "bg-primary",
  },
  marketplace: {
    label: "Marketplace",
    icon: Store,
    tint: "bg-accent/15 text-accent",
    dot: "bg-accent",
  },
  government: {
    label: "Government",
    icon: Landmark,
    tint: "bg-chart-3/15 text-chart-3",
    dot: "bg-chart-3",
  },
  ai: {
    label: "AI Alerts",
    icon: Sparkles,
    tint: "bg-violet-500/12 text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
  },
  payments: {
    label: "Payments",
    icon: Wallet,
    tint: "bg-chart-4/15 text-chart-4",
    dot: "bg-chart-4",
  },
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    category: "weather",
    icon: CloudLightning,
    title: "Heavy rain alert for Warangal",
    body: "IMD forecasts 45mm rainfall in the next 18 hours. Delay any scheduled spraying and secure harvested produce.",
    time: "8 min ago",
    minsAgo: 8,
    read: false,
    priority: "urgent",
    tag: "Red alert",
    action: "View forecast",
  },
  {
    id: "n2",
    category: "ai",
    icon: Bug,
    title: "Akanksha AI detected leaf blight risk",
    body: "Conditions in your paddy field match early-stage bacterial blight. Scout the north plot and consider a copper-based spray.",
    time: "22 min ago",
    minsAgo: 22,
    read: false,
    priority: "high",
    tag: "Crop health",
    action: "Open diagnosis",
  },
  {
    id: "n3",
    category: "orders",
    icon: Truck,
    title: "Your order is out for delivery",
    body: "20kg DAP fertilizer (Order #RS-48213) will arrive today between 2–4 PM. Rider: Suresh, +91 90000 12345.",
    time: "1 hr ago",
    minsAgo: 60,
    read: false,
    priority: "normal",
    tag: "#RS-48213",
    action: "Track order",
  },
  {
    id: "n4",
    category: "payments",
    icon: IndianRupee,
    title: "Payment received",
    body: "₹18,500 credited for your paddy sale to Sri Lakshmi Traders. Settled to your HDFC account ending 4821.",
    time: "3 hrs ago",
    minsAgo: 180,
    read: false,
    priority: "normal",
    amount: "+₹18,500",
    tag: "Credited",
    action: "View receipt",
  },
  {
    id: "n5",
    category: "government",
    icon: Landmark,
    title: "PM-KISAN 16th instalment released",
    body: "₹2,000 has been transferred to your registered bank account under the PM-KISAN scheme. DBT ref: PMK16-TS-9921.",
    time: "5 hrs ago",
    minsAgo: 300,
    read: true,
    priority: "high",
    amount: "+₹2,000",
    tag: "DBT",
    action: "View scheme",
  },
  {
    id: "n6",
    category: "marketplace",
    icon: TrendingUp,
    title: "Paddy prices up 6% at Warangal mandi",
    body: "Today's modal price is ₹2,320/quintal, up from ₹2,190 last week. A good window to list your stored produce.",
    time: "6 hrs ago",
    minsAgo: 360,
    read: true,
    priority: "normal",
    tag: "Price rise",
    action: "Sell now",
  },
  {
    id: "n7",
    category: "weather",
    icon: Sun,
    title: "Clear skies for the next 3 days",
    body: "Good conditions for harvesting and drying. Daytime highs around 32°C with low humidity.",
    time: "9 hrs ago",
    minsAgo: 540,
    read: true,
    priority: "normal",
    tag: "Forecast",
  },
  {
    id: "n8",
    category: "marketplace",
    icon: Store,
    title: "New buyer interested in your listing",
    body: "AgriFresh Exports sent an enquiry for your 40 quintal paddy listing. Respond to negotiate a price.",
    time: "12 hrs ago",
    minsAgo: 720,
    read: true,
    priority: "high",
    tag: "Enquiry",
    action: "Reply",
  },
  {
    id: "n9",
    category: "ai",
    icon: Droplets,
    title: "Irrigation recommendation",
    body: "Soil moisture in your maize plot dropped to 38%. Akanksha AI suggests light irrigation within 24 hours.",
    time: "1 day ago",
    minsAgo: 1440,
    read: true,
    priority: "normal",
    tag: "Advisory",
    action: "See plan",
  },
  {
    id: "n10",
    category: "orders",
    icon: Package,
    title: "Order delivered successfully",
    body: "Certified paddy seeds (Order #RS-47980) were delivered and confirmed. Rate your experience to help others.",
    time: "1 day ago",
    minsAgo: 1500,
    read: true,
    priority: "normal",
    tag: "#RS-47980",
    action: "Rate order",
  },
  {
    id: "n11",
    category: "government",
    icon: Gift,
    title: "New subsidy: Drip irrigation 55% off",
    body: "You are eligible for the micro-irrigation subsidy under PMKSY. Applications close on 30 July.",
    time: "2 days ago",
    minsAgo: 2880,
    read: true,
    priority: "high",
    tag: "Eligible",
    action: "Apply now",
  },
  {
    id: "n12",
    category: "payments",
    icon: CreditCard,
    title: "Premium plan renews in 3 days",
    body: "Your Premium membership (₹499/mo) will auto-renew on 8 July. Manage your plan anytime.",
    time: "2 days ago",
    minsAgo: 3000,
    read: true,
    priority: "normal",
    tag: "Renewal",
    action: "Manage plan",
  },
]
