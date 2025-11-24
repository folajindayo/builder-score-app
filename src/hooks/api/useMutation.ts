/**
 * useMutation Hook
 * Custom hook for data mutations
 */

import { useState, useCallback } from "react";

interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions<T> = {}
): [
  (variables: V) => Promise<T | undefined>,
  MutationState<T>
] {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<MutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: V) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await mutationFn(variables);
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error as Error;
        setState({ data: null, loading: false, error: err });
        onError?.(err);
        return undefined;
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return [mutate, state];
}

