import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Mock admin user list
    const users = Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i}`,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      role: i === 0 ? "admin" : "user",
      verified: i % 3 !== 0,
      score: Math.floor(Math.random() * 100),
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = users.slice(start, end);

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch users" },
      { status: 500 }
    );
  }
}

