import {
  generateMockAddress,
  generateMockBuilderScore,
  generateMockCredential,
  generateMockSkill,
} from './test-helpers';

describe('Custom Matchers', () => {
  describe('toBeValidEthereumAddress', () => {
    it('should pass for valid Ethereum addresses', () => {
      expect('0x1234567890123456789012345678901234567890').toBeValidEthereumAddress();
      expect('0xABCDEF1234567890ABCDEF1234567890ABCDEF12').toBeValidEthereumAddress();
    });

    it('should fail for invalid Ethereum addresses', () => {
      expect(() => {
        expect('invalid').toBeValidEthereumAddress();
      }).toThrow();

      expect(() => {
        expect('0x123').toBeValidEthereumAddress();
      }).toThrow();
    });
  });

  describe('toBeValidBuilderScore', () => {
    it('should pass for valid builder scores', () => {
      expect(0).toBeValidBuilderScore();
      expect(500).toBeValidBuilderScore();
      expect(1000).toBeValidBuilderScore();
    });

    it('should fail for invalid builder scores', () => {
      expect(() => {
        expect(-1).toBeValidBuilderScore();
      }).toThrow();

      expect(() => {
        expect(1001).toBeValidBuilderScore();
      }).toThrow();
    });
  });

  describe('toBeValidISODate', () => {
    it('should pass for valid ISO dates', () => {
      expect(new Date().toISOString()).toBeValidISODate();
      expect('2024-01-15T10:30:00.000Z').toBeValidISODate();
    });

    it('should fail for invalid dates', () => {
      expect(() => {
        expect('not a date').toBeValidISODate();
      }).toThrow();

      expect(() => {
        expect('2024-01-15').toBeValidISODate();
      }).toThrow();
    });
  });

  describe('toBeValidBuilderProfile', () => {
    it('should pass for valid builder profiles', () => {
      const profile = {
        address: generateMockAddress(),
        score: {
          score: 800,
          rank: 50,
        },
      };
      expect(profile).toBeValidBuilderProfile();
    });

    it('should fail for invalid builder profiles', () => {
      expect(() => {
        expect({ address: 'invalid' }).toBeValidBuilderProfile();
      }).toThrow();

      expect(() => {
        expect({ score: {} }).toBeValidBuilderProfile();
      }).toThrow();
    });
  });

  describe('toBeValidSkill', () => {
    it('should pass for valid skills', () => {
      const skill = generateMockSkill();
      expect(skill).toBeValidSkill();
    });

    it('should fail for invalid skills', () => {
      expect(() => {
        expect({ id: '' }).toBeValidSkill();
      }).toThrow();

      expect(() => {
        expect({ name: 'Test' }).toBeValidSkill();
      }).toThrow();
    });
  });

  describe('toBeValidCredential', () => {
    it('should pass for valid credentials', () => {
      const credential = generateMockCredential();
      expect(credential).toBeValidCredential();
    });

    it('should fail for invalid credentials', () => {
      expect(() => {
        expect({ id: '1', name: 'Test' }).toBeValidCredential();
      }).toThrow();

      expect(() => {
        expect({
          id: '1',
          name: 'Test',
          issuer: 'Test',
          verified: 'not a boolean',
        }).toBeValidCredential();
      }).toThrow();
    });
  });
});
