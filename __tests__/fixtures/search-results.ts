import { SearchResult, SearchResponse } from '@/types/talent';
import { fixtureSkills, fixtureCredentials } from './builder-profiles';

/**
 * Test fixtures for search results
 */

export const fixtureSearchResults: SearchResult[] = [
  {
    address: '0x1234567890123456789012345678901234567890',
    ensName: 'builder1.eth',
    score: 920,
    profile: {
      name: 'Alice Builder',
      bio: 'Solidity expert and DeFi protocol developer',
      avatar: 'https://example.com/avatars/alice.jpg',
    },
    skills: [fixtureSkills[0], fixtureSkills[2], fixtureSkills[3]],
    credentials: [fixtureCredentials[0], fixtureCredentials[1]],
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    ensName: 'builder2.eth',
    score: 875,
    profile: {
      name: 'Bob Developer',
      bio: 'Full-stack Web3 developer',
      avatar: 'https://example.com/avatars/bob.jpg',
    },
    skills: [fixtureSkills[1], fixtureSkills[2]],
    credentials: [fixtureCredentials[0]],
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    ensName: 'builder3.eth',
    score: 830,
    profile: {
      name: 'Charlie Engineer',
      bio: 'Infrastructure and DevOps for Web3',
      avatar: 'https://example.com/avatars/charlie.jpg',
    },
    skills: [fixtureSkills[4]],
    credentials: [fixtureCredentials[2]],
  },
  {
    address: '0x4567890123456789012345678901234567890123',
    score: 795,
    profile: {
      name: 'Diana Architect',
      bio: 'Protocol designer and researcher',
      avatar: 'https://example.com/avatars/diana.jpg',
    },
    skills: [fixtureSkills[0], fixtureSkills[3]],
    credentials: [],
  },
  {
    address: '0x5678901234567890123456789012345678901234',
    ensName: 'builder5.eth',
    score: 760,
    profile: {
      name: 'Eve Security',
      bio: 'Smart contract security specialist',
      avatar: 'https://example.com/avatars/eve.jpg',
    },
    skills: [fixtureSkills[3]],
    credentials: [fixtureCredentials[1]],
  },
];

export const fixtureSearchResponsePage1: SearchResponse = {
  results: fixtureSearchResults,
  total: 25,
  page: 1,
  pageSize: 5,
  hasMore: true,
};

export const fixtureSearchResponsePage2: SearchResponse = {
  results: [
    {
      address: '0x6789012345678901234567890123456789012345',
      ensName: 'builder6.eth',
      score: 720,
      profile: {
        name: 'Frank Frontend',
        bio: 'Frontend developer for dApps',
        avatar: 'https://example.com/avatars/frank.jpg',
      },
      skills: [fixtureSkills[1], fixtureSkills[2]],
      credentials: [],
    },
  ],
  total: 25,
  page: 2,
  pageSize: 5,
  hasMore: true,
};

export const fixtureEmptySearchResponse: SearchResponse = {
  results: [],
  total: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,
};

export const fixtureFilteredBySkillResponse: SearchResponse = {
  results: fixtureSearchResults.filter((r) =>
    r.skills?.some((s) => s.name === 'Solidity')
  ),
  total: 3,
  page: 1,
  pageSize: 10,
  hasMore: false,
};

export const fixtureFilteredByScoreResponse: SearchResponse = {
  results: fixtureSearchResults.filter((r) => r.score >= 850),
  total: 2,
  page: 1,
  pageSize: 10,
  hasMore: false,
};

export const fixtureFilteredByCredentialResponse: SearchResponse = {
  results: fixtureSearchResults.filter((r) =>
    r.credentials?.some((c) => c.name === 'Security Auditor')
  ),
  total: 2,
  page: 1,
  pageSize: 10,
  hasMore: false,
};

