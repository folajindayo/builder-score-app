import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/services/builderService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const addresses = searchParams.get("addresses")?.split(",") || [];

    if (addresses.length === 0 || addresses.length > 5) {
      return NextResponse.json(
        { error: "Please provide 1-5 addresses to compare" },
        { status: 400 }
      );
    }

    const profiles = await Promise.all(
      addresses.map((address) => builderService.getProfile(address.trim()))
    );

    const comparison = {
      profiles: profiles.filter((p) => p !== null),
      count: profiles.filter((p) => p !== null).length,
    };

    return NextResponse.json(comparison);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to compare builders" },
      { status: 500 }
    );
  }
}

