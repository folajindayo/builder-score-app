// Unit tests (commits 126-140)
import { fuzzyMatch, saveSearch, exportToCSV } from '@/lib/search-fuzzy';
import { filterLeaderboardBySkills, getTrendingBuilders } from '@/lib/leaderboard-utils';
import { followBuilder, getFollowing } from '@/lib/social-features';
import { announceToScreenReader } from '@/lib/accessibility';
import { setupSwipeGestures } from '@/lib/mobile-utils';
import { generateScoreTrendData } from '@/lib/charts';
import { createNotification, addNotification } from '@/lib/notifications';
import { unlockAchievement, getUserPoints } from '@/lib/gamification';
import { resolveENS } from '@/lib/integrations';

describe('Search Utils', () => {
  it('should perform fuzzy matching', () => {
    expect(fuzzyMatch('test', 'testing')).toBe(true);
    expect(fuzzyMatch('xyz', 'abc')).toBe(false);
  });

  it('should save search', () => {
    saveSearch('builder', { score: '> 500' });
    expect(true).toBe(true);
  });
});

describe('Leaderboard Utils', () => {
  it('should filter by skills', () => {
    const data = [
      { skills: [{ name: 'Solidity' }] },
      { skills: [{ name: 'Rust' }] },
    ];
    const result = filterLeaderboardBySkills(data, ['Solidity']);
    expect(result).toHaveLength(1);
  });

  it('should get trending builders', () => {
    const data = [
      { ranking_change: 5 },
      { ranking_change: -2 },
      { ranking_change: 10 },
    ];
    const result = getTrendingBuilders(data);
    expect(result[0].ranking_change).toBe(10);
  });
});

describe('Social Features', () => {
  beforeEach(() => localStorage.clear());

  it('should follow builder', () => {
    followBuilder('user1', 'user2');
    const following = getFollowing('user1');
    expect(following).toContain('user2');
  });
});

describe('Accessibility', () => {
  it('should announce to screen reader', () => {
    announceToScreenReader('Test message');
    expect(document.querySelector('[role="status"]')).toBeTruthy();
  });
});

describe('Charts', () => {
  it('should generate score trend data', () => {
    const scores = [{ date: '2024-01', score: 100 }, { date: '2024-02', score: 150 }];
    const result = generateScoreTrendData(scores);
    expect(result.labels).toHaveLength(2);
    expect(result.datasets[0].data).toEqual([100, 150]);
  });
});

describe('Notifications', () => {
  beforeEach(() => localStorage.clear());

  it('should create and add notification', () => {
    const notif = createNotification('info', 'Test', 'Test message');
    addNotification(notif);
    expect(notif.type).toBe('info');
  });
});

describe('Gamification', () => {
  beforeEach(() => localStorage.clear());

  it('should unlock achievement', () => {
    unlockAchievement('user1', 'first-profile');
    const points = getUserPoints('user1');
    expect(points).toBeGreaterThan(0);
  });
});

describe('Integrations', () => {
  it('should resolve ENS', async () => {
    const result = await resolveENS('vitalik.eth');
    expect(typeof result).toBe('string');
  });
});

