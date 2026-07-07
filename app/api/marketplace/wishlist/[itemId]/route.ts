import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * DELETE /api/marketplace/wishlist/[itemId]
 * Remove product from wishlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const { data: item } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("id", itemId)
      .single()

    if (!item || item.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", itemId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Remove from wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
