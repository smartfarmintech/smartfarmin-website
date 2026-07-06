import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/farmers/me
 * Get current farmer's profile
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

    const { data: farmer, error } = await supabase
      .from("farmers")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(farmer)
  } catch (error) {
    console.error("[v0] Get farmer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/farmers/me/lands
 * Get farmer's lands
 */
export async function GET_LANDS(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    const { data: lands, error } = await supabase
      .from("lands")
      .select("*")
      .eq("farmer_id", farmer.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(lands)
  } catch (error) {
    console.error("[v0] Get lands error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/farmers/me/crops
 * Get farmer's active crop cycles
 */
export async function GET_CROPS(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    const { data: crops, error } = await supabase
      .from("v_active_crop_cycles")
      .select("*")
      .eq("farmer_id", farmer.id)
      .order("sowing_date", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(crops)
  } catch (error) {
    console.error("[v0] Get crops error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/farmers/me/overview
 * Get farmer's complete overview dashboard
 */
export async function GET_OVERVIEW(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: overview, error } = await supabase
      .from("v_farmer_overview")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error("[v0] Get overview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
