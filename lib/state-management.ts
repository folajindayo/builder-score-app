/**
 * State management utilities and patterns
 * 
 * Provides reusable patterns for managing complex state,
 * reducing the number of useState calls and improving performance.
 */

import { useReducer, useCallback, useMemo } from 'react';

/**
 * Generic reducer action type
 */
export type Action<T> = 
  | { type: 'SET'; payload: T }
  | { type: 'RESET'; payload?: T }
  | { type: 'UPDATE'; payload: Partial<T> }
  | { type: string; payload?: any };

/**
 * Creates a reducer for managing a single value
 */
export function createValueReducer<T>(initialValue: T) {
  return (state: T, action: Action<T>): T => {
    switch (action.type) {
      case 'SET':
        return action.payload;
      case 'RESET':
        return action.payload ?? initialValue;
      case 'UPDATE':
        if (typeof state === 'object' && state !== null && typeof action.payload === 'object') {
          return { ...state, ...action.payload };
        }
        return state;
      default:
        return state;
    }
  };
}

/**
 * Hook for managing a single value with reducer pattern
 */
export function useValueReducer<T>(initialValue: T) {
  const reducer = useMemo(() => createValueReducer(initialValue), [initialValue]);
  const [state, dispatch] = useReducer(reducer, initialValue);

  const setValue = useCallback((value: T) => {
    dispatch({ type: 'SET', payload: value });
  }, []);

  const resetValue = useCallback((value?: T) => {
    dispatch({ type: 'RESET', payload: value });
  }, []);

  const updateValue = useCallback((updates: Partial<T>) => {
    dispatch({ type: 'UPDATE', payload: updates });
  }, []);

  return {
    value: state,
    setValue,
    resetValue,
    updateValue,
    dispatch,
  };
}

/**
 * Toggle state reducer
 */
function toggleReducer(state: boolean): boolean {
  return !state;
}

/**
 * Hook for managing boolean toggle state
 */
export function useToggle(initialValue: boolean = false) {
  const [state, dispatch] = useReducer(toggleReducer, initialValue);

  const toggle = useCallback(() => {
    dispatch();
  }, []);

  const setTrue = useCallback(() => {
    if (!state) dispatch();
  }, [state]);

  const setFalse = useCallback(() => {
    if (state) dispatch();
  }, [state]);

  return {
    value: state,
    toggle,
    setTrue,
    setFalse,
  };
}

/**
 * Set state reducer
 */
function setReducer<T>(state: Set<T>, action: { type: 'ADD' | 'REMOVE' | 'CLEAR' | 'SET'; payload?: T | Set<T> }): Set<T> {
  switch (action.type) {
    case 'ADD':
      if (action.payload !== undefined) {
        const newSet = new Set(state);
        newSet.add(action.payload);
        return newSet;
      }
      return state;
    case 'REMOVE':
      if (action.payload !== undefined) {
        const newSet = new Set(state);
        newSet.delete(action.payload);
        return newSet;
      }
      return state;
    case 'CLEAR':
      return new Set();
    case 'SET':
      if (action.payload instanceof Set) {
        return new Set(action.payload);
      }
      return state;
    default:
      return state;
  }
}

/**
 * Hook for managing Set state
 */
