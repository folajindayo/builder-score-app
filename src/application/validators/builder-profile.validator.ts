/**
 * Builder Profile Validators
 */

import { z } from 'zod';

export const githubUsernameSchema = z.string().min(1).max(39).regex(/^[a-zA-Z0-9-]+$/);

export const credentialSchema = z.object({
  type: z.string(),
  issuer: z.string(),
  issuedAt: z.date(),
  verified: z.boolean(),
});

export const activitySchema = z.object({
  commits: z.number().int().min(0),
  pullRequests: z.number().int().min(0),
  issues: z.number().int().min(0),
  contributions: z.number().int().min(0),
  lastActive: z.date(),
});

export const createBuilderProfileSchema = z.object({
  githubUsername: githubUsernameSchema,
  credentials: z.array(credentialSchema).optional(),
});

export class BuilderProfileValidator {
  static validateUsername(username: unknown) {
    return githubUsernameSchema.parse(username);
  }

  static validateCreate(data: unknown) {
    return createBuilderProfileSchema.parse(data);
  }

  static validateCredential(data: unknown) {
    return credentialSchema.parse(data);
  }

  static validateActivity(data: unknown) {
    return activitySchema.parse(data);
  }
}

