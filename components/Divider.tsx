"use client";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacingClasses = {
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

export function Divider({
  orientation = "horizontal",
  spacing = "md",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={`inline-block w-px h-full bg-gray-200 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <hr
      className={`border-0 border-t border-gray-200 ${spacingClasses[spacing]} ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
