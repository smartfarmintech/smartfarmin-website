import type { LucideIcon } from "lucide-react"
import { Combine, Plane, SprayCan, Tractor, Truck, Wind } from "lucide-react"

export type MachineryCategory =
  | "Tractor"
  | "Harvester"
  | "Drone"
  | "Rotavator"
  | "Sprayer"
  | "JCB"

export type Availability = "available" | "busy" | "soon"

export interface Operator {
  id: string
  name: string
  initials: string
  category: MachineryCategory
  machine: string
  specs: string
  rating: number
  reviews: number
  /** price value in rupees */
  price: number
  /** billing unit */
  unit: string
  distanceKm: number
  etaMin: number
  availability: Availability
  verified: boolean
  jobs: number
  /** position on the stylized map, percentages 0-100 */
  x: number
  y: number
}

export interface CategoryMeta {
  key: MachineryCategory
  icon: LucideIcon
  tagline: string
  tint: string
}

export const CATEGORY_META: CategoryMeta[] = [
  { key: "Tractor", icon: Tractor, tagline: "Ploughing & haulage", tint: "bg-primary/12 text-primary" },
  { key: "Harvester", icon: Combine, tagline: "Crop harvesting", tint: "bg-accent/15 text-accent" },
  { key: "Drone", icon: Plane, tagline: "Aerial spraying", tint: "bg-chart-3/15 text-chart-3" },
  { key: "Rotavator", icon: Wind, tagline: "Soil preparation", tint: "bg-chart-4/15 text-chart-4" },
  { key: "Sprayer", icon: SprayCan, tagline: "Pesticide & nutrients", tint: "bg-chart-5/15 text-chart-5" },
  { key: "JCB", icon: Truck, tagline: "Earth moving", tint: "bg-primary/12 text-primary" },
]

export const OPERATORS: Operator[] = [
  {
    id: "op-1",
    name: "Ramesh Yadav",
    initials: "RY",
    category: "Tractor",
    machine: "Mahindra 575 DI",
    specs: "47 HP · 2WD · Cultivator",
    rating: 4.9,
    reviews: 214,
    price: 650,
    unit: "/hour",
    distanceKm: 1.2,
    etaMin: 8,
    availability: "available",
    verified: true,
    jobs: 1240,
    x: 38,
    y: 44,
  },
  {
    id: "op-2",
    name: "Suresh Reddy",
    initials: "SR",
    category: "Tractor",
    machine: "John Deere 5050D",
    specs: "50 HP · 2WD · Rotavator",
    rating: 4.7,
    reviews: 156,
    price: 720,
    unit: "/hour",
    distanceKm: 2.6,
    etaMin: 14,
    availability: "available",
    verified: true,
    jobs: 890,
    x: 62,
    y: 32,
  },
  {
    id: "op-3",
    name: "Anil Kumar",
    initials: "AK",
    category: "Harvester",
    machine: "Kartar 4000",
    specs: "Self-propelled · Paddy & wheat",
    rating: 4.8,
    reviews: 98,
    price: 2200,
    unit: "/acre",
    distanceKm: 3.4,
    etaMin: 22,
    availability: "soon",
    verified: true,
    jobs: 540,
    x: 54,
    y: 60,
  },
  {
    id: "op-4",
    name: "Mahesh Goud",
    initials: "MG",
    category: "Harvester",
    machine: "New Holland TC5.30",
    specs: "Track type · Multi-crop",
    rating: 4.6,
    reviews: 72,
    price: 2450,
    unit: "/acre",
    distanceKm: 5.1,
    etaMin: 30,
    availability: "busy",
    verified: false,
    jobs: 310,
    x: 24,
    y: 66,
  },
  {
    id: "op-5",
    name: "Kiran Rao",
    initials: "KR",
    category: "Drone",
    machine: "DJI Agras T30",
    specs: "30 L tank · 16 acres/hr",
    rating: 5.0,
    reviews: 187,
    price: 400,
    unit: "/acre",
    distanceKm: 0.9,
    etaMin: 6,
    availability: "available",
    verified: true,
    jobs: 2100,
    x: 48,
    y: 38,
  },
  {
    id: "op-6",
    name: "Venkat Sai",
    initials: "VS",
    category: "Drone",
    machine: "Garuda Kisan",
    specs: "10 L tank · Smart spray",
    rating: 4.8,
    reviews: 64,
    price: 380,
    unit: "/acre",
    distanceKm: 2.1,
    etaMin: 12,
    availability: "available",
    verified: true,
    jobs: 420,
    x: 70,
    y: 52,
  },
  {
    id: "op-7",
    name: "Prakash Naik",
    initials: "PN",
    category: "Rotavator",
    machine: "Shaktiman 7ft",
    specs: "42 blades · Tractor mount",
    rating: 4.5,
    reviews: 51,
    price: 900,
    unit: "/acre",
    distanceKm: 3.9,
    etaMin: 24,
    availability: "available",
    verified: false,
    jobs: 260,
    x: 32,
    y: 28,
  },
  {
    id: "op-8",
    name: "Lakshmi Devi",
    initials: "LD",
    category: "Sprayer",
    machine: "Aspee HTP Power",
    specs: "Boom sprayer · 200 L",
    rating: 4.9,
    reviews: 133,
    price: 320,
    unit: "/acre",
    distanceKm: 1.7,
    etaMin: 10,
    availability: "available",
    verified: true,
    jobs: 760,
    x: 58,
    y: 46,
  },
  {
    id: "op-9",
    name: "Ravi Teja",
    initials: "RT",
    category: "JCB",
    machine: "JCB 3DX Backhoe",
    specs: "Loader + excavator",
    rating: 4.7,
    reviews: 89,
    price: 1100,
    unit: "/hour",
    distanceKm: 4.3,
    etaMin: 26,
    availability: "soon",
    verified: true,
    jobs: 480,
    x: 42,
    y: 70,
  },
  {
    id: "op-10",
    name: "Naveen Chary",
    initials: "NC",
    category: "JCB",
    machine: "JCB 4DX",
    specs: "Heavy duty · 76 HP",
    rating: 4.4,
    reviews: 37,
    price: 1250,
    unit: "/hour",
    distanceKm: 6.0,
    etaMin: 34,
    availability: "busy",
    verified: false,
    jobs: 190,
    x: 76,
    y: 40,
  },
]

export const AVAILABILITY_META: Record<
  Availability,
  { label: string; dot: string; text: string }
> = {
  available: { label: "Available now", dot: "bg-chart-1", text: "text-chart-1" },
  soon: { label: "Free in 30 min", dot: "bg-accent", text: "text-accent" },
  busy: { label: "On a job", dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

export function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}
