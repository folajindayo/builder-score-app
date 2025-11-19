import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services/analyticsService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, properties, userId } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      );
    }

    analyticsService.track(type, properties || {}, userId);

    return NextResponse.json({
      success: true,
      message: "Event tracked successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to track event" },
      { status: 500 }
    );
  }
}

