"use client";

import React from "react";

interface LeaderboardHeaderProps {
  totalUsers: number;
  lastUpdated?: string;
  title?: string;
}

/**
 * LeaderboardHeader Component
 * Header section for leaderboard with metadata
 */
export default function LeaderboardHeader({
  totalUsers,
  lastUpdated,
  title = "Builder Score Leaderboard",
}: LeaderboardHeaderProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{totalUsers.toLocaleString()} Builders</span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Updated {lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}

