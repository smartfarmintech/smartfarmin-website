import { NextRequest, NextResponse } from "next/server";
import { analyticsQueries } from "@/lib/queries/analytics";

// GET /api/founder/revenue/daily?startDate=2024-01-01&endDate=2024-01-31
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0];

    const { data, error } = await analyticsQueries.getDailyRevenue(startDate, endDate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate aggregations
    const total = data?.reduce((sum: number, item: any) => sum + (item.sum_value || 0), 0) || 0;
    const average = data?.length ? (total / data.length) : 0;
    const max = data?.reduce((max: number, item: any) => Math.max(max, item.sum_value || 0), 0) || 0;

    return NextResponse.json({
      data: data || [],
      summary: {
        total,
        average,
        max,
        count: data?.length || 0,
        startDate,
        endDate,
      },
      timestamp: new Date().toISOString(),
      cacheControl: "max-age=300", // 5 min cache
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
