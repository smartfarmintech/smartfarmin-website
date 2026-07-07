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
 * Enhanced Fleet Machine with GPS tracking
 */
export interface FleetMachine {
  id: string
  name: string
  type: "tractor" | "harvester" | "thrower" | "sprayer" | "drill" | "pump" | "other"
  brand: string
  model: string
  registrationNumber: string
  yearOfManufacture: number
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  operatingStatus: "active" | "maintenance" | "inactive"
  lastServiceDate?: string
  nextServiceDate?: string
  kmHoursWorked: number
  purchaseCost: number
  currentValue: number
  fuelType: "diesel" | "petrol" | "electric"
  specifications: {
    power: number // HP
    wheelDrive: string
    transmission: string
    features: string[]
  }
  location: {
    latitude: number
    longitude: number
    address: string
  }
  totalBookings: number
  averageRating: number
  gpsEnabled: boolean
  gpsLastUpdate?: string
}

/**
 * Maintenance Record
 */
export interface MaintenanceRecord {
  id: string
  machineId: string
  maintenanceType: "routine" | "preventive" | "repair"
  serviceDate: string
  completionDate?: string
  cost: number
  serviceProvider: string
  description: string
  status: "pending" | "in-progress" | "completed"
  mileageKmHours: number
  nextScheduledDate?: string
}

/**
 * Machine Location GPS
 */
export interface MachineLocation {
  id: string
  machineId: string
  timestamp: string
  latitude: number
  longitude: number
  speed: number // km/h
  heading: number // degrees
  accuracy: number // meters
  altitude?: number
}

/**
 * Fleet Utilization Metrics
 */
export interface FleetUtilization {
  machineId: string
  utilizationPercentage: number
  totalHoursAvailable: number
  totalHoursBooked: number
  totalBookings: number
  averageBookingDuration: number
  revenue: number
  costOfOperation: number
  profitMargin: number
  peakUsageHours: string
}

/**
 * Machinery Alert
 */
export interface MachineryAlert {
  id: string
  machineId: string
  alertType: "maintenance" | "location" | "utilization" | "performance" | "document"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: string
  resolved: boolean
}

/**
 * Get all machines in fleet
 */
