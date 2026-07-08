/**
 * API route protection middleware
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole, hasPermission, Resource, Action } from '@/lib/security/rbac'
import { canPerformAction } from './permissions-matrix'

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

/**
 * Protect API route with authentication
 */
export async function protectAPI(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: 'Missing authorization header',
      status: 401,
    }
  }

  return {
    error: null,
    status: 200,
  }
}

/**
 * Check if authenticated user has permission for resource action
 */
export async function requirePermission(
  userId: string,
  resource: Resource,
  action: Action,
): Promise<{ authorized: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get user role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role_id')
      .eq('id', userId)
      .single()

    if (!profile?.role_id) {
      return { authorized: false, error: 'User role not found' }
    }

    const { data: role } = await supabase
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single()

    if (!role?.name) {
      return { authorized: false, error: 'Invalid user role' }
    }

    // Check permissions matrix
    const authorized = canPerformAction(role.name as any, resource, action)

    return { authorized, error: authorized ? undefined : 'Permission denied' }
  } catch (error) {
    return { authorized: false, error: 'Permission check failed' }
  }
}

/**
 * API error response helper
 */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * API success response helper
 */
export function apiSuccess(data: any, status: number = 200) {
  return NextResponse.json({ data }, { status })
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing authorization')
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    return user
  } catch (error) {
    throw new UnauthorizedError('Failed to get user')
  }
}

/**
 * Wrap API handler with permission check
 */
export function withPermission(requiredResource: Resource, requiredAction: Action) {
  return async (handler: (req: NextRequest, user: unknown) => Promise<Response>, request: NextRequest) => {
    try {
      const user = await getAuthenticatedUser(request)
      const { authorized, error } = await requirePermission(user.id, requiredResource, requiredAction)

      if (!authorized) {
        return apiError(error || 'Permission denied', 403)
      }

      return handler(request, user)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return apiError(error.message, 401)
      }
      return apiError('Internal server error', 500)
    }
  }
}
