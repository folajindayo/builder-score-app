/**
 * Theme Type Definitions
 * 
 * Type definitions for theming system.
 */

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Spacing scale
 */
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;

/**
 * Border radius
 */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Font weight
 */
export type FontWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

/**
 * Font size
 */
export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

/**
 * Breakpoints
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Z-index levels
 */
export type ZIndex =
  | 'base'
  | 'dropdown'
  | 'sticky'
  | 'fixed'
  | 'modal'
  | 'popover'
  | 'tooltip'
  | 'toast';

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  spacing: Record<Spacing, string>;
  borderRadius: Record<BorderRadius, string>;
  fontWeight: Record<FontWeight, string>;
  fontSize: Record<FontSize, string>;
  breakpoints: Record<Breakpoint, string>;
  zIndex: Record<ZIndex, number>;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: ThemeConfig;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

