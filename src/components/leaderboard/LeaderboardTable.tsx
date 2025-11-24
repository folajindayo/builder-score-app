"use client";

import { motion } from "framer-motion";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import type { LeaderboardUser } from "@/types/talent";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  onUserClick?: (user: LeaderboardUser) => void;
  loading?: boolean;
}

export function LeaderboardTable({
  users,
  onUserClick,
  loading = false,
}: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <motion.div
          key={user.wallet_address}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onUserClick?.(user)}
          className="flex cursor-pointer items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex-shrink-0 text-lg font-bold text-gray-500">
            #{index + 1}
          </div>

          <Avatar
            src={user.profile_picture_url}
            alt={user.display_name || user.wallet_address}
            size="md"
          />

          <div className="flex-1">
            <div className="font-semibold">
              {user.display_name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500">
              {user.wallet_address.slice(0, 6)}...
              {user.wallet_address.slice(-4)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">{user.score}</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>

          {user.total_earnings_usd && (
            <div className="text-right">
              <div className="font-semibold text-green-600">
                ${user.total_earnings_usd.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Earnings</div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

