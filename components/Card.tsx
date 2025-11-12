"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = false, onClick }: CardProps) {
  const baseClasses = "bg-white rounded-xl border-2 border-gray-200 shadow-sm";
  const hoverClasses = hover ? "hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const content = (
    <div className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}>
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={hover ? { scale: 1.02, y: -4 } : { scale: 1.01 }}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return hover ? (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }} 
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  ) : content;
}

