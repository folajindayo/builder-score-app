/**
 * EmptyState Molecule Component
 * Displays when no content is available
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { Button, ButtonProps } from '@atoms/Button';
import { ComponentProps } from '@presentation/types';

export interface EmptyStateProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ButtonProps & { label: string };
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
        {...props}
      >
        {icon && (
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            {icon}
          </div>
        )}
        <Heading as="h3" size="xl" className="mb-2">
          {title}
        </Heading>
        {description && (
          <Text color="muted" className="max-w-md mb-6">
            {description}
          </Text>
        )}
        {action && (
          <Button {...action}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

