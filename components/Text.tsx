"use client";

import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "secondary" | "error" | "success";
  align?: "left" | "center" | "right";
  className?: string;
  as?: "p" | "span" | "div";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorClasses = {
  default: "text-gray-900",
  muted: "text-gray-600",
  primary: "text-blue-600",
  secondary: "text-gray-500",
  error: "text-red-600",
  success: "text-green-600",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Text({
  children,
  size = "base",
  weight = "normal",
  color = "default",
  align = "left",
  className = "",
  as: Component = "p",
}: TextProps) {
  return (
    <Component
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${alignClasses[align]} ${className}`}
    >
      {children}
    </Component>
  );
}

