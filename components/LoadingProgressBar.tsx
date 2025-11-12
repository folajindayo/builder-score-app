"use client";

import { motion } from "framer-motion";

interface LoadingProgressBarProps {
  isLoading: boolean;
}

export function LoadingProgressBar({ isLoading }: LoadingProgressBarProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" role="progressbar" aria-label="Loading" aria-live="polite">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
        aria-hidden="true"
      />
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

