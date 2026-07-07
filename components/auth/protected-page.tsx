/**
 * Server-side protected page wrapper
 * Ensures user is authenticated and has required permissions before rendering
 */
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasPermission, Resource, Action, enforceMinimumRole, Role } from "@/lib/security/rbac"

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRole?: Role
  requiredResource?: Resource
  requiredAction?: Action
}

export async function ProtectedPage({
  children,
  requiredRole,
  requiredResource,
  requiredAction,
}: ProtectedPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/farmer/login")
  }

  // Check role requirement
  if (requiredRole) {
    const hasRole = await enforceMinimumRole(user.id, requiredRole)
    if (!hasRole) {
      redirect("/unauthorized")
    }
  }

  // Check permission requirement
  if (requiredResource && requiredAction) {
    const hasAccess = await hasPermission(user.id, requiredResource, requiredAction)
    if (!hasAccess) {
      redirect("/unauthorized")
    }
  }

  return <>{children}</>
}

/**
 * Utility to check auth in client components (hook)
 */
export async function getCurrentUserOrRedirect() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/farmer/login")
  }

  return user
}

/**
 * 401 Unauthorized page
 */
export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">401</h1>
        <p className="mt-2 text-xl text-muted-foreground">You don't have permission to access this page</p>
      </div>
    </div>
  )
}
