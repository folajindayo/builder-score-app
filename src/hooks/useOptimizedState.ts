/**
 * Optimized state management hooks
 */

import { useState, useCallback, useRef } from "react";

export function useOptimizedState<T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);

  const setOptimizedState = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = typeof value === "function" ? (value as Function)(prev) : value;
      
      if (Object.is(newValue, stateRef.current)) {
        return prev;
      }
      
      stateRef.current = newValue;
      return newValue;
    });
  }, []);

  return [state, setOptimizedState];
}

export function useBatchedState<T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState(initialValue);
  const pendingUpdates = useRef<Array<T | ((prev: T) => T)>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const flush = useCallback(() => {
    if (pendingUpdates.current.length === 0) return;

    setState((prev) => {
      let current = prev;
      for (const update of pendingUpdates.current) {
        current = typeof update === "function" ? (update as Function)(current) : update;
      }
      return current;
    });

    pendingUpdates.current = [];
  }, []);

  const setBatchedState = useCallback((value: T | ((prev: T) => T)) => {
    pendingUpdates.current.push(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(flush, 0);
  }, [flush]);

  return [state, setBatchedState, flush];
}

export function useLazyState<T>(
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialValue);

  const setLazyState = useCallback((value: T | ((prev: T) => T)) => {
    requestIdleCallback(() => {
      setState(value);
    });
  }, []);

  return [state, setLazyState];
}

