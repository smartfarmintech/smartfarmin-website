import { z } from "zod"
import {
  AVAILABILITY_STATUSES,
  BOOKING_STATES,
  DOC_VERIFICATION_STATUSES,
  FUEL_TYPES,
  MACHINE_OWNERSHIP_TYPES,
  MACHINE_STATUSES,
  MAINTENANCE_STATUSES,
  MAINTENANCE_TYPES,
  OPERATOR_DOC_TYPES,
  OPERATOR_STATUSES,
  PRICING_UNITS,
} from "./constants"

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === "" || v === null) return null
    const n = typeof v === "number" ? v : Number.parseFloat(v)
    return Number.isFinite(n) ? n : null
  })

// Comma/newline separated list -> string[] (trimmed, non-empty).
const stringList = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean),
  )

const boolFromForm = z
  .union([z.string(), z.boolean()])
  .optional()
  .transform((v) => v === true || v === "on" || v === "true")

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: optionalString,
    businessName: optionalString,
    ownershipType: z.enum(MACHINE_OWNERSHIP_TYPES),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  phone: optionalString,
  bio: optionalString,
  pincode: optionalString,
  addressLine1: optionalString,
  preferredLanguage: optionalString,
})

export const machineSchema = z.object({
  name: z.string().trim().min(1, "Machine name is required"),
  categoryId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  machineStatus: z.enum(MACHINE_STATUSES),
  ownershipType: z.enum(MACHINE_OWNERSHIP_TYPES),
  brand: optionalString,
  model: optionalString,
  manufactureYear: optionalNumber,
  registrationNo: optionalString,
  fuel: z.enum(FUEL_TYPES),
  powerHp: optionalNumber,
  description: optionalString,
  implementsIncluded: stringList,
  operatorIncluded: boolFromForm,
  baseLocation: optionalString,
  serviceRadiusKm: optionalNumber,
  latitude: optionalNumber,
  longitude: optionalNumber,
  imageUrl: optionalString,
  minBookingHours: optionalNumber,
})

export const operatorSchema = z.object({
  fullName: z.string().trim().min(2, "Operator name is required"),
  phone: optionalString,
  operatorStatus: z.enum(OPERATOR_STATUSES),
  yearsExperience: optionalNumber,
  skills: stringList,
  dailyWage: optionalNumber,
  photoUrl: optionalString,
})

export const availabilitySchema = z
  .object({
    machineId: z.string().uuid("Please select a machine"),
    slotStatus: z.enum(AVAILABILITY_STATUSES),
    startsAt: z.string().trim().min(1, "Start time is required"),
    endsAt: z.string().trim().min(1, "End time is required"),
    reason: optionalString,
  })
  .refine((d) => new Date(d.endsAt).getTime() > new Date(d.startsAt).getTime(), {
    message: "End time must be after start time",
    path: ["endsAt"],
  })

export const pricingSchema = z.object({
  machineId: z.string().uuid("Please select a machine"),
  name: optionalString,
  unit: z.enum(PRICING_UNITS),
  price: z.coerce.number().positive("Price must be greater than 0"),
  minUnits: optionalNumber,
  maxUnits: optionalNumber,
  operatorFee: z.coerce.number().min(0).default(0),
  fuelIncluded: boolFromForm,
  seasonStart: optionalDate,
  seasonEnd: optionalDate,
  validFrom: optionalDate,
  validUntil: optionalDate,
  isActive: boolFromForm,
  priority: z.coerce.number().int().min(0).default(0),
})

export const maintenanceSchema = z.object({
  machineId: z.string().uuid("Please select a machine"),
  maintType: z.enum(MAINTENANCE_TYPES),
  maintStatus: z.enum(MAINTENANCE_STATUSES),
  title: z.string().trim().min(1, "Title is required"),
  description: optionalString,
  scheduledAt: optionalDate,
  startedAt: optionalDate,
  completedAt: optionalDate,
  cost: optionalNumber,
  serviceProvider: optionalString,
  odometerHours: optionalNumber,
})

export const operatorDocumentSchema = z.object({
  operatorId: z.string().uuid("Please select an operator"),
  docType: z.enum(OPERATOR_DOC_TYPES),
  verificationStatus: z.enum(DOC_VERIFICATION_STATUSES).default("pending"),
  documentNumber: optionalString,
  documentUrl: optionalString,
  issuedOn: optionalDate,
  expiresOn: optionalDate,
})

export const bookingTransitionSchema = z.object({
  bookingId: z.string().uuid(),
  toState: z.enum(BOOKING_STATES),
  operatorId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  note: optionalString,
})

export const gpsPingSchema = z.object({
  machineId: z.string().uuid("Please select a machine"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  speedKmph: optionalNumber,
})

export type MachineInput = z.infer<typeof machineSchema>
export type OperatorInput = z.infer<typeof operatorSchema>
export type AvailabilityInput = z.infer<typeof availabilitySchema>
export type PricingInput = z.infer<typeof pricingSchema>
export type MaintenanceInput = z.infer<typeof maintenanceSchema>
