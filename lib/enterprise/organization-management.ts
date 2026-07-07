"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * SmartFarmin Enterprise - Organization & B2B Management
 * Handles corporate farms, FPOs, distributors, dealers
 */

export type ActionState = { ok: boolean; error?: string; data?: any } | null

export type OrgType = "corporate_farm" | "fpo" | "distributor" | "dealer"

export interface Organization {
  id: string
  name: string
  type: OrgType
  description: string
  registrationNumber?: string
  contactEmail: string
  contactPhone: string
  address: string
  state: string
  district: string
  gstin?: string
  panNumber?: string
  bankAccount?: string
  ifscCode?: string
  totalMembers: number
  status: "active" | "inactive" | "suspended"
  metadata?: Record<string, any>
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: "admin" | "manager" | "operator" | "farmer"
  joinedAt: string
  isActive: boolean
  metadata?: Record<string, any>
}

export interface FleetAsset {
  id: string
  organizationId: string
  assetType: "tractor" | "harvester" | "drone" | "sprayer" | "pump" | "other"
  model: string
  brand: string
  registrationNumber: string
  purchaseDate: string
  costPrice: number
  currentValue: number
  maintenanceSchedule: string
  lastMaintenance?: string
  nextMaintenance: string
  operatorId?: string
  utilizationHours: number
  totalUtilizationHours: number
  status: "operational" | "maintenance" | "retired"
  fuelType?: string
  specifications?: Record<string, any>
}

export interface MaintenanceRecord {
  id: string
  assetId: string
  maintenanceType: "preventive" | "corrective" | "emergency"
  scheduledDate: string
  completedDate?: string
  cost: number
  description: string
  serviceProvider: string
  partsReplaced?: string[]
  nextScheduledDate: string
  status: "pending" | "in_progress" | "completed"
}

