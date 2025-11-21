/**
 * Analytics Middleware
 */

import { NextRequest, NextResponse } from 'next/server';

export async function analyticsMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Track API usage
  const analyticsData = {
    endpoint: request.url,
    method: request.method,
    timestamp: Date.now(),
    userAgent: request.headers.get('user-agent'),
  };

  // Send to analytics service
  console.log('Analytics:', analyticsData);

  return response;
}

