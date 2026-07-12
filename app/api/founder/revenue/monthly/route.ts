import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const year = parseInt(req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString());
    
    // TODO: Connect to actual analytics queries
    const mockData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: Math.random() * 50000 + 10000,
    }));

    return NextResponse.json({
      data: mockData,
      year,
      count: 12,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
