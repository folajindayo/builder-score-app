"use client";

import { RenderIf } from "@/components/RenderIf";
import { ReactNode } from "react";

interface HideProps {
  when: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Hide({
  when,
  children,
  fallback,
}: HideProps) {
  return (
    <RenderIf condition={!when}>
      {children}
    </RenderIf>
  );
}

