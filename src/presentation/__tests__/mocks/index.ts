/**
 * Test Mocks for Presentation Layer
 * 
 * Mock data and utilities for testing components.
 */

/**
 * Mock builder data
 */
export const mockBuilder = {
  address: '0x1234567890123456789012345678901234567890',
  name: 'John Builder',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Full-stack developer and blockchain enthusiast',
  github: 'johnbuilder',
  twitter: '@johnbuilder',
  website: 'https://johnbuilder.com',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01'),
};

/**
 * Mock score data
 */
export const mockScore = {
  value: 85,
  maxValue: 100,
  calculatedAt: new Date(),
  percentage: 85,
  tier: 'A' as const,
};

/**
 * Mock leaderboard data
 */
export const mockLeaderboard = [
  {
    address: '0x1111111111111111111111111111111111111111',
    name: 'Top Builder',
    score: 95,
    rank: 1,
  },
  {
    address: '0x2222222222222222222222222222222222222222',
    name: 'Second Builder',
    score: 88,
    rank: 2,
  },
  {
    address: '0x3333333333333333333333333333333333333333',
    name: 'Third Builder',
    score: 82,
    rank: 3,
  },
];

/**
 * Mock API responses
 */
export const mockApiResponses = {
  success: {
    data: mockBuilder,
    status: 'success',
  },
  error: {
    error: 'Something went wrong',
    status: 'error',
  },
  loading: {
    data: null,
    status: 'loading',
  },
};

/**
 * Create mock function
 */
export function createMockFn<T extends (...args: any[]) => any>(): jest.Mock<
  ReturnType<T>,
  Parameters<T>
> {
  return jest.fn();
}

/**
 * Create mock promise
 */
export function createMockPromise<T>(
  data: T,
  delay: number = 0
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Create mock rejected promise
 */
export function createMockRejectedPromise(
  error: any,
  delay: number = 0
): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay);
  });
}

