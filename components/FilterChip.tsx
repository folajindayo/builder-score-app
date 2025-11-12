"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  icon?: ReactNode;
  variant?: "default" | "active" | "highlight";
  className?: string;
}

export function FilterChip({
  label,
  onRemove,
  icon,
  variant = "default",
  className = "",
}: FilterChipProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200",
    active: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    highlight: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

