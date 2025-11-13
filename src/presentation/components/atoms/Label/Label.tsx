/**
 * Label Atom Component
 */

import { LabelHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface LabelProps
  extends ComponentProps,
    Omit<LabelHTMLAttributes<HTMLLabelElement>, 'className'> {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  isRequired?: boolean;
  isInvalid?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      size = 'md',
      weight = 'medium',
      isRequired = false,
      isInvalid = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const weightStyles = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    };

    const colorStyle = isInvalid
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-700 dark:text-gray-300';

    const classes = `inline-block ${sizeStyles[size]} ${weightStyles[weight]} ${colorStyle} ${className}`;

    return (
      <label ref={ref} className={classes} {...props}>
        {children}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

