import { server } from './server';
import { http, HttpResponse } from 'msw';

describe('MSW API Mocking', () => {
  it('should mock builder score API', async () => {
    const response = await fetch('/api/builderscore');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('score');
  });

  it('should mock error responses', async () => {
    const response = await fetch('/api/builderscore/error');
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch builder score');
  });

  it('should mock search API with query parameters', async () => {
    const response = await fetch('/api/talent/search?minScore=900');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.results).toBeInstanceOf(Array);
    // Results should be filtered by minScore
    data.results.forEach((result: any) => {
      expect(result.score).toBeGreaterThanOrEqual(900);
    });
  });

  it('should mock profile API with dynamic params', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    const response = await fetch(`/api/talent/profile/${address}`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.address).toBe(address);
    expect(data.score).toBeDefined();
    expect(data.profile).toBeDefined();
  });

  it('should allow runtime handler overrides', async () => {
    // Override handler for this test only
    server.use(
      http.get('/api/builderscore', () => {
        return HttpResponse.json({
          success: true,
          data: { score: 999, rank: 1 },
        });
      })
    );

    const response = await fetch('/api/builderscore');
    const data = await response.json();

    expect(data.data.score).toBe(999);
    expect(data.data.rank).toBe(1);
  });

  it('should handle 404 responses', async () => {
    const response = await fetch('/api/notfound');
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Not found');
  });

  it('should handle 401 unauthorized', async () => {
    const response = await fetch('/api/unauthorized');
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should mock leaderboard API with pagination', async () => {
    const response = await fetch('/api/builderscore/leaderboard?page=1&per_page=5');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.users).toHaveLength(5);
    expect(data.pagination.current_page).toBe(1);
  });
});
