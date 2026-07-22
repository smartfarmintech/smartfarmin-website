import type { LucideIcon } from "lucide-react"
import { CheckCircle2, Clock, MapPin, Navigation, Tractor, UserPlus, Users } from "lucide-react"

export type VisitStatus = "done" | "current" | "upcoming"

export type RouteStop = {
  id: string
  order: number
  village: string
  purpose: string
  status: VisitStatus
  eta: string
  distanceKm: number
  farmers: number
  /* position on the stylized map, in % */
  x: number
  y: number
}

/* Today's planned route — ordered village visits */
export const ROUTE_STOPS: RouteStop[] = [
  { id: "s1", order: 1, village: "Ellareddy", purpose: "Farmer onboarding drive", status: "done", eta: "8:30 AM", distanceKm: 0, farmers: 6, x: 16, y: 78 },
  { id: "s2", order: 2, village: "Narsampet", purpose: "Operator KYC + demo", status: "done", eta: "9:45 AM", distanceKm: 7.2, farmers: 4, x: 34, y: 60 },
  { id: "s3", order: 3, village: "Duggondi", purpose: "Soil card distribution", status: "current", eta: "11:15 AM", distanceKm: 5.8, farmers: 9, x: 52, y: 46 },
  { id: "s4", order: 4, village: "Chennaraopet", purpose: "Crop insurance signups", status: "upcoming", eta: "1:00 PM", distanceKm: 6.4, farmers: 5, x: 70, y: 34 },
  { id: "s5", order: 5, village: "Nekkonda", purpose: "Machinery booking camp", status: "upcoming", eta: "2:30 PM", distanceKm: 8.1, farmers: 7, x: 84, y: 20 },
]

export type Kpi = {
  id: string
  label: string
  value: string
  sub: string
  icon: LucideIcon
  tint: string
  progress: number
}

export const FIELD_KPIS: Kpi[] = [
  { id: "visits", label: "Village Visits", value: "2 / 5", sub: "3 remaining today", icon: MapPin, tint: "bg-primary/12 text-primary", progress: 40 },
  { id: "farmers", label: "Farmers Added", value: "18", sub: "Target 25", icon: Users, tint: "bg-chart-1/15 text-chart-1", progress: 72 },
  { id: "operators", label: "Operators Added", value: "4", sub: "Target 5", icon: Tractor, tint: "bg-chart-3/15 text-chart-3", progress: 80 },
  { id: "distance", label: "Mileage", value: "27.5 km", sub: "of 45 km route", icon: Navigation, tint: "bg-accent/15 text-accent", progress: 61 },
]

export type Task = {
  id: string
  title: string
  village: string
  time: string
  done: boolean
  kind: "farmer" | "operator" | "visit" | "photo"
}

export const TASKS: Task[] = [
  { id: "t1", title: "Onboard 6 farmers at Ellareddy", village: "Ellareddy", time: "8:30 AM", done: true, kind: "farmer" },
  { id: "t2", title: "Complete operator KYC — R. Naidu", village: "Narsampet", time: "9:45 AM", done: true, kind: "operator" },
  { id: "t3", title: "Distribute 9 soil health cards", village: "Duggondi", time: "11:15 AM", done: false, kind: "visit" },
  { id: "t4", title: "Capture geo-tagged field photos", village: "Duggondi", time: "11:40 AM", done: false, kind: "photo" },
  { id: "t5", title: "Crop insurance camp — 5 signups", village: "Chennaraopet", time: "1:00 PM", done: false, kind: "farmer" },
  { id: "t6", title: "Machinery booking demo", village: "Nekkonda", time: "2:30 PM", done: false, kind: "visit" },
]

export type GeoPhoto = {
  id: string
  label: string
  village: string
  time: string
  lat: string
  lng: string
  hue: number
}

export const GEO_PHOTOS: GeoPhoto[] = [
  { id: "p1", label: "Paddy field — waterlogging", village: "Ellareddy", time: "8:52 AM", lat: "17.9241° N", lng: "79.6012° E", hue: 140 },
  { id: "p2", label: "Cotton crop inspection", village: "Narsampet", time: "10:05 AM", lat: "17.9333° N", lng: "79.6540° E", hue: 90 },
  { id: "p3", label: "Soil sample collection", village: "Duggondi", time: "11:20 AM", lat: "17.9612° N", lng: "79.6821° E", hue: 40 },
  { id: "p4", label: "Operator tractor verify", village: "Narsampet", time: "10:12 AM", lat: "17.9351° N", lng: "79.6559° E", hue: 200 },
]

export type Attendance = {
  checkedIn: boolean
  checkInTime: string
  location: string
  hours: string
  status: "On duty" | "Off duty"
}

export const ATTENDANCE: Attendance = {
  checkedIn: true,
  checkInTime: "8:12 AM",
  location: "Ellareddy Village Center",
  hours: "5h 48m",
  status: "On duty",
}

export type Incentive = {
  id: string
  label: string
  earned: number
  target: number
  amount: string
  icon: LucideIcon
}

export const INCENTIVES: Incentive[] = [
  { id: "i1", label: "Farmer onboarding bonus", earned: 18, target: 25, amount: "₹1,800", icon: Users },
  { id: "i2", label: "Operator activation bonus", earned: 4, target: 5, amount: "₹1,200", icon: Tractor },
  { id: "i3", label: "Visit streak reward", earned: 12, target: 15, amount: "₹600", icon: CheckCircle2 },
]

export const INCENTIVE_SUMMARY = {
  todayEarned: "₹3,600",
  monthEarned: "₹42,400",
  monthTarget: "₹60,000",
  monthProgress: 71,
}

export const STATUS_META: Record<VisitStatus, { label: string; dot: string; text: string; ring: string }> = {
  done: { label: "Visited", dot: "bg-chart-1", text: "text-chart-1", ring: "ring-chart-1/30" },
  current: { label: "In progress", dot: "bg-accent", text: "text-accent", ring: "ring-accent/40" },
  upcoming: { label: "Upcoming", dot: "bg-muted-foreground/40", text: "text-muted-foreground", ring: "ring-border" },
}

export const TASK_ICON: Record<Task["kind"], LucideIcon> = {
  farmer: UserPlus,
  operator: Tractor,
  visit: MapPin,
  photo: Clock,
}
