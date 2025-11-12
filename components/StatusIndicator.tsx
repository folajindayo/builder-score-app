"use client";

interface StatusIndicatorProps {
  status: "active" | "inactive" | "pending" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ status, label, size = "md" }: StatusIndicatorProps) {
  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    pending: "bg-yellow-500",
    error: "bg-red-500",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${statusColors[status]} rounded-full`}
        aria-label={`Status: ${status}`}
      />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}

