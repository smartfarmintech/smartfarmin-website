import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const farmerProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string(),
  location: z.string(),
  farm_area: z.number().positive(),
  farm_type: z.string(),
  crops_grown: z.array(z.string()),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
})

/**
 * GET /api/profile/farmer
 * Get farmer profile
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
      .from("farmer_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[v0] Get farmer profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/profile/farmer
 * Update farmer profile
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
    const parsed = farmerProfileSchema.safeParse(body)

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
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!existing) {
      // Create new profile if doesn't exist
      const { data: profile, error } = await supabase
        .from("farmer_profiles")
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
      .from("farmer_profiles")
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
    console.error("[v0] Update farmer profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
