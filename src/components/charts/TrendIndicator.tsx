"use client";

import React from "react";

interface TrendIndicatorProps {
  value: number;
  change: number;
  label?: string;
  format?: "number" | "percentage" | "currency";
}

/**
 * TrendIndicator Component
 * Displays value with trend indicator
 */
export default function TrendIndicator({
  value,
  change,
  label,
  format = "number",
}: TrendIndicatorProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const formatValue = (val: number) => {
    switch (format) {
      case "percentage":
        return `${val}%`;
      case "currency":
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (isNeutral) return "→";
    return isPositive ? "↑" : "↓";
  };

  const getTrendColor = () => {
    if (isNeutral) return "text-gray-600";
    return isPositive ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex items-center gap-2">
      <div>
        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        {label && <p className="text-sm text-gray-600">{label}</p>}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
        <span className="text-lg">{getTrendIcon()}</span>
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  );
}

