/**
 * Builder Profile DTOs
 */

export interface BuilderProfileDTO {
  id: string;
  githubUsername: string;
  score: number;
  credentials: CredentialDTO[];
  activity: ActivityDTO;
  rank?: number;
}

export interface CredentialDTO {
  id: string;
  type: string;
  issuer: string;
  issuedAt: Date;
  verified: boolean;
}

export interface ActivityDTO {
  commits: number;
  pullRequests: number;
  issues: number;
  contributions: number;
  lastActive: Date;
}

export interface LeaderboardDTO {
  builders: BuilderProfileDTO[];
  total: number;
  page: number;
}

export interface ScoreBreakdownDTO {
  totalScore: number;
  components: {
    github: number;
    credentials: number;
    activity: number;
    reputation: number;
  };
}
