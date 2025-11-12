"use client";

interface StatusIndicatorProps {
  status: "online" | "offline" | "away" | "busy";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

const statusLabels = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Busy",
};

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
  className = "",
}: StatusIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`${sizeClasses[size]} ${statusColors[status]} rounded-full inline-block ${
          status === "online" ? "ring-2 ring-green-200" : ""
        }`}
        aria-label={statusLabels[status]}
      />
      {showLabel && (
        <span className="text-sm text-gray-600">{statusLabels[status]}</span>
      )}
    </div>
  );
}
