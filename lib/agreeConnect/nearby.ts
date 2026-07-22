import type { LucideIcon } from "lucide-react"
import {
  Building2,
  FlaskConical,
  Sprout,
  Stethoscope,
  Store,
  Tractor,
  Warehouse,
  Wrench,
} from "lucide-react"

export type ServiceCategory =
  | "Agri Store"
  | "Soil Lab"
  | "Vet Clinic"
  | "Cold Storage"
  | "Mandi"
  | "Nursery"
  | "Equipment"
  | "Repair"

export type Availability = "open" | "busy" | "closed"

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  tagline: string
  rating: number
  reviews: number
  /** representative price label */
  price: string
  priceNote: string
  distanceKm: number
  etaMin: number
  availability: Availability
  hours: string
  verified: boolean
  phone: string
  /** position on the stylized map, percentages 0-100 */
  x: number
  y: number
}

export interface CategoryMeta {
  key: ServiceCategory
  icon: LucideIcon
  tint: string
}

export const CATEGORY_META: CategoryMeta[] = [
  { key: "Agri Store", icon: Store, tint: "bg-primary/12 text-primary" },
  { key: "Soil Lab", icon: FlaskConical, tint: "bg-accent/15 text-accent" },
  { key: "Vet Clinic", icon: Stethoscope, tint: "bg-chart-3/15 text-chart-3" },
  { key: "Cold Storage", icon: Warehouse, tint: "bg-chart-4/15 text-chart-4" },
  { key: "Mandi", icon: Building2, tint: "bg-chart-5/15 text-chart-5" },
  { key: "Nursery", icon: Sprout, tint: "bg-primary/12 text-primary" },
  { key: "Equipment", icon: Tractor, tint: "bg-accent/15 text-accent" },
  { key: "Repair", icon: Wrench, tint: "bg-chart-3/15 text-chart-3" },
]

