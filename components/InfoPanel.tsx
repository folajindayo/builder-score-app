"use client";

import { ReactNode } from "react";

interface InfoPanelProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  className?: string;
}

export function InfoPanel({ title, icon, children, variant = "default", className = "" }: InfoPanelProps) {
  const variants = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    error: "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div className={`border rounded-lg p-4 ${variants[variant]} ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2">
          {icon}
          {title && <h3 className="font-semibold">{title}</h3>}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

