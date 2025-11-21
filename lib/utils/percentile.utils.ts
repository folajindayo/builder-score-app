/**
 * Percentile Utilities
 */

export function calculatePercentile(scores: number[], targetScore: number): number {
  if (scores.length === 0) return 0;
  
  const sorted = [...scores].sort((a, b) => a - b);
  const lowerCount = sorted.filter((s) => s < targetScore).length;
  
  return (lowerCount / sorted.length) * 100;
}

export function getTopPercentile(scores: number[], percentile: number): number[] {
  if (scores.length === 0) return [];
  
  const sorted = [...scores].sort((a, b) => b - a);
  const cutoff = Math.floor((scores.length * percentile) / 100);
  
  return sorted.slice(0, cutoff);
}

export function getScoreRank(scores: number[], targetScore: number): number {
  const sorted = [...scores].sort((a, b) => b - a);
  return sorted.findIndex((s) => s === targetScore) + 1;
}

