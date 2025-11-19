"use client";

import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

/**
 * Card Component
 * Flexible container with optional header and footer
 */
export default function Card({
  children,
  title,
  subtitle,
  footer,
  hover = false,
  padding = "md",
  className = "",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClass = hover
    ? "transition-shadow duration-200 hover:shadow-lg"
    : "";

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${hoverClass} ${className}`}
    >
      {(title || subtitle) && (
        <div
          className={`border-b border-gray-200 ${paddingClasses[padding]}`}
        >
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div
          className={`border-t border-gray-200 ${paddingClasses[padding]}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

