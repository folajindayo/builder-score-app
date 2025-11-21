/**
 * Builder Type Definitions
 */

export type CredentialType = 'github' | 'talent_protocol' | 'ens' | 'lens' | 'farcaster' | 'custom';

export interface ICredential {
  id: string;
  type: CredentialType;
  issuer: string;
  issuedAt: string;
  verified: boolean;
  metadata?: Record<string, any>;
}

export interface IBuilderScore {
  overall: number;
  reputation: number;
  activity: number;
  skills: number;
  contributions: number;
}

export interface IBuilderProfile {
  id: string;
  walletAddress: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  score: IBuilderScore;
  credentials: ICredential[];
  rank?: number;
  percentile?: number;
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
}

export interface ILeaderboardEntry {
  builderId: string;
  username: string;
  score: number;
  rank: number;
  change?: number;
}

