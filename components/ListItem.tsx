"use client";

import { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export function ListItem({
  children,
  className = "",
}: ListItemProps) {
  return (
    <li className={className}>
      {children}
    </li>
  );
}

