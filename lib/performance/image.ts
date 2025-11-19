/**
 * Image optimization utilities
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(src: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

export interface OptimizedImageParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
}

export function getOptimizedImageUrl(
  src: string,
  params: OptimizedImageParams
): string {
  const url = new URL(src, window.location.origin);
  
  if (params.width) {
    url.searchParams.set("w", params.width.toString());
  }
  
  if (params.height) {
    url.searchParams.set("h", params.height.toString());
  }
  
  if (params.quality) {
    url.searchParams.set("q", params.quality.toString());
  }
  
  if (params.format) {
    url.searchParams.set("fm", params.format);
  }

  return url.toString();
}

export function generateSrcSet(
  src: string,
  widths: number[],
  format?: "webp" | "avif" | "jpeg" | "png"
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(src, { width, format });
      return `${url} ${width}w`;
    })
    .join(", ");
}

export function lazyLoadImage(img: HTMLImageElement): void {
  if ("loading" in img) {
    img.loading = "lazy";
  } else {
    // Fallback for browsers that don't support loading="lazy"
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          if (target.dataset.src) {
            target.src = target.dataset.src;
            target.removeAttribute("data-src");
          }
          observer.unobserve(target);
        }
      });
    });

    observer.observe(img);
  }
}

