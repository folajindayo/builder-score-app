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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function Avatar({ src, alt, size = 'md', fallback, className = '', position }: AvatarProps) {
  // Generate alt text if not provided
  const altText = alt || generateProfileAltText(fallback, fallback, position);

  const displayFallback = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-600 font-medium ${className}`}
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
  );
}
