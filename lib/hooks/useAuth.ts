"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone: string
  email: string
  avatar_url?: string
  role_id: string
  village_id?: string
  preferred_language: "en" | "te" | "hi"
  status: "active" | "inactive"
  is_verified: boolean
  email_verified_at?: string
  phone_verified_at?: string
}

interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  let supabase: any = null
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )
  } catch (error) {
    console.error("[v0] Supabase initialization error:", error)
  }

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) throw error
      setProfile(data as UserProfile)
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
      setProfile(null)
    }
  }, [supabase])

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setSession(data.session)
      setUser(data.session?.user || null)
      if (data.session?.user) {
        await loadProfile(data.session.user.id)
      }
    } catch (error) {
      console.error("[v0] Error refreshing auth:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, loadProfile])

  const signOut = useCallback(async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("[v0] Error signing out:", error)
    }
  }, [supabase, router])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    refresh()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user || null)
        if (newSession?.user) {
          await loadProfile(newSession.user.id)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [supabase, refresh, loadProfile])

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    signOut,
    refresh,
  }
}
