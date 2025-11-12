"use client";

import { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({
  children,
  className = "",
}: TableRowProps) {
  return (
    <tr className={`border-b border-gray-200 ${className}`}>
      {children}
    </tr>
  );
}

