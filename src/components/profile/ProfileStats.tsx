"use client";

import React from "react";

interface StatItem {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

interface ProfileStatsProps {
  stats: StatItem[];
}

/**
 * Profile Stats Component
 * Displays key metrics in a grid layout
 */
export default function ProfileStats({ stats }: ProfileStatsProps) {
  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            {stat.trend && stat.trendValue && (
              <span className={`text-sm ${getTrendColor(stat.trend)}`}>
                {getTrendIcon(stat.trend)} {stat.trendValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

