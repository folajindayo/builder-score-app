'use client';

import { Image } from '@/components/Image';
import { generateProfileAltText } from '@/lib/alt-text-utils';

/**
 * Avatar component for displaying user profile pictures.
 * Automatically generates meaningful alt text when not provided.
 *
 * @example
 * <Avatar src="/avatar.jpg" alt="John Doe" size="lg" />
 * <Avatar alt="Jane Smith" fallback="JS" size="md" />
 */
interface AvatarProps {
  src?: string;
  /**
   * Alt text for the avatar. If not provided, will be generated from fallback or name.
   * For better accessibility, always provide a meaningful alt text.
   */
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Fallback text to display when image is not available.
   * Also used to generate alt text if alt prop is not provided.
   */
  fallback?: string;
  className?: string;
  /**
   * Optional context for generating better alt text (e.g., leaderboard position).
   */
  position?: number;
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Show status indicator */
  showStatus?: boolean;
  /** Border color */
  bordered?: boolean;
  /** Avatar shape */
  shape?: 'circle' | 'square';
  /** Click handler */
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
};

export function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  position,
  status,
  showStatus = false,
  bordered = false,
  shape = 'circle',
  onClick,
}: AvatarProps) {
  // Generate alt text if not provided
  const altText = alt || generateProfileAltText(fallback, fallback, position);

  const displayFallback = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

  return (
    <div
      className={`relative inline-flex ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={`${sizeClasses[size]} ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} overflow-hidden flex items-center justify-center bg-gray-200 text-gray-600 font-medium ${
          bordered ? 'ring-2 ring-white ring-offset-2' : ''
        } ${onClick ? 'hover:opacity-80 transition-opacity' : ''} ${className}`}
        role="img"
        aria-label={altText}
      >
        {src ? (
          <Image
            src={src}
            alt={altText}
            width={sizePixels[size]}
            height={sizePixels[size]}
            objectFit="cover"
            className="w-full h-full"
          />
        ) : (
          <span aria-hidden="true">{displayFallback}</span>
        )}
      </div>
      {showStatus && status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} ${
            shape === 'circle' ? 'rounded-full' : 'rounded-sm'
          } ring-2 ring-white`}
          aria-label={`Status: ${status}`}
          role="status"
        />
      )}
    </div>
  );
}
