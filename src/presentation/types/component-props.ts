/**
 * Common Component Props Types
 * 
 * Shared prop types used across presentation components.
 */

import { ReactNode } from 'react';

/**
 * Base component props
 */
export interface BaseComponentProps {
  /** Additional CSS classes */
  className?: string;
  /** Component ID */
  id?: string;
  /** Test ID for testing */
  testId?: string;
  /** Inline styles (use sparingly) */
  style?: React.CSSProperties;
  /** Children elements */
  children?: ReactNode;
}

/**
 * Size variants
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

/**
 * Status variants
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Button variants
 */
export type ButtonVariant =
  | 'solid'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'subtle';

/**
 * Input variants
 */
export type InputVariant = 'default' | 'filled' | 'flushed' | 'unstyled';

/**
 * Component state props
 */
export interface StateProps {
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Required field */
  required?: boolean;
}

/**
 * Interactive element props
 */
export interface InteractiveProps extends StateProps {
  /** On click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** On focus handler */
  onFocus?: (event: React.FocusEvent) => void;
  /** On blur handler */
  onBlur?: (event: React.FocusEvent) => void;
  /** On mouse enter handler */
  onMouseEnter?: (event: React.MouseEvent) => void;
  /** On mouse leave handler */
  onMouseLeave?: (event: React.MouseEvent) => void;
}

/**
 * Form element props
 */
export interface FormElementProps extends StateProps {
  /** Field name */
  name?: string;
  /** Field value */
  value?: any;
  /** Default value */
  defaultValue?: any;
  /** On change handler */
  onChange?: (value: any) => void;
  /** On change event handler */
  onChangeEvent?: (event: React.ChangeEvent<any>) => void;
  /** Validation error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Accessibility props
 */
export interface AccessibilityProps {
  /** ARIA label */
  'aria-label'?: string;
  /** ARIA labelledby */
  'aria-labelledby'?: string;
  /** ARIA describedby */
  'aria-describedby'?: string;
  /** ARIA role */
  role?: string;
  /** Tab index */
  tabIndex?: number;
}

/**
 * Full component props combining all common types
 */
export interface ComponentProps
  extends BaseComponentProps,
    AccessibilityProps {}

/**
 * Polymorphic component props
 */
export type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;

