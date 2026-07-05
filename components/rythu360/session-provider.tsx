"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { RoleId } from "@/lib/rythu360/roles"

const STORAGE_KEY = "rythu360.role"

type SessionContextValue = {
  roleId: RoleId | null
  ready: boolean
  login: (role: RoleId) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as RoleId | null
      if (stored) setRoleId(stored)
    } catch {
      // ignore storage errors
    }
    setReady(true)
  }, [])

  const login = useCallback((role: RoleId) => {
    setRoleId(role)
    try {
      window.localStorage.setItem(STORAGE_KEY, role)
    } catch {
      // ignore
    }
  }, [])

  const logout = useCallback(() => {
    setRoleId(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return (
    <SessionContext.Provider value={{ roleId, ready, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within a SessionProvider")
  return ctx
}
