import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const reviewSchema = z.object({
  product_id: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3),
  comment: z.string().min(10),
})

/**
 * GET /api/marketplace/reviews
 * Get product reviews
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!productId) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 })
    }

    const from = (page - 1) * limit

    const { data: reviews, error, count } = await supabase
      .from("marketplace_reviews")
      .select(
        `*,
        buyer:farmer_profiles(name, avatar_url)`
      )
      .eq("product_id", productId)
      .range(from, from + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/marketplace/reviews
 * Create product review
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

    const body = await request.json()
    const parsed = reviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { product_id, rating, title, comment } = parsed.data

    // Get farmer profile
    const { data: farmer } = await supabase
      .from("farmer_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!farmer) {
      return NextResponse.json({ error: "Farmer profile not found" }, { status: 404 })
    }

    // Verify product exists
    const { data: product } = await supabase
      .from("marketplace_products")
      .select("id")
      .eq("id", product_id)
      .single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("marketplace_reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("buyer_id", farmer.id)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    const { data: review, error } = await supabase
      .from("marketplace_reviews")
      .insert({
        product_id,
        buyer_id: farmer.id,
        rating,
        title,
        comment,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("[v0] Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
