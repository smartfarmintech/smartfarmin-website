import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createOrganization,
  addOrganizationMember,
} from "@/lib/enterprise/organization-management";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgData = await request.json();

    const organization = await createOrganization(
      supabase,
      {
        name: orgData.name,
        type: orgData.type,
        description: orgData.description,
        location: orgData.location,
        contactPerson: orgData.contactPerson,
        contactEmail: orgData.contactEmail,
        contactPhone: orgData.contactPhone,
      },
      user.id
    );

    return NextResponse.json(organization, { status: 201 });
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
