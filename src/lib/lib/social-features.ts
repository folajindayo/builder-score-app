// Social features (commits 56-60)
export function followBuilder(userId: string, targetId: string): void {
  const following = JSON.parse(localStorage.getItem(`following:${userId}`) || '[]');
  if (!following.includes(targetId)) {
    following.push(targetId);
    localStorage.setItem(`following:${userId}`, JSON.stringify(following));
  }
}

export function unfollowBuilder(userId: string, targetId: string): void {
  const following = JSON.parse(localStorage.getItem(`following:${userId}`) || '[]');
  localStorage.setItem(`following:${userId}`, JSON.stringify(following.filter((id: string) => id !== targetId)));
}

export function getFollowing(userId: string): string[] {
  return JSON.parse(localStorage.getItem(`following:${userId}`) || '[]');
}

export function getFollowers(userId: string): string[] {
  // Would be fetched from API in production
  return [];
}

export function getActivityFeed(userId: string): Array<{id: string; type: string; content: string; timestamp: number}> {
  const following = getFollowing(userId);
  // Would aggregate activity from followed users
  return [];
}

export function addComment(profileId: string, userId: string, comment: string): void {
  const comments = JSON.parse(localStorage.getItem(`comments:${profileId}`) || '[]');
  comments.push({ userId, comment, timestamp: Date.now(), id: Math.random().toString(36) });
  localStorage.setItem(`comments:${profileId}`, JSON.stringify(comments));
}

export function getComments(profileId: string): Array<{userId: string; comment: string; timestamp: number; id: string}> {
  return JSON.parse(localStorage.getItem(`comments:${profileId}`) || '[]');
}

export function voteReputation(profileId: string, userId: string, vote: 'up' | 'down'): void {
  const votes = JSON.parse(localStorage.getItem(`votes:${profileId}`) || '{}');
  votes[userId] = vote;
  localStorage.setItem(`votes:${profileId}`, JSON.stringify(votes));
}

export function getRecommendations(userId: string): string[] {
  const following = getFollowing(userId);
  // Simple recommendation: return users followed by people you follow
  return following.slice(0, 5);
}

