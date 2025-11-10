"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/builderscore-api";
import { getTokenPrice, type TokenInfo } from "@/lib/coingecko-api";
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
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setPage(1); // Reset to page 1 when searching
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Fetch token price based on sponsor slug
  useEffect(() => {
    if (filters.sponsor_slug) {
      getTokenPrice(filters.sponsor_slug)
        .then(({ price, tokenInfo }) => {
          setTokenPrice(price);
          setTokenInfo(tokenInfo);
        })
        .catch((err) => {
          console.error("Failed to fetch token price:", err);
          setTokenPrice(null);
          setTokenInfo(null);
        });
    } else {
      // Default to WCT if no sponsor selected
      getTokenPrice("walletconnect")
        .then(({ price, tokenInfo }) => {
          setTokenPrice(price);
          setTokenInfo(tokenInfo);
        })
        .catch((err) => {
          console.error("Failed to fetch token price:", err);
          setTokenPrice(null);
          setTokenInfo(null);
        });
    }
  }, [filters.sponsor_slug]);

  // Reset page when filters change (except page filter and search)
  useEffect(() => {
    if (filters.page !== undefined) {
      setPage(filters.page);
    } else {
      setPage(1);
    }
  }, [JSON.stringify({ sponsor_slug: filters.sponsor_slug, grant_id: filters.grant_id, per_page: filters.per_page })]);

  useEffect(() => {
    fetchLeaderboard({ 
      ...filters, 
      page,
      search: activeSearchQuery || undefined,
    });
  }, [page, activeSearchQuery, JSON.stringify({ sponsor_slug: filters.sponsor_slug, grant_id: filters.grant_id, per_page: filters.per_page })]);

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
            className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl border-2 border-red-200 shadow-sm">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
        <p className="text-gray-600 text-center text-lg">
          No leaderboard data available
        </p>
      </div>
    );
  }

  // Use server-side filtered results (no client-side filtering needed)
  const filteredUsers = data.users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Top Builders
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredUsers.length} of {data.pagination.total} builders
            {activeSearchQuery && (
              <span className="text-blue-600 font-medium"> • Searching for "{activeSearchQuery}"</span>
            )}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name, wallet, or bio..."
              className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              disabled={loading}
            />
            {searchQuery && !loading && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <span>Searching...</span>
              </>
            ) : (
              <>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </>
            )}
          </button>
        </div>
        {loading && activeSearchQuery && (
          <p className="mt-3 text-sm text-blue-600 font-medium">
            🔍 Searching through all builders...
          </p>
        )}
      </div>

      {filteredUsers.length === 0 && activeSearchQuery && !loading && (
        <div className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
          <p className="text-gray-600 text-center text-lg">
            No builders found matching "{activeSearchQuery}"
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 flex-1">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-bold text-lg shadow-md">
                  {user.leaderboard_position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-gray-900 truncate">
                      {user.profile.display_name || user.profile.name || "Anonymous"}
                    </h4>
                    {user.profile.human_checkmark && (
                      <span className="text-blue-500 text-xl" title="Verified">
                        ✓
                      </span>
                    )}
                  </div>
                  {user.profile.bio && (
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                      {user.profile.bio}
                    </p>
                  )}
                  {user.recipient_wallet && (
                    <p className="text-xs font-mono text-gray-500 mt-2">
                      {formatAddress(user.recipient_wallet)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 ml-4">
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user.profile.builder_score?.points !== undefined
                      ? formatNumber(user.profile.builder_score.points)
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Score</div>
                </div>
                {user.reward_amount > 0 && (
                  <div className="text-right">
                    {tokenPrice !== null && tokenInfo ? (
                      <>
                        <div className="text-xl font-bold text-green-600">
                          ${formatNumber(user.reward_amount * tokenPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(user.reward_amount)} {tokenInfo.symbol}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-green-600">
                          {formatNumber(user.reward_amount)} {tokenInfo?.symbol || "TOKEN"}
                        </div>
                        <div className="text-xs text-gray-400">
                          Loading USD...
                        </div>
                      </>
                    )}
                    <div className="text-xs text-gray-500 mt-1 font-medium">Earnings</div>
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

