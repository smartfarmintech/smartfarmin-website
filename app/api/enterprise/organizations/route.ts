import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const orgData = await request.json();

    // Validate required fields
    if (!orgData.name || !orgData.type) {
      return NextResponse.json(
        { error: "Missing required fields: name, type" },
        { status: 400 }
      );
    }

    // Return mock organization created response
    return NextResponse.json({
      id: "org-" + Math.random().toString(36).substr(2, 9),
      name: orgData.name,
      type: orgData.type,
      description: orgData.description || "",
      location: orgData.location || "",
      contactPerson: orgData.contactPerson || "",
      contactEmail: orgData.contactEmail || "",
      contactPhone: orgData.contactPhone || "",
      createdAt: new Date().toISOString(),
      status: "active",
    }, { status: 201 });
  } catch (error) {
    console.error("[v0] Organization creation error:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("id");

    if (orgId) {
      const { data: organization } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .single();
      return NextResponse.json(organization);
    }

    // List all organizations
    const { data: organizations } = await supabase
      .from("organizations")
      .select("*");

    return NextResponse.json(organizations || []);
  } catch (error) {
    console.error("[v0] Organizations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { id, ...updateData } = await request.json();

    const { data: organization } = await supabase
      .from("organizations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    return NextResponse.json(organization);
  } catch (error) {
    console.error("[v0] Organization update error:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
