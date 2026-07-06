"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Fleet asset management
 */
export interface FleetAsset {
  id: string
  organizationId: string
  assetType: "tractor" | "harvester" | "drone" | "sprayer" | "pump"
  model: string
  registrationNumber: string
  purchaseDate: string
  costPrice: number
  currentValue: number
  maintenanceSchedule: string
  lastMaintenance: string
  nextMaintenance: string
  operatorId?: string
  status: "operational" | "maintenance" | "retired"
}

/**
 * Register fleet asset
 */
export async function registerFleetAsset(
  _prev: ActionState,
  formData: {
    organizationId: string
    assetType: string
    model: string
    registrationNumber: string
    purchaseDate: string
    costPrice: number
    maintenanceSchedule: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("fleet_assets")
      .insert({
        organization_id: formData.organizationId,
        asset_type: formData.assetType,
        model: formData.model,
        registration_number: formData.registrationNumber,
        purchase_date: formData.purchaseDate,
        cost_price: formData.costPrice,
        current_value: formData.costPrice,
        maintenance_schedule: formData.maintenanceSchedule,
        status: "operational",
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    revalidatePath("/enterprise/fleet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Assign asset to operator
 */
export async function assignAssetToOperator(
  _prev: ActionState,
  assetId: string,
  operatorId: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("fleet_assets")
      .update({ operator_id: operatorId })
      .eq("id", assetId)

    if (error) throw error
    revalidatePath("/enterprise/fleet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Record asset usage/utilization
 */
export async function recordAssetUtilization(
  _prev: ActionState,
  assetId: string,
  formData: {
    usageDate: string
    usageHours: number
    taskType: string
    fieldSize: number
    operatorNotes?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("asset_utilization")
      .insert({
        asset_id: assetId,
        usage_date: formData.usageDate,
        usage_hours: formData.usageHours,
        task_type: formData.taskType,
        field_size_acres: formData.fieldSize,
        operator_notes: formData.operatorNotes,
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    revalidatePath("/enterprise/fleet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * FPO (Farmer Producer Organization) management
 */
export interface FPO {
  id: string
  name: string
  district: string
  state: string
  memberCount: number
  registrationNumber: string
  bankAccount: string
  president: string
  vice_president: string
  treasurer: string
  createdAt: string
}

/**
 * Register FPO
 */
export async function registerFPO(
  _prev: ActionState,
  formData: {
    name: string
    district: string
    state: string
    registrationNumber: string
    bankAccount: string
    president: string
    vicePpresident: string
    treasurer: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("fpos")
      .insert({
        name: formData.name,
        district: formData.district,
        state: formData.state,
        registration_number: formData.registrationNumber,
        bank_account: formData.bankAccount,
        president: formData.president,
        vice_president: formData.vicePpresident,
        treasurer: formData.treasurer,
        member_count: 0,
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    revalidatePath("/enterprise/fpo")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Dealer portal management
 */
export interface Dealer {
  id: string
  name: string
  contactPerson: string
  phoneNumber: string
  district: string
  dealershipType: "official" | "authorized" | "distributor"
  commissionRate: number
  targetRevenue: number
  status: "active" | "inactive"
}

/**
 * Register dealer
 */
export async function registerDealer(
  _prev: ActionState,
  formData: {
    name: string
    contactPerson: string
    phoneNumber: string
    district: string
    dealershipType: string
    commissionRate: number
    targetRevenue: number
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("dealers")
      .insert({
        name: formData.name,
        contact_person: formData.contactPerson,
        phone_number: formData.phoneNumber,
        district: formData.district,
        dealership_type: formData.dealershipType,
        commission_rate: formData.commissionRate,
        target_revenue: formData.targetRevenue,
        status: "active",
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    revalidatePath("/enterprise/dealers")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Warehouse and inventory management
 */
export interface WarehouseInventory {
  id: string
  warehouseId: string
  productId: string
  quantity: number
  reorderLevel: number
  location: string
  lastUpdated: string
}

/**
 * Update warehouse inventory
 */
export async function updateWarehouseInventory(
  _prev: ActionState,
  warehouseId: string,
  productId: string,
  quantity: number,
  operation: "add" | "remove"
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { data: existing } = await supabase
      .from("warehouse_inventory")
      .select("quantity")
      .eq("warehouse_id", warehouseId)
      .eq("product_id", productId)
      .single()

    const newQuantity =
      operation === "add"
        ? (existing?.quantity || 0) + quantity
        : (existing?.quantity || 0) - quantity

    if (newQuantity < 0) {
      throw new Error("Insufficient inventory")
    }

    const { error } = await supabase
      .from("warehouse_inventory")
      .upsert({
        warehouse_id: warehouseId,
        product_id: productId,
        quantity: newQuantity,
        last_updated: new Date().toISOString(),
      })

    if (error) throw error
    revalidatePath("/enterprise/warehouse")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Role-based access control
 */
export interface RolePermission {
  role: "admin" | "manager" | "operator" | "farmer" | "dealer" | "fpo_president"
  permissions: string[]
}

/**
 * Audit logging
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes?: Record<string, any>
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        changes: changes || {},
        ip_address: "127.0.0.1",
        user_agent: "",
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Generate enterprise reports
 */
export async function generateEnterpriseReport(
  organizationId: string,
  reportType: "fleet" | "fpo" | "dealer" | "inventory" | "revenue",
  dateRange: { from: string; to: string }
): Promise<any> {
  const supabase = await createClient()

  try {
    let query

    switch (reportType) {
      case "fleet":
        query = supabase
          .from("fleet_assets")
          .select("*")
          .eq("organization_id", organizationId)
        break

      case "fpo":
        query = supabase
          .from("fpos")
          .select("*")
          .eq("organization_id", organizationId)
        break

      case "inventory":
        query = supabase
          .from("warehouse_inventory")
          .select("*")
          .eq("organization_id", organizationId)
        break

      default:
        throw new Error("Unknown report type")
    }

    const { data, error } = await query

    if (error) throw error

    return {
      ok: true,
      report: {
        type: reportType,
        organizationId,
        dateRange,
        generatedAt: new Date().toISOString(),
        data: data || [],
      },
    }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