export async function getFleetMachines(organizationId?: string) {
  const supabase = await createClient()

  const query = supabase.from("machines").select("*")

  if (organizationId) {
    query.eq("owner_id", organizationId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching fleet:", error)
    return []
  }

  return (data || []) as FleetMachine[]
}

/**
 * Get machine details with full history
 */
export async function getMachineDetails(machineId: string) {
  const supabase = await createClient()

  // Get machine
  const { data: machine } = await supabase.from("machines").select("*").eq("id", machineId).single()

  // Get maintenance history
  const { data: maintenance } = await supabase
    .from("maintenance")
    .select("*")
    .eq("machine_id", machineId)
    .order("scheduled_at", { ascending: false })
    .limit(10)

  // Get GPS locations (recent)
  const { data: locations } = await supabase
    .from("gps_locations")
    .select("*")
    .eq("machine_id", machineId)
    .order("recorded_at", { ascending: false })
    .limit(100)

  // Get bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("machine_id", machineId)
    .order("starts_at", { ascending: false })
    .limit(10)

  return {
    machine,
    maintenanceHistory: maintenance || [],
    gpsTrack: locations || [],
    recentBookings: bookings || [],
  }
}

/**
 * Schedule maintenance
 */
export async function scheduleMaintenance(
  _prev: ActionState,
  formData: {
    machineId: string
    maintenanceType: "routine" | "preventive" | "repair"
    scheduledDate: string
    description: string
    estimatedCost?: number
    serviceProvider?: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("maintenance")
      .insert({
        machine_id: formData.machineId,
        maint_type: formData.maintenanceType,
        scheduled_at: formData.scheduledDate,
        description: formData.description,
        cost: formData.estimatedCost || 0,
        service_provider: formData.serviceProvider,
        status: "pending",
        maint_status: "pending",
        title: `${formData.maintenanceType} Maintenance`,
      })

    if (error) throw error
    revalidatePath("/enterprise/fleet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update maintenance status
 */
export async function updateMaintenanceStatus(
  _prev: ActionState,
  maintenanceId: string,
  status: "pending" | "in-progress" | "completed",
  completionDate?: string,
  actualCost?: number
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("maintenance")
      .update({
        maint_status: status,
        status,
        completed_at: completionDate,
        cost: actualCost,
      })
      .eq("id", maintenanceId)

    if (error) throw error
    revalidatePath("/enterprise/fleet")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Log machine location via GPS
 */
export async function logMachineLocation(
  _prev: ActionState,
  machineId: string,
  latitude: number,
  longitude: number,
  speed: number = 0,
  heading: number = 0,
  accuracy: number = 5,
  bookingId?: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("gps_locations")
      .insert({
        machine_id: machineId,
        booking_id: bookingId,
        latitude,
        longitude,
        speed_kmph: speed,
        heading,
        accuracy_m: accuracy,
        recorded_at: new Date().toISOString(),
      })

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get machine location history for map display
 */
export async function getMachineLocationHistory(machineId: string, hours: number = 24) {
  const supabase = await createClient()

  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("gps_locations")
    .select("*")
    .eq("machine_id", machineId)
    .gte("recorded_at", cutoffTime)
    .order("recorded_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching GPS history:", error)
    return []
  }

  return (data || []) as MachineLocation[]
}

/**
 * Calculate fleet utilization metrics
 */
export async function calculateFleetUtilization(machineId: string, period: "week" | "month" | "year" = "month") {
  const supabase = await createClient()

  // Get machine
  const { data: machine } = await supabase.from("machines").select("*").eq("id", machineId).single()

  // Get bookings in period
  const periodDays = period === "week" ? 7 : period === "month" ? 30 : 365
  const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("machine_id", machineId)
    .gte("starts_at", cutoffDate)

  // Get maintenance downtime
  const { data: maintenance } = await supabase
    .from("maintenance")
    .select("*")
    .eq("machine_id", machineId)
    .eq("status", "completed")
    .gte("scheduled_at", cutoffDate)

  // Calculate metrics
  const totalHoursAvailable = periodDays * 24
  const totalHoursBooked = (bookings || []).reduce((sum, b) => {
    const start = new Date(b.starts_at).getTime()
    const end = new Date(b.ends_at).getTime()
    return sum + (end - start) / (1000 * 60 * 60)
  }, 0)

  const maintenanceDowntime = (maintenance || []).length * 4 // assume 4 hours per maintenance
  const utilizationPercentage = ((totalHoursBooked / (totalHoursAvailable - maintenanceDowntime)) * 100).toFixed(2)

  const totalRevenue = (bookings || []).reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const operatingCost = totalHoursBooked * 50 // assume 50/hour operating cost
  const profitMargin = totalRevenue - operatingCost

  return {
    machineId,
    utilizationPercentage: parseFloat(utilizationPercentage as string),
    totalHoursAvailable,
    totalHoursBooked,
    totalBookings: bookings?.length || 0,
    averageBookingDuration: totalHoursBooked / (bookings?.length || 1),
    revenue: totalRevenue,
    costOfOperation: operatingCost,
    profitMargin,
    peakUsageHours: "10 AM - 2 PM",
  } as FleetUtilization
}

/**
 * Generate fleet alerts
 */
export async function generateFleetAlerts(machineId: string): Promise<MachineryAlert[]> {
  const supabase = await createClient()

  const alerts: MachineryAlert[] = []

  // Get machine details
  const { data: machine } = await supabase.from("machines").select("*").eq("id", machineId).single()

  // Check maintenance alert
  if (machine?.status === "maintenance" || machine?.machine_status === "maintenance") {
    alerts.push({
      id: `alert-${machineId}-1`,
      machineId,
      alertType: "maintenance",
      severity: "high",
      title: "Maintenance In Progress",
      description: "Machine is currently under maintenance",
      timestamp: new Date().toISOString(),
      resolved: false,
    })
  }

  // Check utilization
  const utilization = await calculateFleetUtilization(machineId, "week")
  if (utilization.utilizationPercentage < 20) {
    alerts.push({
      id: `alert-${machineId}-2`,
      machineId,
      alertType: "utilization",
      severity: "low",
      title: "Low Machine Utilization",
      description: `Machine utilization is only ${utilization.utilizationPercentage}% this week`,
      timestamp: new Date().toISOString(),
      resolved: false,
    })
  }

  return alerts
}

/**
 * Get fleet overview dashboard
 */
export async function getFleetOverview(organizationId?: string) {
  const supabase = await createClient()

  const machines = await getFleetMachines(organizationId)

  const totalMachines = machines.length
  const activeMachines = machines.filter((m) => m.operatingStatus === "active").length
  const maintenanceMachines = machines.filter((m) => m.operatingStatus === "maintenance").length

  // Get total revenue this month
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: monthlyBookings } = await supabase
    .from("bookings")
    .select("total_amount")
    .gte("created_at", monthAgo)

  const totalRevenue = monthlyBookings?.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0) || 0

  return {
    totalMachines,
    activeMachines,
    maintenanceMachines,
    inactiveMachines: totalMachines - activeMachines - maintenanceMachines,
    totalRevenue,
    averageUtilization: machines.length > 0 ? (activeMachines / totalMachines * 100).toFixed(2) : "0",
    machines,
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
    registrationNumber: string
    purchaseDate: string
    costPrice: number
    maintenanceSchedule: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("machines")
      .insert({
        owner_id: formData.organizationId,
        category_id: formData.assetType,
        model: formData.model,
        registration_no: formData.registrationNumber,
        created_at: new Date().toISOString(),
        status: "active",
        machine_status: "active",
        name: `${formData.model} - ${formData.registrationNumber}`,
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
