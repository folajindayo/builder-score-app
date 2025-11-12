"use client";

import { Divider } from "@/components/Divider";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  spacing = "md",
  className = "",
}: SeparatorProps) {
  return (
    <Divider
      orientation={orientation}
      spacing={spacing}
      className={className}
    />
  );
}