export const SERVICES: Service[] = [
  {
    id: "sv-1",
    name: "Sri Lakshmi Agri Centre",
    category: "Agri Store",
    tagline: "Seeds, fertilizers & pesticides",
    rating: 4.8,
    reviews: 326,
    price: "₹",
    priceNote: "Retail MRP",
    distanceKm: 0.8,
    etaMin: 5,
    availability: "open",
    hours: "8:00 AM – 9:00 PM",
    verified: true,
    phone: "+91 98490 11223",
    x: 46,
    y: 40,
  },
  {
    id: "sv-2",
    name: "AgriTest Soil Laboratory",
    category: "Soil Lab",
    tagline: "NPK, pH & micronutrient testing",
    rating: 4.9,
    reviews: 142,
    price: "₹299",
    priceNote: "per sample",
    distanceKm: 1.5,
    etaMin: 9,
    availability: "open",
    hours: "9:00 AM – 6:00 PM",
    verified: true,
    phone: "+91 90000 45671",
    x: 62,
    y: 30,
  },
  {
    id: "sv-3",
    name: "Warangal Pashu Vet Clinic",
    category: "Vet Clinic",
    tagline: "Cattle & poultry care · 24x7",
    rating: 4.7,
    reviews: 208,
    price: "₹150",
    priceNote: "consultation",
    distanceKm: 2.3,
    etaMin: 13,
    availability: "open",
    hours: "Open 24 hours",
    verified: true,
    phone: "+91 91234 55678",
    x: 34,
    y: 52,
  },
  {
    id: "sv-4",
    name: "GreenChill Cold Storage",
    category: "Cold Storage",
    tagline: "Multi-commodity · 5000 MT",
    rating: 4.5,
    reviews: 76,
    price: "₹18",
    priceNote: "per bag / month",
    distanceKm: 3.6,
    etaMin: 20,
    availability: "busy",
    hours: "6:00 AM – 10:00 PM",
    verified: true,
    phone: "+91 98765 33445",
    x: 72,
    y: 58,
  },
  {
    id: "sv-5",
    name: "Enumamula Agri Market Yard",
    category: "Mandi",
    tagline: "Paddy, cotton & maize auctions",
    rating: 4.6,
    reviews: 512,
    price: "Live",
    priceNote: "daily rates",
    distanceKm: 4.1,
    etaMin: 24,
    availability: "open",
    hours: "5:00 AM – 4:00 PM",
    verified: true,
    phone: "+91 87000 99001",
    x: 24,
    y: 30,
  },
  {
    id: "sv-6",
    name: "Haritha Nursery & Saplings",
    category: "Nursery",
    tagline: "Fruit, veg & ornamental plants",
    rating: 4.8,
    reviews: 189,
    price: "₹",
    priceNote: "per sapling",
    distanceKm: 2.8,
    etaMin: 16,
    availability: "open",
    hours: "7:00 AM – 7:00 PM",
    verified: false,
    phone: "+91 96543 22110",
    x: 56,
    y: 66,
  },
  {
    id: "sv-7",
    name: "Kisan Equipment Rentals",
    category: "Equipment",
    tagline: "Tractors, tillers & sprayers",
    rating: 4.7,
    reviews: 134,
    price: "₹650",
    priceNote: "per hour",
    distanceKm: 1.9,
    etaMin: 11,
    availability: "open",
    hours: "6:00 AM – 8:00 PM",
    verified: true,
    phone: "+91 93910 77882",
    x: 40,
    y: 26,
  },
  {
    id: "sv-8",
    name: "Balaji Tractor Service",
    category: "Repair",
    tagline: "On-site machinery repair",
    rating: 4.4,
    reviews: 63,
    price: "₹",
    priceNote: "visit + parts",
    distanceKm: 5.2,
    etaMin: 29,
    availability: "closed",
    hours: "Opens 8:00 AM",
    verified: false,
    phone: "+91 90101 44556",
    x: 78,
    y: 42,
  },
  {
    id: "sv-9",
    name: "Rythu Seva Agri Store",
    category: "Agri Store",
    tagline: "Organic inputs & bio-fertilizers",
    rating: 4.6,
    reviews: 97,
    price: "₹",
    priceNote: "Retail MRP",
    distanceKm: 3.0,
    etaMin: 18,
    availability: "busy",
    hours: "8:30 AM – 8:30 PM",
    verified: true,
    phone: "+91 99887 66554",
    x: 30,
    y: 70,
  },
  {
    id: "sv-10",
    name: "Telangana Krishi Vet Hub",
    category: "Vet Clinic",
    tagline: "Artificial insemination & vaccines",
    rating: 4.9,
    reviews: 151,
    price: "₹200",
    priceNote: "per visit",
    distanceKm: 4.8,
    etaMin: 27,
    availability: "open",
    hours: "8:00 AM – 9:00 PM",
    verified: true,
    phone: "+91 98111 22334",
    x: 68,
    y: 20,
  },
]

export const AVAILABILITY_META: Record<
  Availability,
  { label: string; dot: string; text: string; badge: string }
> = {
  open: {
    label: "Open now",
    dot: "bg-chart-1",
    text: "text-chart-1",
    badge: "bg-chart-1/12 text-chart-1",
  },
  busy: {
    label: "Busy",
    dot: "bg-accent",
    text: "text-accent",
    badge: "bg-accent/15 text-accent",
  },
  closed: {
    label: "Closed",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
}

/** Live tracking steps for a booked/visited service */
export const TRACKING_STEPS = [
  { key: "confirmed", label: "Request confirmed", note: "Service accepted your request" },
  { key: "enroute", label: "On the way", note: "Field agent heading to your farm" },
  { key: "arriving", label: "Arriving soon", note: "Less than 1 km away" },
  { key: "arrived", label: "Arrived", note: "Agent at your location" },
] as const

export function iconFor(category: ServiceCategory): LucideIcon {
  return CATEGORY_META.find((c) => c.key === category)?.icon ?? Store
}
