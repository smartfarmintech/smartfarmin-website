/**
 * Role-Based Access Control utilities
 */
import { createClient } from "@/lib/supabase/server"

export enum Role {
  FOUNDER = "founder",
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  FARMER = "farmer",
  TELECALLER = "telecaller",
  FIELD_AGENT = "field_agent",
  MACHINERY_OPERATOR = "machinery_operator",
  DRONE_OPERATOR = "drone_operator",
}

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  REJECT = "reject",
  DOWNLOAD = "download",
}

export enum Resource {
  USER = "user",
  FARMER = "farmer",
  OPERATOR = "operator",
  MACHINERY = "machinery",
  BOOKING = "booking",
  DRONE = "drone",
  MARKETPLACE = "marketplace",
  WALLET = "wallet",
  LEAD = "lead",
  REPORT = "report",
  ADMIN_PANEL = "admin_panel",
  SCHEME = "scheme",
  ANALYTICS = "analytics",
}

/**
 * Get user's role
 */
export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role_id")
      .eq("id", userId)
      .single()

    if (!profile || !profile.role_id) return null
    
    // Get role name from roles table
    const { data: role } = await supabase
      .from("roles")
      .select("name")
      .eq("id", profile.role_id)
      .single()

    if (!role) return null
    return role.name as Role
  } catch {
    return null
  }
}

/**
 * Check if user has permission for resource action
 */
export async function hasPermission(
  userId: string,
  resource: Resource,
  action: Action,
): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Superadmin and founder have all permissions
    const role = await getUserRole(userId)
    if (role === Role.SUPER_ADMIN || role === Role.FOUNDER) return true

    // Check via RLS policy on permissions table
    const { data } = await supabase.rpc("has_permission", {
      p_user_id: userId,
      p_resource: resource,
      p_action: action,
    })

    return data === true
  } catch {
    return false
  }
}

/**
 * Verify user can access a resource owner's data
 */
export async function canAccessOwnerData(userId: string, ownerId: string): Promise<boolean> {
  if (userId === ownerId) return true

  // Admin/superadmin can access anyone's data
  const role = await getUserRole(userId)
  return role === Role.ADMIN || role === Role.SUPER_ADMIN || role === Role.FOUNDER
}

/**
 * Check if user is farmer (for farmer-specific pages)
 */
export async function isFarmer(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()
    return farmer !== null
  } catch {
    return false
  }
}

/**
 * Check if user is operator
 */
export async function isOperator(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: operator } = await supabase
      .from("operators")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()
    return operator !== null
  } catch {
    return false
  }
}

/**
 * Check if user is field agent
 */
export async function isFieldAgent(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: agent } = await supabase
      .from("field_agents")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()
    return agent !== null
  } catch {
    return false
  }
}

/**
 * Check if user is telecaller
 */
export async function isTelecaller(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: tc } = await supabase
      .from("telecallers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()
    return tc !== null
  } catch {
    return false
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data: permissions } = await supabase.rpc("get_user_permissions", {
      p_user_id: userId,
    })
    return permissions || []
  } catch {
    return []
  }
}

/**
 * Enforce minimum role requirement (redirect if insufficient)
 */
export async function enforceMinimumRole(userId: string, requiredRole: Role): Promise<boolean> {
  const userRole = await getUserRole(userId)
  if (!userRole) return false

  const roleHierarchy: Record<Role, number> = {
    [Role.FOUNDER]: 5,
    [Role.SUPER_ADMIN]: 4,
    [Role.ADMIN]: 3,
    [Role.FIELD_AGENT]: 2,
    [Role.TELECALLER]: 2,
    [Role.FARMER]: 1,
    [Role.MACHINERY_OPERATOR]: 1,
    [Role.DRONE_OPERATOR]: 1,
  }

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const names: Record<Role, string> = {
    [Role.FOUNDER]: "Founder",
    [Role.SUPER_ADMIN]: "Super Admin",
    [Role.ADMIN]: "Admin",
    [Role.FARMER]: "Farmer",
    [Role.TELECALLER]: "Telecaller",
    [Role.FIELD_AGENT]: "Field Agent",
    [Role.MACHINERY_OPERATOR]: "Machinery Operator",
    [Role.DRONE_OPERATOR]: "Drone Operator",
  }
  return names[role] || role
}

/**
 * Get default dashboard path for role
 */
export function getDashboardPath(role: Role | null): string {
  const paths: Record<Role, string> = {
    [Role.FOUNDER]: "/founder",
    [Role.SUPER_ADMIN]: "/admin",
    [Role.ADMIN]: "/admin",
    [Role.FARMER]: "/farmer",
    [Role.TELECALLER]: "/telecaller",
    [Role.FIELD_AGENT]: "/field-agent",
    [Role.MACHINERY_OPERATOR]: "/operator",
    [Role.DRONE_OPERATOR]: "/drone-operator",
  }
  return paths[role as Role] || "/app"
}
