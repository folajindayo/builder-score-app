/**
 * Builder API Route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.talentprotocol.com/v1/builders/${address}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TALENT_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch builder data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

