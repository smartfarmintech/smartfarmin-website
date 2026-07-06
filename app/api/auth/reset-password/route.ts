import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/auth/reset-password
 * Request a password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password`,
    })

    if (error) {
      // Don't leak if email exists
      return NextResponse.json({ success: true, message: "Check your email for password reset instructions" })
    }

    return NextResponse.json({
      success: true,
      message: "Check your email for password reset instructions",
    })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
