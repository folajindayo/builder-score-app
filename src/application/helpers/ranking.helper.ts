/**
 * Ranking Helper Functions
 */

export function calculateRank(score: number, allScores: number[]): number {
  const sortedScores = [...allScores].sort((a, b) => b - a);
  return sortedScores.indexOf(score) + 1;
}

export function getPercentileRank(score: number, allScores: number[]): number {
  const belowScore = allScores.filter(s => s < score).length;
  return (belowScore / allScores.length) * 100;
}

export function getTier(percentile: number): string {
  if (percentile >= 95) return 'Elite';
  if (percentile >= 80) return 'Expert';
  if (percentile >= 60) return 'Advanced';
  if (percentile >= 40) return 'Intermediate';
  return 'Beginner';
}

export function getBadge(score: number): string {
  if (score >= 90) return '🏆';
  if (score >= 80) return '🥇';
  if (score >= 70) return '🥈';
  if (score >= 60) return '🥉';
  return '⭐';
}
