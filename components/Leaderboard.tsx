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

// All sponsor slugs
const ALL_SPONSOR_SLUGS = ["walletconnect", "celo", "base", "base-summer", "syndicate", "talent-protocol"];

// Extended user type with earnings breakdown
interface UserWithEarningsBreakdown extends LeaderboardUser {
  earningsBreakdown?: Array<{
    sponsor: string;
    amount: number;
    amountUSD: number;
    tokenSymbol: string;
  }>;
  totalEarningsUSD?: number;
  sponsors?: string[]; // List of sponsors this builder appears in
}

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
  const [expandedEarnings, setExpandedEarnings] = useState<Set<number>>(new Set());

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
    // For "all sponsors", we don't need a single token price
    // Earnings are already calculated in USD in fetchAllSponsors
    if (filters.sponsor_slug && filters.sponsor_slug !== "all") {
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
    } else if (!filters.sponsor_slug) {
      // Default to walletconnect if no sponsor selected
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
    } else {
      // "all sponsors" - no single token price needed
      setTokenPrice(null);
      setTokenInfo(null);
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
      // Check if "all sponsors" is selected (no sponsor_slug)
      if (!leaderboardFilters.sponsor_slug) {
        // Fetch from all sponsors and combine
        const allSponsorsData = await fetchAllSponsors(leaderboardFilters);
        setData(allSponsorsData);
      } else {
        // Single sponsor fetch
        const response = await getLeaderboard(leaderboardFilters);
        setData(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leaderboard");
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSponsors = async (filters: LeaderboardFilters): Promise<LeaderboardResponse> => {
    // Fetch token prices for all sponsors
    const tokenPrices = await Promise.all(
      ALL_SPONSOR_SLUGS.map(async (slug) => {
        const { price, tokenInfo } = await getTokenPrice(slug);
        return { slug, price, tokenInfo };
      })
    );

    const priceMap = new Map(
      tokenPrices.map(({ slug, price }) => [slug, price])
    );
    const tokenInfoMap = new Map(
      tokenPrices.map(({ slug, tokenInfo }) => [slug, tokenInfo])
    );

    // Fetch data from all sponsors
    const allResponses = await Promise.allSettled(
      ALL_SPONSOR_SLUGS.map((slug) =>
        getLeaderboard({
          ...filters,
          sponsor_slug: slug,
          grant_id: undefined, // All time only
        })
      )
    );

    // Combine all users by builder ID
    const userMap = new Map<number, UserWithEarningsBreakdown>();
    const earningsBreakdownMap = new Map<number, Array<{
      sponsor: string;
      amount: number;
      amountUSD: number;
      tokenSymbol: string;
    }>>();
    const sponsorsMap = new Map<number, Set<string>>(); // Track which sponsors each builder appears in

    // Step 1: Gather all data from each sponsor slug
    allResponses.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const sponsor = ALL_SPONSOR_SLUGS[index];
        const tokenPrice = priceMap.get(sponsor) || 0;
        const tokenInfo = tokenInfoMap.get(sponsor);

        result.value.users.forEach((user) => {
          const rewardAmount = typeof user.reward_amount === 'string' 
            ? parseFloat(user.reward_amount) 
            : user.reward_amount;
          
          // Convert token amount to USD immediately
          const earningsUSD = rewardAmount * tokenPrice;

          if (!userMap.has(user.id)) {
            // First time seeing this builder - initialize
            userMap.set(user.id, {
              ...user,
              earningsBreakdown: [],
              totalEarningsUSD: 0,
              sponsors: [],
            });
            earningsBreakdownMap.set(user.id, []);
            sponsorsMap.set(user.id, new Set());
          }

          const existingUser = userMap.get(user.id)!;
          const breakdown = earningsBreakdownMap.get(user.id)!;
          const sponsorsSet = sponsorsMap.get(user.id)!;

          // Track that this builder appears in this sponsor
          sponsorsSet.add(sponsor);

          // Add earnings from this sponsor (converted to USD)
          // Include ALL earnings from ALL sponsors, even if 0
          if (tokenInfo) {
            breakdown.push({
              sponsor,
              amount: rewardAmount,
              amountUSD: earningsUSD, // Already in USD
              tokenSymbol: tokenInfo.symbol,
            });

            // Accumulate total earnings in USD from ALL sponsors
            // This sums the entire amount made from all sponsors
            existingUser.totalEarningsUSD = (existingUser.totalEarningsUSD || 0) + earningsUSD;
          }

          // Update other fields (take the best/highest values)
          if ((user.profile.builder_score?.points || 0) > (existingUser.profile.builder_score?.points || 0)) {
            existingUser.profile.builder_score = user.profile.builder_score;
          }
          if (user.leaderboard_position < existingUser.leaderboard_position) {
            existingUser.leaderboard_position = user.leaderboard_position;
          }
        });
      }
    });

    // Step 2: After gathering all data, update reward_amount to total USD for display
    userMap.forEach((user) => {
      user.reward_amount = user.totalEarningsUSD || 0;
    });

    // Attach earnings breakdown and sponsors list to users
    userMap.forEach((user, id) => {
      user.earningsBreakdown = earningsBreakdownMap.get(id) || [];
      user.sponsors = Array.from(sponsorsMap.get(id) || []);
    });

    // Convert to array and sort:
    // 1. First by number of sponsors (builders in multiple sponsors prioritized)
    // 2. Then by total earnings USD (descending)
    const combinedUsers = Array.from(userMap.values()).sort((a, b) => {
      const aSponsorCount = (a.sponsors || []).length;
      const bSponsorCount = (b.sponsors || []).length;
      const aTotal = a.totalEarningsUSD || 0;
      const bTotal = b.totalEarningsUSD || 0;
      
      // First, prioritize builders who appear in multiple sponsors
      if (aSponsorCount !== bSponsorCount) {
        return bSponsorCount - aSponsorCount; // More sponsors = higher priority
      }
      
      // If same number of sponsors, sort by total earnings USD
      return bTotal - aTotal;
    });

    // Apply pagination
    const perPage = filters.per_page || 20;
    const currentPage = filters.page || 1;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = combinedUsers.slice(startIndex, endIndex);

    // Update leaderboard positions based on sorted order
    paginatedUsers.forEach((user, index) => {
      user.leaderboard_position = startIndex + index + 1;
    });

    return {
      users: paginatedUsers,
      pagination: {
        current_page: currentPage,
        last_page: Math.ceil(combinedUsers.length / perPage),
        total: combinedUsers.length,
      },
    };
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data && newPage <= data.pagination.last_page) {
      setPage(newPage);
    }
  };

  const filteredUsers = data?.users || [];
  const isAllSponsors = !filters.sponsor_slug;
  
  // Categorize builders and calculate MCAP (must be before early returns)
  const categories = useMemo(() => {
    if (!filteredUsers.length) return new Map<number, BuilderCategory>();
    // For all sponsors mode, use average token price or default
    const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
    return categorizeBuilders(filteredUsers, priceForMCAP);
  }, [filteredUsers, tokenPrice, isAllSponsors]);

  // Get top builders for each category in specified order
  const topBuildersByCategory = useMemo(() => {
    if (!filteredUsers.length) return [];
    
    const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
    const soughtAfter = getSoughtAfterBuilder(filteredUsers);
    const trending = getTrendingBuilder(filteredUsers);
    const highestScore = getHighestScore(filteredUsers);
    const featured = getFeaturedBuilder(filteredUsers, priceForMCAP);
    const mostEarnings = getMostEarnings(filteredUsers);
    
    // Return in specified order: sought after, trending, highest score, featured, most earnings
    return [
      { category: "sought_after" as BuilderCategory, builder: soughtAfter },
      { category: "trending" as BuilderCategory, builder: trending },
      { category: "highest_score" as BuilderCategory, builder: highestScore },
      { category: "featured" as BuilderCategory, builder: featured },
      { category: "most_earnings" as BuilderCategory, builder: mostEarnings },
    ].filter(item => item.builder !== null);
  }, [filteredUsers, tokenPrice, isAllSponsors]);


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

  const toggleEarningsBreakdown = (userId: number) => {
    setExpandedEarnings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
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
        <div className="mb-6 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Top Builders by Category
            </h3>
            <p className="text-xs text-gray-500">
              Leading builders across different categories
            </p>
          </div>
          <div className="w-full">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[20%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[26%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Builder
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MCAP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 0);
                  const mcap = priceForMCAP ? calculateMCAP(user, priceForMCAP) : 0;
                  
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
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[category]}`}>
                          <TrophyIcon category={category} className="w-3 h-3" />
                          <span className="truncate">{getCategoryLabel(category)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {user.profile.image_url ? (
                            <img
                              src={user.profile.image_url}
                              alt={user.profile.display_name || user.profile.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-gray-500">
                                {user.leaderboard_position}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {user.profile.display_name || user.profile.name || "Anonymous"}
                            </div>
                            {user.profile.bio && (
                              <div className="text-xs text-gray-500 truncate">
                                {user.profile.bio}
                              </div>
                            )}
                            {isAllSponsors && (user as UserWithEarningsBreakdown).sponsors && (user as UserWithEarningsBreakdown).sponsors!.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {(user as UserWithEarningsBreakdown).sponsors!.map((sponsor) => (
                                  <span
                                    key={sponsor}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                                    title={`Appears in ${sponsor.replace("-", " ")}`}
                                  >
                                    {sponsor.replace("-", " ")}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.profile.builder_score?.points !== undefined
                            ? formatNumber(user.profile.builder_score.points)
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {(() => {
                          const userWithBreakdown = user as UserWithEarningsBreakdown;
                          if (isAllSponsors && userWithBreakdown.totalEarningsUSD !== undefined) {
                            return (
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  ${formatNumber(userWithBreakdown.totalEarningsUSD)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Total (All Sponsors)
                                </div>
                              </div>
                            );
                          } else if (rewardAmount > 0 && tokenPrice && tokenInfo) {
                            return (
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  ${formatNumber(rewardAmount * tokenPrice)}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {formatNumber(rewardAmount)} {tokenInfo.symbol}
                                </div>
                              </div>
                            );
                          } else {
                            return <span className="text-sm text-gray-400">—</span>;
                          }
                        })()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          ${formatNumber(mcap)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{user.leaderboard_position}
                        </div>
                        {user.ranking_change !== 0 && (
                          <div className={`text-xs ${user.ranking_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {user.ranking_change > 0 ? '↑' : '↓'} {Math.abs(user.ranking_change)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {tokenPrice ? (
                          <div 
                            className="text-xs text-gray-600"
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
              // For all sponsors, use totalEarningsUSD as the base for MCAP calculation
              const priceForMCAP = isAllSponsors 
                ? 1 // USD already calculated, so use 1 as multiplier
                : (tokenPrice || 0);
              const mcap = priceForMCAP ? calculateMCAP(user, priceForMCAP) : 0;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 flex-shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        {user.profile.image_url ? (
                          <img
                            src={user.profile.image_url}
                            alt={user.profile.display_name || user.profile.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-gray-500">
                              {user.leaderboard_position}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.profile.display_name || user.profile.name || "Anonymous"}
                            </p>
                            {category && (
                              <div className="flex items-center gap-1 flex-shrink-0" title={getCategoryLabel(category)}>
                                <TrophyIcon category={category} className="w-4 h-4" />
                              </div>
                            )}
                            {user.profile.human_checkmark && (
                              <span className="text-blue-500 text-xs flex-shrink-0" title="Verified">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {user.profile.bio || user.profile.location || "No description"}
                          </p>
                          {user.profile.location && (
                            <p className="text-xs text-gray-400 truncate">
                              {user.profile.location}
                            </p>
                          )}
                          {isAllSponsors && (user as UserWithEarningsBreakdown).sponsors && (user as UserWithEarningsBreakdown).sponsors!.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {(user as UserWithEarningsBreakdown).sponsors!.map((sponsor) => (
                                <span
                                  key={sponsor}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                                  title={`Appears in ${sponsor.replace("-", " ")}`}
                                >
                                  {sponsor.replace("-", " ")}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.profile.builder_score?.points !== undefined
                        ? formatNumber(user.profile.builder_score.points)
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {(() => {
                      const userWithBreakdown = user as UserWithEarningsBreakdown;
                      const isExpanded = expandedEarnings.has(user.id);
                      
                      if (isAllSponsors && userWithBreakdown.totalEarningsUSD !== undefined) {
                        // All sponsors mode - show total USD and breakdown
                        return (
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              ${formatNumber(userWithBreakdown.totalEarningsUSD)}
                            </div>
                            {userWithBreakdown.earningsBreakdown && userWithBreakdown.earningsBreakdown.length > 0 && (
                              <div className="mt-1">
                                <button
                                  onClick={() => toggleEarningsBreakdown(user.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                  {isExpanded ? "Hide" : "Show"} Breakdown
                                  <svg
                                    className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                {isExpanded && (
                                  <div className="mt-2 space-y-1.5 bg-gray-50 rounded-lg p-2 border border-gray-200">
                                    {userWithBreakdown.earningsBreakdown.map((breakdown, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600 capitalize">
                                          {breakdown.sponsor.replace("-", " ")}:
                                        </span>
                                        <div className="text-right">
                                          <div className="font-medium text-gray-900">
                                            ${formatNumber(breakdown.amountUSD)}
                                          </div>
                                          <div className="text-gray-500">
                                            {formatNumber(breakdown.amount)} {breakdown.tokenSymbol}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      } else if (rewardAmount > 0) {
                        // Single sponsor mode
                        return (
                          <div>
                            {tokenPrice !== null && tokenInfo ? (
                              <>
                                <div className="text-sm font-semibold text-gray-900">
                                  ${formatNumber(rewardAmount * tokenPrice)}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {formatNumber(rewardAmount)} {tokenInfo.symbol}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm font-semibold text-gray-900">
                                {formatNumber(rewardAmount)} {tokenInfo?.symbol || "TOKEN"}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return <span className="text-sm text-gray-400">—</span>;
                      }
                    })()}
                  </td>
                  <td className="px-4 py-4">
                    {user.ranking_change !== 0 ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      ${formatNumber(mcap)}
                    </div>
                    {category && (
                      <div className="text-xs text-gray-500 truncate">
                        {getCategoryLabel(category)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
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
