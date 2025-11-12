"use client";

import { Image } from "@/components/Image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className = "",
}: AvatarProps) {
  const displayFallback = fallback || alt.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-600 font-medium ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={sizePixels[size]}
          height={sizePixels[size]}
          objectFit="cover"
          className="w-full h-full"
        />
      ) : (
        <span>{displayFallback}</span>
      )}
    </div>
  );
}
