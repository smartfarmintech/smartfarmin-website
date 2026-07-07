"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const FarmerProfileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string(),
  email: z.string().email().optional(),
  aadhaar_last4: z.string().length(4).optional(),
  pan_number: z.string().optional(),
  bank_account_last4: z.string().optional(),
  bank_name: z.string().optional(),
  ifsc_code: z.string().optional(),
  annual_income: z.number().optional(),
  household_size: z.number().optional(),
  education_level: z.string().optional(),
  social_category: z.string().optional(),
  upi_id: z.string().optional(),
})

/**
 * Get farmer profile
 */
export async function getFarmerProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("farmer_profiles")
    .select("*")
    .eq("farmer_id", (
      await supabase
        .from("farmers")
        .select("id")
        .eq("user_id", user.id)
        .single()
    ).data?.id)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

/**
 * Update farmer profile
 */
export async function updateFarmerProfile(data: z.infer<typeof FarmerProfileSchema>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const validated = FarmerProfileSchema.parse(data)

    // Get farmer
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return { ok: false, error: "Farmer profile not found" }
    }

    // Update profile
    const { data: profile, error } = await supabase
      .from("farmer_profiles")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("farmer_id", farmer.id)
      .select()
      .single()

    if (error) throw error

    // Update user profile
    await supabase.from("user_profiles").update({
      full_name: validated.full_name,
      phone: validated.phone,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id)

    revalidateTag("farmer-profile", "max")
    return { ok: true, profile }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

/**
 * Upload farm document
 */
export async function uploadFarmDocument(
  farmDocumentType: string,
  fileName: string,
  fileUrl: string,
  landId?: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return { ok: false, error: "Farmer not found" }
    }

    const { data: document, error } = await supabase
      .from("farm_documents")
      .insert({
        farmer_id: farmer.id,
        land_id: landId,
        document_type: farmDocumentType,
        file_name: fileName,
        file_url: fileUrl,
        mime_type: fileName.split(".").pop() || "application/octet-stream",
        file_size_bytes: 0,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("farmer-documents", "max")
    return { ok: true, document }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to upload document" }
  }
}

/**
 * Create land record
 */
export async function createLand(landData: {
  land_name: string
  survey_number?: string
  khata_number?: string
  area_value: number
  area_unit: string
  land_type: string
  ownership_type: string
  water_source?: string
  soil_type?: string
  latitude?: number
  longitude?: number
  village_id?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return { ok: false, error: "Farmer not found" }
    }

    const { data: land, error } = await supabase
      .from("lands")
      .insert({
        farmer_id: farmer.id,
        ...landData,
        created_by: user.id,
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("farmer-lands", "max")
    return { ok: true, land }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create land" }
  }
}

/**
 * Track crop cycle
 */
export async function createCropCycle(cropData: {
  land_id: string
  crop_name: string
  variety?: string
  sowing_date: string
  expected_harvest_date: string
  season: string
  area_value?: number
  area_unit?: string
  expected_yield?: number
  yield_unit?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return { ok: false, error: "Farmer not found" }
    }

    const { data: cropCycle, error } = await supabase
      .from("crop_cycles")
      .insert({
        farmer_id: farmer.id,
        ...cropData,
        status: "active",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidateTag("farmer-crops", "max")
    return { ok: true, cropCycle }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create crop cycle" }
  }
}
