/**
 * Module Type Definitions for Rythu360
 * Centralized types for all 6 modules
 */

// ============ WALLET & PAYMENTS MODULE ============

export interface Wallet {
  id: string
  user_id: string
  balance: number
  reserved_balance: number
  total_credited: number
  total_debited: number
  currency: string
  wallet_status: 'active' | 'suspended' | 'closed'
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  user_id: string
  amount: number
  txn_type: 'credit' | 'debit'
  txn_status: 'pending' | 'success' | 'failed'
  category: string
  description: string
  balance_after: number
  reference_type: string
  reference_id: string
  created_at: string
}

export interface PaymentRequest {
  id: string
  user_id: string
  amount: number
  channel: string
  gateway: string
  request_status: string
  gateway_order_id?: string
  gateway_payment_id?: string
  purpose: string
  created_at: string
}

// ============ DRONE SERVICES MODULE ============

export interface DroneBooking {
  id: string
  machine_id: string
  renter_id: string
  owner_id: string
  operator_id?: string
  starts_at: string
  ends_at: string
  latitude: number
  longitude: number
  booking_state: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'partial' | 'completed'
  total_amount: number
  advance_amount: number
  booking_number: string
  created_at: string
}

export interface GPSLocation {
  id: string
  machine_id: string
  booking_id: string
  latitude: number
  longitude: number
  speed_kmph: number
  heading: number
  accuracy_m: number
  recorded_at: string
}

export interface Operator {
  id: string
  user_id: string
  full_name: string
  phone: string
  years_experience: number
  rating_avg: number
  rating_count: number
  is_verified: boolean
  operator_status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

// ============ MARKETPLACE MODULE ============

export interface Product {
  id: string
  seller_id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  category_id: string
  brand_id: string
  sku: string
  quantity: number
  rating_avg: number
  rating_count: number
  product_status: 'active' | 'inactive' | 'delisted'
  is_featured: boolean
  created_at: string
}

export interface Cart {
  id: string
  user_id: string
  coupon_id?: string
  created_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  order_number: string
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'partial' | 'completed' | 'refunded'
  subtotal: number
  tax_amount: number
  discount_amount: number
  shipping_amount: number
  total_amount: number
  placed_at: string
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_item_id: string
  rating: number
  title: string
  body: string
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
}

// ============ ORGANIC MARKETPLACE MODULE ============

export interface OrganicFarm {
  id: string
  farmer_id: string
  user_id: string
  farm_name: string
  description: string
  total_area_acres: number
  organic_since: string
  is_certified: boolean
  contact_email: string
  contact_phone: string
  latitude: number
  longitude: number
  rating_avg: number
  rating_count: number
  farm_status: 'active' | 'pending_verification' | 'suspended'
  created_at: string
}

export interface OrganicCertificate {
  id: string
  farm_id: string
  cert_type: string
  certificate_number: string
  issued_on: string
  valid_from: string
  valid_until: string
  issuing_body: string
  cert_status: 'active' | 'expired' | 'suspended'
  is_verified: boolean
  created_at: string
}

export interface OrganicProduct {
  id: string
  farm_id: string
  name: string
  description: string
  price: number
  category_id: string
  quantity_available: number
  harvest_date: string
  best_before_date: string
  is_seasonal: boolean
  rating_avg: number
  rating_count: number
  product_status: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
}

// ============ ORDER & DELIVERY MODULE ============

export interface DeliveryAgent {
  id: string
  user_id: string
  full_name: string
  phone: string
  email: string
  vehicle_type: string
  vehicle_number: string
  license_number: string
  is_verified: boolean
  rating: number
  total_deliveries: number
  current_latitude: number
  current_longitude: number
  agent_status: 'active' | 'inactive' | 'on_duty'
  created_at: string
}

export interface Tracking {
  id: string
  order_id: string
  tracking_number: string
  tracking_status: 'pending' | 'picked' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  delivery_agent_id?: string
  current_latitude: number
  current_longitude: number
  estimated_delivery: string
  delivered_at?: string
  created_at: string
}

export interface ReturnRequest {
  id: string
  order_id: string
  buyer_id: string
  reason: string
  reason_note?: string
  return_status: 'pending' | 'approved' | 'rejected' | 'received' | 'refunded'
  quantity: number
  created_at: string
}

export interface DeliveryProof {
  id: string
  order_id: string
  tracking_id: string
  proof_type: 'photo' | 'signature' | 'otp'
  file_url?: string
  signed_name?: string
  otp_verified: boolean
  latitude: number
  longitude: number
  captured_at: string
}

// ============ AI ASSISTANT MODULE ============

export interface AIConversation {
  id: string
  user_id: string
  farmer_id?: string
  title: string
  language: 'en' | 'te' | 'hi'
  channel: 'web' | 'mobile' | 'voice'
  message_count: number
  is_archived: boolean
  last_message_at: string
  created_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  model: string
  tokens_prompt?: number
  tokens_completion?: number
  latency_ms?: number
  tool_calls?: any
  created_at: string
}

export interface DiseasePrediction {
  id: string
  farmer_id: string
  image_url: string
  crop_name: string
  predicted_disease: string
  confidence: number
  severity: 'mild' | 'moderate' | 'severe'
  diagnosis: string
  treatment: any
  alternatives: any
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface CropPrediction {
  id: string
  farmer_id: string
  crop_name: string
  season: string
  soil_type: string
  recommended_crops: string[]
  top_crop: string
  confidence: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface ImageAnalysis {
  id: string
  farmer_id: string
  image_url: string
  analysis_type: 'crop_health' | 'pest_detection' | 'deficiency_detection'
  labels: any
  result: any
  confidence: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

// ============ COMMON/SHARED TYPES ============

export interface User {
  id: string
  email: string
  phone: string
  full_name: string
  avatar_url?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export enum MODULE {
  WALLET = 'wallet',
  DRONE = 'drone',
  MARKETPLACE = 'marketplace',
  ORGANIC = 'organic',
  DELIVERY = 'delivery',
  AI = 'ai'
}

export interface ModuleAction {
  module: MODULE
  action: string
  data: any
}
