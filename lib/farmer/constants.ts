// Enum values mirrored exactly from the live Supabase schema.
// Keep these in sync with the database enums.

export const FARMER_TYPES = ["owner", "tenant", "sharecropper", "laborer", "fpo_member"] as const
export const AREA_UNITS = ["acre", "hectare", "guntha", "cent", "bigha", "square_meter"] as const
export const LAND_OWNERSHIP_TYPES = ["owned", "leased", "shared", "government", "encroached", "other"] as const
export const LAND_TYPES = ["irrigated", "rainfed", "wetland", "dryland", "plantation", "fallow"] as const
export const SOIL_TYPES = [
  "alluvial",
  "black",
  "red",
  "laterite",
  "sandy",
  "clay",
  "loamy",
  "saline",
  "peaty",
  "other",
] as const
export const WATER_SOURCES = [
  "borewell",
  "open_well",
  "canal",
  "river",
  "tank",
  "rainwater",
  "pond",
  "municipal",
  "other",
] as const
export const CROP_SEASONS = ["kharif", "rabi", "zaid", "summer", "perennial", "whole_year"] as const
export const CROP_CYCLE_STATUSES = [
  "planned",
  "sowing",
  "growing",
  "flowering",
  "maturing",
  "harvested",
  "failed",
  "abandoned",
] as const
export const TEMPERATURE_UNITS = ["celsius", "fahrenheit"] as const
export const NOTIFICATION_STATUSES = ["unread", "read", "archived"] as const
export const WALLET_TXN_TYPES = ["credit", "debit"] as const
export const WALLET_TXN_CATEGORIES = [
  "topup",
  "withdrawal",
  "purchase",
  "refund",
  "cashback",
  "reward",
  "commission",
  "settlement",
  "adjustment",
  "transfer",
  "fee",
] as const
export const WALLET_TXN_STATUSES = ["pending", "completed", "failed", "reversed", "cancelled"] as const
export const FARM_DOCUMENT_TYPES = [
  "land_record",
  "pahani",
  "patta",
  "ror",
  "bank_passbook",
  "aadhaar",
  "pan",
  "kcc",
  "insurance",
  "subsidy",
  "soil_health_card",
  "lease_agreement",
  "other",
] as const

export type FarmerType = (typeof FARMER_TYPES)[number]
export type AreaUnit = (typeof AREA_UNITS)[number]
export type LandOwnershipType = (typeof LAND_OWNERSHIP_TYPES)[number]
export type LandType = (typeof LAND_TYPES)[number]
export type SoilType = (typeof SOIL_TYPES)[number]
export type WaterSource = (typeof WATER_SOURCES)[number]
export type CropSeason = (typeof CROP_SEASONS)[number]
export type CropCycleStatus = (typeof CROP_CYCLE_STATUSES)[number]
export type TemperatureUnit = (typeof TEMPERATURE_UNITS)[number]
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]
export type WalletTxnType = (typeof WALLET_TXN_TYPES)[number]
export type WalletTxnCategory = (typeof WALLET_TXN_CATEGORIES)[number]
export type FarmDocumentType = (typeof FARM_DOCUMENT_TYPES)[number]

// Human-readable labels for enum values used across the UI.
function titleize(value: string) {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export const label = (value: string | null | undefined) => (value ? titleize(value) : "—")

// Ordered lifecycle for crop cycle status, used for progress + coloring.
export const CROP_STATUS_ORDER: CropCycleStatus[] = [
  "planned",
  "sowing",
  "growing",
  "flowering",
  "maturing",
  "harvested",
]

export const AREA_UNIT_TO_ACRE: Record<AreaUnit, number> = {
  acre: 1,
  hectare: 2.47105,
  guntha: 0.025,
  cent: 0.01,
  bigha: 0.625,
  square_meter: 0.000247105,
}

export function toAcres(value: number, unit: AreaUnit): number {
  return value * (AREA_UNIT_TO_ACRE[unit] ?? 1)
}

// Machinery & Booking Constants
export const BOOKING_STATES = [
  "pending",
  "confirmed",
  "operator_assigned",
  "in_progress",
  "completed",
  "rejected",
  "no_show",
  "cancelled",
] as const

export const PAYMENT_STATUSES = ["pending", "advance_paid", "partial_paid", "paid", "cancelled"] as const
export const PRICING_UNITS = ["hourly", "daily", "weekly"] as const
export const PAYMENT_METHODS = ["cash", "online", "check", "bank_transfer"] as const

export type BookingState = (typeof BOOKING_STATES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type PricingUnit = (typeof PRICING_UNITS)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

// Booking state machine: which states can transition to which
export const BOOKING_TRANSITIONS: Record<BookingState, BookingState[]> = {
  pending: ["confirmed", "rejected", "cancelled"],
  confirmed: ["operator_assigned", "cancelled"],
  operator_assigned: ["in_progress", "cancelled"],
  in_progress: ["completed", "no_show", "cancelled"],
  completed: ["cancelled"],
  rejected: [],
  no_show: [],
  cancelled: [],
}

// State labels and styling
export const BOOKING_STATE_LABEL: Record<BookingState, string> = {
  pending: "Pending",
  confirmed: "Accepted",
  operator_assigned: "Operator Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  no_show: "No Show",
  cancelled: "Cancelled",
}

export const BOOKING_STATE_COLOR: Record<BookingState, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  operator_assigned: "bg-cyan-50 text-cyan-700 border-cyan-200",
  in_progress: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-gray-50 text-gray-700 border-gray-200",
  cancelled: "bg-slate-50 text-slate-700 border-slate-200",
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Awaiting Payment",
  advance_paid: "Advance Paid",
  partial_paid: "Partially Paid",
  paid: "Paid",
  cancelled: "Cancelled",
}

export const PRICING_UNIT_LABEL: Record<PricingUnit, string> = {
  hourly: "Per Hour",
  daily: "Per Day",
  weekly: "Per Week",
}
