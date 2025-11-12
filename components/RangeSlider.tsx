"use client";

import { useState, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValues?: boolean;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
  label,
  showValues = false,
  className = "",
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleMinChange = useCallback((newMin: number) => {
    const newValue: [number, number] = [Math.min(newMin, localValue[1]), localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  }, [localValue, onChange]);

  const handleMaxChange = useCallback((newMax: number) => {
    const newValue: [number, number] = [localValue[0], Math.max(newMax, localValue[0])];
    setLocalValue(newValue);
    onChange(newValue);
  }, [localValue, onChange]);

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValues && (
            <span className="text-sm text-gray-600">
              {localValue[0]} - {localValue[1]}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          value={localValue[0]}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider"
        />
        <input
          type="range"
          value={localValue[1]}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider"
        />
        <div className="relative h-2 bg-gray-200 rounded-lg">
          <div
            className="absolute h-2 bg-blue-600 rounded-lg"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / (max - min)) * 100}%`,
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          pointer-events: all;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          pointer-events: all;
        }
      `}</style>
    </div>
  );
}

