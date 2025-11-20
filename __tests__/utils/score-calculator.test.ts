/**
 * Score Calculator Tests
 */

import {
  calculateBuilderScore,
  getScoreLevel,
  BuilderMetrics,
} from '../lib/utils/score-calculator';

describe('calculateBuilderScore', () => {
  it('should calculate score correctly', () => {
    const metrics: BuilderMetrics = {
      commits: 100,
      pullRequests: 50,
      repositories: 10,
      followers: 100,
      contributions: 200,
    };
    const score = calculateBuilderScore(metrics);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should cap score at 100', () => {
    const metrics: BuilderMetrics = {
      commits: 10000,
      pullRequests: 5000,
      repositories: 1000,
      followers: 10000,
      contributions: 20000,
    };
    const score = calculateBuilderScore(metrics);
    expect(score).toBe(100);
  });
});

describe('getScoreLevel', () => {
  it('should return Elite for high scores', () => {
    expect(getScoreLevel(85)).toBe('Elite');
  });

  it('should return Novice for low scores', () => {
    expect(getScoreLevel(10)).toBe('Novice');
  });
});

