/**
 * AvatarGroup Molecule Component
 * Group of overlapping avatars
 */

import { HTMLAttributes, forwardRef } from 'react';
import { Avatar, AvatarProps } from '@atoms/Avatar';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface AvatarGroupProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max = 5,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
      <div
        ref={ref}
        className={`flex items-center -space-x-2 ${className}`}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <div
            key={index}
            className="inline-block ring-2 ring-white dark:ring-gray-800 rounded-full"
            style={{ zIndex: visibleAvatars.length - index }}
          >
            <Avatar {...avatar} size={size} showBorder={false} />
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className="inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800"
            style={{ zIndex: 0 }}
          >
            <Avatar
              size={size}
              name={`+${remainingCount}`}
              showBorder={false}
            />
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

