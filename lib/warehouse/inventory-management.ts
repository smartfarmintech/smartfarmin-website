"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Warehouse & Inventory Management System
 * Handles stock levels, warehouse locations, product categories, and supply chain
 */

export interface WarehouseLocation {
  id: string
  name: string
  address: string
  pincode: string
  latitude: number
  longitude: number
  type: "main" | "regional" | "local"
  capacity: number
  currentUtilization: number
  manager: string
  managerPhone: string
  createdAt: string
}

export interface InventoryProduct {
  id: string
  warehouseId: string
  productName: string
  category: "fertilizer" | "pesticide" | "seed" | "equipment" | "irrigation" | "organic"
  sku: string
  quantity: number
  unit: string // kg, litre, piece, etc
  reorderLevel: number
  reorderQuantity: number
  unitPrice: number
  supplier: string
  batchNumber: string
  expiryDate?: string
  storageLocation: string // Rack/Aisle/Bin location
  lastUpdated: string
}

export interface StockMovement {
  id: string
  productId: string
  warehouseId: string
  movementType: "inbound" | "outbound" | "transfer" | "damage" | "adjustment"
  quantity: number
  unit: string
  referenceId?: string // Booking ID, Order ID, etc
  reason: string
  notes?: string
  movedBy: string
  movedAt: string
  previousStock: number
  newStock: number
}

export interface InventoryAlert {
  id: string
  productId: string
  alertType: "low-stock" | "overstock" | "expiring" | "expired" | "damage-report"
  severity: "low" | "medium" | "high"
  message: string
  createdAt: string
  resolved: boolean
}

export interface SupplyChainOrder {
  id: string
  supplierId: string
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    productName: string
    quantity: number
    unit: string
    unitPrice: number
  }>
  totalValue: number
  paymentStatus: "unpaid" | "partial" | "paid"
}

/**
 * Get all warehouse locations
 */
