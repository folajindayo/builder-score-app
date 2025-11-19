"use client";

import React from "react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

interface ProfileHeaderProps {
  address: string;
  score: number;
  rank?: number;
  avatar?: string;
  username?: string;
  badges?: string[];
}

/**
 * Profile Header Component
 * Displays user profile information with avatar and stats
 */
export default function ProfileHeader({
  address,
  score,
  rank,
  avatar,
  username,
  badges = [],
}: ProfileHeaderProps) {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Avatar
        src={avatar}
        alt={username || address}
        size="xl"
        fallback={address[0].toUpperCase()}
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {username || truncatedAddress}
          </h2>
          {rank && (
            <Badge variant="primary" size="lg">
              Rank #{rank}
            </Badge>
          )}
        </div>
        
        <p className="mt-1 text-sm text-gray-500">{truncatedAddress}</p>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="text-3xl font-bold text-blue-600">{score}</div>
          <span className="text-sm text-gray-600">Builder Score</span>
        </div>
        
        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

