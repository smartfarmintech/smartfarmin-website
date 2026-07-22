import type { LucideIcon } from "lucide-react"
import {
  Sprout,
  Tractor,
  Truck,
  Store,
  Handshake,
  GraduationCap,
  Headphones,
  MapPinned,
  ShieldCheck,
  Crown,
  LayoutDashboard,
  CloudSun,
  Wallet,
  Package,
  Users,
  Phone,
  ClipboardList,
  Leaf,
  TrendingUp,
  Settings,
} from "lucide-react"

export type RoleId =
  | "farmer"
  | "operator"
  | "delivery"
  | "dealer"
  | "buyer"
  | "expert"
  | "telecaller"
  | "field-agent"
  | "admin"
  | "super-admin"

export type NavItem = {
  label: string
  icon: LucideIcon
}

export type Role = {
  id: RoleId
  label: string
  tagline: string
  description: string
  icon: LucideIcon
  /** tailwind classes for the icon tile accent */
  accent: string
  nav: NavItem[]
}

const commonTail: NavItem[] = [{ label: "Settings", icon: Settings }]

export const ROLES: Role[] = [
  {
    id: "farmer",
    label: "Farmer",
    tagline: "Grow smarter",
    description: "Crop planning, advisory, mandi prices and finance in one place.",
    icon: Sprout,
    accent: "bg-primary/12 text-primary",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "My Crops", icon: Leaf },
      { label: "Advisory", icon: GraduationCap },
      { label: "Weather", icon: CloudSun },
      { label: "Marketplace", icon: Store },
      { label: "Finance", icon: Wallet },
      ...commonTail,
    ],
  },
  {
    id: "operator",
    label: "Operator",
    tagline: "Run the fleet",
    description: "Manage machinery, drone jobs and field operations.",
    icon: Tractor,
    accent: "bg-accent/15 text-accent",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Jobs", icon: ClipboardList },
      { label: "Machinery", icon: Tractor },
      { label: "Earnings", icon: Wallet },
      ...commonTail,
    ],
  },
  {
    id: "delivery",
    label: "Delivery Partner",
    tagline: "Move produce",
    description: "Pickups, routes and delivery tracking for agri logistics.",
    icon: Truck,
    accent: "bg-chart-3/15 text-chart-3",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Deliveries", icon: Package },
      { label: "Routes", icon: MapPinned },
      { label: "Earnings", icon: Wallet },
      ...commonTail,
    ],
  },
  {
    id: "dealer",
    label: "Dealer",
    tagline: "Sell inputs",
    description: "Inventory, orders and customer management for input dealers.",
    icon: Store,
    accent: "bg-chart-4/15 text-chart-4",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Inventory", icon: Package },
      { label: "Orders", icon: ClipboardList },
      { label: "Customers", icon: Users },
      ...commonTail,
    ],
  },
  {
    id: "buyer",
    label: "Crop Buyer",
    tagline: "Source at scale",
    description: "Discover lots, negotiate and procure produce directly.",
    icon: Handshake,
    accent: "bg-primary/12 text-primary",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Marketplace", icon: Store },
      { label: "Procurement", icon: Package },
      { label: "Payments", icon: Wallet },
      ...commonTail,
    ],
  },
  {
    id: "expert",
    label: "Expert",
    tagline: "Advise farmers",
    description: "Answer queries, publish advisories and review crop health.",
    icon: GraduationCap,
    accent: "bg-accent/15 text-accent",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Consultations", icon: Users },
      { label: "Advisories", icon: ClipboardList },
      ...commonTail,
    ],
  },
  {
    id: "telecaller",
    label: "Telecaller",
    tagline: "Reach farmers",
    description: "Manage call queues, campaigns and follow-ups.",
    icon: Headphones,
    accent: "bg-chart-3/15 text-chart-3",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Call Queue", icon: Phone },
      { label: "Campaigns", icon: TrendingUp },
      ...commonTail,
    ],
  },
  {
    id: "field-agent",
    label: "Field Agent",
    tagline: "On the ground",
    description: "Onboard farmers, verify land and capture field data.",
    icon: MapPinned,
    accent: "bg-chart-4/15 text-chart-4",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Visits", icon: MapPinned },
      { label: "Onboarding", icon: Users },
      ...commonTail,
    ],
  },
  {
    id: "admin",
    label: "Admin",
    tagline: "Operate the platform",
    description: "Oversee users, content and day-to-day operations.",
    icon: ShieldCheck,
    accent: "bg-primary/12 text-primary",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Users", icon: Users },
      { label: "Operations", icon: ClipboardList },
      ...commonTail,
    ],
  },
  {
    id: "super-admin",
    label: "Super Admin",
    tagline: "Full control",
    description: "Organisation-wide analytics, roles and system settings.",
    icon: Crown,
    accent: "bg-accent/15 text-accent",
    nav: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Organisations", icon: Store },
      { label: "Analytics", icon: TrendingUp },
      { label: "Access Control", icon: ShieldCheck },
      ...commonTail,
    ],
  },
]

export function getRole(id: string | null | undefined): Role | undefined {
  return ROLES.find((r) => r.id === id)
}
