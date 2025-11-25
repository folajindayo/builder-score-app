/**
 * useCredentials Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useCredentials } from '../hooks/useCredentials';

global.fetch = jest.fn();

describe('useCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches credentials', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ credentials: [{ id: '1', score: 25 }] }),
    });

    const { result } = renderHook(() => useCredentials('0x123'));

    await waitFor(() => {
      expect(result.current.credentials).toHaveLength(1);
    });

    expect(result.current.totalScore).toBe(25);
  });

  it('counts verified credentials', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        credentials: [
          { id: '1', score: 10, verifiedOnChain: true },
          { id: '2', score: 15, verifiedOnChain: false },
        ],
      }),
    });

    const { result } = renderHook(() => useCredentials('0x123'));

    await waitFor(() => {
      expect(result.current.verifiedCount).toBe(1);
    });
  });
});

