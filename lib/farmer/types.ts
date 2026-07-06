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
export interface MachineCatalogItem {
  id: string
  name: string
  category: string
  owner_id: string
  owner_name: string | null
  operating_area: number | null
  warranty: string | null
  hourly_rate: number
  daily_rate: number | null
  weekly_rate: number | null
  currency: string
  image_url: string | null
  description: string | null
  avg_rating: number | null
  total_reviews: number
}

export interface MachineDetail extends MachineCatalogItem {
  machine_status: string
  status: string
  description: string | null
  features: string[] | null
  certifications: string[] | null
  warranty_details: string | null
  reviews: MachineReview[]
  pricing_rules: PricingRule[]
}

export interface MachineReview {
  id: string
  machine_id: string
  reviewer_name: string
  rating: number
  comment: string | null
  created_at: string
}

export interface PricingRule {
  id: string
  machine_id: string
  unit: string // 'hourly' | 'daily' | 'weekly'
  rate: number
  currency: string
  min_duration: number | null
  is_active: boolean
}

export type BookingState =
  | "pending"
  | "confirmed"
  | "operator_assigned"
  | "in_progress"
  | "completed"
  | "rejected"
  | "no_show"
  | "cancelled"

export type PaymentStatus =
  | "pending"
  | "advance_paid"
  | "partial_paid"
  | "paid"
  | "cancelled"

export interface Booking {
  id: string
  booking_number: string
  renter_id: string
  machine_id: string
  owner_id: string
  operator_id: string | null
  starts_at: string
  ends_at: string
  booking_state: BookingState
  payment_status: PaymentStatus
  payment_method: string | null
  total_amount: number
  hourly_rate: number | null
  daily_rate: number | null
  unit_type: string | null
  tax_amount: number | null
  service_address: string | null
  metadata: Record<string, unknown> | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BookingWithMachine extends Booking {
  machine?: Pick<
    MachineDetail,
    | "id"
    | "name"
    | "category"
    | "owner_name"
    | "image_url"
  > | null
  operator?: Pick<
    any,
    "id" | "full_name" | "phone" | "avatar_url"
  > | null
}

export interface BookingDraft {
  machineId: string
  startsAt: string
  endsAt: string
  hourlyRate?: number
  dailyRate?: number
  unitType: string
  totalAmount: number
  serviceAddress?: string
  notes?: string
}
