'use client';

import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { validateAltText } from '@/lib/alt-text-utils';

/**
 * Image component with enhanced accessibility support.
 *
 * @example
 * // Informative image
 * <Image src="/photo.jpg" alt="A beautiful sunset over the ocean" width={800} height={600} />
 *
 * @example
 * // Decorative image
 * <Image src="/pattern.jpg" alt="" decorative width={100} height={100} />
 */
interface ImageProps {
  src: string;
  /**
   * Alt text for the image. Required for informative images.
   * Use empty string "" for decorative images.
   */
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  /**
   * Whether the image is decorative (purely visual, no meaning).
   * When true, alt should be empty and aria-hidden will be set.
   */
  decorative?: boolean;
  /**
   * Whether to validate alt text in development mode.
   * @default true
   */
  validateAlt?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  decorative = false,
  validateAlt: shouldValidate = true,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Validate alt text in development
  useEffect(() => {
    if (shouldValidate && process.env.NODE_ENV === 'development') {
      const validation = validateAltText(alt, decorative);
      if (!validation.isValid) {
        console.warn(`[Image] Alt text validation failed for image "${src}":`, validation.warning);
        if (validation.suggestion) {
          console.info(`[Image] Suggestion: ${validation.suggestion}`);
        }
      } else if (validation.suggestion) {
        console.info(`[Image] Alt text suggestion for image "${src}":`, validation.suggestion);
      }
    }
  }, [alt, decorative, src, shouldValidate]);

  // Determine if image should be hidden from screen readers
  const isHidden = decorative || alt === '';

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt || 'Failed to load image'}
      >
        <span className="text-gray-400 text-sm" aria-hidden="true">
          Failed to load image
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NextImage
        src={src}
        alt={decorative ? '' : alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit }}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        aria-hidden={isHidden ? true : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
}