export async function getWarehouses(organizationId?: string) {
  const supabase = await createClient()

  const query = supabase.from("warehouses").select("*")

  if (organizationId) {
    query.eq("org_id", organizationId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching warehouses:", error)
    return []
  }

  return (data || []) as WarehouseLocation[]
}

/**
 * Get warehouse details with inventory
 */
export async function getWarehouseDetails(warehouseId: string) {
  const supabase = await createClient()

  // Get warehouse info
  const { data: warehouse } = await supabase.from("warehouses").select("*").eq("id", warehouseId).single()

  // Get inventory
  const { data: inventory } = await supabase
    .from("inventory")
    .select("*")
    .eq("warehouse_id", warehouseId)
    .order("product_name", { ascending: true })

  // Get recent stock movements
  const { data: movements } = await supabase
    .from("stock_movements")
    .select("*")
    .eq("warehouse_id", warehouseId)
    .order("moved_at", { ascending: false })
    .limit(50)

  // Get active alerts
  const { data: alerts } = await supabase
    .from("inventory_alerts")
    .select("*")
    .eq("warehouse_id", warehouseId)
    .eq("resolved", false)

  return {
    warehouse,
    inventory: inventory || [],
    recentMovements: movements || [],
    activeAlerts: alerts || [],
  }
}

/**
 * Add inventory to warehouse
 */
export async function addInventory(
  _prev: ActionState,
  formData: {
    warehouseId: string
    productName: string
    category: string
    sku: string
    quantity: number
    unit: string
    unitPrice: number
    supplier: string
    batchNumber: string
    expiryDate?: string
    storageLocation: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("inventory").insert({
      warehouse_id: formData.warehouseId,
      product_name: formData.productName,
      category: formData.category,
      sku: formData.sku,
      quantity: formData.quantity,
      unit: formData.unit,
      unit_price: formData.unitPrice,
      supplier: formData.supplier,
      batch_number: formData.batchNumber,
      expiry_date: formData.expiryDate,
      storage_location: formData.storageLocation,
      reorder_level: Math.ceil(formData.quantity * 0.2), // 20% of quantity
      reorder_quantity: Math.ceil(formData.quantity * 0.5), // 50% of quantity
      last_updated: new Date().toISOString(),
    })

    if (error) throw error
    revalidatePath("/warehouse")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update inventory quantity (Inbound/Outbound)
 */
export async function updateInventoryQuantity(
  _prev: ActionState,
  productId: string,
  quantity: number,
  movementType: "inbound" | "outbound" | "adjustment",
  reason: string,
  referenceId?: string,
  notes?: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Get current product
    const { data: product } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", productId)
      .single()

    if (!product) throw new Error("Product not found")

    const previousStock = product.quantity
    const newStock = movementType === "outbound" ? previousStock - quantity : previousStock + quantity

    // Update inventory
    const { error: updateError } = await supabase
      .from("inventory")
      .update({ quantity: newStock, last_updated: new Date().toISOString() })
      .eq("id", productId)

    if (updateError) throw updateError

    // Log movement
    const { error: movementError } = await supabase.from("stock_movements").insert({
      product_id: productId,
      warehouse_id: product.warehouse_id,
      movement_type: movementType,
      quantity,
      unit: product.unit,
      reference_id: referenceId,
      reason,
      notes,
      moved_by: "system", // Should be current user
      moved_at: new Date().toISOString(),
      previous_stock: previousStock,
      new_stock: newStock,
    })

    if (movementError) throw movementError

    // Check for low stock alert
    if (newStock <= product.reorder_level) {
      await supabase.from("inventory_alerts").insert({
        product_id: productId,
        warehouse_id: product.warehouse_id,
        alert_type: "low-stock",
        severity: "high",
        message: `${product.product_name} stock level (${newStock}${product.unit}) is below reorder level`,
        created_at: new Date().toISOString(),
        resolved: false,
      })
    }

    revalidatePath("/warehouse")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Transfer inventory between warehouses
 */
export async function transferInventory(
  _prev: ActionState,
  productId: string,
  fromWarehouseId: string,
  toWarehouseId: string,
  quantity: number,
  reason: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Get product from source warehouse
    const { data: product } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", productId)
      .eq("warehouse_id", fromWarehouseId)
      .single()

    if (!product) throw new Error("Product not found in source warehouse")
    if (product.quantity < quantity) throw new Error("Insufficient quantity in source warehouse")

    // Reduce from source
    const { error: reduceError } = await supabase
      .from("inventory")
      .update({
        quantity: product.quantity - quantity,
        last_updated: new Date().toISOString(),
      })
      .eq("id", productId)

    if (reduceError) throw reduceError

    // Log outbound movement
    await supabase.from("stock_movements").insert({
      product_id: productId,
      warehouse_id: fromWarehouseId,
      movement_type: "transfer",
      quantity,
      unit: product.unit,
      reason: `Transfer to warehouse ${toWarehouseId}`,
      notes: reason,
      moved_by: "system",
      moved_at: new Date().toISOString(),
      previous_stock: product.quantity,
      new_stock: product.quantity - quantity,
    })

    // Check if product exists in destination warehouse
    const { data: destProduct } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", productId)
      .eq("warehouse_id", toWarehouseId)
      .single()

    if (destProduct) {
      // Update existing
      await supabase
        .from("inventory")
        .update({
          quantity: destProduct.quantity + quantity,
          last_updated: new Date().toISOString(),
        })
        .eq("id", destProduct.id)
    } else {
      // Create new entry in destination
      await supabase.from("inventory").insert({
        ...product,
        id: undefined,
        warehouse_id: toWarehouseId,
        quantity,
        last_updated: new Date().toISOString(),
      })
    }

    // Log inbound movement
    await supabase.from("stock_movements").insert({
      product_id: productId,
      warehouse_id: toWarehouseId,
      movement_type: "transfer",
      quantity,
      unit: product.unit,
      reason: `Received from warehouse ${fromWarehouseId}`,
      notes: reason,
      moved_by: "system",
      moved_at: new Date().toISOString(),
      previous_stock: destProduct?.quantity || 0,
      new_stock: (destProduct?.quantity || 0) + quantity,
    })

    revalidatePath("/warehouse")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get low stock alerts
 */
export async function getLowStockAlerts(warehouseId?: string) {
  const supabase = await createClient()

  const query = supabase
    .from("inventory_alerts")
    .select("*, inventory(*)")
    .eq("alert_type", "low-stock")
    .eq("resolved", false)

  if (warehouseId) {
    query.eq("warehouse_id", warehouseId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching alerts:", error)
    return []
  }

  return data || []
}

/**
 * Create purchase order
 */
export async function createPurchaseOrder(
  _prev: ActionState,
  formData: {
    supplierId: string
    items: Array<{
      productName: string
      quantity: number
      unit: string
      unitPrice: number
    }>
    expectedDelivery: string
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const totalValue = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    const { error } = await supabase.from("supply_chain_orders").insert({
      supplier_id: formData.supplierId,
      order_date: new Date().toISOString(),
      expected_delivery: formData.expectedDelivery,
      status: "pending",
      items: formData.items,
      total_value: totalValue,
      payment_status: "unpaid",
    })

    if (error) throw error
    revalidatePath("/warehouse")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get inventory summary
 */
export async function getInventorySummary(warehouseId?: string) {
  const supabase = await createClient()

  const query = supabase.from("inventory").select("*")

  if (warehouseId) {
    query.eq("warehouse_id", warehouseId)
  }

  const { data: inventory } = await query

  if (!inventory) return null

  // Calculate metrics
  const totalItems = inventory.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const totalValue = inventory.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0)
  const lowStockCount = inventory.filter((item: any) => item.quantity <= item.reorder_level).length
  const outOfStockCount = inventory.filter((item: any) => item.quantity === 0).length

  return {
    totalItems,
    totalValue,
    lowStockCount,
    outOfStockCount,
    productCount: inventory.length,
    byCategory: inventory.reduce(
      (acc: any, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity
        return acc
      },
      {}
    ),
  }
}

/**
 * Generate inventory report
 */
export async function generateInventoryReport(warehouseId?: string, period: "week" | "month" | "year" = "month") {
  const supabase = await createClient()

  const periodDays = period === "week" ? 7 : period === "month" ? 30 : 365
  const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  // Get movements in period
  const query = supabase.from("stock_movements").select("*").gte("moved_at", cutoffDate)

  if (warehouseId) {
    query.eq("warehouse_id", warehouseId)
  }

  const { data: movements } = await query

  // Get inventory snapshot
  const inventoryQuery = supabase.from("inventory").select("*")
  if (warehouseId) {
    inventoryQuery.eq("warehouse_id", warehouseId)
  }

  const { data: inventory } = await inventoryQuery

  return {
    period,
    generatedAt: new Date().toISOString(),
    totalMovements: movements?.length || 0,
    inbound: movements?.filter((m: any) => m.movement_type === "inbound").length || 0,
    outbound: movements?.filter((m: any) => m.movement_type === "outbound").length || 0,
    transfers: movements?.filter((m: any) => m.movement_type === "transfer").length || 0,
    currentInventory: inventory || [],
    summary: await getInventorySummary(warehouseId),
  }
}
