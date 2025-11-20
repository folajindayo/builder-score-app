/**
 * Builder Score Calculator
 */

export interface BuilderMetrics {
  commits: number;
  pullRequests: number;
  repositories: number;
  followers: number;
  contributions: number;
}

export function calculateBuilderScore(metrics: BuilderMetrics): number {
  let score = 0;

  score += Math.min(metrics.commits / 10, 30);
  score += Math.min(metrics.pullRequests / 5, 25);
  score += Math.min(metrics.repositories / 2, 20);
  score += Math.min(metrics.followers / 10, 15);
  score += Math.min(metrics.contributions / 20, 10);

  return Math.round(Math.min(score, 100));
}

export function getScoreLevel(score: number): string {
  if (score >= 80) return 'Elite';
  if (score >= 60) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  if (score >= 20) return 'Beginner';
  return 'Novice';
}

