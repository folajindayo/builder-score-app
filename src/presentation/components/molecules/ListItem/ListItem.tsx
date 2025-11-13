/**
 * ListItem Molecule Component
 * Flexible list item with avatar, content, and actions
 */

import { LiHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@atoms/Avatar';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface ListItemProps extends ComponentProps, Omit<LiHTMLAttributes<HTMLLIElement>, 'className'> {
  avatar?: AvatarProps;
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  isClickable?: boolean;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      avatar,
      title,
      subtitle,
      description,
      leftIcon,
      rightContent,
      isClickable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'flex items-start gap-3 p-4';
    const clickableStyles = isClickable
      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
      : '';

    return (
      <li
        ref={ref}
        className={`${baseStyles} ${clickableStyles} ${className}`}
        {...props}
      >
        {(avatar || leftIcon) && (
          <div className="flex-shrink-0">
            {avatar ? <Avatar {...avatar} /> : leftIcon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Text weight="semibold" className="truncate">
            {title}
          </Text>
          {subtitle && (
            <Text size="sm" color="muted" className="truncate">
              {subtitle}
            </Text>
          )}
          {description && (
            <Text size="sm" color="muted" className="mt-1">
              {description}
            </Text>
          )}
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

