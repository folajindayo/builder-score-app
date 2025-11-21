/**
 * Builder Profile DTOs
 */

export interface BuilderProfileDTO {
  id: string;
  walletAddress: string;
  username?: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  score: BuilderScoreDTO;
  credentials: CredentialDTO[];
  socialLinks: SocialLinksDTO;
  hasVerifiedCredentials: boolean;
  isTopBuilder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderScoreDTO {
  overall: number;
  reputation: number;
  activity: number;
  skills: number;
  contributions: number;
}

export interface CredentialDTO {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  verified: boolean;
  metadata?: Record<string, any>;
}

export interface SocialLinksDTO {
  github?: string;
  twitter?: string;
  website?: string;
  linkedin?: string;
}

export interface LeaderboardEntryDTO {
  rank: number;
  profile: BuilderProfileDTO;
  percentile: number;
}

