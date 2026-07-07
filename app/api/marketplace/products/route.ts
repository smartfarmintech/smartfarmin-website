import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/marketplace/products
 * List marketplace products with search, filter, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "newest"

    const supabase = await createClient()

    let query = supabase
      .from("v_product_catalog")
      .select("*", { count: "exact" })

    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,short_description.ilike.%${search}%,brand_name.ilike.%${search}%`,
      )
    }

    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice))
    }

    // Apply sorting
    if (sortBy === "price_low") {
      query = query.order("price", { ascending: true })
    } else if (sortBy === "price_high") {
      query = query.order("price", { ascending: false })
    } else if (sortBy === "rating") {
      query = query.order("rating_avg", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
