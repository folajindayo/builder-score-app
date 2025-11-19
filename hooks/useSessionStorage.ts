import { useState, useEffect, useCallback } from "react";

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state from sessionStorage
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, state]);

  // Update state and sessionStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState((prevState) => {
      const nextState = value instanceof Function ? value(prevState) : value;
      return nextState;
    });
  }, []);

  // Remove from sessionStorage
  const removeValue = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.removeItem(key);
      setState(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [state, setValue, removeValue];
}