export function useSet<T>(initialValue: Set<T> = new Set()) {
  const [state, dispatch] = useReducer(setReducer<T>, initialValue);

  const add = useCallback((item: T) => {
    dispatch({ type: 'ADD', payload: item });
  }, []);

  const remove = useCallback((item: T) => {
    dispatch({ type: 'REMOVE', payload: item });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const set = useCallback((items: Set<T>) => {
    dispatch({ type: 'SET', payload: items });
  }, []);

  const toggle = useCallback((item: T) => {
    if (state.has(item)) {
      dispatch({ type: 'REMOVE', payload: item });
    } else {
      dispatch({ type: 'ADD', payload: item });
    }
  }, [state]);

  return {
    value: state,
    add,
    remove,
    clear,
    set,
    toggle,
    has: (item: T) => state.has(item),
    size: state.size,
  };
}

/**
 * Map state reducer
 */
function mapReducer<K, V>(
  state: Map<K, V>,
  action: { type: 'SET' | 'DELETE' | 'CLEAR' | 'UPDATE'; key?: K; value?: V; entries?: [K, V][] }
): Map<K, V> {
  switch (action.type) {
    case 'SET':
      if (action.key !== undefined && action.value !== undefined) {
        const newMap = new Map(state);
        newMap.set(action.key, action.value);
        return newMap;
      }
      return state;
    case 'DELETE':
      if (action.key !== undefined) {
        const newMap = new Map(state);
        newMap.delete(action.key);
        return newMap;
      }
      return state;
    case 'CLEAR':
      return new Map();
    case 'UPDATE':
      if (action.entries) {
        return new Map(action.entries);
      }
      return state;
    default:
      return state;
  }
}

/**
 * Hook for managing Map state
 */
export function useMap<K, V>(initialValue: Map<K, V> = new Map()) {
  const [state, dispatch] = useReducer(mapReducer<K, V>, initialValue);

  const set = useCallback((key: K, value: V) => {
    dispatch({ type: 'SET', key, value });
  }, []);

  const remove = useCallback((key: K) => {
    dispatch({ type: 'DELETE', key });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const update = useCallback((entries: [K, V][]) => {
    dispatch({ type: 'UPDATE', entries });
  }, []);

  return {
    value: state,
    set,
    remove,
    clear,
    update,
    get: (key: K) => state.get(key),
    has: (key: K) => state.has(key),
    size: state.size,
  };
}

/**
 * Async state reducer
 */
type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type AsyncAction<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error }
  | { type: 'RESET' };

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'ERROR':
      return { data: null, loading: false, error: action.payload };
    case 'RESET':
      return { data: null, loading: false, error: null };
    default:
      return state;
  }
}

/**
 * Hook for managing async operations state
 */
export function useAsyncState<T>(initialData: T | null = null) {
  const [state, dispatch] = useReducer(asyncReducer<T>, {
    data: initialData,
    loading: false,
    error: null,
  });

  const setLoading = useCallback(() => {
    dispatch({ type: 'LOADING' });
  }, []);

  const setSuccess = useCallback((data: T) => {
    dispatch({ type: 'SUCCESS', payload: data });
  }, []);

  const setError = useCallback((error: Error) => {
    dispatch({ type: 'ERROR', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    reset,
  };
}

/**
 * Combined state reducer for common UI patterns
 */
export interface UIState {
  loading: boolean;
  error: string | null;
  open: boolean;
  selected: Set<string | number>;
}

type UIAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SELECT'; payload: string | number }
  | { type: 'DESELECT'; payload: string | number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESET' };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'TOGGLE_OPEN':
      return { ...state, open: !state.open };
    case 'SELECT': {
      const newSelected = new Set(state.selected);
      newSelected.add(action.payload);
      return { ...state, selected: newSelected };
    }
    case 'DESELECT': {
      const newSelected = new Set(state.selected);
      newSelected.delete(action.payload);
      return { ...state, selected: newSelected };
    }
    case 'CLEAR_SELECTION':
      return { ...state, selected: new Set() };
    case 'RESET':
      return { loading: false, error: null, open: false, selected: new Set() };
    default:
      return state;
  }
}

/**
 * Hook for managing common UI state patterns
 */
export function useUIState(initialState: Partial<UIState> = {}) {
  const [state, dispatch] = useReducer(uiReducer, {
    loading: false,
    error: null,
    open: false,
    selected: new Set<string | number>(),
    ...initialState,
  });

  return {
    ...state,
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setOpen: (open: boolean) => dispatch({ type: 'SET_OPEN', payload: open }),
    toggleOpen: () => dispatch({ type: 'TOGGLE_OPEN' }),
    select: (item: string | number) => dispatch({ type: 'SELECT', payload: item }),
    deselect: (item: string | number) => dispatch({ type: 'DESELECT', payload: item }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}



