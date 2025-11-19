import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // Mock search results
    const results = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      username: `${query}_${i + 1}`,
      score: Math.floor(Math.random() * 100),
      avatar: null,
    }));

    return NextResponse.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}

