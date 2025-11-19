import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/services/builderService";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const profile = await builderService.getProfile(address);

    if (!profile) {
      return NextResponse.json({ error: "Builder not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch builder" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const body = await request.json();

    const updatedProfile = await builderService.updateProfile(address, body);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update builder" },
      { status: 500 }
    );
  }
}

