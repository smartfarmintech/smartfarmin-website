import type {
  AvailabilityStatus,
  BookingState,
  DocVerificationStatus,
  FuelType,
  MachineOwnership,
  MachineStatus,
  MaintenanceStatus,
  MaintenanceType,
  NotificationStatus,
  OperatorDocType,
  OperatorStatus,
  PaymentMethod,
  PaymentStatus,
  PricingUnit,
  ReviewPublishStatus,
} from "./constants"

export interface UserProfile {
  id: string
  full_name: string | null
  display_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  bio: string | null
  preferred_language: string | null
  pincode: string | null
  address_line1: string | null
  latitude: number | null
  longitude: number | null
}

export interface MachineryCategory {
  id: string
  parent_id: string | null
  name: string
  slug: string
  icon_url: string | null
  display_order: number
}

export interface Machine {
  id: string
  owner_id: string
  category_id: string | null
  name: string
  slug: string | null
  machine_status: MachineStatus
  ownership_type: MachineOwnership
  brand: string | null
  model: string | null
  manufacture_year: number | null
  registration_no: string | null
  fuel: FuelType
  power_hp: number | null
  description: string | null
  implements_included: string[]
  operator_included: boolean
  base_location: string | null
  service_radius_km: number | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
  gallery_urls: string[]
  min_booking_hours: number | null
  rating_avg: number
  rating_count: number
  total_bookings: number
  status: string
  created_at: string
  // joined
  category?: Pick<MachineryCategory, "id" | "name"> | null
}

export interface Operator {
  id: string
  owner_id: string
  user_id: string | null
  full_name: string
  phone: string | null
  operator_status: OperatorStatus
  years_experience: number | null
  skills: string[]
  daily_wage: number | null
  photo_url: string | null
  is_verified: boolean
  rating_avg: number
  rating_count: number
  status: string
  created_at: string
}

export interface OperatorDocument {
  id: string
  operator_id: string
  doc_type: OperatorDocType
  verification_status: DocVerificationStatus
  document_number: string | null
  document_url: string | null
  issued_on: string | null
  expires_on: string | null
  created_at: string
  // joined
  operator?: Pick<Operator, "id" | "full_name"> | null
}

export interface AvailabilitySlot {
  id: string
  machine_id: string
  slot_status: AvailabilityStatus
  starts_at: string
  ends_at: string
  reason: string | null
  created_at: string
  // joined
  machine?: Pick<Machine, "id" | "name"> | null
}

export interface PricingRule {
  id: string
  machine_id: string
  name: string | null
  unit: PricingUnit
  price: number
  currency: string
  min_units: number | null
  max_units: number | null
  operator_fee: number
  fuel_included: boolean
  season_start: string | null
  season_end: string | null
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  priority: number
  created_at: string
  // joined
  machine?: Pick<Machine, "id" | "name"> | null
}

export interface MaintenanceRecord {
  id: string
  machine_id: string
  maint_type: MaintenanceType
  maint_status: MaintenanceStatus
  title: string
  description: string | null
  scheduled_at: string | null
  started_at: string | null
  completed_at: string | null
  cost: number | null
  currency: string
  service_provider: string | null
  odometer_hours: number | null
  created_at: string
  // joined
  machine?: Pick<Machine, "id" | "name"> | null
}

export interface Booking {
  id: string
  booking_number: string
  machine_id: string
  owner_id: string
  renter_id: string
  operator_id: string | null
  pricing_rule_id: string | null
  booking_state: BookingState
  payment_status: PaymentStatus
  starts_at: string
  ends_at: string
  units: number | null
  unit_type: PricingUnit | null
  service_address: Record<string, unknown> | null
  latitude: number | null
  longitude: number | null
  unit_price: number
  operator_fee: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  advance_amount: number
  currency: string
  notes: string | null
  cancel_reason: string | null
  confirmed_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  created_at: string
  // joined
  machine?: Pick<Machine, "id" | "name" | "image_url"> | null
  operator?: Pick<Operator, "id" | "full_name"> | null
}

export interface BookingStatusEvent {
  id: string
  booking_id: string
  from_state: BookingState | null
  to_state: BookingState
  note: string | null
  created_at: string
}

export interface BookingPayment {
  id: string
  booking_id: string
  amount: number
  currency: string
  method: PaymentMethod
  payment_status: PaymentStatus
  is_advance: boolean
  is_refund: boolean
  transaction_ref: string | null
  paid_at: string | null
  created_at: string
}

export interface MachineReview {
  id: string
  machine_id: string
  booking_id: string | null
  operator_id: string | null
  user_id: string
  rating: number
  operator_rating: number | null
  title: string | null
  body: string | null
  review_status: ReviewPublishStatus
  is_verified_booking: boolean
  helpful_count: number
  owner_response: string | null
  responded_at: string | null
  created_at: string
  // joined
  machine?: Pick<Machine, "id" | "name"> | null
}

export interface GpsLocation {
  id: string
  machine_id: string
  booking_id: string | null
  latitude: number
  longitude: number
  speed_kmph: number | null
  heading: number | null
  accuracy_m: number | null
  recorded_at: string
  // joined
  machine?: Pick<Machine, "id" | "name"> | null
}

export interface NotificationItem {
  id: string
  category: string
  channel: string
  priority: string
  status: NotificationStatus
  title: string
  body: string
  action_url: string | null
  read_at: string | null
  created_at: string
}

export interface OwnerDashboardStats {
  machineCount: number
  activeMachines: number
  operatorCount: number
  activeBookings: number
  pendingRequests: number
  monthRevenue: number
  ratingAvg: number
  ratingCount: number
}
