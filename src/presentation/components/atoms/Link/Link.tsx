/**
 * Link Atom Component
 */

import { AnchorHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface LinkProps
  extends ComponentProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  variant?: 'default' | 'subtle' | 'underline';
  colorScheme?: 'primary' | 'secondary' | 'inherit';
  isExternal?: boolean;
  isDisabled?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      variant = 'default',
      colorScheme = 'primary',
      isExternal = false,
      isDisabled = false,
      href,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center gap-1 transition-colors';

    const variantStyles = {
      default: {
        primary: 'text-blue-600 hover:text-blue-700',
        secondary: 'text-purple-600 hover:text-purple-700',
        inherit: 'text-current hover:opacity-80',
      },
      subtle: {
        primary: 'text-blue-600 hover:bg-blue-50 px-2 py-1 rounded',
        secondary: 'text-purple-600 hover:bg-purple-50 px-2 py-1 rounded',
        inherit: 'text-current hover:bg-gray-100 px-2 py-1 rounded',
      },
      underline: {
        primary: 'text-blue-600 underline hover:no-underline',
        secondary: 'text-purple-600 underline hover:no-underline',
        inherit: 'text-current underline hover:no-underline',
      },
    };

    const disabledStyles = isDisabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    const classes = `${baseStyles} ${variantStyles[variant][colorScheme]} ${disabledStyles} ${className}`;

    const externalProps = isExternal
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <a ref={ref} href={href} className={classes} {...externalProps} {...props}>
        {children}
        {isExternal && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';

