"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ClickOutsideProps {
  children: ReactNode;
  onClickOutside: () => void;
  className?: string;
}

export function ClickOutside({
  children,
  onClickOutside,
  className = "",
}: ClickOutsideProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

