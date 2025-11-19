import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Mock activity data
    const activities = Array.from({ length: limit }, (_, i) => ({
      id: `activity-${i}`,
      type: ["commit", "repo_created", "score_update"][i % 3],
      description: `Activity description ${i + 1}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      metadata: {
        repo: `repo-${i}`,
        language: ["TypeScript", "Solidity", "Rust"][i % 3],
      },
    }));

    return NextResponse.json({
      address,
      activities,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

