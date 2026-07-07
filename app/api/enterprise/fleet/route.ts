import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { action, data } = await request.json();

    if (action === "register-asset") {
      const { data: machine } = await supabase
        .from("machines")
        .insert({
          organization_id: data.organizationId,
          asset_type: data.assetType,
          name: data.assetName,
          registration_number: data.registrationNumber,
          purchase_date: data.purchaseDate,
          purchase_price: data.purchasePrice,
          current_condition: data.currentCondition,
          operator_id: data.operatorId,
        })
        .select()
        .single();

      return NextResponse.json(machine, { status: 201 });
    }

    if (action === "schedule-maintenance") {
      const { data: maintenance } = await supabase
        .from("maintenance")
        .insert({
          machine_id: data.machineId,
          maintenance_type: data.maintenanceType,
          scheduled_date: data.scheduledDate,
          estimated_cost: data.estimatedCost,
          technician: data.technician,
        })
        .select()
        .single();

      return NextResponse.json(maintenance, { status: 201 });
    }

    if (action === "update-gps") {
      const { data: location } = await supabase
        .from("gps_locations")
        .insert({
          machine_id: data.machineId,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      return NextResponse.json(location);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[v0] Fleet API error:", error);
    return NextResponse.json(
      { error: "Failed to process fleet operation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("orgId");

    // Get fleet stats
    const { data: machines } = await supabase
      .from("machines")
      .select("*")
      .eq("organization_id", organizationId);

    const { data: maintenance } = await supabase
      .from("maintenance")
      .select("*")
      .eq("scheduled_date", `gte.${new Date().toISOString()}`);

    const stats = {
      totalAssets: machines?.length || 0,
      activeNow: machines?.filter((m) => m.current_condition === "Excellent").length || 0,
      maintenanceNeeded: maintenance?.filter((m) => m.status === "pending").length || 0,
      utilizationRate: 75,
    };

    return NextResponse.json({
      machines: machines || [],
      stats,
    });
  } catch (error) {
    console.error("[v0] Fleet fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fleet data" },
      { status: 500 }
    );
  }
}
