import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  registerAsset,
  scheduleMaintenance,
  updateGPSLocation,
  getFleetStatus,
  getMaintenanceReport,
} from "@/lib/enterprise/fleet-management";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();

    if (action === "register-asset") {
      const asset = await registerAsset(supabase, {
        organizationId: data.organizationId,
        assetType: data.assetType,
        assetName: data.assetName,
        registrationNumber: data.registrationNumber,
        purchaseDate: data.purchaseDate,
        purchasePrice: data.purchasePrice,
        currentCondition: data.currentCondition,
        operatorId: data.operatorId,
      });

      return NextResponse.json(asset, { status: 201 });
    }

    if (action === "schedule-maintenance") {
      const maintenance = await scheduleMaintenance(supabase, {
        machineId: data.machineId,
        maintenanceType: data.maintenanceType,
        scheduledDate: data.scheduledDate,
        estimatedCost: data.estimatedCost,
        technician: data.technician,
      });

      return NextResponse.json(maintenance, { status: 201 });
    }

    if (action === "update-gps") {
      const location = await updateGPSLocation(supabase, {
        machineId: data.machineId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
      });

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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("orgId");
    const report = searchParams.get("report");

    if (report === "maintenance") {
      const maintenanceReport = await getMaintenanceReport(supabase, organizationId);
      return NextResponse.json(maintenanceReport);
    }

    const fleetStatus = await getFleetStatus(supabase, organizationId);
    return NextResponse.json(fleetStatus);
  } catch (error) {
    console.error("[v0] Fleet fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fleet data" },
      { status: 500 }
    );
  }
}
