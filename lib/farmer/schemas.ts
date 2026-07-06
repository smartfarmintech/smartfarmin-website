import { z } from "zod"
import {
  AREA_UNITS,
  CROP_CYCLE_STATUSES,
  CROP_SEASONS,
  FARM_DOCUMENT_TYPES,
  FARMER_TYPES,
  LAND_OWNERSHIP_TYPES,
  LAND_TYPES,
  SOIL_TYPES,
  TEMPERATURE_UNITS,
  WATER_SOURCES,
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

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null)),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    farmerType: z.enum(FARMER_TYPES),
    experienceYears: z.coerce.number().int().min(0).max(100).default(0),
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

export const landSchema = z.object({
  landName: optionalString,
  surveyNumber: optionalString,
  areaValue: z.coerce.number().positive("Area must be greater than 0"),
  areaUnit: z.enum(AREA_UNITS),
  ownershipType: z.enum(LAND_OWNERSHIP_TYPES),
  landType: z.enum(LAND_TYPES),
  soilType: z.enum(SOIL_TYPES).optional().nullable(),
  waterSource: z.enum(WATER_SOURCES).optional().nullable(),
  latitude: optionalNumber,
  longitude: optionalNumber,
})

export const cropCycleSchema = z.object({
  landId: z.string().uuid("Please select a land parcel"),
  cropName: z.string().trim().min(1, "Crop name is required"),
  variety: optionalString,
  season: z.enum(CROP_SEASONS),
  status: z.enum(CROP_CYCLE_STATUSES),
  sowingDate: optionalDate,
  expectedHarvestDate: optionalDate,
  actualHarvestDate: optionalDate,
  areaValue: optionalNumber,
  areaUnit: z.enum(AREA_UNITS),
  expectedYield: optionalNumber,
  actualYield: optionalNumber,
  yieldUnit: optionalString,
  seedSource: optionalString,
})

export const weatherPrefsSchema = z.object({
  alertsEnabled: z.coerce.boolean(),
  rainfallAlerts: z.coerce.boolean(),
  temperatureAlerts: z.coerce.boolean(),
  windAlerts: z.coerce.boolean(),
  temperatureUnit: z.enum(TEMPERATURE_UNITS),
  latitude: optionalNumber,
  longitude: optionalNumber,
})

export const topupSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than 0").max(100000, "Amount too large"),
  description: optionalString,
})

export const documentSchema = z.object({
  documentType: z.enum(FARM_DOCUMENT_TYPES),
  title: z.string().trim().min(1, "Title is required"),
  fileUrl: z.string().trim().url("Enter a valid URL"),
  landId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  issuedBy: optionalString,
  issueDate: optionalDate,
  expiryDate: optionalDate,
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CropCycleInput = z.infer<typeof cropCycleSchema>
export type LandInput = z.infer<typeof landSchema>
