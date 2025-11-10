"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/builderscore-api";
import { getWCTPrice, convertWCTToUSD } from "@/lib/coingecko-api";
import type { LeaderboardResponse, LeaderboardFilters } from "@/types/talent";
import { formatAddress, formatNumber } from "@/lib/utils";

interface LeaderboardProps {
  filters?: LeaderboardFilters;
}

export function Leaderboard({ filters = {} }: LeaderboardProps) {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(filters.page || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [wctPrice, setWctPrice] = useState<number | null>(null);

  // Fetch WCT price on component mount
  useEffect(() => {
    getWCTPrice()
      .then(setWctPrice)
      .catch((err) => {
        console.error("Failed to fetch WCT price:", err);
        setWctPrice(0.1249); // Fallback price
      });
  }, []);

  // Reset page when filters change (except page filter)
  useEffect(() => {
    if (filters.page !== undefined) {
      setPage(filters.page);
    } else {
      setPage(1);
    }
  }, [JSON.stringify({ sponsor_slug: filters.sponsor_slug, grant_id: filters.grant_id, per_page: filters.per_page })]);

  useEffect(() => {
    fetchLeaderboard({ ...filters, page });
  }, [page, JSON.stringify(filters)]);

  const fetchLeaderboard = async (leaderboardFilters: LeaderboardFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLeaderboard(leaderboardFilters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leaderboard");
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data && newPage <= data.pagination.last_page) {
      setPage(newPage);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No leaderboard data available
        </p>
      </div>
    );
  }

  // Filter users by search query (client-side)
  const filteredUsers = searchQuery
    ? data.users.filter((user) => {
        const query = searchQuery.toLowerCase();
        const name = (user.profile.display_name || user.profile.name || "").toLowerCase();
        const wallet = (user.recipient_wallet || "").toLowerCase();
        const bio = (user.profile.bio || "").toLowerCase();
        return name.includes(query) || wallet.includes(query) || bio.includes(query);
      })
    : data.users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Builders
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredUsers.length} of {data.pagination.total} builders
            {searchQuery && ` (filtered by "${searchQuery}")`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, wallet, or bio..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredUsers.length === 0 && searchQuery && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No builders found matching "{searchQuery}"
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                  {user.leaderboard_position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {user.profile.display_name || user.profile.name || "Anonymous"}
                    </h4>
                    {user.profile.human_checkmark && (
                      <span className="text-blue-500" title="Verified">
                        ✓
                      </span>
                    )}
                  </div>
                  {user.profile.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {user.profile.bio}
                    </p>
                  )}
                  {user.recipient_wallet && (
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                      {formatAddress(user.recipient_wallet)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 ml-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(user.profile.builder_score.points)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                </div>
                {user.reward_amount > 0 && (
                  <div className="text-right">
                    {wctPrice !== null ? (
                      <>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${formatNumber(user.reward_amount * wctPrice)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNumber(user.reward_amount)} WCT
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatNumber(user.reward_amount)} WCT
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Loading USD...
                        </div>
                      </>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Earnings</div>
                    {user.reward_transaction_hash && (
                      <a
                        href={`https://etherscan.io/tx/${user.reward_transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View transaction"
                      >
                        View TX
                      </a>
                    )}
                  </div>
                )}
                {user.ranking_change !== 0 && (
                  <div
                    className={`text-sm font-medium ${
                      user.ranking_change > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {user.ranking_change > 0 ? "↑" : "↓"} {Math.abs(user.ranking_change)}
                  </div>
                )}
              </div>
            </div>
            {user.profile.tags && user.profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {user.profile.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {data.pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page {data.pagination.current_page} of {data.pagination.last_page}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data.pagination.last_page || loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

