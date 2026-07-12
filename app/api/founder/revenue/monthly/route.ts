import { NextRequest, NextResponse } from "next/server";
import { analyticsQueries } from "@/lib/queries/analytics";

export async function GET(req: NextRequest) {
  try {
    const year = parseInt(req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString());
    const { data, error } = await analyticsQueries.getMonthlyRevenue(year);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      year,
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
