import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/auth/session
 * Get the current user's session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role_id, status")
      .eq("id", user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    })
  } catch (error) {
    console.error("[v0] Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/auth/refresh
 * Refresh the session token
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      session: data.session,
    })
  } catch (error) {
    console.error("[v0] Refresh session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
