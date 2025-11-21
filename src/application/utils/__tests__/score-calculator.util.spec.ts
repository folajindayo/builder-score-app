/**
 * Score Calculator Tests
 */

import { 
  calculateBuilderScore, 
  calculatePercentile, 
  normalizeScore 
} from '../score-calculator.util';

describe('ScoreCalculator', () => {
  describe('calculateBuilderScore', () => {
    it('should calculate weighted score', () => {
      const metrics = {
        githubContributions: 100,
        talentProtocolScore: 85,
        onchainActivity: 50,
        communityEngagement: 75,
      };
      const score = calculateBuilderScore(metrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle missing metrics', () => {
      const metrics = { githubContributions: 50 };
      const score = calculateBuilderScore(metrics);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculatePercentile', () => {
    it('should calculate percentile rank', () => {
      const scores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      expect(calculatePercentile(75, scores)).toBeGreaterThanOrEqual(0);
      expect(calculatePercentile(75, scores)).toBeLessThanOrEqual(100);
    });
  });

  describe('normalizeScore', () => {
    it('should normalize score to 0-100 range', () => {
      expect(normalizeScore(500, 0, 1000)).toBe(50);
      expect(normalizeScore(0, 0, 1000)).toBe(0);
      expect(normalizeScore(1000, 0, 1000)).toBe(100);
    });
  });
});

