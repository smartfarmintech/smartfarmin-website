import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  createOrganization,
  getOrganizationById,
  updateOrganization,
  listOrganizationMembers,
  addMemberToOrganization,
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("id");

    if (orgId) {
      const organization = await getOrganizationById(supabase, orgId);
      return NextResponse.json(organization);
    }

    // List user's organizations
    const { data: organizations } = await supabase
      .from("organizations")
      .select("*")
      .or(
        `admin_id.eq.${user.id},members->>user_id.eq.${user.id}`
      );

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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    const organization = await updateOrganization(supabase, id, updateData, user.id);

    return NextResponse.json(organization);
  } catch (error) {
    console.error("[v0] Organization update error:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
