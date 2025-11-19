import { NextRequest, NextResponse } from "next/server";
import { leaderboardService } from "@/services/leaderboardService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "score";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    // Extract filters
    const language = searchParams.get("language") || undefined;
    const minScore = searchParams.get("minScore")
      ? parseInt(searchParams.get("minScore")!, 10)
      : undefined;
    const timeRange = (searchParams.get("timeRange") ||
      undefined) as "week" | "month" | "all-time" | undefined;

    const filters = {
      language,
      minScore,
      timeRange,
    };

    const result = await leaderboardService.getLeaderboard(
      page,
      limit,
      sortBy,
      order,
      filters
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

