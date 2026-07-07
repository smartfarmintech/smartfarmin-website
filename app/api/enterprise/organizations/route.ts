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
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("id");

    if (orgId) {
      // Return mock organization
      return NextResponse.json({
        id: orgId,
        name: "Example Organization",
        type: "Corporate Farm",
        description: "A sample organization",
        location: "India",
        contactPerson: "Manager",
        contactEmail: "contact@org.com",
        members: 15,
        createdAt: new Date().toISOString(),
      });
    }

    // List mock organizations
    return NextResponse.json([
      {
        id: "org-1",
        name: "Green Valley Farm",
        type: "FPO",
        members: 45,
        status: "active",
      },
      {
        id: "org-2",
        name: "Tech Farms Ltd",
        type: "Corporate Farm",
        members: 28,
        status: "active",
      },
    ]);
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
    const { id, ...updateData } = await request.json();

    // Return updated mock organization
    return NextResponse.json({
      id,
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[v0] Organization update error:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
