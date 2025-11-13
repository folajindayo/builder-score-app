import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock builder score data for testing
 */
export const mockBuilderScore = {
  score: 850,
  rank: 42,
  percentile: 95,
  updatedAt: '2024-01-15T10:30:00Z',
  credentials: [
    {
      id: '1',
      name: 'Verified Developer',
      issuer: 'GitHub',
      verified: true,
      issuedAt: '2023-06-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Smart Contract Auditor',
      issuer: 'Certik',
      verified: true,
      issuedAt: '2023-09-15T00:00:00Z',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'Solidity',
      category: 'Programming',
      level: 4,
    },
    {
      id: '2',
      name: 'React',
      category: 'Frontend',
      level: 5,
    },
  ],
};

/**
 * Mock search results for testing
 */
export const mockSearchResults = {
  results: [
    {
      address: '0x1234567890123456789012345678901234567890',
      ensName: 'builder1.eth',
      score: 920,
      skills: [
        { id: '1', name: 'Solidity', category: 'Programming' },
      ],
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      ensName: 'builder2.eth',
      score: 875,
      skills: [
        { id: '2', name: 'Rust', category: 'Programming' },
      ],
    },
  ],
  total: 2,
  page: 0,
  pageSize: 10,
  hasMore: false,
};

/**
 * Mock wallet account for testing
 */
export const mockWalletAccount = {
  address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  isConnected: true,
  isDisconnected: false,
};

/**
 * Helper to wait for async operations
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

