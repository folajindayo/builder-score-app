'use client';

import { ConditionalRender } from '@/components/ConditionalRender';
import { ReactNode } from 'react';

interface RenderIfProps {
  condition: boolean;
  children: ReactNode;
}

export function RenderIf({ condition, children }: RenderIfProps) {
  return <ConditionalRender condition={condition}>{children}</ConditionalRender>;
}
