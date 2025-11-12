"use client";

import { ReactNode } from "react";

interface TabPanelProps {
  value: string | number;
  activeTab: string | number;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, activeTab, children, className = "" }: TabPanelProps) {
  if (value !== activeTab) return null;
  
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

