"use client";

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className = "" }: DividerProps) {
  if (text) {
    return (
      <div className={`flex items-center my-4 ${className}`}>
        <div className="flex-1 border-t-2 border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">{text}</span>
        <div className="flex-1 border-t-2 border-gray-200"></div>
      </div>
    );
  }

  return <div className={`border-t-2 border-gray-200 my-4 ${className}`}></div>;
}

