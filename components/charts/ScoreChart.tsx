"use client";

import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface ScoreChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
}

/**
 * ScoreChart Component
 * Simple bar chart for score visualization
 */
export default function ScoreChart({
  data,
  title,
  height = 200,
}: ScoreChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * 100;

          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t-lg bg-blue-600 transition-all duration-300 hover:bg-blue-700"
                  style={{ height: `${barHeight}%` }}
                  title={`${point.label}: ${point.value}`}
                />
              </div>
              <span className="text-xs text-gray-600">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

