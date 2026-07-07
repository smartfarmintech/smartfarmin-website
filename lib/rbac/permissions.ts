"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Role-Based Access Control (RBAC) System
 * Manages permissions for SmartFarmin users across all modules
 */

export type UserRole =
  | "admin"
  | "enterprise_admin"
  | "enterprise_manager"
  | "field_agent"
  | "farmer"
  | "dealer"
  | "distributor"
  | "operator"
  | "telecaller"

export type Resource =
  | "crop_health"
  | "machinery"
  | "marketplace"
  | "payments"
  | "schemes"
  | "fleet"
  | "inventory"
  | "organization"
  | "reports"
  | "audit_logs"

export type Action = "create" | "read" | "update" | "delete" | "approve"

export interface Permission {
  id: string
  resource: Resource
  action: Action
  code: string
  name: string
  description: string
}

export interface RolePermission {
  roleId: string
  permissionId: string
  grantedAt: string
}

/**
 * Check if user has permission for resource action
 */
export async function checkPermission(
  userId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  const supabase = await createClient()

  // Get user's role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role_id")
    .eq("id", userId)
    .single()

  if (!profile?.role_id) return false

  // Check if role has this permission
  const { data: rolePerms, error } = await supabase
    .from("role_permissions")
    .select(
      `
      permissions (
        resource,
        action
      )
    `
    )
    .eq("role_id", profile.role_id)

  if (error) throw error

  return rolePerms?.some(
    (rp: any) =>
      rp.permissions.resource === resource && rp.permissions.action === action
  ) || false
}

/**
 * Get user's available permissions
 */
export async function getUserPermissions(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role_id")
    .eq("id", userId)
    .single()

  if (!profile?.role_id) return []

  const { data: rolePerms } = await supabase
    .from("role_permissions")
    .select(
      `
      permissions (
        resource,
        action,
        code
      )
    `
    )
    .eq("role_id", profile.role_id)

  return rolePerms?.map((rp: any) => rp.permissions) || []
}

/**
 * Seed default roles and permissions
 */
