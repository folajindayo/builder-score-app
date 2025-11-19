"use client";

import React from "react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

interface LeaderboardRowProps {
  rank: number;
  address: string;
  score: number;
  change?: number;
  avatar?: string;
  username?: string;
  verified?: boolean;
  onClick?: () => void;
}

/**
 * LeaderboardRow Component
 * Individual row in leaderboard table
 */
export default function LeaderboardRow({
  rank,
  address,
  score,
  change,
  avatar,
  username,
  verified = false,
  onClick,
}: LeaderboardRowProps) {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return null;
    if (change > 0) return <span className="text-green-600">↑ {change}</span>;
    if (change < 0)
      return <span className="text-red-600">↓ {Math.abs(change)}</span>;
    return <span className="text-gray-600">→</span>;
  };

  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-gray-50 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {rank}
          </span>
          {getRankBadge(rank) && (
            <span className="text-xl">{getRankBadge(rank)}</span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} alt={username || address} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">
                {username || truncatedAddress}
              </p>
              {verified && (
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {username && (
              <p className="text-sm text-gray-500">{truncatedAddress}</p>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-lg font-semibold text-gray-900">
          {score.toLocaleString()}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm font-medium">{getTrendIcon(change)}</div>
      </td>
    </tr>
  );
}

