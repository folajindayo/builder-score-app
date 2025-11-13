/**
 * Custom Hook Types
 * 
 * Type definitions for custom React hooks.
 */

/**
 * Async state
 */
export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Sort state
 */
export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Filter state
 */
export type FilterState = Record<string, any>;

/**
 * Form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Toggle state return type
 */
export interface ToggleState {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

/**
 * Disclosure state (for modals, drawers, etc.)
 */
export interface DisclosureState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Media query state
 */
export interface MediaQueryState {
  matches: boolean;
  query: string;
}

/**
 * Local storage hook return type
 */
export interface LocalStorageState<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
}

/**
 * Debounced value hook return type
 */
export interface DebouncedValue<T> {
  value: T;
  isPending: boolean;
}

/**
 * Window size state
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Scroll position state
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Intersection observer state
 */
export interface IntersectionState {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

