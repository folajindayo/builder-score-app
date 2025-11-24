'use client';

import { RenderIf } from '@/components/RenderIf';
import { ReactNode } from 'react';

interface ShowProps {
  when: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Show({ when, children, fallback }: ShowProps) {
  return <RenderIf condition={when}>{children}</RenderIf>;
}
