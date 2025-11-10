"use client";

import { useEffect, useState, useMemo } from "react";
import { getLeaderboard } from "@/lib/builderscore-api";
import { getTokenPrice, type TokenInfo } from "@/lib/coingecko-api";
import type { LeaderboardResponse, LeaderboardFilters } from "@/types/talent";
import { formatAddress, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  categorizeBuilders,
  calculateMCAP,
  getCategoryLabel,
  type BuilderCategory,
} from "@/lib/builder-analytics";
import { TrophyIcon } from "@/components/TrophyIcon";
import { BuilderProfileModal } from "@/components/BuilderProfileModal";
import type { LeaderboardUser } from "@/types/talent";

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
  const [selectedBuilder, setSelectedBuilder] = useState<LeaderboardUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setPage(1);
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 rounded mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <p className="text-gray-500 text-center text-sm">
          No leaderboard data available
        </p>
      </div>
    );
  }

  const filteredUsers = data.users;

  // Categorize builders and calculate MCAP
  const categories = useMemo(() => {
    if (!filteredUsers.length || !tokenPrice) return new Map<number, BuilderCategory>();
    return categorizeBuilders(filteredUsers, tokenPrice);
  }, [filteredUsers, tokenPrice]);

  const handleViewProfile = (user: LeaderboardUser) => {
    setSelectedBuilder(user);
    setShowProfileModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Members
            </h3>
            <p className="text-xs text-gray-500">
              Display all the team members and essential details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            )}
          </div>
        </div>
        {activeSearchQuery && (
          <p className="text-xs text-gray-500">
            Showing {filteredUsers.length} of {data.pagination.total} builders
            {activeSearchQuery && ` • Searching for "${activeSearchQuery}"`}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>Member Name</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Score</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Earnings</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span>Rank Change</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, idx) => {
              const rewardAmount = typeof user.reward_amount === 'string' 
                ? parseFloat(user.reward_amount) 
                : user.reward_amount;
              
              const category = categories.get(user.id) || null;
              const mcap = tokenPrice ? calculateMCAP(user, tokenPrice) : 0;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <div className="flex items-center gap-3">
                        {user.profile.image_url ? (
                          <img
                            src={user.profile.image_url}
                            alt={user.profile.display_name || user.profile.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
                              {user.leaderboard_position}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.profile.display_name || user.profile.name || "Anonymous"}
                            </p>
                            {category && (
                              <div className="flex items-center gap-1" title={getCategoryLabel(category)}>
                                <TrophyIcon category={category} />
                              </div>
                            )}
                            {user.profile.human_checkmark && (
                              <span className="text-blue-500 text-xs" title="Verified">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {user.profile.bio || user.profile.location || "No description"}
                          </p>
                          {user.profile.location && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {user.profile.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.profile.builder_score?.points !== undefined
                        ? formatNumber(user.profile.builder_score.points)
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rewardAmount > 0 ? (
                      <div>
                        {tokenPrice !== null && tokenInfo ? (
                          <>
                            <div className="text-sm font-semibold text-gray-900">
                              ${formatNumber(rewardAmount * tokenPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatNumber(rewardAmount)} {tokenInfo.symbol}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm font-semibold text-gray-900">
                            {formatNumber(rewardAmount)} {tokenInfo?.symbol || "TOKEN"}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.ranking_change !== 0 ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.ranking_change > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.ranking_change > 0 ? "↑" : "↓"} {Math.abs(user.ranking_change)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${formatNumber(mcap)}
                    </div>
                    {category && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getCategoryLabel(category)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewProfile(user)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.pagination.last_page > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data.pagination.current_page} of {data.pagination.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, data.pagination.last_page) }, (_, i) => {
              let pageNum;
              if (data.pagination.last_page <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= data.pagination.last_page - 2) {
                pageNum = data.pagination.last_page - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                    pageNum === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {data.pagination.last_page > 5 && page < data.pagination.last_page - 2 && (
              <span className="px-2 text-sm text-gray-500">...</span>
            )}
            {data.pagination.last_page > 5 && (
              <button
                onClick={() => handlePageChange(data.pagination.last_page)}
                disabled={loading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {data.pagination.last_page}
              </button>
            )}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.pagination.last_page || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(data.pagination.last_page)}
              disabled={page === data.pagination.last_page || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              »»
            </button>
          </div>
        </div>
      )}
      </div>

      {selectedBuilder && (
        <BuilderProfileModal
          builder={selectedBuilder}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedBuilder(null);
          }}
        />
      )}
    </>
  );
}
