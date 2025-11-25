/**
 * Test helper utilities
 */

/**
 * Generate a mock Ethereum address
 */
export function generateMockAddress(seed = 0): `0x${string}` {
  const hex = seed.toString(16).padStart(40, '0');
  return `0x${hex}` as `0x${string}`;
}

/**
 * Generate mock builder score data
 */
export function generateMockBuilderScore(overrides?: any) {
  return {
    score: 750,
    rank: 100,
    percentile: 85,
    updatedAt: new Date().toISOString(),
    credentials: [],
    skills: [],
    ...overrides,
  };
}

/**
 * Generate mock credential
 */
export function generateMockCredential(overrides?: any) {
  return {
    id: `cred-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Credential',
    issuer: 'Test Issuer',
    verified: true,
    issuedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate mock skill
 */
export function generateMockSkill(overrides?: any) {
  return {
    id: `skill-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Skill',
    category: 'Testing',
    level: 3,
    ...overrides,
  };
}

/**
 * Generate mock search result
 */
export function generateMockSearchResult(overrides?: any) {
  return {
    address: generateMockAddress(),
    ensName: 'builder.eth',
    score: 800,
    skills: [],
    credentials: [],
    ...overrides,
  };
}

/**
 * Generate multiple mock search results
 */
export function generateMockSearchResults(count: number, overrides?: any) {
  return Array.from({ length: count }, (_, i) =>
    generateMockSearchResult({ ...overrides, address: generateMockAddress(i) })
  );
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API response helper
 */
export function mockApiResponse<T>(data: T, delay = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Mock API error helper
 */
export function mockApiError(message: string, status = 500, delay = 0): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(
      () =>
        reject({
          message,
          status,
          error: new Error(message),
        }),
      delay
    );
  });
}

/**
 * Create a spy on console methods for testing
 */
export function spyOnConsole(method: 'log' | 'warn' | 'error' = 'error') {
  return jest.spyOn(console, method).mockImplementation(() => {});
}

/**
 * Restore all console spies
 */
export function restoreConsole() {
  jest.restoreAllMocks();
}

/**
 * Check if running in test environment
 */
export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Mock localStorage for testing
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
}

/**
 * Mock sessionStorage for testing
 */
export const mockSessionStorage = mockLocalStorage;

/**
 * Create a mock file for upload testing
 */
export function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
}

/**
 * Trigger window resize event for testing
 */
export function triggerResize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}
