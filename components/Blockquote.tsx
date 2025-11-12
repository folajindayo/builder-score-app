"use client";

import { ReactNode } from "react";

interface BlockquoteProps {
  children: ReactNode;
  author?: string;
  cite?: string;
  className?: string;
}

export function Blockquote({
  children,
  author,
  cite,
  className = "",
}: BlockquoteProps) {
  return (
    <blockquote
      cite={cite}
      className={`border-l-4 border-gray-300 pl-4 py-2 italic text-gray-700 ${className}`}
    >
      <p>{children}</p>
      {author && (
        <footer className="mt-2 text-sm text-gray-600 not-italic">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

