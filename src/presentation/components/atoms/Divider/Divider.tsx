/**
 * Divider Atom Component
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface DividerProps
  extends ComponentProps,
    Omit<HTMLAttributes<HTMLHRElement>, 'className'> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: '1' | '2' | '4';
  label?: string;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      thickness = '1',
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    const orientationStyles = orientation === 'horizontal'
      ? `w-full border-t-${thickness} ${variantStyles[variant]}`
      : `h-full border-l-${thickness} ${variantStyles[variant]}`;

    const classes = `border-gray-300 dark:border-gray-700 ${orientationStyles} ${className}`;

    if (label && orientation === 'horizontal') {
      return (
        <div className="flex items-center gap-4 w-full">
          <hr ref={ref} className={classes} {...props} />
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {label}
          </span>
          <hr ref={ref} className={classes} {...props} />
        </div>
      );
    }

    return <hr ref={ref} className={classes} {...props} />;
  }
);

Divider.displayName = 'Divider';

