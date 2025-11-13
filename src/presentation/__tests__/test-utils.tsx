/**
 * Testing Utilities for Presentation Components
 * 
 * Provides custom render functions and utilities for testing components
 * with proper providers and context.
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Custom render options
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark';
  initialRoute?: string;
}

/**
 * All providers wrapper for testing
 */
interface AllProvidersProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
}

function AllProviders({ children, theme = 'light' }: AllProvidersProps) {
  // This will be enhanced with actual providers as they're created
  return <>{children}</>;
}

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  const { initialTheme = 'light', ...renderOptions } = options || {};

  function Wrapper({ children }: { children: ReactNode }) {
    return <AllProviders theme={initialTheme}>{children}</AllProviders>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create mock props helper
 */
export function createMockProps<T extends Record<string, any>>(
  overrides?: Partial<T>
): T {
  return {
    testId: 'test-component',
    ...overrides,
  } as T;
}

/**
 * Wait for element to be removed (useful for loading states)
 */
export { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

/**
 * User event utilities
 */
export { default as userEvent } from '@testing-library/user-event';

/**
 * Screen queries
 */
export { screen, within } from '@testing-library/react';

/**
 * Custom matchers
 */
export { expect } from '@jest/globals';

// Re-export everything from testing library
export * from '@testing-library/react';

