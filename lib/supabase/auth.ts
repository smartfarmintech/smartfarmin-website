/**
 * Comprehensive authentication utilities for production
 */
import { createClient as createServerClient } from "./server"
import { createClient as createBrowserClient } from "./client"
import type { AuthError } from "@supabase/supabase-js"

export interface AuthResponse {
  ok: boolean
  error?: string
  data?: any
}

/**
 * Get the current authenticated user from the server
 */
export async function getCurrentUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Get the current user's session
 */
export async function getSession() {
  const supabase = await createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Refresh the current session's JWT token
 */
export async function refreshSession() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.refreshSession()
  if (error) throw error
  return data.session
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, metadata: Record<string, any> = {}) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
  return { data, error }
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })
  return { data, error }
}

/**
 * Update password with a reset token
 */
export async function updatePassword(password: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  return { data, error }
}

/**
 * Verify an email with an OTP token
 */
export async function verifyEmail(email: string, token: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })
  return { data, error }
}

/**
 * Resend email verification link
 */
export async function resendEmailVerification(email: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  })
  return { data, error }
}

/**
 * Get user's role from user_profiles
 */
export async function getUserRole() {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const supabase = await createServerClient()
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role_id")
      .eq("id", user.id)
      .single()

    return profile?.role_id
  } catch (error) {
    return null
  }
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(resourceCode: string, actionCode: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const supabase = await createServerClient()
    const { data: hasAccess } = await supabase.rpc("has_permission", {
      p_user_id: user.id,
      p_resource: resourceCode,
      p_action: actionCode,
    })

    return hasAccess === true
  } catch (error) {
    return false
  }
}

/**
 * Validate JWT token expiry
 */
export async function validateToken() {
  try {
    const user = await getCurrentUser()
    return user !== null
  } catch {
    return false
  }
}

/**
 * Log authentication event (audit trail)
 */
export async function logAuthEvent(
  eventType: "login" | "signup" | "logout" | "password_reset" | "email_verified" | "failed_login",
  metadata: Record<string, any> = {},
) {
  try {
    const user = await getCurrentUser()
    if (!user) return

    const supabase = await createServerClient()
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      entity_type: "auth",
      entity_id: user.id,
      action: eventType,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Failed to log auth event:", error)
  }
}

/**
 * Get user sessions for device tracking
 */
export async function getUserSessions() {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const supabase = await createServerClient()
    const { data: sessions } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    return sessions || []
  } catch (error) {
    return []
  }
}

/**
 * Revoke a specific session (logout from device)
 */
export async function revokeSession(sessionId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: "Not authenticated" }

    const supabase = await createServerClient()
    const { error } = await supabase
      .from("user_sessions")
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id)

    return { error }
  } catch (error) {
    return { error: String(error) }
  }
}

/**
 * Create login history entry
 */
export async function recordLoginHistory(
  email: string,
  status: "success" | "failed",
  metadata: Record<string, any> = {},
) {
  try {
    const supabase = await createServerClient()
    await supabase.from("login_history").insert({
      email,
      status,
      metadata,
    })
  } catch (error) {
    console.error("[v0] Failed to record login history:", error)
  }
}
