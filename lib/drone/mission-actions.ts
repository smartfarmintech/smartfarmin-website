"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { FlightPlan, NDVIAnalysis, PostFlightReport } from "./ai-engine"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Schedule drone mission
 */
export async function scheduleDroneMission(
  _prev: ActionState,
  formData: {
    farmerId: string
    droneId: string
    operatorId: string
    cropType: string
    areaAcres: number
    scheduledDate: string
    scheduledTime: string
    missionType: "imaging" | "spraying" | "monitoring"
    notes?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("drone_missions")
      .insert({
        farmer_id: formData.farmerId,
        drone_id: formData.droneId,
        operator_id: formData.operatorId,
        crop_type: formData.cropType,
        area_acres: formData.areaAcres,
        scheduled_date: formData.scheduledDate,
        scheduled_time: formData.scheduledTime,
        mission_type: formData.missionType,
        status: "scheduled",
        notes: formData.notes,
        created_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Start drone mission
 */
export async function startDroneMission(
  _prev: ActionState,
  missionId: string,
  flightPlan: FlightPlan
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error: missionError } = await supabase
      .from("drone_missions")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
        flight_plan: flightPlan,
      })
      .eq("id", missionId)

    if (missionError) throw missionError

    // Record flight
    const { error: flightError } = await supabase
      .from("drone_flights")
      .insert({
        mission_id: missionId,
        status: "in_progress",
        started_at: new Date().toISOString(),
        drone_id: flightPlan.flight_id,
      })

    if (flightError) throw flightError

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Complete drone mission
 */
export async function completeDroneMission(
  _prev: ActionState,
  missionId: string,
  report: PostFlightReport
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Update mission
    const { error: missionError } = await supabase
      .from("drone_missions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        area_covered_acres: report.area_covered_acres,
        post_flight_report: report,
      })
      .eq("id", missionId)

    if (missionError) throw missionError

    // Update flight record
    const { error: flightError } = await supabase
      .from("drone_flights")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        flight_duration_minutes: report.duration_minutes,
        battery_used_percent: report.battery_used_percent,
        coverage_quality: report.coverage_quality,
      })
      .eq("mission_id", missionId)

    if (flightError) throw flightError

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Record spray report
 */
export async function recordSprayReport(
  _prev: ActionState,
  missionId: string,
  formData: {
    quantityUsed: number
    coverageAcres: number
    sprayedDate: string
    weatherConditions: string
    operatorNotes?: string
    photoUrls?: string[]
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("spray_reports")
      .insert({
        mission_id: missionId,
        quantity_used_liters: formData.quantityUsed,
        coverage_acres: formData.coverageAcres,
        sprayed_date: formData.sprayedDate,
        weather_conditions: formData.weatherConditions,
        operator_notes: formData.operatorNotes,
        photo_urls: formData.photoUrls,
        created_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Record drone maintenance
 */
export async function recordDroneMaintenance(
  _prev: ActionState,
  droneId: string,
  formData: {
    maintenanceType: "routine" | "repair" | "inspection" | "battery_replacement"
    description: string
    maintenanceDate: string
    cost?: number
    nextMaintenanceDue?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error: logError } = await supabase
      .from("drone_maintenance_logs")
      .insert({
        drone_id: droneId,
        maintenance_type: formData.maintenanceType,
        description: formData.description,
        maintenance_date: formData.maintenanceDate,
        cost: formData.cost,
        next_maintenance_due: formData.nextMaintenanceDue,
        created_at: new Date().toISOString(),
      })

    if (logError) throw logError

    // Update drone status
    const { error: droneError } = await supabase
      .from("drones")
      .update({
        last_maintenance: formData.maintenanceDate,
        next_maintenance_due: formData.nextMaintenanceDue,
      })
      .eq("id", droneId)

    if (droneError) throw droneError

    revalidatePath("/operator/drones")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Record NDVI analysis
 */
export async function recordNDVIAnalysis(
  _prev: ActionState,
  missionId: string,
  analysis: NDVIAnalysis
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("ndvi_analyses")
      .insert({
        mission_id: missionId,
        ndvi_score: analysis.ndvi_score,
        vegetation_health: analysis.vegetation_health,
        stressed_zones: analysis.stressed_zones,
        recommendations: analysis.recommendations,
        processed_at: analysis.processed_at,
      })

    if (error) throw error

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Assign drone operator to mission
 */
export async function assignDroneOperator(
  _prev: ActionState,
  missionId: string,
  operatorId: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("drone_missions")
      .update({ operator_id: operatorId })
      .eq("id", missionId)

    if (error) throw error

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Upload mission images
 */
export async function uploadMissionImages(
  _prev: ActionState,
  missionId: string,
  imageUrls: string[]
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Get existing images
    const { data: mission } = await supabase
      .from("drone_missions")
      .select("image_urls")
      .eq("id", missionId)
      .single()

    const existingImages = (mission?.image_urls as string[]) || []
    const allImages = [...existingImages, ...imageUrls]

    const { error } = await supabase
      .from("drone_missions")
      .update({ image_urls: allImages })
      .eq("id", missionId)

    if (error) throw error

    revalidatePath("/farmer/drone-missions")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
