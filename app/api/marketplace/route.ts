import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  unit: z.string(),
  image_url: z.string().url().optional(),
})

/**
 * GET /api/marketplace
 * Get marketplace products with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "created_at"

    const from = (page - 1) * limit

    let query = supabase
      .from("marketplace_products")
      .select("*, seller:farmer_profiles(*), reviews:marketplace_reviews(rating)", { count: "exact" })
      .eq("status", "active")

    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    const { data: products, error, count } = await query
      .range(from, from + limit - 1)
      .order(sortBy, { ascending: sortBy === "price" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate average ratings
    const productsWithRating = products?.map((product: any) => ({
      ...product,
      avgRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length,
    })) || []

    return NextResponse.json({
      data: productsWithRating,
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

/**
 * POST /api/marketplace
 * Create new marketplace product
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a farmer
    const { data: farmer } = await supabase
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Only farmers can create products" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { data: product, error } = await supabase
      .from("marketplace_products")
      .insert({
        farmer_id: farmer.id,
        ...parsed.data,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
