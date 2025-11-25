import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services/analyticsService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters = {
      type: searchParams.get("type") || undefined,
      userId: searchParams.get("userId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const events = analyticsService.getEvents(filters);

    return NextResponse.json({
      events,
      count: events.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    );
  }
}

