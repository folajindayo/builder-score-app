/**
 * Builder Validation Schemas
 */

import { z } from 'zod';

export const BuilderScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  reputation: z.number().min(0).max(100),
  activity: z.number().min(0).max(100),
  skills: z.number().min(0).max(100),
  contributions: z.number().min(0).max(100),
});

export const CredentialSchema = z.object({
  id: z.string(),
  type: z.enum(['github', 'talent_protocol', 'ens', 'lens', 'farcaster', 'custom']),
  issuer: z.string(),
  issuedAt: z.string().datetime(),
  verified: z.boolean(),
  metadata: z.record(z.any()).optional(),
});

export const CreateBuilderProfileSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  socialLinks: z.object({
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
});

export const CalculateScoreSchema = z.object({
  builderId: z.string(),
  metrics: z.object({
    githubContributions: z.number().int().min(0).optional(),
    talentProtocolScore: z.number().min(0).max(100).optional(),
    onchainActivity: z.number().min(0).optional(),
    communityEngagement: z.number().min(0).optional(),
    projectComplexity: z.number().min(0).optional(),
  }),
});

export type CreateBuilderProfileInput = z.infer<typeof CreateBuilderProfileSchema>;
export type CalculateScoreInput = z.infer<typeof CalculateScoreSchema>;

