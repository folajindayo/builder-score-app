/**
 * TabItem Molecule Component
 * Individual tab button/link
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Badge } from '@atoms/Badge';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface TabItemProps extends ComponentProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
  badge?: string | number;
}

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  (
    {
      label,
      isActive = false,
      isDisabled = false,
      badge,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2';
    const activeStyles = isActive
      ? 'text-blue-600 border-blue-600'
      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300';
    const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        disabled={isDisabled}
        className={`${baseStyles} ${activeStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        <Text as="span" weight="medium">
          {label}
        </Text>
        {badge !== undefined && (
          <Badge size="sm" variant="subtle" colorScheme={isActive ? 'primary' : 'secondary'}>
            {badge}
          </Badge>
        )}
      </button>
    );
  }
);

TabItem.displayName = 'TabItem';

