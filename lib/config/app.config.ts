/**
 * App Configuration
 */

export const APP_CONFIG = {
  name: 'Builder Score App',
  description: 'On-chain builder score and searcher',
  api: {
    talent: {
      baseUrl: 'https://api.talentprotocol.com/v1',
      key: process.env.TALENT_API_KEY || '',
    },
  },
  cache: {
    ttl: 10 * 60 * 1000, // 10 minutes
  },
  features: {
    search: true,
    profiles: true,
    leaderboard: true,
  },
};

