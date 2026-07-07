/**
 * Role-based permissions matrix
 * Defines what each role can do across resources
 */

import { Role, Resource, Action } from './rbac'

export type PermissionMatrix = Record<Role, Record<Resource, Action[]>>

export const permissionsMatrix: PermissionMatrix = {
  [Role.FOUNDER]: {
    [Resource.USER]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.FARMER]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.APPROVE],
    [Resource.OPERATOR]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.APPROVE],
    [Resource.MACHINERY]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.BOOKING]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.DRONE]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.MARKETPLACE]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.WALLET]: [Action.READ, Action.UPDATE],
    [Resource.LEAD]: [Action.READ, Action.UPDATE],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [Action.READ, Action.UPDATE],
    [Resource.SCHEME]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.SUPER_ADMIN]: {
    [Resource.USER]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.FARMER]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.APPROVE],
    [Resource.OPERATOR]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.APPROVE],
    [Resource.MACHINERY]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.BOOKING]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.DRONE]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    [Resource.MARKETPLACE]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.WALLET]: [Action.READ, Action.UPDATE],
    [Resource.LEAD]: [Action.READ, Action.UPDATE],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [Action.READ, Action.UPDATE],
    [Resource.SCHEME]: [Action.READ, Action.UPDATE],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.ADMIN]: {
    [Resource.USER]: [Action.READ, Action.UPDATE],
    [Resource.FARMER]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.OPERATOR]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.MACHINERY]: [Action.READ, Action.UPDATE],
    [Resource.BOOKING]: [Action.READ, Action.UPDATE, Action.APPROVE],
    [Resource.DRONE]: [Action.READ, Action.UPDATE],
    [Resource.MARKETPLACE]: [Action.READ, Action.UPDATE],
    [Resource.WALLET]: [Action.READ],
    [Resource.LEAD]: [Action.READ, Action.UPDATE],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [Action.READ],
    [Resource.SCHEME]: [Action.READ],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.FARMER]: {
    [Resource.USER]: [Action.READ, Action.UPDATE],
    [Resource.FARMER]: [Action.READ, Action.UPDATE],
    [Resource.OPERATOR]: [Action.READ],
    [Resource.MACHINERY]: [Action.READ],
    [Resource.BOOKING]: [Action.CREATE, Action.READ, Action.UPDATE],
    [Resource.DRONE]: [Action.CREATE, Action.READ],
    [Resource.MARKETPLACE]: [Action.READ, Action.CREATE],
    [Resource.WALLET]: [Action.READ, Action.UPDATE],
    [Resource.LEAD]: [],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [],
    [Resource.SCHEME]: [Action.READ],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.TELECALLER]: {
    [Resource.USER]: [Action.READ],
    [Resource.FARMER]: [Action.READ, Action.UPDATE],
    [Resource.OPERATOR]: [Action.READ],
    [Resource.MACHINERY]: [Action.READ],
    [Resource.BOOKING]: [Action.READ],
    [Resource.DRONE]: [],
    [Resource.MARKETPLACE]: [],
    [Resource.WALLET]: [],
    [Resource.LEAD]: [Action.CREATE, Action.READ, Action.UPDATE],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [],
    [Resource.SCHEME]: [Action.READ],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.FIELD_AGENT]: {
    [Resource.USER]: [Action.READ],
    [Resource.FARMER]: [Action.READ, Action.UPDATE],
    [Resource.OPERATOR]: [Action.READ],
    [Resource.MACHINERY]: [Action.READ],
    [Resource.BOOKING]: [Action.READ, Action.UPDATE],
    [Resource.DRONE]: [Action.READ],
    [Resource.MARKETPLACE]: [],
    [Resource.WALLET]: [],
    [Resource.LEAD]: [],
    [Resource.REPORT]: [Action.READ, Action.DOWNLOAD],
    [Resource.ADMIN_PANEL]: [],
    [Resource.SCHEME]: [Action.READ],
    [Resource.ANALYTICS]: [Action.READ],
  },

  [Role.MACHINERY_OPERATOR]: {
    [Resource.USER]: [Action.READ, Action.UPDATE],
    [Resource.FARMER]: [Action.READ],
    [Resource.OPERATOR]: [Action.READ, Action.UPDATE],
    [Resource.MACHINERY]: [Action.READ],
    [Resource.BOOKING]: [Action.READ, Action.UPDATE],
    [Resource.DRONE]: [],
    [Resource.MARKETPLACE]: [],
    [Resource.WALLET]: [Action.READ],
    [Resource.LEAD]: [],
    [Resource.REPORT]: [Action.READ],
    [Resource.ADMIN_PANEL]: [],
    [Resource.SCHEME]: [],
    [Resource.ANALYTICS]: [],
  },

  [Role.DRONE_OPERATOR]: {
    [Resource.USER]: [Action.READ, Action.UPDATE],
    [Resource.FARMER]: [Action.READ],
    [Resource.OPERATOR]: [Action.READ, Action.UPDATE],
    [Resource.MACHINERY]: [],
    [Resource.BOOKING]: [Action.READ],
    [Resource.DRONE]: [Action.READ, Action.UPDATE],
    [Resource.MARKETPLACE]: [],
    [Resource.WALLET]: [Action.READ],
    [Resource.LEAD]: [],
    [Resource.REPORT]: [Action.READ],
    [Resource.ADMIN_PANEL]: [],
    [Resource.SCHEME]: [],
    [Resource.ANALYTICS]: [],
  },
}

/**
 * Check if a role can perform an action on a resource
 */
export function canPerformAction(role: Role, resource: Resource, action: Action): boolean {
  const rolePermissions = permissionsMatrix[role]
  if (!rolePermissions) return false

  const resourcePermissions = rolePermissions[resource]
  if (!resourcePermissions) return false

  return resourcePermissions.includes(action)
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Record<Resource, Action[]> {
  return permissionsMatrix[role] || {}
}
