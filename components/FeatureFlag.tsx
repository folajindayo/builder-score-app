"use client";

import { ReactNode } from "react";

interface FeatureFlagProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const ENABLED_FLAGS = new Set(process.env.NEXT_PUBLIC_FEATURE_FLAGS?.split(',') || []);

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  return ENABLED_FLAGS.has(flag) ? <>{children}</> : <>{fallback}</>;
}

