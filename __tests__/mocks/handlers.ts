import { http, HttpResponse } from 'msw';
import { mockBuilderScore, mockSearchResults } from '../test-utils';

/**
 * MSW handlers for mocking API endpoints
 */
export const handlers = [
  // Mock BuilderScore API - Get user score
  http.get('/api/builderscore', () => {
    return HttpResponse.json({
      success: true,
      data: mockBuilderScore,
    });
  }),

  // Mock BuilderScore API - Error case
  http.get('/api/builderscore/error', () => {
    return HttpResponse.json(
      {
        success: false,
        error: 'Failed to fetch builder score',
      },
      { status: 500 }
    );
  }),

  // Mock Talent Protocol API - Get user profile
  http.get('/api/talent/profile/:address', ({ params }) => {
    const { address } = params;
    
    return HttpResponse.json({
      address,
      score: mockBuilderScore,
      profile: {
        name: 'Test Builder',
        bio: 'A test builder profile',
        avatar: 'https://example.com/avatar.jpg',
      },
    });
  }),

  // Mock Talent Protocol API - Search builders
  http.get('/api/talent/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const minScore = url.searchParams.get('minScore');
    const maxScore = url.searchParams.get('maxScore');

    // Filter results based on query parameters
    let results = mockSearchResults.results;

    if (minScore) {
      results = results.filter((r) => r.score >= parseInt(minScore));
    }

    if (maxScore) {
      results = results.filter((r) => r.score <= parseInt(maxScore));
    }

    if (query) {
      results = results.filter(
        (r) =>
          r.address.toLowerCase().includes(query.toLowerCase()) ||
          (r.ensName && r.ensName.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return HttpResponse.json({
      results,
      total: results.length,
      page: 0,
      pageSize: 10,
      hasMore: false,
    });
  }),

  // Mock Leaderboard API
  http.get('/api/builderscore/leaderboard', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '10');

    const mockUsers = Array.from({ length: perPage }, (_, i) => ({
      id: page * perPage + i,
      leaderboard_position: page * perPage + i + 1,
      profile: {
        id: `user-${i}`,
        display_name: `Builder ${i}`,
        name: `Test Builder ${i}`,
        image_url: `https://example.com/avatar-${i}.jpg`,
        builder_score: {
          points: 1000 - i * 10,
          rank_position: i + 1,
          last_calculated_at: new Date().toISOString(),
          slug: 'builder-score',
        },
        scores: [],
        tags: ['developer', 'builder'],
        bio: `Bio for builder ${i}`,
        human_checkmark: true,
        verified_nationality: false,
        calculating_score: false,
        created_at: new Date().toISOString(),
        location: null,
        talent_protocol_id: null,
      },
      ranking_change: 0,
      reward_amount: '0',
      reward_transaction_hash: null,
      recipient_wallet: null,
      distributed_at: null,
      hall_of_fame: false,
      summary: null,
    }));

    return HttpResponse.json({
      users: mockUsers,
      pagination: {
        current_page: page,
        last_page: 10,
        total: 100,
      },
    });
  }),

  // Mock network delay
  http.get('/api/slow', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return HttpResponse.json({ message: 'Slow response' });
  }),

  // Mock 404 error
  http.get('/api/notfound', () => {
    return HttpResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }),

  // Mock 401 unauthorized
  http.get('/api/unauthorized', () => {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }),
];

