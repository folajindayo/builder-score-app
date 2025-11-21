/**
 * Ranking Helper Tests
 */

import { rankBuilders, sortByScore, calculatePercentile } from '../ranking.helper';

describe('Ranking Helper', () => {
  const mockBuilders = [
    { id: '1', score: 100, githubUsername: 'user1' },
    { id: '2', score: 80, githubUsername: 'user2' },
    { id: '3', score: 90, githubUsername: 'user3' },
  ];

  describe('rankBuilders', () => {
    it('should rank builders by score descending', () => {
      const ranked = rankBuilders(mockBuilders);
      expect(ranked[0].score).toBe(100);
      expect(ranked[1].score).toBe(90);
      expect(ranked[2].score).toBe(80);
    });

    it('should handle empty array', () => {
      expect(rankBuilders([])).toEqual([]);
    });
  });

  describe('sortByScore', () => {
    it('should sort in descending order', () => {
      const sorted = sortByScore(mockBuilders);
      expect(sorted[0].score).toBeGreaterThanOrEqual(sorted[1].score);
    });
  });

  describe('calculatePercentile', () => {
    it('should calculate percentile correctly', () => {
      expect(calculatePercentile(100, mockBuilders)).toBeGreaterThan(90);
      expect(calculatePercentile(80, mockBuilders)).toBeLessThan(50);
    });

    it('should return 0 for empty list', () => {
      expect(calculatePercentile(100, [])).toBe(0);
    });
  });
});

