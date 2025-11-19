"use client";

import React from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

/**
 * Avatar Component
 * Displays user avatar with fallback support
 */
export function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const [imageError, setImageError] = React.useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white ${sizeClasses[size]} ${className}`}
      >
        {fallback || alt[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`inline-block rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}

