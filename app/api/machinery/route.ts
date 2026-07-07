import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/machinery
 * List all machinery (with filtering and pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "created_at"

    const supabase = await createClient()

    let query = supabase
      .from("v_machine_catalog")
      .select("*", { count: "exact" })

    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    // Apply sorting
    if (sortBy === "rating") {
      query = query.order("rating_avg", { ascending: false })
    } else if (sortBy === "price") {
      query = query.order("min_price", { ascending: true })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data: machines, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: machines,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get machinery error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET /api/machinery/:id
 * Get detailed machinery information
 */
export async function GET_DETAIL(request: NextRequest) {
  try {
    const machineId = request.nextUrl.pathname.split("/").pop()

    const supabase = await createClient()
    const { data: machine, error } = await supabase
      .from("machines")
      .select("*, pricing_rules(*), machine_reviews(*)")
      .eq("id", machineId)
      .single()

    if (error || !machine) {
      return NextResponse.json({ error: "Machinery not found" }, { status: 404 })
    }

    return NextResponse.json(machine)
  } catch (error) {
    console.error("[v0] Get machinery detail error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
