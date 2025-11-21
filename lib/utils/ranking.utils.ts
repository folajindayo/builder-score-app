/**
 * Ranking Utilities
 */

export function getRankSuffix(rank: number): string {
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }
  
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatRank(rank: number): string {
  return `${rank}${getRankSuffix(rank)}`;
}

export function calculateLeaderboardPosition(
  scores: number[],
  userScore: number
): { rank: number; total: number; percentile: number } {
  const sorted = [...scores].sort((a, b) => b - a);
  const rank = sorted.findIndex((s) => s === userScore) + 1;
  const total = sorted.length;
  const percentile = ((total - rank) / total) * 100;
  
  return { rank, total, percentile };
}

