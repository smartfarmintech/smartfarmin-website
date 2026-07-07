'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, Role } from '@/lib/security/rbac'

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: Role[]
  fallbackUrl?: string
}

export function RoleGuard({ children, requiredRoles, fallbackUrl = '/login' }: RoleGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAuthorization()
  }, [])

  async function checkAuthorization() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(fallbackUrl)
        return
      }

      const userRole = await getUserRole(user.id)
      if (!userRole || !requiredRoles.includes(userRole)) {
        router.push('/unauthorized')
        return
      }

      setIsAuthorized(true)
    } catch (error) {
      console.error('Authorization check failed:', error)
      router.push(fallbackUrl)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
