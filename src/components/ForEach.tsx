'use client';

import { ReactNode } from 'react';

interface ForEachProps<T> {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  fallback?: ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

export function ForEach<T>({ items, render, fallback = null, keyExtractor }: ForEachProps<T>) {
  if (items.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <>
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return <div key={key}>{render(item, index)}</div>;
      })}
    </>
  );
}
