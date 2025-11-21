/**
 * Percentile Utilities Tests
 */

import {
  calculatePercentile,
  getTopPercentile,
  getScoreRank,
} from '../lib/utils/percentile.utils';

describe('Percentile Utilities', () => {
  describe('calculatePercentile', () => {
    it('calculates percentile correctly', () => {
      const scores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const percentile = calculatePercentile(scores, 75);
      
      expect(percentile).toBeGreaterThan(60);
      expect(percentile).toBeLessThan(80);
    });

    it('returns 0 for empty array', () => {
      const percentile = calculatePercentile([], 50);
      expect(percentile).toBe(0);
    });
  });

  describe('getTopPercentile', () => {
    it('returns top 10%', () => {
      const scores = Array.from({ length: 100 }, (_, i) => i + 1);
      const top = getTopPercentile(scores, 10);
      
      expect(top).toHaveLength(10);
      expect(top[0]).toBe(100);
    });
  });

  describe('getScoreRank', () => {
    it('returns correct rank', () => {
      const scores = [50, 75, 90, 60, 85];
      const rank = getScoreRank(scores, 85);
      
      expect(rank).toBe(2);
    });
  });
});

