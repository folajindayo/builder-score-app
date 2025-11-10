"use client";

import { useEffect, useState, useMemo } from "react";
import { getLeaderboard } from "@/lib/builderscore-api";
import { getTokenPrice, type TokenInfo } from "@/lib/coingecko-api";
import type { LeaderboardResponse, LeaderboardFilters } from "@/types/talent";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  categorizeBuilders,
  calculateMCAP,
  getCategoryLabel,
  getMostEarnings,
  getTrendingBuilder,
  getHighestScore,
  getFeaturedBuilder,
  getSoughtAfterBuilder,
  type BuilderCategory,
} from "@/lib/builder-analytics";
import { TrophyIcon } from "@/components/TrophyIcon";
import { BuilderProfileModal } from "@/components/BuilderProfileModal";
import type { LeaderboardUser } from "@/types/talent";

/**
 * Get the reason/explanation for why a builder was categorized
 */
function getCategoryReason(user: LeaderboardUser, category: Exclude<BuilderCategory, null>, tokenPrice: number): string {
  const rewardAmount = typeof user.reward_amount === 'string' 
    ? parseFloat(user.reward_amount) 
    : user.reward_amount;
  const score = user.profile.builder_score?.points || 0;
  const earningsUSD = rewardAmount * tokenPrice;
  
  switch (category) {
    case "most_earnings":
      return `Highest earnings: ${formatNumber(rewardAmount)} tokens ($${formatNumber(earningsUSD)})`;
    
    case "trending":
      const changeText = user.ranking_change > 0 
        ? `↑${user.ranking_change} positions` 
        : user.ranking_change < 0 
        ? `↓${Math.abs(user.ranking_change)} positions`
        : "stable";
      return `Ranking change: ${changeText} | Position: #${user.leaderboard_position} | Score: ${formatNumber(score)}`;
    
    case "highest_score":
      return `Builder score: ${formatNumber(score)} points (highest among all builders)`;
    
    case "featured":
      const mcap = calculateMCAP(user, tokenPrice);
      const verificationBonus = (user.profile.human_checkmark ? 150 : 0) + (user.profile.verified_nationality ? 75 : 0);
      return `MCAP: $${formatNumber(mcap)} | Verified: ${verificationBonus > 0 ? 'Yes' : 'No'} | Top ${user.leaderboard_position <= 10 ? '10' : user.leaderboard_position <= 50 ? '50' : '100+'} position`;
    
    case "sought_after":
      const completenessScore = 
        (user.profile.human_checkmark ? 150 : 0) +
        (user.profile.verified_nationality ? 75 : 0) +
        (user.profile.bio ? 40 : 0) +
        (user.profile.location ? 30 : 0) +
        (user.profile.tags?.length || 0) * 15 +
        score * 0.8 +
        (user.profile.image_url ? 20 : 0);
      const factors = [];
      if (user.profile.human_checkmark) factors.push("Verified");
      if (user.profile.verified_nationality) factors.push("Nationality verified");
      if (user.profile.bio) factors.push("Bio");
      if (user.profile.location) factors.push("Location");
      if (user.profile.tags?.length) factors.push(`${user.profile.tags.length} tags`);
      if (user.profile.image_url) factors.push("Profile image");
      return `Completeness score: ${Math.round(completenessScore)} | Factors: ${factors.join(", ") || "None"} | Score: ${formatNumber(score)}`;
    
    default:
      return "";
  }
}

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

  const filteredUsers = data?.users || [];
  
  // Categorize builders and calculate MCAP (must be before early returns)
  const categories = useMemo(() => {
    if (!filteredUsers.length || !tokenPrice) return new Map<number, BuilderCategory>();
    return categorizeBuilders(filteredUsers, tokenPrice);
  }, [filteredUsers, tokenPrice]);

  // Get top builders for each category in specified order
  const topBuildersByCategory = useMemo(() => {
    if (!filteredUsers.length || !tokenPrice) return [];
    
    const soughtAfter = getSoughtAfterBuilder(filteredUsers);
    const trending = getTrendingBuilder(filteredUsers);
    const highestScore = getHighestScore(filteredUsers);
    const featured = getFeaturedBuilder(filteredUsers, tokenPrice);
    const mostEarnings = getMostEarnings(filteredUsers);
    
    // Return in specified order: sought after, trending, highest score, featured, most earnings
    return [
      { category: "sought_after" as BuilderCategory, builder: soughtAfter },
      { category: "trending" as BuilderCategory, builder: trending },
      { category: "highest_score" as BuilderCategory, builder: highestScore },
      { category: "featured" as BuilderCategory, builder: featured },
      { category: "most_earnings" as BuilderCategory, builder: mostEarnings },
    ].filter(item => item.builder !== null);
  }, [filteredUsers, tokenPrice]);


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
        <div className="flex items-center justify-between mt-4">
          {activeSearchQuery && (
            <p className="text-xs text-gray-500">
              Showing {filteredUsers.length} of {data.pagination.total} builders
              {activeSearchQuery && ` • Searching for "${activeSearchQuery}"`}
            </p>
          )}
          {!activeSearchQuery && (
            <div className="flex items-center gap-4 text-xs flex-wrap">
              {Array.from(categories.entries()).map(([userId, category]) => {
                const user = filteredUsers.find(u => u.id === userId);
                if (!user) return null;
                return (
                  <div key={userId} className="flex items-center gap-1.5">
                    <TrophyIcon category={category} className="w-4 h-4" />
                    <span className="text-gray-600">
                      {getCategoryLabel(category)}: <span className="font-medium">{user.profile.display_name || user.profile.name}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Builders by Category Table */}
      {!activeSearchQuery && topBuildersByCategory.length > 0 && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 flex flex-col max-h-[400px]">
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Top Builders by Category
            </h3>
            <p className="text-xs text-gray-500">
              Leading builders across different categories
            </p>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Builder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MCAP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topBuildersByCategory.map((item, idx) => {
                  const user = item.builder!;
                  const category = item.category!; // We filtered out null categories
                  const rewardAmount = typeof user.reward_amount === 'string' 
                    ? parseFloat(user.reward_amount) 
                    : user.reward_amount;
                  const mcap = tokenPrice ? calculateMCAP(user, tokenPrice) : 0;
                  
                  const categoryColors: Record<Exclude<BuilderCategory, null>, string> = {
                    sought_after: "bg-green-100 text-green-800 border-green-200",
                    trending: "bg-orange-100 text-orange-800 border-orange-200",
                    highest_score: "bg-blue-100 text-blue-800 border-blue-200",
                    featured: "bg-purple-100 text-purple-800 border-purple-200",
                    most_earnings: "bg-yellow-100 text-yellow-800 border-yellow-200",
                  };

                  return (
                    <motion.tr
                      key={`${category}-${user.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[category]}`}>
                          <TrophyIcon category={category} className="w-4 h-4" />
                          {getCategoryLabel(category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.profile.display_name || user.profile.name || "Anonymous"}
                            </div>
                            {user.profile.bio && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {user.profile.bio}
                              </div>
                            )}
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
                        {rewardAmount > 0 && tokenPrice && tokenInfo ? (
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              ${formatNumber(rewardAmount * tokenPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatNumber(rewardAmount)} {tokenInfo.symbol}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${formatNumber(mcap)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{user.leaderboard_position}
                        </div>
                        {user.ranking_change !== 0 && (
                          <div className={`text-xs ${user.ranking_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {user.ranking_change > 0 ? '↑' : '↓'} {Math.abs(user.ranking_change)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {tokenPrice ? (
                          <div 
                            className="text-xs text-gray-600 max-w-xs"
                            title={getCategoryReason(user, category, tokenPrice)}
                          >
                            <div className="truncate" title={getCategoryReason(user, category, tokenPrice)}>
                              {getCategoryReason(user, category, tokenPrice)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Loading...</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-lg border border-gray-200 flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>MCAP</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.users.map((user, idx) => {
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
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
