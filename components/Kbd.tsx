"use client";

import { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({
  children,
  className = "",
}: KbdProps) {
  return (
    <kbd
      className={`px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm ${className}`}
    >
      {children}
    </kbd>
  );
}

