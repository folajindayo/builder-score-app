/**
 * ButtonGroup Molecule Component
 * Groups multiple buttons together
 */

import { HTMLAttributes, forwardRef, ReactElement, Children, cloneElement } from 'react';
import { ComponentProps } from '@presentation/types';

export interface ButtonGroupProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactElement[];
  variant?: 'attached' | 'spaced';
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      children,
      variant = 'attached',
      orientation = 'horizontal',
      className = '',
      ...props
    },
    ref
  ) => {
    const orientationStyles = orientation === 'horizontal'
      ? 'flex-row'
      : 'flex-col';

    const variantStyles = variant === 'attached'
      ? orientation === 'horizontal'
        ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px'
        : '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px'
      : orientation === 'horizontal'
      ? 'gap-2'
      : 'gap-2';

    return (
      <div
        ref={ref}
        role="group"
        className={`inline-flex ${orientationStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {Children.map(children, (child, index) => {
          return cloneElement(child, {
            ...child.props,
            style: variant === 'attached' ? { position: 'relative', zIndex: 0 } : undefined,
          });
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

