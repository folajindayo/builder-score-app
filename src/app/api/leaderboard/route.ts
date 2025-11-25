import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "score";
    const order = searchParams.get("order") || "desc";

    // Mock data - in real app, query database
    const mockBuilders = Array.from({ length: 50 }, (_, i) => ({
      id: `builder-${i}`,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      score: Math.floor(Math.random() * 100),
      commits: Math.floor(Math.random() * 1000),
      rank: i + 1,
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockBuilders.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockBuilders.length,
        totalPages: Math.ceil(mockBuilders.length / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

