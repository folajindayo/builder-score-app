"use client";

import { ReactNode } from "react";
import NextLink from "next/link";

interface LinkProps {
  children: ReactNode;
  href: string;
  external?: boolean;
  variant?: "default" | "primary" | "secondary" | "muted";
  className?: string;
  underline?: boolean;
}

const variantClasses = {
  default: "text-gray-900 hover:text-gray-700",
  primary: "text-blue-600 hover:text-blue-700",
  secondary: "text-gray-600 hover:text-gray-800",
  muted: "text-gray-500 hover:text-gray-700",
};

export function Link({
  children,
  href,
  external = false,
  variant = "default",
  className = "",
  underline = true,
}: LinkProps) {
  const baseClasses = `${variantClasses[variant]} ${underline ? "underline" : ""} transition-colors ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={baseClasses}>
      {children}
    </NextLink>
  );
}