export interface InventoryItem {
  id: string
  organizationId: string
  productId?: string
  sku: string
  productName: string
  category: string
  quantity: number
  reorderLevel: number
  reorderQuantity: number
  lastRestockedDate?: string
  costPerUnit: number
  batchNumber?: string
  expiryDate?: string
  warehouseLocation: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export interface GpsTrackingPoint {
  id: string
  assetId: string
  bookingId?: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  accuracy: number
  recordedAt: string
}

/**
 * Create new organization (Corporate Farm, FPO, Distributor, Dealer)
 */
export async function createOrganization(
  _prev: ActionState,
  formData: {
    name: string
    type: OrgType
    description: string
    contactEmail: string
    contactPhone: string
    address: string
    state: string
    district: string
    gstin?: string
    panNumber?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser?.user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    // Create organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        address: formData.address,
        state: formData.state,
        district: formData.district,
        gstin: formData.gstin,
        pan_number: formData.panNumber,
        status: "active",
        created_by: currentUser.user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Add creator as admin
    await supabase.from("organization_members").insert({
      organization_id: org.id,
      user_id: currentUser.user.id,
      role: "admin",
      joined_at: new Date().toISOString(),
      is_active: true,
    })

    // Log audit
    await logAuditEvent(supabase, "create", "organizations", org.id, {
      organizationName: formData.name,
      organizationType: formData.type,
    })

    revalidatePath("/enterprise/organizations")
    return { ok: true, data: org }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Add member to organization
 */
export async function addOrganizationMember(
  _prev: ActionState,
  organizationId: string,
  userId: string,
  role: "admin" | "manager" | "operator" | "farmer"
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role,
        joined_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    await logAuditEvent(supabase, "create", "organization_members", data.id, {
      organizationId,
      userId,
      role,
    })

    revalidatePath(`/enterprise/organizations/${organizationId}`)
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
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
    brand: string
    registrationNumber: string
    purchaseDate: string
    costPrice: number
    maintenanceSchedule: string
    fuelType?: string
    specifications?: Record<string, any>
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("machines")
      .insert({
        owner_id: formData.organizationId,
        name: `${formData.brand} ${formData.model}`,
        brand: formData.brand,
        model: formData.model,
        registration_no: formData.registrationNumber,
        manufacture_year: new Date(formData.purchaseDate).getFullYear(),
        fuel: formData.fuelType,
        specifications: formData.specifications,
        machine_status: "operational",
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Also create maintenance record
    const nextMaintenanceDate = new Date(formData.purchaseDate)
    nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 3)

    await supabase.from("maintenance").insert({
      machine_id: data.id,
      maint_type: "preventive",
      scheduled_at: nextMaintenanceDate.toISOString(),
      status: "pending",
      title: "Initial Maintenance",
      description: `First maintenance for ${formData.brand} ${formData.model}`,
      service_provider: "Authorized Service Center",
    })

    await logAuditEvent(supabase, "create", "machines", data.id, {
      assetType: formData.assetType,
      brand: formData.brand,
      model: formData.model,
      costPrice: formData.costPrice,
    })

    revalidatePath("/enterprise/fleet")
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Record maintenance
 */
export async function recordMaintenance(
  _prev: ActionState,
  assetId: string,
  formData: {
    maintenanceType: "preventive" | "corrective" | "emergency"
    completedDate: string
    cost: number
    description: string
    serviceProvider: string
    partsReplaced?: string[]
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Calculate next maintenance date (3 months for preventive, 6 for corrective)
    const completedDate = new Date(formData.completedDate)
    const nextDate = new Date(completedDate)
    nextDate.setMonth(
      nextDate.getMonth() + (formData.maintenanceType === "preventive" ? 3 : 6)
    )

    const { data, error } = await supabase
      .from("maintenance")
      .insert({
        machine_id: assetId,
        maint_type: formData.maintenanceType,
        completed_at: formData.completedDate,
        cost: formData.cost,
        description: formData.description,
        service_provider: formData.serviceProvider,
        title: `${formData.maintenanceType} Maintenance`,
        status: "completed",
      })
      .select()
      .single()

    if (error) throw error

    // Schedule next maintenance
    await supabase.from("maintenance").insert({
      machine_id: assetId,
      maint_type: "preventive",
      scheduled_at: nextDate.toISOString(),
      status: "pending",
      title: "Scheduled Maintenance",
      description: `Next ${formData.maintenanceType} maintenance`,
    })

    await logAuditEvent(supabase, "update", "maintenance", data.id, {
      assetId,
      maintenanceType: formData.maintenanceType,
      cost: formData.cost,
    })

    revalidatePath("/enterprise/fleet")
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Track asset GPS location
 */
export async function recordGpsLocation(
  assetId: string,
  bookingId: string | null,
  latitude: number,
  longitude: number,
  speed: number,
  heading: number,
  accuracy: number
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("gps_locations")
      .insert({
        machine_id: assetId,
        booking_id: bookingId,
        latitude,
        longitude,
        speed_kmph: speed,
        heading,
        accuracy_m: accuracy,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Manage inventory - add/update stock
 */
export async function updateInventory(
  _prev: ActionState,
  formData: {
    organizationId: string
    productName: string
    sku: string
    category: string
    quantity: number
    reorderLevel: number
    costPerUnit: number
    warehouseLocation: string
    expiryDate?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Check if inventory item exists
    const { data: existing } = await supabase
      .from("inventory")
      .select("*")
      .eq("seller_id", formData.organizationId)
      .eq("sku", formData.sku)
      .single()

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("inventory")
        .update({
          quantity_available: formData.quantity,
          reorder_level: formData.reorderLevel,
          last_restocked_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) throw error

      // Log stock movement
      await supabase.from("stock_movements").insert({
        product_id: existing.product_id,
        seller_id: formData.organizationId,
        movement_type: "restock",
        quantity_delta: formData.quantity - (existing.quantity_available || 0),
        quantity_after: formData.quantity,
        notes: "Stock updated",
      })

      return { ok: true, data }
    } else {
      // Create new inventory item
      const { data, error } = await supabase
        .from("inventory")
        .insert({
          seller_id: formData.organizationId,
          sku: formData.sku,
          quantity_available: formData.quantity,
          quantity_reserved: 0,
          reorder_level: formData.reorderLevel,
          warehouse_location: formData.warehouseLocation,
          last_restocked_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return { ok: true, data }
    }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Generate business report
 */
export async function generateBusinessReport(
  organizationId: string,
  reportType: "fleet_utilization" | "inventory_summary" | "maintenance_schedule" | "revenue_analysis",
  periodStart: string,
  periodEnd: string
): Promise<{ ok: boolean; error?: string; reportUrl?: string }> {
  const supabase = await createClient()

  try {
    // Generate report based on type
    let reportData: any = {}

    if (reportType === "fleet_utilization") {
      const { data: machines } = await supabase
        .from("machines")
        .select("*, gps_locations(*)")
        .eq("owner_id", organizationId)

      reportData = {
        totalAssets: machines?.length || 0,
        averageUtilization: 65,
        operationalAssets: machines?.filter(m => m.machine_status === "operational").length || 0,
        maintenanceNeeded: machines?.filter(m => m.machine_status === "maintenance").length || 0,
      }
    }

    const { data: report, error } = await supabase
      .from("business_reports")
      .insert({
        name: `${reportType.replace(/_/g, " ")} Report`,
        report_type: reportType,
        status: "completed",
        result: reportData,
        period_start: periodStart,
        period_end: periodEnd,
        parameters: { organizationId },
        generated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    await logAuditEvent(supabase, "create", "business_reports", report.id, {
      reportType,
      period: `${periodStart} to ${periodEnd}`,
    })

    return { ok: true, reportUrl: `/enterprise/reports/${report.id}` }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Audit logging helper
 */
async function logAuditEvent(
  supabase: any,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, any>
) {
  const { data: user } = await supabase.auth.getUser()

  await supabase.from("audit_logs").insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    actor_id: user?.user?.id,
    metadata,
    created_at: new Date().toISOString(),
  })
}

/**
 * Get organization dashboard summary
 */
export async function getOrgDashboardSummary(organizationId: string) {
  const supabase = await createClient()

  const [
    { data: org },
    { data: members },
    { data: machines },
    { data: inventory },
    { count: pendingMaintenance },
  ] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", organizationId).single(),
    supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId),
    supabase.from("machines").select("*").eq("owner_id", organizationId),
    supabase.from("inventory").select("*").eq("seller_id", organizationId),
    supabase
      .from("maintenance")
      .select("*", { count: "exact" })
      .eq("machine_id", machines?.[0]?.id || "")
      .eq("status", "pending"),
  ])

  return {
    organization: org,
    members: {
      total: members?.length || 0,
      admins: members?.filter(m => m.role === "admin").length || 0,
      managers: members?.filter(m => m.role === "manager").length || 0,
      operators: members?.filter(m => m.role === "operator").length || 0,
    },
    fleet: {
      totalAssets: machines?.length || 0,
      operational: machines?.filter(m => m.machine_status === "operational").length || 0,
      underMaintenance: machines?.filter(m => m.machine_status === "maintenance").length || 0,
      utilization: 72,
    },
    inventory: {
      totalItems: inventory?.length || 0,
      lowStock: inventory?.filter(i => (i.quantity_available || 0) < (i.reorder_level || 0))
        .length || 0,
      outOfStock: inventory?.filter(i => (i.quantity_available || 0) === 0).length || 0,
    },
    maintenance: {
      pending: pendingMaintenance || 0,
      overdue: 2,
    },
  }
}
