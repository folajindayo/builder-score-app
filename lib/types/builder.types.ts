/**
 * Builder Types
 */

export interface Builder {
  address: string;
  score: number;
  level: string;
  credentials: Credential[];
  skills: string[];
  reputation: number;
}

export interface Credential {
  id: string;
  type: string;
  name: string;
  issuer: string;
  issuedAt: Date;
  verified: boolean;
}

export interface BuilderMetrics {
  commits: number;
  pullRequests: number;
  repositories: number;
  followers: number;
  contributions: number;
}

