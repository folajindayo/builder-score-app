import { LeaderboardResponse, LeaderboardUser, UserProfile } from '@/types/talent';

/**
 * Test fixtures for leaderboard data
 */

function createMockUserProfile(
  id: number,
  position: number,
  score: number
): UserProfile {
  return {
    id: `user-${id}`,
    display_name: `Builder ${id}`,
    name: `Test Builder ${id}`,
    image_url: `https://example.com/avatars/builder-${id}.jpg`,
    bio: `Passionate Web3 developer with expertise in blockchain technology. Building the future of decentralized applications.`,
    builder_score: {
      points: score,
      rank_position: position,
      last_calculated_at: new Date(Date.now() - id * 86400000).toISOString(),
      slug: 'builder-score',
    },
    scores: [
      {
        points: score,
        rank_position: position,
        last_calculated_at: new Date().toISOString(),
        slug: 'builder-score',
      },
    ],
    tags: ['developer', 'builder', 'web3'],
    human_checkmark: true,
    verified_nationality: id % 3 === 0,
    calculating_score: false,
    created_at: new Date(Date.now() - id * 86400000 * 30).toISOString(),
    location: id % 2 === 0 ? 'San Francisco, CA' : null,
    talent_protocol_id: id * 100,
  };
}

function createMockLeaderboardUser(
  id: number,
  position: number,
  score: number
): LeaderboardUser {
  const profile = createMockUserProfile(id, position, score);
  
  return {
    id,
    leaderboard_position: position,
    profile,
    ranking_change: Math.floor(Math.random() * 10) - 5, // -5 to +5
    reward_amount: position <= 10 ? (1000 - position * 50).toString() : '0',
    reward_transaction_hash:
      position <= 10
        ? `0x${Math.random().toString(16).substring(2, 66)}`
        : null,
    recipient_wallet:
      position <= 10
        ? `0x${Math.random().toString(16).substring(2, 42)}`
        : null,
    distributed_at: position <= 10 ? new Date().toISOString() : null,
    hall_of_fame: position <= 3,
    summary:
      position <= 3
        ? `Top ${position} builder with exceptional contributions to the ecosystem`
        : null,
  };
}

export const fixtureLeaderboardPage1: LeaderboardResponse = {
  users: Array.from({ length: 10 }, (_, i) =>
    createMockLeaderboardUser(i + 1, i + 1, 1000 - i * 10)
  ),
  pagination: {
    current_page: 1,
    last_page: 50,
    total: 500,
  },
};

export const fixtureLeaderboardPage2: LeaderboardResponse = {
  users: Array.from({ length: 10 }, (_, i) =>
    createMockLeaderboardUser(i + 11, i + 11, 900 - i * 10)
  ),
  pagination: {
    current_page: 2,
    last_page: 50,
    total: 500,
  },
};

export const fixtureLeaderboardLastPage: LeaderboardResponse = {
  users: Array.from({ length: 5 }, (_, i) =>
    createMockLeaderboardUser(i + 496, i + 496, 50 - i * 10)
  ),
  pagination: {
    current_page: 50,
    last_page: 50,
    total: 500,
  },
};

export const fixtureEmptyLeaderboard: LeaderboardResponse = {
  users: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
  },
};

// Top 3 hall of fame builders
export const fixtureHallOfFameUsers = fixtureLeaderboardPage1.users.slice(0, 3);

// Users with rewards
export const fixtureUsersWithRewards = fixtureLeaderboardPage1.users.filter(
  (u) => u.reward_amount !== '0'
);

// Recent movers (positive ranking change)
export const fixtureRisingBuilders = fixtureLeaderboardPage1.users.filter(
  (u) => u.ranking_change > 0
);

// Falling builders (negative ranking change)
export const fixtureFallingBuilders = fixtureLeaderboardPage1.users.filter(
  (u) => u.ranking_change < 0
);

