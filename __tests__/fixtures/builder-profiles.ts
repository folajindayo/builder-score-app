import { BuilderProfile, BuilderScore, Credential, Skill } from '@/types/talent';

/**
 * Test fixtures for builder profiles
 */

export const fixtureSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Solidity',
    category: 'Programming Languages',
    level: 5,
  },
  {
    id: 'skill-2',
    name: 'React',
    category: 'Frontend Development',
    level: 4,
  },
  {
    id: 'skill-3',
    name: 'TypeScript',
    category: 'Programming Languages',
    level: 5,
  },
  {
    id: 'skill-4',
    name: 'Smart Contract Security',
    category: 'Security',
    level: 4,
  },
  {
    id: 'skill-5',
    name: 'Web3.js',
    category: 'Web3 Development',
    level: 3,
  },
];

export const fixtureCredentials: Credential[] = [
  {
    id: 'cred-1',
    name: 'Ethereum Developer',
    issuer: 'Ethereum Foundation',
    description: 'Certified Ethereum smart contract developer',
    verified: true,
    issuedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'cred-2',
    name: 'Security Auditor',
    issuer: 'OpenZeppelin',
    description: 'Certified smart contract security auditor',
    verified: true,
    issuedAt: '2023-03-20T00:00:00Z',
  },
  {
    id: 'cred-3',
    name: 'Hackathon Winner',
    issuer: 'ETHGlobal',
    description: 'First place at ETHGlobal Paris 2023',
    verified: true,
    issuedAt: '2023-07-10T00:00:00Z',
  },
];

export const fixtureBuilderScore: BuilderScore = {
  score: 850,
  rank: 42,
  percentile: 95,
  updatedAt: '2024-01-15T10:30:00Z',
  credentials: fixtureCredentials,
  skills: fixtureSkills,
  dataPoints: [
    {
      id: 'dp-1',
      source: 'GitHub',
      type: 'commits',
      value: 2500,
      verified: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'dp-2',
      source: 'Ethereum',
      type: 'contracts_deployed',
      value: 15,
      verified: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],
};

export const fixtureBuilderProfile: BuilderProfile = {
  address: '0x1234567890123456789012345678901234567890',
  ensName: 'builder.eth',
  score: fixtureBuilderScore,
  profile: {
    name: 'John Builder',
    bio: 'Full-stack Web3 developer with 5+ years of experience in Ethereum ecosystem',
    avatar: 'https://example.com/avatars/john-builder.jpg',
    website: 'https://johnbuilder.dev',
    twitter: 'johnbuilder',
    github: 'johnbuilder',
  },
};

export const fixtureBuilderProfileWithoutENS: BuilderProfile = {
  address: '0x0987654321098765432109876543210987654321',
  score: {
    score: 720,
    rank: 150,
    percentile: 85,
    updatedAt: '2024-01-15T10:30:00Z',
    credentials: [fixtureCredentials[0]],
    skills: [fixtureSkills[0], fixtureSkills[1]],
  },
  profile: {
    name: 'Jane Developer',
    bio: 'Smart contract developer',
    avatar: 'https://example.com/avatars/jane-dev.jpg',
  },
};

export const fixtureNewBuilderProfile: BuilderProfile = {
  address: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
  score: {
    score: 100,
    rank: 5000,
    percentile: 20,
    updatedAt: '2024-01-15T10:30:00Z',
    credentials: [],
    skills: [],
  },
  profile: {
    name: 'New Builder',
    bio: 'Just getting started in Web3',
  },
};

export const fixtureTopBuilderProfile: BuilderProfile = {
  address: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  ensName: 'topbuilder.eth',
  score: {
    score: 990,
    rank: 1,
    percentile: 100,
    updatedAt: '2024-01-15T10:30:00Z',
    credentials: fixtureCredentials,
    skills: fixtureSkills,
  },
  profile: {
    name: 'Top Builder',
    bio: 'Leading Web3 architect and protocol designer',
    avatar: 'https://example.com/avatars/top-builder.jpg',
    website: 'https://topbuilder.io',
    twitter: 'topbuilder',
    github: 'topbuilder',
  },
};

// Export all profiles as an array
export const fixtureBuilderProfiles = [
  fixtureBuilderProfile,
  fixtureBuilderProfileWithoutENS,
  fixtureNewBuilderProfile,
  fixtureTopBuilderProfile,
];
