'use client';

import { ReactNode } from 'react';

interface CodeProps {
  children: ReactNode;
  variant?: 'inline' | 'block';
  language?: string;
  className?: string;
}

export function Code({ children, variant = 'inline', language, className = '' }: CodeProps) {
  if (variant === 'block') {
    return (
      <pre className={`bg-gray-100 rounded-lg p-4 overflow-x-auto ${className}`}>
        <code className={`text-sm ${language ? `language-${language}` : ''}`}>{children}</code>
      </pre>
    );
  }

  return (
    <code
      className={`bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono ${className}`}
    >
      {children}
    </code>
  );
}
