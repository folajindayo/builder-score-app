/**
 * CardHeader Molecule Component
 * Combines Avatar + Heading + Text + Actions
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@atoms/Avatar';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface CardHeaderProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  avatar?: AvatarProps;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      avatar,
      title,
      subtitle,
      actions,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 ${className}`}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {avatar && <Avatar {...avatar} />}
          <div className="flex-1 min-w-0">
            <Heading as="h3" size="lg" className="truncate">
              {title}
            </Heading>
            {subtitle && (
              <Text size="sm" color="muted" className="truncate">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

