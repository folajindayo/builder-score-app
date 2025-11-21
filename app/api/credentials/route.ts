/**
 * Credentials API Route
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
    // Fetch credentials from various sources
    const credentials = [
      {
        id: '1',
        type: 'passport' as const,
        title: 'Gitcoin Passport',
        issuer: 'Gitcoin',
        issuedAt: '2024-01-01',
        verifiedOnChain: true,
        score: 25,
      },
      {
        id: '2',
        type: 'achievement' as const,
        title: 'Early Adopter',
        issuer: 'Platform',
        issuedAt: '2023-12-01',
        verifiedOnChain: false,
        score: 10,
      },
    ];

    return NextResponse.json({ credentials });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}

