import { z } from "zod"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

// Farmer Profile Schemas
export const farmerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  location: z.string().min(5, "Please enter a valid location"),
  total_land_area: z.number().positive("Land area must be positive"),
  crop_types: z.array(z.string()).min(1, "Select at least one crop type"),
})

// Operator Profile Schemas
export const operatorProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/),
  machine_expertise: z.array(z.string()).min(1),
  hourly_rate: z.number().positive(),
  location: z.string().min(5),
})

// Machinery Booking Schemas
export const bookingCreateSchema = z.object({
  machine_id: z.string().uuid("Invalid machine ID"),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  operator_id: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
})

export const bookingUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]),
  operator_id: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
})

// Marketplace Schemas
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10),
  price: z.number().positive("Price must be positive"),
  category_id: z.string().uuid(),
  sku: z.string().min(3),
  quantity: z.number().int().min(0),
})

export const orderCreateSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
  shipping_address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postal_code: z.string().regex(/^[0-9]{6}$/),
  }),
})

export const reviewSchema = z.object({
  product_id: z.string().uuid(),
  order_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
})

// Wallet Schemas
export const walletTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  transaction_type: z.enum([
    "credit",
    "debit",
    "refund",
    "subscription",
    "withdrawal",
  ]),
  description: z.string().min(5),
})

export const addFundsSchema = z.object({
  amount: z.number().positive("Amount must be at least ₹100"),
  payment_method: z.enum(["razorpay", "bank_transfer"]),
})

// Drone Service Schemas
export const droneServiceBookingSchema = z.object({
  service_type: z.enum(["survey", "spraying", "monitoring"]),
  land_area: z.number().positive(),
  start_date: z.string().datetime(),
  operator_id: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
})

// Notification Schemas
export const notificationPreferencesSchema = z.object({
  email_bookings: z.boolean().default(true),
  email_orders: z.boolean().default(true),
  email_payments: z.boolean().default(true),
  sms_urgent: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
})

// Government Schemes Schemas
export const schemeApplicationSchema = z.object({
  scheme_id: z.string().uuid(),
  land_area: z.number().positive(),
  crop_type: z.string(),
  annual_income: z.number().positive(),
  supporting_documents: z.array(z.string().url()).optional(),
})

// Report Schemas
export const reportFiltersSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  report_type: z.enum(["sales", "bookings", "revenue", "expenses"]).optional(),
  status: z.string().optional(),
})

// Pagination
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
})

// Helper function to validate input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { valid: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(data)
    return { valid: true, data: validated }
  } catch (error: any) {
    return {
      valid: false,
      error: error.errors?.[0]?.message || "Validation failed",
    }
  }
}
