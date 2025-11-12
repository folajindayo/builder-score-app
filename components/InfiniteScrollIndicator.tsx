"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/Spinner";

interface InfiniteScrollIndicatorProps {
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
}

export function InfiniteScrollIndicator({
  isLoading,
  hasMore,
  className = "",
}: InfiniteScrollIndicatorProps) {
  if (!hasMore && !isLoading) {
    return (
      <div className={`text-center py-4 text-gray-500 text-sm ${className}`}>
        No more items to load
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`flex items-center justify-center py-4 gap-2 ${className}`}
        >
          <Spinner size="sm" variant="primary" />
          <span className="text-sm text-gray-600">Loading more...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

