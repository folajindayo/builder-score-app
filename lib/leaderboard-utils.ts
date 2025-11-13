// Leaderboard utilities (commits 46-55: Leaderboard enhancements)
export type LeaderboardCategory = 'overall' | 'monthly' | 'weekly' | 'daily';
export type TimeRange = 'day' | 'week' | 'month' | 'all';

export function filterLeaderboardBySkills(data: any[], skills: string[]): any[] {
  return data.filter(builder => 
    builder.skills?.some((s: any) => skills.includes(s.name))
  );
}

export function filterLeaderboardByCredentials(data: any[], credentials: string[]): any[] {
  return data.filter(builder =>
    builder.credentials?.some((c: any) => credentials.includes(c.name))
  );
}

export function getTrendingBuilders(data: any[]): any[] {
  return data
    .filter(b => b.ranking_change > 0)
    .sort((a, b) => b.ranking_change - a.ranking_change)
    .slice(0, 10);
}

export function getHistoricalLeaderboard(date: string): Promise<any[]> {
  // Mock implementation - would fetch from API
  return Promise.resolve([]);
}

export function subscribeToLeaderboard(userId: string, category: LeaderboardCategory): void {
  const subs = JSON.parse(localStorage.getItem('leaderboard-subs') || '{}');
  subs[userId] = category;
  localStorage.setItem('leaderboard-subs', JSON.stringify(subs));
}

export function generateLeaderboardEmbed(data: any[]): string {
  return `<div class="leaderboard-embed">${data.map(b => `<div>${b.name}: ${b.score}</div>`).join('')}</div>`;
}

// Caching
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function cacheLeaderboard(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function getCachedLeaderboard(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

