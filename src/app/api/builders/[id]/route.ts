/**
 * Builder Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Implementation would call builder service
    const builder = {
      id,
      username: 'builder',
      score: 85,
      credentials: [],
    };

    return NextResponse.json({
      success: true,
      data: builder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

