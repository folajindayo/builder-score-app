import type { LeaderboardUser } from "@/types/talent";

export interface BuilderAnalytics {
  userId: number;
  mcap: number;
  category: BuilderCategory;
  rank: number;
}

export type BuilderCategory = 
  | "most_earnings"
  | "trending"
  | "highest_score"
  | "featured"
  | "sought_after"
  | null;

/**
 * Calculate MCAP (Market Cap) for a builder based on their activities
 * Formula considers: score, earnings, ranking position, and activity level
 */
export function calculateMCAP(user: LeaderboardUser, tokenPrice: number): number {
  const rewardAmount = typeof user.reward_amount === 'string' 
    ? parseFloat(user.reward_amount) 
    : user.reward_amount;
  
  const score = user.profile.builder_score?.points || 0;
  const earningsUSD = rewardAmount * tokenPrice;
  const position = user.leaderboard_position;
  const rankingChange = Math.abs(user.ranking_change);
  
  // Base MCAP from earnings
  const earningsMCAP = earningsUSD * 0.4;
  
  // Score multiplier (higher score = higher MCAP)
  const scoreMCAP = score * 10 * 0.3;
  
  // Position multiplier (better position = higher MCAP)
  // Inverse relationship: position 1 = max multiplier, position 1000 = min multiplier
  const positionMultiplier = Math.max(0.1, 1 - (position - 1) / 1000);
  const positionMCAP = earningsUSD * positionMultiplier * 0.2;
  
  // Trending bonus (positive ranking change = bonus)
  const trendingBonus = rankingChange > 0 ? rankingChange * 5 : 0;
  
  // Activity bonus (verified, checkmarks, etc.)
  const activityBonus = 
    (user.profile.human_checkmark ? 50 : 0) +
    (user.profile.verified_nationality ? 30 : 0) +
    (user.profile.tags?.length || 0) * 5;
  
  const totalMCAP = earningsMCAP + scoreMCAP + positionMCAP + trendingBonus + activityBonus;
  
  return Math.round(totalMCAP);
}

/**
 * Get builder with most earnings
 */
export function getMostEarnings(users: LeaderboardUser[]): LeaderboardUser | null {
  if (users.length === 0) return null;
  
  return users.reduce((max, user) => {
    const maxAmount = typeof max.reward_amount === 'string' 
      ? parseFloat(max.reward_amount) 
      : max.reward_amount;
    const userAmount = typeof user.reward_amount === 'string' 
      ? parseFloat(user.reward_amount) 
      : user.reward_amount;
    
    return userAmount > maxAmount ? user : max;
  });
}

/**
 * Get trending builder (based on ranking change and recent activity)
 */
export function getTrendingBuilder(users: LeaderboardUser[]): LeaderboardUser | null {
  if (users.length === 0) return null;
  
  // Score based on ranking change and position improvement
  return users.reduce((trending, user) => {
    const trendingScore = 
      (user.ranking_change > 0 ? user.ranking_change * 10 : 0) +
      (user.leaderboard_position <= 10 ? 50 : 0) +
      (user.profile.builder_score?.points || 0) * 0.1;
    
    const currentScore = 
      (trending.ranking_change > 0 ? trending.ranking_change * 10 : 0) +
      (trending.leaderboard_position <= 10 ? 50 : 0) +
      (trending.profile.builder_score?.points || 0) * 0.1;
    
    return trendingScore > currentScore ? user : trending;
  });
}

/**
 * Get builder with highest score
 */
export function getHighestScore(users: LeaderboardUser[]): LeaderboardUser | null {
  if (users.length === 0) return null;
  
  return users.reduce((max, user) => {
    const maxScore = max.profile.builder_score?.points || 0;
    const userScore = user.profile.builder_score?.points || 0;
    return userScore > maxScore ? user : max;
  });
}

/**
 * Get featured builder (combination of score, earnings, and activity)
 */
export function getFeaturedBuilder(users: LeaderboardUser[], tokenPrice: number): LeaderboardUser | null {
  if (users.length === 0) return null;
  
  return users.reduce((featured, user) => {
    const featuredMCAP = calculateMCAP(featured, tokenPrice);
    const userMCAP = calculateMCAP(user, tokenPrice);
    
    // Also consider verification and activity
    const featuredBonus = 
      (featured.profile.human_checkmark ? 100 : 0) +
      (featured.profile.verified_nationality ? 50 : 0);
    const userBonus = 
      (user.profile.human_checkmark ? 100 : 0) +
      (user.profile.verified_nationality ? 50 : 0);
    
    return (userMCAP + userBonus) > (featuredMCAP + featuredBonus) ? user : featured;
  });
}

/**
 * Get sought after builder (based on profile completeness, verification, and engagement)
 */
export function getSoughtAfterBuilder(users: LeaderboardUser[]): LeaderboardUser | null {
  if (users.length === 0) return null;
  
  return users.reduce((sought, user) => {
    const soughtScore = 
      (sought.profile.human_checkmark ? 100 : 0) +
      (sought.profile.verified_nationality ? 50 : 0) +
      (sought.profile.bio ? 30 : 0) +
      (sought.profile.location ? 20 : 0) +
      (sought.profile.tags?.length || 0) * 10 +
      (sought.profile.builder_score?.points || 0) * 0.5;
    
    const userScore = 
      (user.profile.human_checkmark ? 100 : 0) +
      (user.profile.verified_nationality ? 50 : 0) +
      (user.profile.bio ? 30 : 0) +
      (user.profile.location ? 20 : 0) +
      (user.profile.tags?.length || 0) * 10 +
      (user.profile.builder_score?.points || 0) * 0.5;
    
    return userScore > soughtScore ? user : sought;
  });
}

/**
 * Categorize all builders
 */
export function categorizeBuilders(
  users: LeaderboardUser[],
  tokenPrice: number
): Map<number, BuilderCategory> {
  const categories = new Map<number, BuilderCategory>();
  
  if (users.length === 0) return categories;
  
  const mostEarnings = getMostEarnings(users);
  const trending = getTrendingBuilder(users);
  const highestScore = getHighestScore(users);
  const featured = getFeaturedBuilder(users, tokenPrice);
  const soughtAfter = getSoughtAfterBuilder(users);
  
  if (mostEarnings) categories.set(mostEarnings.id, "most_earnings");
  if (trending) categories.set(trending.id, "trending");
  if (highestScore) categories.set(highestScore.id, "highest_score");
  if (featured) categories.set(featured.id, "featured");
  if (soughtAfter) categories.set(soughtAfter.id, "sought_after");
  
  return categories;
}

/**
 * Get category label
 */
export function getCategoryLabel(category: BuilderCategory): string {
  switch (category) {
    case "most_earnings":
      return "Most Earnings";
    case "trending":
      return "Trending";
    case "highest_score":
      return "Highest Score";
    case "featured":
      return "Featured";
    case "sought_after":
      return "Sought After";
    default:
      return "";
  }
}

