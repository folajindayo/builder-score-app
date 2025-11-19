import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/services/builderService";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const activities = await builderService.getActivity(address, limit);

    return NextResponse.json({ address, activities });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

