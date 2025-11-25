/**
 * GitHubService Tests
 */

import { githubService } from '../lib/services/github.service';

global.fetch = jest.fn();

describe('GitHubService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserActivity', () => {
    it('fetches user activity', async () => {
      const mockActivity = {
        commits: 150,
        pullRequests: 25,
        issues: 40,
        repositories: 15,
        contributions: 600,
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockActivity,
      });

      const result = await githubService.getUserActivity('testuser');
      expect(result).toEqual(mockActivity);
    });

    it('returns null on error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await githubService.getUserActivity('testuser');
      expect(result).toBeNull();
    });
  });

  describe('calculateGitHubScore', () => {
    it('calculates score based on activity', async () => {
      const mockActivity = {
        commits: 100,
        pullRequests: 20,
        issues: 30,
        repositories: 10,
        contributions: 500,
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockActivity,
      });

      const score = await githubService.calculateGitHubScore('testuser');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});

