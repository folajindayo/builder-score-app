import { NextRequest, NextResponse } from "next/server";
import { leaderboardService } from "@/services/leaderboardService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const topBuilders = await leaderboardService.getTopBuilders(limit);

    return NextResponse.json({
      topBuilders,
      count: topBuilders.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch top builders" },
      { status: 500 }
    );
  }
}

