// Enum values mirrored exactly from the live Supabase schema (machinery domain).
// Keep these in sync with the database enums.

export const MACHINE_STATUSES = ["draft", "active", "booked", "under_maintenance", "inactive", "retired"] as const
export const MACHINE_OWNERSHIP_TYPES = [
  "individual",
  "cooperative",
  "custom_hiring_center",
  "dealer",
  "government",
] as const
export const FUEL_TYPES = ["diesel", "petrol", "electric", "cng", "manual", "other"] as const
export const AVAILABILITY_STATUSES = ["available", "blocked", "booked", "maintenance"] as const
export const OPERATOR_STATUSES = ["pending", "active", "suspended", "inactive"] as const
export const PRICING_UNITS = ["per_hour", "per_day", "per_acre", "per_km", "flat"] as const
export const MAINTENANCE_TYPES = ["routine", "repair", "inspection", "breakdown", "servicing"] as const
export const MAINTENANCE_STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const
export const BOOKING_STATES = [
  "requested",
  "confirmed",
  "operator_assigned",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
  "no_show",
] as const
export const PAYMENT_STATUSES = [
  "unpaid",
  "advance_paid",
  "pending",
  "paid",
  "partially_refunded",
  "refunded",
  "failed",
] as const
export const PAYMENT_METHODS = ["cash", "upi", "card", "netbanking", "wallet", "bank_transfer", "other"] as const
export const OPERATOR_DOC_TYPES = [
  "driving_license",
  "aadhaar",
  "training_certificate",
  "police_verification",
  "other",
] as const
export const DOC_VERIFICATION_STATUSES = ["pending", "verified", "rejected", "expired"] as const
export const REVIEW_PUBLISH_STATUSES = ["pending", "published", "rejected", "hidden"] as const
export const RECORD_STATUSES = ["active", "inactive", "archived", "pending", "suspended"] as const
export const NOTIFICATION_STATUSES = ["unread", "read", "archived"] as const

export type MachineStatus = (typeof MACHINE_STATUSES)[number]
export type MachineOwnership = (typeof MACHINE_OWNERSHIP_TYPES)[number]
export type FuelType = (typeof FUEL_TYPES)[number]
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number]
export type OperatorStatus = (typeof OPERATOR_STATUSES)[number]
export type PricingUnit = (typeof PRICING_UNITS)[number]
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number]
export type BookingState = (typeof BOOKING_STATES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export type OperatorDocType = (typeof OPERATOR_DOC_TYPES)[number]
export type DocVerificationStatus = (typeof DOC_VERIFICATION_STATUSES)[number]
export type ReviewPublishStatus = (typeof REVIEW_PUBLISH_STATUSES)[number]
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]

// Human-readable labels for enum values used across the UI.
function titleize(value: string) {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export const label = (value: string | null | undefined) => (value ? titleize(value) : "—")

export const PRICING_UNIT_SUFFIX: Record<PricingUnit, string> = {
  per_hour: "/ hr",
  per_day: "/ day",
  per_acre: "/ acre",
  per_km: "/ km",
  flat: "flat",
}

// Ordered lifecycle for a booking, used for stepper + coloring.
export const BOOKING_STATE_ORDER: BookingState[] = [
  "requested",
  "confirmed",
  "operator_assigned",
  "in_progress",
  "completed",
]

// Terminal booking states that cannot progress further.
export const BOOKING_TERMINAL_STATES: BookingState[] = ["completed", "cancelled", "rejected", "no_show"]

// Valid owner-driven transitions for the booking workflow.
export const BOOKING_TRANSITIONS: Record<BookingState, BookingState[]> = {
  requested: ["confirmed", "rejected"],
  confirmed: ["operator_assigned", "in_progress", "cancelled"],
  operator_assigned: ["in_progress", "cancelled"],
  in_progress: ["completed", "no_show"],
  completed: [],
  cancelled: [],
  rejected: [],
  no_show: [],
}
