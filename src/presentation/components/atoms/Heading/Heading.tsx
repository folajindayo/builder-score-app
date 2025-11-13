/**
 * Heading Atom Component
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface HeadingProps
  extends ComponentProps,
    Omit<HTMLAttributes<HTMLHeadingElement>, 'className'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      children,
      as: Component = 'h2',
      size = 'xl',
      weight = 'bold',
      color = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    };

    const weightStyles = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const colorStyles = {
      default: 'text-gray-900 dark:text-gray-100',
      muted: 'text-gray-700 dark:text-gray-300',
      primary: 'text-blue-600 dark:text-blue-400',
    };

    const classes = `${sizeStyles[size]} ${weightStyles[weight]} ${colorStyles[color]} ${className}`;

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

