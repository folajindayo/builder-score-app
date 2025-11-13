/**
 * Avatar Atom Component
 */

import { ImgHTMLAttributes, forwardRef, useState } from 'react';
import { ComponentProps } from '@presentation/types';

export interface AvatarProps
  extends ComponentProps,
    Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  name?: string;
  showBorder?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      showBorder = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizeStyles = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };

    const borderStyle = showBorder ? 'ring-2 ring-white dark:ring-gray-800' : '';
    const baseStyles = `inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ${borderStyle}`;

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${className}`;

    if (!src || imageError) {
      return (
        <div ref={ref} className={classes}>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {name ? getInitials(name) : '?'}
          </span>
        </div>
      );
    }

    return (
      <div ref={ref} className={classes}>
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          {...props}
        />
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

