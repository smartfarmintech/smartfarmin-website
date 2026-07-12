import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/founder/revenue/daily?startDate=2024-01-01&endDate=2024-01-31
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0];

    // TODO: Connect to actual analytics queries
    const mockData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      sum_value: Math.random() * 10000 + 5000,
    }));

    const total = mockData.reduce((sum: number, item: any) => sum + (item.sum_value || 0), 0);
    const average = mockData.length ? (total / mockData.length) : 0;
    const max = mockData.reduce((max: number, item: any) => Math.max(max, item.sum_value || 0), 0);

    return NextResponse.json({
      data: mockData,
      summary: {
        total: Math.round(total),
        average: Math.round(average),
        max: Math.round(max),
        count: mockData.length,
        startDate,
        endDate,
      },
      timestamp: new Date().toISOString(),
      cacheControl: "max-age=300",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
