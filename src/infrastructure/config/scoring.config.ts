/**
 * Scoring Configuration
 */

export const scoringConfig = {
  weights: {
    github: 0.4,       // 40%
    credentials: 0.3,  // 30%
    activity: 0.2,     // 20%
    reputation: 0.1,   // 10%
  },
  
  github: {
    repoStars: 5,
    repoForks: 3,
    commits: 1,
    pullRequests: 2,
    issues: 1,
    followers: 0.5,
  },
  
  credentials: {
    verified: 50,
    unverified: 10,
    maxCredentials: 10,
  },
  
  activity: {
    recentCommitBonus: 10,
    consistencyBonus: 20,
    inactivePenalty: -5,
    recencyThresholdDays: 30,
  },
  
  reputation: {
    endorsements: 5,
    reviews: 3,
    awards: 10,
  },
  
  thresholds: {
    beginner: 0,
    intermediate: 100,
    advanced: 250,
    expert: 500,
    master: 1000,
  },
  
  cache: {
    enabled: true,
    duration: 3600, // 1 hour
  },
  
  api: {
    githubTimeout: 15000,
    talentProtocolTimeout: 10000,
  },
};

export const leaderboardConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  refreshInterval: 300000, // 5 minutes
};
