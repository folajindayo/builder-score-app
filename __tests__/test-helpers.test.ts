import {
  generateMockAddress,
  generateMockBuilderScore,
  generateMockCredential,
  generateMockSkill,
  generateMockSearchResult,
  generateMockSearchResults,
  wait,
  mockApiResponse,
  mockApiError,
  mockLocalStorage,
} from './test-helpers';

describe('Test Helpers', () => {
  describe('generateMockAddress', () => {
    it('should generate valid Ethereum addresses', () => {
      const address = generateMockAddress();
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should generate different addresses with different seeds', () => {
      const address1 = generateMockAddress(1);
      const address2 = generateMockAddress(2);
      expect(address1).not.toBe(address2);
    });
  });

  describe('generateMockBuilderScore', () => {
    it('should generate valid builder score', () => {
      const score = generateMockBuilderScore();
      expect(score).toHaveProperty('score');
      expect(score).toHaveProperty('rank');
      expect(score).toHaveProperty('percentile');
      expect(score).toHaveProperty('updatedAt');
    });

    it('should allow overrides', () => {
      const score = generateMockBuilderScore({ score: 999 });
      expect(score.score).toBe(999);
    });
  });

  describe('generateMockCredential', () => {
    it('should generate valid credential', () => {
      const credential = generateMockCredential();
      expect(credential).toHaveProperty('id');
      expect(credential).toHaveProperty('name');
      expect(credential).toHaveProperty('issuer');
      expect(credential).toHaveProperty('verified');
    });
  });

  describe('generateMockSkill', () => {
    it('should generate valid skill', () => {
      const skill = generateMockSkill();
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('category');
      expect(skill).toHaveProperty('level');
    });
  });

  describe('generateMockSearchResult', () => {
    it('should generate valid search result', () => {
      const result = generateMockSearchResult();
      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('ensName');
      expect(result).toHaveProperty('score');
    });
  });

  describe('generateMockSearchResults', () => {
    it('should generate array of search results', () => {
      const results = generateMockSearchResults(5);
      expect(results).toHaveLength(5);
      expect(results[0]).toHaveProperty('address');
    });

    it('should generate unique addresses', () => {
      const results = generateMockSearchResults(3);
      const addresses = results.map((r) => r.address);
      expect(new Set(addresses).size).toBe(3);
    });
  });

  describe('wait', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await wait(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(40); // Allow some variance
    });
  });

  describe('mockApiResponse', () => {
    it('should return mock data', async () => {
      const data = { test: 'data' };
      const result = await mockApiResponse(data);
      expect(result).toEqual(data);
    });

    it('should delay response if specified', async () => {
      const start = Date.now();
      await mockApiResponse({ test: 'data' }, 50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('mockApiError', () => {
    it('should throw error with message', async () => {
      await expect(mockApiError('Test error')).rejects.toMatchObject({
        message: 'Test error',
        status: 500,
      });
    });

    it('should use custom status code', async () => {
      await expect(mockApiError('Not found', 404)).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('mockLocalStorage', () => {
    it('should set and get items', () => {
      const storage = mockLocalStorage();
      storage.setItem('key', 'value');
      expect(storage.getItem('key')).toBe('value');
    });

    it('should remove items', () => {
      const storage = mockLocalStorage();
      storage.setItem('key', 'value');
      storage.removeItem('key');
      expect(storage.getItem('key')).toBeNull();
    });

    it('should clear all items', () => {
      const storage = mockLocalStorage();
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      storage.clear();
      expect(storage.length).toBe(0);
    });
  });
});