export async function seedDefaultRoles() {
  const supabase = await createClient()

  // Create roles
  const roles = [
    { name: "admin", level: 1, description: "Platform administrator" },
    { name: "enterprise_admin", level: 2, description: "Enterprise organization admin" },
    { name: "enterprise_manager", level: 3, description: "Enterprise manager" },
    { name: "field_agent", level: 4, description: "Field agent" },
    { name: "farmer", level: 5, description: "Farmer user" },
    { name: "operator", level: 6, description: "Machinery operator" },
    { name: "dealer", level: 7, description: "Product dealer" },
    { name: "distributor", level: 8, description: "Distributor" },
    { name: "telecaller", level: 9, description: "Sales telecaller" },
  ]

  for (const role of roles) {
    await supabase
      .from("roles")
      .upsert(
        {
          name: role.name,
          slug: role.name,
          level: role.level,
          description: role.description,
          is_system: true,
        },
        { onConflict: "name" }
      )
  }

  // Create permissions
  const permissions = [
    // Crop Health
    { resource: "crop_health", action: "read", code: "crop_health.read" },
    { resource: "crop_health", action: "create", code: "crop_health.create" },
    { resource: "crop_health", action: "update", code: "crop_health.update" },
    { resource: "crop_health", action: "delete", code: "crop_health.delete" },

    // Machinery
    { resource: "machinery", action: "read", code: "machinery.read" },
    { resource: "machinery", action: "create", code: "machinery.create" },
    { resource: "machinery", action: "update", code: "machinery.update" },
    { resource: "machinery", action: "delete", code: "machinery.delete" },

    // Fleet Management
    { resource: "fleet", action: "read", code: "fleet.read" },
    { resource: "fleet", action: "create", code: "fleet.create" },
    { resource: "fleet", action: "update", code: "fleet.update" },
    { resource: "fleet", action: "delete", code: "fleet.delete" },

    // Inventory
    { resource: "inventory", action: "read", code: "inventory.read" },
    { resource: "inventory", action: "create", code: "inventory.create" },
    { resource: "inventory", action: "update", code: "inventory.update" },
    { resource: "inventory", action: "delete", code: "inventory.delete" },

    // Organization
    { resource: "organization", action: "read", code: "organization.read" },
    { resource: "organization", action: "create", code: "organization.create" },
    { resource: "organization", action: "update", code: "organization.update" },
    { resource: "organization", action: "delete", code: "organization.delete" },

    // Reports
    { resource: "reports", action: "read", code: "reports.read" },
    { resource: "reports", action: "create", code: "reports.create" },

    // Audit Logs
    { resource: "audit_logs", action: "read", code: "audit_logs.read" },

    // Marketplace
    { resource: "marketplace", action: "read", code: "marketplace.read" },
    { resource: "marketplace", action: "create", code: "marketplace.create" },
    { resource: "marketplace", action: "update", code: "marketplace.update" },

    // Payments
    { resource: "payments", action: "read", code: "payments.read" },
    { resource: "payments", action: "create", code: "payments.create" },

    // Schemes
    { resource: "schemes", action: "read", code: "schemes.read" },
  ]

  for (const perm of permissions) {
    await supabase.from("permissions").upsert(
      {
        code: perm.code,
        resource: perm.resource,
        action: perm.action,
        name: `${perm.resource} ${perm.action}`,
        description: `Permission to ${perm.action} ${perm.resource}`,
        is_system: true,
      },
      { onConflict: "code" }
    )
  }

  // Map roles to permissions
  const rolePermissions: Record<string, string[]> = {
    admin: [
      // Admin has all permissions
      "crop_health.read",
      "crop_health.create",
      "crop_health.update",
      "crop_health.delete",
      "machinery.read",
      "machinery.create",
      "machinery.update",
      "machinery.delete",
      "fleet.read",
      "fleet.create",
      "fleet.update",
      "fleet.delete",
      "inventory.read",
      "inventory.create",
      "inventory.update",
      "inventory.delete",
      "organization.read",
      "organization.create",
      "organization.update",
      "organization.delete",
      "reports.read",
      "reports.create",
      "audit_logs.read",
      "marketplace.read",
      "marketplace.create",
      "marketplace.update",
      "payments.read",
      "payments.create",
      "schemes.read",
    ],
    enterprise_admin: [
      "crop_health.read",
      "crop_health.create",
      "crop_health.update",
      "machinery.read",
      "machinery.update",
      "fleet.read",
      "fleet.create",
      "fleet.update",
      "inventory.read",
      "inventory.create",
      "inventory.update",
      "organization.read",
      "organization.update",
      "reports.read",
      "reports.create",
      "audit_logs.read",
    ],
    enterprise_manager: [
      "crop_health.read",
      "machinery.read",
      "fleet.read",
      "fleet.update",
      "inventory.read",
      "inventory.update",
      "organization.read",
      "reports.read",
    ],
    field_agent: [
      "crop_health.read",
      "crop_health.create",
      "crop_health.update",
      "machinery.read",
      "schemes.read",
    ],
    farmer: [
      "crop_health.read",
      "crop_health.create",
      "crop_health.update",
      "machinery.read",
      "marketplace.read",
      "marketplace.create",
      "payments.read",
      "schemes.read",
    ],
    operator: ["machinery.read", "machinery.update", "fleet.read"],
    dealer: [
      "marketplace.read",
      "marketplace.create",
      "marketplace.update",
      "inventory.read",
      "inventory.create",
      "inventory.update",
      "payments.read",
    ],
    distributor: [
      "inventory.read",
      "inventory.create",
      "inventory.update",
      "organization.read",
      "reports.read",
    ],
    telecaller: [
      "schemes.read",
      "payments.read",
    ],
  }

  // Get all roles
  const { data: allRoles } = await supabase.from("roles").select("id, name")

  for (const role of allRoles || []) {
    const permCodes = rolePermissions[role.name] || []

    // Get permission IDs
    const { data: perms } = await supabase
      .from("permissions")
      .select("id, code")
      .in("code", permCodes)

    // Create role permissions
    for (const perm of perms || []) {
      await supabase.from("role_permissions").upsert(
        {
          role_id: role.id,
          permission_id: perm.id,
        },
        { onConflict: "role_id,permission_id" }
      )
    }
  }
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(
  userId: string,
  roleName: string
): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data: role } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single()

    if (!role) throw new Error("Role not found")

    const { error } = await supabase.from("user_profiles").update({
      role_id: role.id,
    }).eq("id", userId)

    if (error) throw error

    // Log audit
    await supabase.from("audit_logs").insert({
      action: "assign_role",
      entity_type: "user_profiles",
      entity_id: userId,
      metadata: { roleName },
      created_at: new Date().toISOString(),
    })

    return true
  } catch (err) {
    console.error("Error assigning role:", err)
    return false
  }
}

/**
 * Get user role details
 */
export async function getUserRole(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("user_profiles")
    .select(
      `
      role_id,
      roles (
        id,
        name,
        slug,
        description,
        level,
        role_permissions (
          permissions (
            id,
            code,
            resource,
            action,
            name
          )
        )
      )
    `
    )
    .eq("id", userId)
    .single()

  return data?.roles || null
}

/**
 * Create custom permission
 */
export async function createCustomPermission(
  resource: Resource,
  action: Action,
  name: string,
  description: string
) {
  const supabase = await createClient()

  const code = `${resource}.${action}`

  const { data, error } = await supabase
    .from("permissions")
    .insert({
      code,
      resource,
      action,
      name,
      description,
      is_system: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Grant permission to role
 */
export async function grantPermissionToRole(roleId: string, permissionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("role_permissions").insert({
    role_id: roleId,
    permission_id: permissionId,
  })

  if (error && error.code !== "23505") throw error // Ignore duplicate
  return data
}

/**
 * Revoke permission from role
 */
export async function revokePermissionFromRole(roleId: string, permissionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId)
    .eq("permission_id", permissionId)

  if (error) throw error
  return true
}
