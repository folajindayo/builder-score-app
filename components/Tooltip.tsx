"use client";

import { useState, useEffect, useRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  maxWidth?: string;
  className?: string;
}

export function Tooltip({ children, content, position = "top", delay = 300, maxWidth = "200px", className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg ${positionClasses[position]} ${className}`}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-r-transparent border-b-transparent border-l-transparent"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-r-transparent border-t-transparent border-l-transparent"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-r-transparent border-b-transparent"
                : "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-l-transparent border-b-transparent"
            }`}
          />
        </div>
      )}
    </div>
  );
}

