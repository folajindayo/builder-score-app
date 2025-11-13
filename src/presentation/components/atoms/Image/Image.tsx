/**
 * Image Atom Component
 */

import { ImgHTMLAttributes, forwardRef, useState } from 'react';
import { ComponentProps } from '@presentation/types';

export interface ImageProps
  extends ComponentProps,
    Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'> {
  fallbackSrc?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc,
      fit = 'cover',
      loading = 'lazy',
      className = '',
      ...props
    },
    ref
  ) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const fitStyles = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    };

    const handleError = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    if (hasError) {
      return (
        <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Failed to load image
          </span>
        </div>
      );
    }

    return (
      <>
        {isLoading && (
          <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
        )}
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          loading={loading}
          className={`${fitStyles[fit]} ${isLoading ? 'hidden' : ''} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      </>
    );
  }
);

Image.displayName = 'Image';

