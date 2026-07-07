import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const operatorProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string(),
  location: z.string(),
  experience_years: z.number().int().min(0),
  machines_operated: z.array(z.string()),
  certifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
  license_number: z.string().optional(),
})

/**
 * GET /api/profile/operator
 * Get operator profile
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from("operator_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[v0] Get operator profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/profile/operator
 * Update operator profile
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = operatorProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    // Check if profile exists
    const { data: existing } = await supabase
      .from("operator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!existing) {
      // Create new profile if doesn't exist
      const { data: profile, error } = await supabase
        .from("operator_profiles")
        .insert({
          user_id: user.id,
          ...parsed.data,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(profile, { status: 201 })
    }

    // Update existing profile
    const { data: profile, error } = await supabase
      .from("operator_profiles")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[v0] Update operator profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
