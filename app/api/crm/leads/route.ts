import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const createLeadSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string(),
  email: z.string().email().optional(),
  cropInterest: z.string().optional(),
  sourceId: z.string().uuid(),
  notes: z.string().optional(),
})

/**
 * GET /api/crm/leads
 * Get leads for telecaller
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let query = supabase
      .from("v_lead_pipeline")
      .select("*", { count: "exact" })
      .eq("assigned_telecaller", user.id)

    if (status) {
      query = query.eq("status_name", status)
    }

    if (priority) {
      query = query.eq("priority", priority)
    }

    const from = (page - 1) * limit
    query = query
      .range(from, from + limit - 1)
      .order("last_contacted_at", { ascending: false })

    const { data: leads, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get leads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/crm/leads
 * Create a new lead
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
    const parsed = createLeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { fullName, phone, email, cropInterest, sourceId, notes } = parsed.data

    // Get default lead status (open)
    const { data: defaultStatus } = await supabase
      .from("lead_status")
      .select("id")
      .eq("is_lost", false)
      .eq("is_won", false)
      .limit(1)
      .single()

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        full_name: fullName,
        phone,
        email: email || null,
        crop_interest: cropInterest || null,
        source_id: sourceId,
        status_id: defaultStatus?.id || null,
        assigned_to: user.id,
        notes: notes || null,
        temperature: "cold",
        priority: "medium",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("[v0] Create lead error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/crm/leads/:id
 * Update lead
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = request.nextUrl.pathname.split("/")[4]
    const body = await request.json()

    // Verify ownership
    const { data: lead } = await supabase
      .from("leads")
      .select("assigned_to")
      .eq("id", leadId)
      .single()

    if (!lead || lead.assigned_to !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: updated, error } = await supabase
      .from("leads")
      .update({
        ...body,
        last_contacted_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Update lead error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
