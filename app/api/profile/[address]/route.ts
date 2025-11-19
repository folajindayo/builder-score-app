import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    // Mock profile data - in real app, fetch from database
    const profile = {
      address,
      username: `builder_${address.slice(0, 6)}`,
      score: Math.floor(Math.random() * 100),
      rank: Math.floor(Math.random() * 1000) + 1,
      commits: Math.floor(Math.random() * 500),
      repos: Math.floor(Math.random() * 50),
      languages: ["TypeScript", "Solidity", "Rust"],
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
    };

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

