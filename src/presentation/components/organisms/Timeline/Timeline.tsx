/**
 * Timeline Organism Component
 * Chronological event display
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Text } from '@atoms/Text';
import { Badge } from '@atoms/Badge';
import { ComponentProps } from '@presentation/types';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      events,
      orientation = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const getColorStyles = (variant?: string) => {
      switch (variant) {
        case 'success':
          return 'bg-green-600 ring-green-200';
        case 'warning':
          return 'bg-amber-600 ring-amber-200';
        case 'error':
          return 'bg-red-600 ring-red-200';
        default:
          return 'bg-blue-600 ring-blue-200';
      }
    };

    return (
      <div
        ref={ref}
        className={`${orientation === 'horizontal' ? 'flex gap-8' : 'space-y-8'} ${className}`}
        {...props}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`relative ${orientation === 'horizontal' ? 'flex-1' : 'pl-8'}`}
          >
            {/* Connector Line */}
            {index < events.length - 1 && (
              <div
                className={`absolute ${
                  orientation === 'horizontal'
                    ? 'top-5 left-full w-full h-0.5'
                    : 'top-12 left-2.5 w-0.5 h-full'
                } bg-gray-200 dark:bg-gray-700`}
              />
            )}

            {/* Event Marker */}
            <div
              className={`absolute ${
                orientation === 'horizontal' ? 'top-4 left-4' : 'top-0 left-0'
              } w-5 h-5 rounded-full ring-4 ${getColorStyles(event.variant)}`}
            >
              {event.icon && (
                <div className="flex items-center justify-center w-full h-full text-white text-xs">
                  {event.icon}
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className={orientation === 'horizontal' ? 'mt-12' : ''}>
              <Text size="sm" color="muted" className="mb-1">
                {event.timestamp}
              </Text>
              <Text weight="semibold" className="mb-1">
                {event.title}
              </Text>
              {event.description && (
                <Text size="sm" color="muted">
                  {event.description}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

