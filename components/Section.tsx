'use client';

import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerClassName?: string;
}

export function Section({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
}: SectionProps) {
  return (
    <section className={className}>
      {(title || subtitle) && (
        <header className={`mb-6 ${headerClassName}`}>
          {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
