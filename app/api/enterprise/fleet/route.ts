import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === "register-asset") {
      return NextResponse.json({
        id: "machine-" + Math.random().toString(36).substr(2, 9),
        organization_id: data.organizationId,
        asset_type: data.assetType,
        name: data.assetName,
        registration_number: data.registrationNumber,
        purchase_date: data.purchaseDate,
        purchase_price: data.purchasePrice,
        current_condition: data.currentCondition,
        operator_id: data.operatorId,
        createdAt: new Date().toISOString(),
      }, { status: 201 });
    }

    if (action === "schedule-maintenance") {
      return NextResponse.json({
        id: "maint-" + Math.random().toString(36).substr(2, 9),
        machine_id: data.machineId,
        maintenance_type: data.maintenanceType,
        scheduled_date: data.scheduledDate,
        estimated_cost: data.estimatedCost,
        technician: data.technician,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      }, { status: 201 });
    }

    if (action === "update-gps") {
      return NextResponse.json({
        id: "gps-" + Math.random().toString(36).substr(2, 9),
        machine_id: data.machineId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date().toISOString(),
      });
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
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("orgId");

    // Return mock fleet data
    const mockMachines = [
      {
        id: "machine-1",
        organization_id: organizationId,
        name: "John Deere 8220R",
        asset_type: "tractor",
        current_condition: "Excellent",
        utilization: 92,
      },
      {
        id: "machine-2",
        organization_id: organizationId,
        name: "Mahindra Combine",
        asset_type: "harvester",
        current_condition: "Good",
        utilization: 78,
      },
    ];

    const stats = {
      totalAssets: mockMachines.length,
      activeNow: mockMachines.filter((m) => m.current_condition === "Excellent").length,
      maintenanceNeeded: 1,
      utilizationRate: 85,
    };

    return NextResponse.json({
      machines: mockMachines,
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
