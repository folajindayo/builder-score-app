/**
 * Builder Profile Entity Tests
 */

import { BuilderProfileEntity, CredentialType } from '../builder-profile.entity';

describe('BuilderProfileEntity', () => {
  const validProps = {
    id: 'builder-1',
    walletAddress: '0x' + '1'.repeat(40),
    username: 'testbuilder',
    displayName: 'Test Builder',
    score: {
      overall: 85,
      reputation: 80,
      activity: 90,
      skills: 85,
      contributions: 80,
    },
    credentials: [],
    socialLinks: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a valid profile entity', () => {
      const profile = BuilderProfileEntity.create(validProps);
      expect(profile.id).toBe(validProps.id);
      expect(profile.displayName).toBe(validProps.displayName);
    });

    it('should throw error for invalid wallet address', () => {
      expect(() =>
        BuilderProfileEntity.create({ ...validProps, walletAddress: 'invalid' })
      ).toThrow('Invalid wallet address');
    });

    it('should throw error for invalid score', () => {
      expect(() =>
        BuilderProfileEntity.create({
          ...validProps,
          score: { ...validProps.score, overall: 150 },
        })
      ).toThrow('Overall score must be between 0 and 100');
    });
  });

  describe('business logic', () => {
    it('should identify top builders', () => {
      const profile = BuilderProfileEntity.create(validProps);
      expect(profile.isTopBuilder()).toBe(true);
    });

    it('should add credentials', () => {
      const profile = BuilderProfileEntity.create(validProps);
      const credential = {
        id: 'cred-1',
        type: CredentialType.GITHUB,
        issuer: 'GitHub',
        issuedAt: new Date(),
        verified: true,
      };
      const updated = profile.addCredential(credential);
      expect(updated.credentials).toHaveLength(1);
    });

    it('should get credentials by type', () => {
      const profile = BuilderProfileEntity.create({
        ...validProps,
        credentials: [
          {
            id: 'cred-1',
            type: CredentialType.GITHUB,
            issuer: 'GitHub',
            issuedAt: new Date(),
            verified: true,
          },
        ],
      });
      expect(profile.getCredentialsByType(CredentialType.GITHUB)).toHaveLength(1);
    });
  });
});

