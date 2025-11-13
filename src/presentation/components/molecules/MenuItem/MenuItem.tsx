/**
 * MenuItem Molecule Component
 * Menu item with icon, label, shortcut
 */

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface MenuItemProps extends ComponentProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  description?: string;
  isDisabled?: boolean;
  isDanger?: boolean;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      label,
      icon,
      shortcut,
      description,
      isDisabled = false,
      isDanger = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors rounded-md';
    const hoverStyles = isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : isDanger
      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700';

    return (
      <button
        ref={ref}
        role="menuitem"
        disabled={isDisabled}
        className={`${baseStyles} ${hoverStyles} ${className}`}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <div className="flex-1 min-w-0">
            <Text as="span" weight="medium" className="block truncate">
              {label}
            </Text>
            {description && (
              <Text as="span" size="sm" color="muted" className="block truncate">
                {description}
              </Text>
            )}
          </div>
        </div>
        {shortcut && (
          <Text as="span" size="sm" color="muted" className="flex-shrink-0">
            {shortcut}
          </Text>
        )}
      </button>
    );
  }
);

MenuItem.displayName = 'MenuItem';

