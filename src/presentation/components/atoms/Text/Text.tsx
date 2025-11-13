/**
 * Text Atom Component
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface TextProps
  extends ComponentProps,
    Omit<HTMLAttributes<HTMLParagraphElement>, 'className'> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'error';
  as?: 'p' | 'span' | 'div';
  truncate?: boolean;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      size = 'base',
      weight = 'normal',
      color = 'default',
      as: Component = 'p',
      truncate = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    };

    const weightStyles = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const colorStyles = {
      default: 'text-gray-900 dark:text-gray-100',
      muted: 'text-gray-600 dark:text-gray-400',
      primary: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
    };

    const classes = `${sizeStyles[size]} ${weightStyles[weight]} ${colorStyles[color]} ${truncate ? 'truncate' : ''} ${className}`;

    return (
      <Component ref={ref as any} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

