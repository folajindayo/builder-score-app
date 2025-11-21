/**
 * Credential Types
 */

export interface Credential {
  id: string;
  type: 'passport' | 'achievement' | 'certification';
  title: string;
  issuer: string;
  issuedAt: string;
  verifiedOnChain: boolean;
  score: number;
  metadata?: Record<string, any>;
}

export interface PassportData {
  score: number;
  stamps: Stamp[];
  lastUpdate: string;
}

export interface Stamp {
  provider: string;
  verified: boolean;
  issuedAt: string;
}

