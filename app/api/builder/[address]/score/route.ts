import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/services/builderService";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const score = await builderService.calculateScore(address);

    return NextResponse.json({ address, score });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to calculate score" },
      { status: 500 }
    );
  }
}

