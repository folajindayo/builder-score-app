/**
 * Component Lazy Loading Utilities
 * For code splitting and performance optimization
 */

import dynamic from "next/dynamic";
import { ComponentType } from "react";

interface LazyOptions {
  loading?: ComponentType;
  ssr?: boolean;
}

/**
 * Lazy load a component with optional loading component
 */
export function lazyLoad<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyOptions = {}
): ComponentType<P> {
  const { loading: LoadingComponent, ssr = false } = options;

  return dynamic(importFn, {
    loading: LoadingComponent ? () => <LoadingComponent /> : undefined,
    ssr,
  });
}

/**
 * Default loading component
 */
export const DefaultLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
  </div>
);

/**
 * Preload a component
 */
export function preload<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
): void {
  importFn().catch(() => {
    // Silently handle preload errors
  });
}

