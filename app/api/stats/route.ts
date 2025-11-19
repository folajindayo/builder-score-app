import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock stats - in real app, fetch from database
    const stats = {
      totalBuilders: 1234,
      totalCommits: 45678,
      averageScore: 78.5,
      topBuilder: {
        address: "0x1234...5678",
        score: 95.2,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

