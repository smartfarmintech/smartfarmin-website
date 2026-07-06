import type {
  AreaUnit,
  CropCycleStatus,
  CropSeason,
  FarmDocumentType,
  FarmerType,
  LandOwnershipType,
  LandType,
  NotificationStatus,
  SoilType,
  TemperatureUnit,
  WalletTxnCategory,
  WalletTxnType,
  WaterSource,
} from "./constants"

export interface UserProfile {
  id: string
  full_name: string | null
  display_name: string | null
  first_name: string | null
  last_name: string | null
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

export interface Farmer {
  id: string
  user_id: string
  village_id: string | null
  farmer_code: string | null
  registration_number: string | null
  farmer_type: FarmerType
  experience_years: number
  is_verified: boolean
  status: string
  created_at: string
}

export interface Land {
  id: string
  farmer_id: string
  land_name: string | null
  survey_number: string | null
  khata_number: string | null
  area_value: number
  area_unit: AreaUnit
  ownership_type: LandOwnershipType
  land_type: LandType
  soil_type: SoilType | null
  water_source: WaterSource | null
  latitude: number | null
  longitude: number | null
  is_active: boolean
  created_at: string
}

export interface CropCycle {
  id: string
  land_id: string
  farmer_id: string
  crop_name: string
  variety: string | null
  season: CropSeason
  status: CropCycleStatus
  sowing_date: string | null
  expected_harvest_date: string | null
  actual_harvest_date: string | null
  area_value: number | null
  area_unit: AreaUnit
  expected_yield: number | null
  actual_yield: number | null
  yield_unit: string | null
  seed_source: string | null
  created_at: string
  // joined
  land?: Pick<Land, "id" | "land_name"> | null
}

export interface WeatherPreferences {
  id: string
  farmer_id: string
  alerts_enabled: boolean
  rainfall_alerts: boolean
  temperature_alerts: boolean
  wind_alerts: boolean
  temperature_unit: TemperatureUnit
  preferred_time: string | null
  latitude: number | null
  longitude: number | null
}

export interface Wallet {
  id: string
  user_id: string
  wallet_status: string
  currency: string
  balance: number
  reserved_balance: number
  total_credited: number
  total_debited: number
  last_txn_at: string | null
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  user_id: string
  txn_type: WalletTxnType
  category: WalletTxnCategory
  txn_status: string
  amount: number
  balance_after: number | null
  currency: string
  description: string | null
  created_at: string
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

export interface FarmDocument {
  id: string
  farmer_id: string
  land_id: string | null
  document_type: FarmDocumentType
  title: string
  file_url: string
  issued_by: string | null
  issue_date: string | null
  expiry_date: string | null
  verification_status: string
  created_at: string
}

export interface WeatherNow {
  temperature: number
  apparentTemperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  time: string
}

export interface WeatherDaily {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipitationSum: number
  precipitationProbabilityMax: number | null
  windSpeedMax: number
}

export interface WeatherResult {
  latitude: number
  longitude: number
  timezone: string
  unit: TemperatureUnit
  now: WeatherNow
  daily: WeatherDaily[]
}

// Machinery & Booking Types

/** Matches the `pricing_unit` enum in the database */
export type PricingUnit = "per_hour" | "per_day" | "per_acre" | "per_km" | "flat"

/** Shape returned by the `v_machine_catalog` view */
export interface MachineCatalogItem {
  machine_id: string
  name: string
  slug: string
  machine_status: string
  brand: string | null
  model: string | null
  fuel: string | null
  power_hp: number | null
  operator_included: boolean
  base_location: string | null
  service_radius_km: number | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
  rating_avg: number | null
  rating_count: number
  total_bookings: number
  owner_id: string
  category_id: string | null
  category_name: string | null
  min_price: number | null
  min_unit: PricingUnit | null
}

export interface MachineDetail extends MachineCatalogItem {
  description: string | null
  specifications: Record<string, unknown> | null
  implements_included: string[] | null
  gallery_urls: string[] | null
  min_booking_hours: number | null
  reviews: MachineReview[]
  pricing_rules: PricingRule[]
}

export interface MachineReview {
  id: string
  machine_id: string
  rating: number
  title: string | null
  body: string | null
  review_status: string
  created_at: string
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
  operator_fee: number | null
  fuel_included: boolean
  is_active: boolean
  priority: number | null
}

export type BookingState =
  | "requested"
  | "confirmed"
  | "operator_assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show"

export type PaymentStatus =
  | "unpaid"
  | "advance_paid"
  | "pending"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "failed"

export interface Booking {
  id: string
  booking_number: string
  renter_id: string
  machine_id: string
  owner_id: string
  operator_id: string | null
  pricing_rule_id: string | null
  starts_at: string
  ends_at: string
  booking_state: BookingState
  payment_status: PaymentStatus
  units: number
  unit_type: PricingUnit
  unit_price: number
  operator_fee: number | null
  discount_amount: number | null
  tax_amount: number | null
  total_amount: number
  advance_amount: number | null
  currency: string
  service_address: Record<string, unknown> | null
  latitude: number | null
  longitude: number | null
  metadata: Record<string, unknown> | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BookingWithMachine extends Booking {
  machine?: {
    id: string
    name: string
    image_url: string | null
    category_id: string | null
  } | null
  operator?: {
    id: string
    full_name: string | null
    phone: string | null
    avatar_url: string | null
  } | null
}

export interface BookingDraft {
  machineId: string
  ownerId: string
  pricingRuleId?: string | null
  startsAt: string
  endsAt: string
  units: number
  unitType: PricingUnit
  unitPrice: number
  operatorFee?: number
  taxAmount?: number
  totalAmount: number
  serviceAddress?: string
  notes?: string
}
