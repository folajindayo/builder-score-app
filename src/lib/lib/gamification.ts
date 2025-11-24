// Gamification system (commits 111-120)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface Level {
  level: number;
  minPoints: number;
  maxPoints: number;
  title: string;
}

export const achievements: Achievement[] = [
  { id: 'first-profile', name: 'First Steps', description: 'Created your profile', icon: '🎯', points: 10, unlocked: false },
  { id: '100-commits', name: 'Century', description: 'Made 100 commits', icon: '💯', points: 100, unlocked: false },
  { id: 'top-10', name: 'Elite', description: 'Reached top 10', icon: '🏆', points: 500, unlocked: false },
];

export const levels: Level[] = [
  { level: 1, minPoints: 0, maxPoints: 100, title: 'Beginner' },
  { level: 2, minPoints: 100, maxPoints: 500, title: 'Apprentice' },
  { level: 3, minPoints: 500, maxPoints: 1000, title: 'Skilled' },
  { level: 4, minPoints: 1000, maxPoints: 5000, title: 'Expert' },
  { level: 5, minPoints: 5000, maxPoints: Infinity, title: 'Master' },
];

export function unlockAchievement(userId: string, achievementId: string): void {
  const userAchievements = getUserAchievements(userId);
  const achievement = achievements.find(a => a.id === achievementId);
  if (achievement && !userAchievements.some(a => a.id === achievementId)) {
    userAchievements.push({ ...achievement, unlocked: true, unlockedAt: Date.now() });
    localStorage.setItem(`achievements:${userId}`, JSON.stringify(userAchievements));
    addPoints(userId, achievement.points);
  }
}

export function getUserAchievements(userId: string): Achievement[] {
  return JSON.parse(localStorage.getItem(`achievements:${userId}`) || '[]');
}

export function getUserLevel(userId: string): Level {
  const points = getUserPoints(userId);
  return levels.find(l => points >= l.minPoints && points < l.maxPoints) || levels[0];
}

export function getUserPoints(userId: string): number {
  return parseInt(localStorage.getItem(`points:${userId}`) || '0');
}

export function addPoints(userId: string, points: number): void {
  const current = getUserPoints(userId);
  localStorage.setItem(`points:${userId}`, (current + points).toString());
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  progress: number;
  reward: number;
  expiresAt: number;
}

export function getDailyChallenges(userId: string): Challenge[] {
  const challenges = JSON.parse(localStorage.getItem(`challenges:${userId}`) || '[]');
  return challenges.filter((c: Challenge) => c.type === 'daily' && c.expiresAt > Date.now());
}

export function updateChallengeProgress(userId: string, challengeId: string, progress: number): void {
  const challenges = JSON.parse(localStorage.getItem(`challenges:${userId}`) || '[]');
  const challenge = challenges.find((c: Challenge) => c.id === challengeId);
  if (challenge) {
    challenge.progress = Math.min(progress, challenge.target);
    if (challenge.progress >= challenge.target) {
      addPoints(userId, challenge.reward);
    }
    localStorage.setItem(`challenges:${userId}`, JSON.stringify(challenges));
  }
}

export interface Milestone {
  id: string;
  name: string;
  value: number;
  achieved: boolean;
}

export function getMilestones(userId: string): Milestone[] {
  return JSON.parse(localStorage.getItem(`milestones:${userId}`) || JSON.stringify([
    { id: 'commits-100', name: '100 Commits', value: 100, achieved: false },
    { id: 'score-500', name: 'Score 500', value: 500, achieved: false },
    { id: 'followers-50', name: '50 Followers', value: 50, achieved: false },
  ]));
}

export function getStreak(userId: string): { current: number; longest: number } {
  return JSON.parse(localStorage.getItem(`streak:${userId}`) || '{"current":0,"longest":0}');
}

export function updateStreak(userId: string): void {
  const streak = getStreak(userId);
  const lastActive = localStorage.getItem(`last-active:${userId}`);
  const today = new Date().toDateString();
  
  if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
    streak.current++;
    streak.longest = Math.max(streak.current, streak.longest);
  } else if (lastActive !== today) {
    streak.current = 1;
  }
  
  localStorage.setItem(`streak:${userId}`, JSON.stringify(streak));
  localStorage.setItem(`last-active:${userId}`, today);
}

