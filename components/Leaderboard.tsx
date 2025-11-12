"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getLeaderboard } from "@/lib/builderscore-api";
import { getTokenPrice, type TokenInfo } from "@/lib/coingecko-api";
import type { LeaderboardResponse, LeaderboardFilters } from "@/types/talent";
import { formatNumber, formatWalletAddress } from "@/lib/utils";
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
import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/Badge";

/**
 * All available sponsor slugs for filtering
 */
const ALL_SPONSOR_SLUGS = ["walletconnect", "celo", "base", "base-summer", "syndicate", "talent-protocol"];

/**
 * Extended user type that includes earnings breakdown data
 */
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(filters.page || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [selectedBuilder, setSelectedBuilder] = useState<LeaderboardUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedEarnings, setExpandedEarnings] = useState<Set<number>>(new Set());
  
  // For "All Sponsors" lazy loading: track loaded pages per sponsor and all aggregated users
  const [allSponsorsPageMap, setAllSponsorsPageMap] = useState<Map<string, number>>(new Map());
  const [allSponsorsAggregatedUsers, setAllSponsorsAggregatedUsers] = useState<UserWithEarningsBreakdown[]>([]);
  const [allSponsorsHasMore, setAllSponsorsHasMore] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(30); // Display 30 builders at a time
  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState<'position' | 'score' | 'earnings' | 'mcap'>('position');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState({
    position: true,
    name: true,
    score: true,
    earnings: true,
    rankChange: true,
    mcap: true,
    actions: true,
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'top10' | 'top50' | 'top100'>('all');
  const [categoryFilter, setCategoryFilter] = useState<BuilderCategory | 'all'>('all');
  const [scoreRange, setScoreRange] = useState<{ min: number | ''; max: number | '' }>({ min: '', max: '' });
  const [earningsRange, setEarningsRange] = useState<{ min: number | ''; max: number | '' }>({ min: '', max: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [bookmarkedBuilders, setBookmarkedBuilders] = useState<Set<number>>(new Set());
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedForComparison, setSelectedForComparison] = useState<Set<number>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const [builderNotes, setBuilderNotes] = useState<Record<number, string>>({});
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [tableDensity, setTableDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleSearch = useCallback(() => {
    setActiveSearchQuery(searchQuery);
    setPage(1);
  }, [searchQuery]);

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

  // Export to CSV
  const handleExportCSV = () => {
    if (!data || !data.users.length) return;
    
    const headers = ["Position", "Name", "Score", "Earnings", "Rank Change", "MCAP", "Category"];
    const rows = data.users.map((user) => {
      const rewardAmount = typeof user.reward_amount === 'string' 
        ? parseFloat(user.reward_amount) 
        : user.reward_amount;
      const earnings = isAllSponsors 
        ? `$${formatNumber((user as UserWithEarningsBreakdown).totalEarningsUSD || 0)}`
        : tokenPrice !== null && tokenInfo
        ? `$${formatNumber(rewardAmount * tokenPrice)} (${formatNumber(rewardAmount)} ${tokenInfo.symbol})`
        : `${formatNumber(rewardAmount)}`;
      const category = categories.get(user.id);
      const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
      const mcap = calculateMCAP(user, priceForMCAP);
      
      return [
        user.leaderboard_position || "",
        user.profile.display_name || user.profile.name || "Anonymous",
        user.profile.builder_score?.points ? formatNumber(user.profile.builder_score.points) : "N/A",
        earnings,
        user.ranking_change || 0,
        `$${formatNumber(mcap)}`,
        category ? getCategoryLabel(category) : "",
      ];
    });
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leaderboard-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (!data || !data.users.length) return;
    
    const exportData = data.users.map((user) => {
      const rewardAmount = typeof user.reward_amount === 'string' 
        ? parseFloat(user.reward_amount) 
        : user.reward_amount;
      const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
      const mcap = calculateMCAP(user, priceForMCAP);
      const category = categories.get(user.id);
      
      return {
        position: user.leaderboard_position,
        name: user.profile.display_name || user.profile.name || "Anonymous",
        score: user.profile.builder_score?.points || null,
        earnings: isAllSponsors 
          ? (user as UserWithEarningsBreakdown).totalEarningsUSD || 0
          : rewardAmount,
        earningsUSD: isAllSponsors 
          ? (user as UserWithEarningsBreakdown).totalEarningsUSD || 0
          : tokenPrice !== null ? rewardAmount * tokenPrice : null,
        rankChange: user.ranking_change || 0,
        mcap: mcap,
        category: category ? getCategoryLabel(category) : null,
        wallet: user.recipient_wallet,
        bio: user.profile.bio,
        location: user.profile.location,
      };
    });
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leaderboard-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: "Builder Score Leaderboard",
      text: `Check out the top builders on the leaderboard!`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch {
      // User cancelled or error occurred
      console.log("Share cancelled or failed");
    }
  };

  // Copy link functionality
  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Bookmark functionality
  const toggleBookmark = (userId: number) => {
    setBookmarkedBuilders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      // Save to localStorage
      localStorage.setItem('bookmarkedBuilders', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedBuilders');
    if (saved) {
      try {
        setBookmarkedBuilders(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }
  }, []);

  // Load builder notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('builderNotes');
    if (saved) {
      try {
        setBuilderNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load builder notes:', e);
      }
    }
  }, []);

  // Save builder notes to localStorage
  useEffect(() => {
    if (Object.keys(builderNotes).length > 0) {
      localStorage.setItem('builderNotes', JSON.stringify(builderNotes));
    }
  }, [builderNotes]);

  // Copy wallet address to clipboard
  const copyWalletAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy wallet address:', err);
    }
  };

  // Save builder note
  const saveNote = (userId: number, note: string) => {
    setBuilderNotes(prev => {
      const updated = { ...prev };
      if (note.trim()) {
        updated[userId] = note.trim();
      } else {
        delete updated[userId];
      }
      return updated;
    });
    setEditingNote(null);
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Comparison functionality
  const toggleComparison = (userId: number) => {
    setSelectedForComparison(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        if (newSet.size >= 3) {
          // Limit to 3 builders for comparison
          return prev;
        }
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const clearComparison = () => {
    setSelectedForComparison(new Set());
    setShowComparison(false);
  };

  // Refresh functionality
  const handleRefresh = () => {
    setPage(1);
    const leaderboardFilters = {
      ...filters,
      page: 1,
    };
    fetchLeaderboard(leaderboardFilters);
  };

  // Sort functionality
  const handleSort = (field: 'position' | 'score' | 'earnings' | 'mcap') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
    // Reset lazy loading state when filters change
    if (!filters.sponsor_slug) {
      setAllSponsorsPageMap(new Map());
      setAllSponsorsAggregatedUsers([]);
      setAllSponsorsHasMore(true);
      setDisplayedCount(30); // Reset to show first 30
    }
  }, [JSON.stringify({ sponsor_slug: filters.sponsor_slug, grant_id: filters.grant_id, per_page: filters.per_page })]);

  useEffect(() => {
    fetchLeaderboard({ 
      ...filters, 
      page,
      search: activeSearchQuery || undefined,
    });
  }, [page, activeSearchQuery, JSON.stringify({ sponsor_slug: filters.sponsor_slug, grant_id: filters.grant_id, per_page: filters.per_page })]);

  // Intersection Observer for infinite scroll (All Sponsors mode only)
  useEffect(() => {
    if (filters.sponsor_slug || !allSponsorsHasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && allSponsorsHasMore) {
            fetchLeaderboard({ 
              ...filters, 
              page: 1,
              search: activeSearchQuery || undefined,
            }, true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const trigger = document.getElementById("load-more-trigger");
    if (trigger) {
      observer.observe(trigger);
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [filters.sponsor_slug, allSponsorsHasMore, loadingMore, activeSearchQuery]);

  const fetchLeaderboard = async (leaderboardFilters: LeaderboardFilters, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }
    
    try {
      // Check if "all sponsors" is selected (no sponsor_slug)
      if (!leaderboardFilters.sponsor_slug) {
        // Fetch from all sponsors and combine (with lazy loading)
        const allSponsorsData = await fetchAllSponsorsLazy(leaderboardFilters, isLoadMore);
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
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Lazy loading version: fetch one page (100 per page) from each sponsor, then aggregate
  const fetchAllSponsorsLazy = async (filters: LeaderboardFilters, isLoadMore = false): Promise<LeaderboardResponse> => {
    console.log(`🚀 [All Sponsors Lazy] ${isLoadMore ? 'Loading more...' : 'Initial load'}`);
    
    // Fetch token prices for all sponsors (only on initial load)
    let priceMap = new Map<string, number>();
    let tokenInfoMap = new Map<string, TokenInfo>();
    
    if (!isLoadMore) {
      console.log("💰 [All Sponsors Lazy] Fetching token prices for all sponsors...");
      const tokenPrices = await Promise.all(
        ALL_SPONSOR_SLUGS.map(async (slug) => {
          const { price, tokenInfo } = await getTokenPrice(slug);
          console.log(`  ✓ ${slug}: $${price} (${tokenInfo?.symbol || 'N/A'})`);
          return { slug, price, tokenInfo };
        })
      );
      priceMap = new Map(tokenPrices.map(({ slug, price }) => [slug, price]));
      tokenInfoMap = new Map(tokenPrices.filter(({ tokenInfo }) => tokenInfo !== null).map(({ slug, tokenInfo }) => [slug, tokenInfo!]));
    } else {
      // Reuse existing token prices (we'll need to store these or fetch again)
      // For now, fetch them again (could be optimized)
      const tokenPrices = await Promise.all(
        ALL_SPONSOR_SLUGS.map(async (slug) => {
          const { price, tokenInfo } = await getTokenPrice(slug);
          return { slug, price, tokenInfo };
        })
      );
      priceMap = new Map(tokenPrices.map(({ slug, price }) => [slug, price]));
      tokenInfoMap = new Map(tokenPrices.filter(({ tokenInfo }) => tokenInfo !== null).map(({ slug, tokenInfo }) => [slug, tokenInfo!]));
    }

    // Determine which page to fetch for each sponsor
    const currentPageMap = new Map<string, number>();
    ALL_SPONSOR_SLUGS.forEach((slug) => {
      const currentPage = allSponsorsPageMap.get(slug) || 0;
      currentPageMap.set(slug, currentPage + 1);
    });

    console.log(`📡 [All Sponsors Lazy] Fetching page 1 (100 per page) from all sponsors...`);
    
    // Fetch next page from all sponsors in parallel
    const allResponses = await Promise.allSettled(
      ALL_SPONSOR_SLUGS.map((slug) => {
        const pageToFetch = currentPageMap.get(slug) || 1;
        console.log(`   📄 Fetching ${slug} - Page ${pageToFetch} (100 per page)...`);
        return getLeaderboard({
          ...filters,
          sponsor_slug: slug,
          grant_id: undefined,
          per_page: 100,
          page: pageToFetch,
        });
      })
    );

    // Update page map
    const newPageMap = new Map(allSponsorsPageMap);
    let hasMoreData = false;
    
    allResponses.forEach((result, index) => {
      const slug = ALL_SPONSOR_SLUGS[index];
      if (result.status === "fulfilled") {
        const currentPage = currentPageMap.get(slug) || 1;
        newPageMap.set(slug, currentPage);
        if (currentPage < result.value.pagination.last_page) {
          hasMoreData = true;
        }
        console.log(`  ✓ ${slug}: Page ${currentPage} - ${result.value.users.length} builders`);
      } else {
        console.error(`  ✗ ${slug}: Failed -`, result.reason);
      }
    });
    
    setAllSponsorsPageMap(newPageMap);
    setAllSponsorsHasMore(hasMoreData);

    // Helper function to get a unique key for a builder
    const getBuilderKey = (user: LeaderboardUser): string => {
      if (user.profile.talent_protocol_id) {
        return `talent_${user.profile.talent_protocol_id}`;
      }
      const normalizedName = (user.profile.display_name || user.profile.name || '').toLowerCase().trim();
      if (normalizedName) {
        return `name_${normalizedName}`;
      }
      return `id_${user.id}`;
    };

    // Aggregate new data with existing data
    const existingUserMap = new Map<string, UserWithEarningsBreakdown>();
    const existingEarningsBreakdownMap = new Map<string, Array<{
      sponsor: string;
      amount: number;
      amountUSD: number;
      tokenSymbol: string;
    }>>();
    const existingSponsorsMap = new Map<string, Set<string>>();

    // Initialize from existing aggregated users
    if (isLoadMore && allSponsorsAggregatedUsers.length > 0) {
      allSponsorsAggregatedUsers.forEach((user) => {
        const key = getBuilderKey(user);
        existingUserMap.set(key, { ...user });
        existingEarningsBreakdownMap.set(key, [...(user.earningsBreakdown || [])]);
        existingSponsorsMap.set(key, new Set(user.sponsors || []));
      });
    }

    // Process new responses
    allResponses.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const sponsor = ALL_SPONSOR_SLUGS[index];
        const tokenPrice = priceMap.get(sponsor) || 0;
        const tokenInfo = tokenInfoMap.get(sponsor);

        result.value.users.forEach((user) => {
          const rewardAmount = typeof user.reward_amount === 'string' 
            ? parseFloat(user.reward_amount) 
            : user.reward_amount;
          
          const earningsUSD = rewardAmount * tokenPrice;
          const builderKey = getBuilderKey(user);

          if (!existingUserMap.has(builderKey)) {
            existingUserMap.set(builderKey, {
              ...user,
              earningsBreakdown: [],
              totalEarningsUSD: 0,
              sponsors: [],
            });
            existingEarningsBreakdownMap.set(builderKey, []);
            existingSponsorsMap.set(builderKey, new Set());
          }

          const existingUser = existingUserMap.get(builderKey)!;
          const breakdown = existingEarningsBreakdownMap.get(builderKey)!;
          const sponsorsSet = existingSponsorsMap.get(builderKey)!;

          sponsorsSet.add(sponsor);

          if (tokenInfo) {
            breakdown.push({
              sponsor,
              amount: rewardAmount,
              amountUSD: earningsUSD,
              tokenSymbol: tokenInfo.symbol,
            });

            const previousTotal = existingUser.totalEarningsUSD || 0;
            existingUser.totalEarningsUSD = previousTotal + earningsUSD;
          }

          if ((user.profile.builder_score?.points || 0) > (existingUser.profile.builder_score?.points || 0)) {
            existingUser.profile.builder_score = user.profile.builder_score;
          }
          if (user.leaderboard_position < existingUser.leaderboard_position) {
            existingUser.leaderboard_position = user.leaderboard_position;
          }
        });
      }
    });

    // Update reward_amount to total USD
    existingUserMap.forEach((user) => {
      user.reward_amount = user.totalEarningsUSD || 0;
    });

    // Attach earnings breakdown and sponsors list
    existingUserMap.forEach((user, builderKey) => {
      user.earningsBreakdown = existingEarningsBreakdownMap.get(builderKey) || [];
      user.sponsors = Array.from(existingSponsorsMap.get(builderKey) || []);
    });

    // Sort: by total earnings USD (descending) - regardless of sponsor count
    const combinedUsers = Array.from(existingUserMap.values()).sort((a, b) => {
      const aTotal = a.totalEarningsUSD || 0;
      const bTotal = b.totalEarningsUSD || 0;
      return bTotal - aTotal;
    });

    // Update aggregated users state
    setAllSponsorsAggregatedUsers(combinedUsers);

    // Apply search filter if active
    let filteredCombinedUsers = combinedUsers;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCombinedUsers = combinedUsers.filter((user) => {
        const name = (user.profile.display_name || user.profile.name || '').toLowerCase();
        const bio = (user.profile.bio || '').toLowerCase();
        const wallet = (user.recipient_wallet || '').toLowerCase();
        return name.includes(searchLower) || bio.includes(searchLower) || wallet.includes(searchLower);
      });
      console.log(`🔍 [All Sponsors Lazy] Search "${filters.search}": ${filteredCombinedUsers.length} results from ${combinedUsers.length} builders`);
    }

    // Display 30 builders at a time (or all if less than 30)
    const currentDisplayedCount = isLoadMore ? displayedCount + 30 : Math.min(30, filteredCombinedUsers.length);
    setDisplayedCount(currentDisplayedCount);
    const displayedUsers = filteredCombinedUsers.slice(0, currentDisplayedCount);

    displayedUsers.forEach((user, index) => {
      user.leaderboard_position = index + 1;
    });

    const result = {
      users: displayedUsers,
      pagination: {
        current_page: 1,
        last_page: Math.ceil(filteredCombinedUsers.length / 30), // 30 per display chunk
        total: filteredCombinedUsers.length,
      },
    };

    console.log(`✅ [All Sponsors Lazy] Loaded ${combinedUsers.length} unique builders, ${filters.search ? `filtered to ${filteredCombinedUsers.length}` : ''}, displaying ${displayedUsers.length} of ${filteredCombinedUsers.length}`);
    return result;
  };

  const fetchAllSponsors = async (filters: LeaderboardFilters): Promise<LeaderboardResponse> => {
    console.log("🚀 [All Sponsors] Starting fetchAllSponsors");
    console.log("📋 [All Sponsors] Sponsor slugs:", ALL_SPONSOR_SLUGS);
    console.log("🔍 [All Sponsors] Filters:", filters);

    // Fetch token prices for all sponsors
    console.log("💰 [All Sponsors] Fetching token prices for all sponsors...");
    const tokenPrices = await Promise.all(
      ALL_SPONSOR_SLUGS.map(async (slug) => {
        const { price, tokenInfo } = await getTokenPrice(slug);
        console.log(`  ✓ ${slug}: $${price} (${tokenInfo?.symbol || 'N/A'})`);
        return { slug, price, tokenInfo };
      })
    );

    console.log("✅ [All Sponsors] Token prices fetched:", tokenPrices);

    const priceMap = new Map(
      tokenPrices.map(({ slug, price }) => [slug, price])
    );
    const tokenInfoMap = new Map(
      tokenPrices.map(({ slug, tokenInfo }) => [slug, tokenInfo])
    );

    // Fetch data from all sponsors
    // Fetch all pages sequentially for each sponsor (page=1, 2, 3, ...) with 100 per page
    console.log("📡 [All Sponsors] Fetching leaderboard data from all sponsors (all pages, 100 per page, sequentially)...");
    
    const fetchAllPagesForSponsor = async (slug: string): Promise<LeaderboardUser[]> => {
      const allUsers: LeaderboardUser[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      console.log(`\n📦 [All Sponsors] Starting to fetch ${slug}...`);
      
      while (hasMorePages) {
        try {
          console.log(`   📄 Fetching ${slug} - Page ${currentPage} (100 per page)...`);
          const response = await getLeaderboard({
            ...filters,
            sponsor_slug: slug,
            grant_id: undefined, // All time only
            per_page: 100,
            page: currentPage,
          });
          
          if (response.users.length === 0) {
            console.log(`   ✓ ${slug} - Page ${currentPage}: No more data`);
            hasMorePages = false;
          } else {
            allUsers.push(...response.users);
            console.log(`   ✓ ${slug} - Page ${currentPage}: ${response.users.length} builders (Total so far: ${allUsers.length})`);
            
            // Check if we've reached the last page
            if (currentPage >= response.pagination.last_page) {
              console.log(`   ✅ ${slug}: Reached last page (${response.pagination.last_page})`);
              hasMorePages = false;
            } else {
              currentPage++;
            }
          }
        } catch (error) {
          console.error(`   ✗ ${slug} - Page ${currentPage}: Error -`, error);
          hasMorePages = false;
        }
      }
      
      console.log(`   ✅ ${slug}: Completed - Fetched ${allUsers.length} builders across ${currentPage} page(s)`);
      return allUsers;
    };
    
    // Fetch all pages for each sponsor sequentially (one sponsor at a time, one page at a time)
    const allResponses: Array<PromiseSettledResult<LeaderboardResponse>> = [];
    
    for (const slug of ALL_SPONSOR_SLUGS) {
      try {
        console.log(`\n🔄 [All Sponsors] Processing sponsor: ${slug}`);
        const users = await fetchAllPagesForSponsor(slug);
        allResponses.push({
          status: "fulfilled" as const,
          value: {
            users,
            pagination: {
              current_page: 1,
              last_page: 1,
              total: users.length,
            },
          },
        });
      } catch (error) {
        console.error(`\n❌ [All Sponsors] Error processing ${slug}:`, error);
        allResponses.push({
          status: "rejected" as const,
          reason: error,
        });
      }
    }
    
    console.log("📊 [All Sponsors] Responses received:", allResponses.length);
    allResponses.forEach((result, index) => {
      const sponsor = ALL_SPONSOR_SLUGS[index];
      if (result.status === "fulfilled") {
        console.log(`  ✓ ${sponsor}: ${result.value.users.length} builders`);
      } else {
        console.error(`  ✗ ${sponsor}: Failed -`, result.reason);
      }
    });

    // Combine all users by a unique identifier (talent_protocol_id or normalized display_name)
    // Use a composite key: talent_protocol_id if available, otherwise normalized display_name
    const userMap = new Map<string, UserWithEarningsBreakdown>();
    const earningsBreakdownMap = new Map<string, Array<{
      sponsor: string;
      amount: number;
      amountUSD: number;
      tokenSymbol: string;
    }>>();
    const sponsorsMap = new Map<string, Set<string>>(); // Track which sponsors each builder appears in
    
    // Helper function to get a unique key for a builder
    const getBuilderKey = (user: LeaderboardUser): string => {
      // Primary: Use talent_protocol_id if available
      if (user.profile.talent_protocol_id) {
        return `talent_${user.profile.talent_protocol_id}`;
      }
      // Fallback: Use normalized display_name (lowercase, trimmed)
      const normalizedName = (user.profile.display_name || user.profile.name || '').toLowerCase().trim();
      if (normalizedName) {
        return `name_${normalizedName}`;
      }
      // Last resort: Use the user ID (but this won't match across sponsors)
      return `id_${user.id}`;
    };

    // Step 1: Gather all data from each sponsor slug
    console.log("🔄 [All Sponsors] Step 1: Gathering and aggregating data from all sponsors...");
    let totalBuildersProcessed = 0;
    let totalEarningsCalculated = 0;

    allResponses.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const sponsor = ALL_SPONSOR_SLUGS[index];
        const tokenPrice = priceMap.get(sponsor) || 0;
        const tokenInfo = tokenInfoMap.get(sponsor);

        console.log(`\n📦 [All Sponsors] Processing ${sponsor}:`);
        console.log(`   Token Price: $${tokenPrice}, Symbol: ${tokenInfo?.symbol || 'N/A'}`);
        console.log(`   Builders in this sponsor: ${result.value.users.length}`);

        result.value.users.forEach((user) => {
          totalBuildersProcessed++;
          const rewardAmount = typeof user.reward_amount === 'string' 
            ? parseFloat(user.reward_amount) 
            : user.reward_amount;
          
          // Convert token amount to USD immediately
          const earningsUSD = rewardAmount * tokenPrice;

          // Get unique key for this builder (talent_protocol_id or normalized name)
          const builderKey = getBuilderKey(user);
          const builderName = user.profile.display_name || user.profile.name || 'Anonymous';

          if (!userMap.has(builderKey)) {
            // First time seeing this builder - initialize
            console.log(`   🆕 New builder found: ${builderName} (Key: ${builderKey}, Talent ID: ${user.profile.talent_protocol_id || 'N/A'}, Sponsor ID: ${user.id})`);
            userMap.set(builderKey, {
              ...user,
              earningsBreakdown: [],
              totalEarningsUSD: 0,
              sponsors: [],
            });
            earningsBreakdownMap.set(builderKey, []);
            sponsorsMap.set(builderKey, new Set());
          }

          const existingUser = userMap.get(builderKey)!;
          const breakdown = earningsBreakdownMap.get(builderKey)!;
          const sponsorsSet = sponsorsMap.get(builderKey)!;

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

            console.log(`   💵 Builder ${builderKey} (${builderName}, Sponsor ID: ${user.id}): ${rewardAmount} ${tokenInfo.symbol} × $${tokenPrice} = $${earningsUSD.toFixed(2)}`);

            // Accumulate total earnings in USD from ALL sponsors
            // This sums the entire amount made from all sponsors
            const previousTotal = existingUser.totalEarningsUSD || 0;
            existingUser.totalEarningsUSD = previousTotal + earningsUSD;
            totalEarningsCalculated += earningsUSD;

            console.log(`      Previous total: $${previousTotal.toFixed(2)} → New total: $${existingUser.totalEarningsUSD.toFixed(2)}`);
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

    console.log(`\n📈 [All Sponsors] Aggregation Summary:`);
    console.log(`   Total builders processed: ${totalBuildersProcessed}`);
    console.log(`   Unique builders: ${userMap.size}`);
    console.log(`   Total earnings calculated: $${totalEarningsCalculated.toFixed(2)}`);

    // Step 2: After gathering all data, update reward_amount to total USD for display
    console.log("\n🔄 [All Sponsors] Step 2: Finalizing user data...");
    userMap.forEach((user) => {
      user.reward_amount = user.totalEarningsUSD || 0;
    });

    // Attach earnings breakdown and sponsors list to users
    let exampleBuilderFound = false;
    
    userMap.forEach((user, builderKey) => {
      user.earningsBreakdown = earningsBreakdownMap.get(builderKey) || [];
      user.sponsors = Array.from(sponsorsMap.get(builderKey) || []);
      
      // Check for example builder: defidevrel.base.eth
      const builderName = (user.profile.display_name || user.profile.name || '').toLowerCase();
      const isExampleBuilder = builderName.includes('defidevrel') || builderName.includes('defidevrel.base.eth');
      
      if (isExampleBuilder) {
        exampleBuilderFound = true;
        const breakdownSum = user.earningsBreakdown.reduce((sum, b) => sum + b.amountUSD, 0);
        
        console.log(`\n🎯 [EXAMPLE BUILDER] ${user.profile.display_name || user.profile.name || 'Anonymous'} (Key: ${builderKey}, Talent ID: ${user.profile.talent_protocol_id || 'N/A'})`);
        console.log(`   Sponsors appeared in: ${user.sponsors.join(', ')} (${user.sponsors.length} sponsors)`);
        console.log(`   Total Earnings (totalEarningsUSD): $${(user.totalEarningsUSD || 0).toFixed(2)}`);
        console.log(`   Breakdown Sum Verification: $${breakdownSum.toFixed(2)}`);
        console.log(`   Match: ${Math.abs((user.totalEarningsUSD || 0) - breakdownSum) < 0.01 ? '✅ CORRECT' : '❌ MISMATCH'}`);
        console.log(`   Earnings Breakdown:`);
        user.earningsBreakdown.forEach((b, idx) => {
          const price = b.amount > 0 ? (b.amountUSD / b.amount) : 0;
          console.log(`      ${idx + 1}. ${b.sponsor}: ${b.amount} ${b.tokenSymbol} × $${price.toFixed(4)} = $${b.amountUSD.toFixed(2)}`);
        });
      }
    });
    
    if (!exampleBuilderFound) {
      console.log("\n⚠️  [EXAMPLE BUILDER] 'defidevrel.base.eth' NOT FOUND in aggregated results");
      console.log("   Searching for similar names...");
      userMap.forEach((user, builderKey) => {
        const builderName = (user.profile.display_name || user.profile.name || '').toLowerCase();
        if (builderName.includes('defi') || builderName.includes('devrel')) {
          console.log(`   Similar match: ${user.profile.display_name || user.profile.name} (Key: ${builderKey}, Talent ID: ${user.profile.talent_protocol_id || 'N/A'}) - Sponsors: ${(user.sponsors || []).join(', ')}`);
        }
      });
    }

    // Convert to array and sort by total earnings USD (descending) - regardless of sponsor count
    console.log("\n🔄 [All Sponsors] Step 3: Sorting builders by earnings...");
    const combinedUsers = Array.from(userMap.values()).sort((a, b) => {
      const aTotal = a.totalEarningsUSD || 0;
      const bTotal = b.totalEarningsUSD || 0;
      return bTotal - aTotal;
    });

    console.log(`   Sorted ${combinedUsers.length} builders`);
    
    // Find example builder's position in sorted list
    const exampleBuilderIndex = combinedUsers.findIndex((user) => {
      const builderName = (user.profile.display_name || user.profile.name || '').toLowerCase();
      return builderName.includes('defidevrel') || builderName.includes('defidevrel.base.eth');
    });
    
    if (exampleBuilderIndex !== -1) {
      const exampleBuilder = combinedUsers[exampleBuilderIndex];
      const pageNumber = Math.floor(exampleBuilderIndex / 30) + 1;
      const positionOnPage = (exampleBuilderIndex % 30) + 1;
      console.log(`\n🎯 [EXAMPLE BUILDER] Position in sorted list:`);
      console.log(`   Name: ${exampleBuilder.profile.display_name || exampleBuilder.profile.name || 'Anonymous'}`);
      console.log(`   Key: ${getBuilderKey(exampleBuilder)}, Talent ID: ${exampleBuilder.profile.talent_protocol_id || 'N/A'}`);
      console.log(`   Rank: #${exampleBuilderIndex + 1} (Position ${positionOnPage} on page ${pageNumber})`);
      console.log(`   Sponsors: ${(exampleBuilder.sponsors || []).length} (${(exampleBuilder.sponsors || []).join(', ')})`);
      console.log(`   Total Earnings: $${(exampleBuilder.totalEarningsUSD || 0).toFixed(2)}`);
      console.log(`   Will appear on page: ${pageNumber}`);
    }
    
    console.log(`   Top 10 builders after sorting:`);
    combinedUsers.slice(0, 10).forEach((user, idx) => {
      const builderName = (user.profile.display_name || user.profile.name || 'Anonymous').toLowerCase();
      const isExample = builderName.includes('defidevrel');
      const marker = isExample ? '🎯' : '';
      console.log(`   ${marker} ${idx + 1}. ${user.profile.display_name || user.profile.name || 'Anonymous'} (Key: ${getBuilderKey(user)}, Talent ID: ${user.profile.talent_protocol_id || 'N/A'})`);
      console.log(`      Sponsors: ${(user.sponsors || []).length} (${(user.sponsors || []).join(', ')})`);
      console.log(`      Total Earnings: $${(user.totalEarningsUSD || 0).toFixed(2)}`);
    });

    // Apply pagination
    // Display 30 per page in the table (regardless of fetch size)
    console.log("\n🔄 [All Sponsors] Step 4: Applying pagination...");
    const perPage = 30; // Always show 30 per page in table
    const currentPage = filters.page || 1;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = combinedUsers.slice(startIndex, endIndex);

    console.log(`   Page: ${currentPage}, Per Page: ${perPage}`);
    console.log(`   Showing builders ${startIndex + 1} to ${Math.min(endIndex, combinedUsers.length)} of ${combinedUsers.length}`);

    // Update leaderboard positions based on sorted order
    paginatedUsers.forEach((user, index) => {
      user.leaderboard_position = startIndex + index + 1;
    });

    const result = {
      users: paginatedUsers,
      pagination: {
        current_page: currentPage,
        last_page: Math.ceil(combinedUsers.length / perPage),
        total: combinedUsers.length,
      },
    };

    console.log("\n✅ [All Sponsors] Final Results:");
    console.log(`   Total unique builders: ${combinedUsers.length}`);
    console.log(`   Pagination: Page ${currentPage} of ${result.pagination.last_page}`);
    console.log(`   Users in this page: ${paginatedUsers.length}`);
    console.log(`   Total earnings across all builders: $${combinedUsers.reduce((sum, u) => sum + (u.totalEarningsUSD || 0), 0).toFixed(2)}`);
    console.log("🎉 [All Sponsors] fetchAllSponsors completed!\n");

    return result;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data && newPage <= data.pagination.last_page) {
      setPage(newPage);
    }
  };

  const filteredUsers = data?.users || [];
  const isAllSponsors = !filters.sponsor_slug;
  
  // Sort filtered users
  const sortedUsers = useMemo(() => {
    if (!data || !data.users.length) return [];
    
    const users = [...data.users];
    const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
    
    return users.sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortBy) {
        case 'position':
          aValue = a.leaderboard_position || 0;
          bValue = b.leaderboard_position || 0;
          break;
        case 'score':
          aValue = a.profile.builder_score?.points || 0;
          bValue = b.profile.builder_score?.points || 0;
          break;
        case 'earnings':
          if (isAllSponsors) {
            aValue = (a as UserWithEarningsBreakdown).totalEarningsUSD || 0;
            bValue = (b as UserWithEarningsBreakdown).totalEarningsUSD || 0;
          } else {
            const aAmt = typeof a.reward_amount === 'string' ? parseFloat(a.reward_amount) : a.reward_amount;
            const bAmt = typeof b.reward_amount === 'string' ? parseFloat(b.reward_amount) : b.reward_amount;
            aValue = tokenPrice !== null ? aAmt * tokenPrice : aAmt;
            bValue = tokenPrice !== null ? bAmt * tokenPrice : bAmt;
          }
          break;
        case 'mcap':
          aValue = calculateMCAP(a, priceForMCAP);
          bValue = calculateMCAP(b, priceForMCAP);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [data, sortBy, sortOrder, tokenPrice, isAllSponsors]);
  
  // Categorize builders and calculate MCAP (must be before early returns)
  const categories = useMemo(() => {
    if (!filteredUsers.length) return new Map<number, BuilderCategory>();
    // For all sponsors mode, use average token price or default
    const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
    return categorizeBuilders(filteredUsers, priceForMCAP);
  }, [filteredUsers, tokenPrice, isAllSponsors]);
  
  // Apply quick filter
  const quickFilteredUsers = useMemo(() => {
    const users = sortedUsers.length > 0 ? sortedUsers : filteredUsers;
    if (quickFilter === 'all') return users;
    const limit = quickFilter === 'top10' ? 10 : quickFilter === 'top50' ? 50 : 100;
    return users.slice(0, limit);
  }, [sortedUsers, filteredUsers, quickFilter]);
  
  // Apply category filter
  const categoryFilteredUsers = useMemo(() => {
    if (categoryFilter === 'all') return quickFilteredUsers;
    return quickFilteredUsers.filter(user => categories.get(user.id) === categoryFilter);
  }, [quickFilteredUsers, categoryFilter, categories]);
  
  // Apply score range filter
  const scoreFilteredUsers = useMemo(() => {
    if (scoreRange.min === '' && scoreRange.max === '') return categoryFilteredUsers;
    return categoryFilteredUsers.filter(user => {
      const score = user.profile.builder_score?.points || 0;
      const min = scoreRange.min === '' ? -Infinity : scoreRange.min;
      const max = scoreRange.max === '' ? Infinity : scoreRange.max;
      return score >= min && score <= max;
    });
  }, [categoryFilteredUsers, scoreRange]);
  
  // Apply earnings range filter
  const earningsFilteredUsers = useMemo(() => {
    if (earningsRange.min === '' && earningsRange.max === '') return scoreFilteredUsers;
    return scoreFilteredUsers.filter(user => {
      let earnings: number;
      if (isAllSponsors) {
        earnings = (user as UserWithEarningsBreakdown).totalEarningsUSD || 0;
      } else {
        const rewardAmount = typeof user.reward_amount === 'string' ? parseFloat(user.reward_amount) : user.reward_amount;
        earnings = tokenPrice !== null ? rewardAmount * tokenPrice : rewardAmount;
      }
      const min = earningsRange.min === '' ? -Infinity : earningsRange.min;
      const max = earningsRange.max === '' ? Infinity : earningsRange.max;
      return earnings >= min && earnings <= max;
    });
  }, [scoreFilteredUsers, earningsRange, isAllSponsors, tokenPrice]);
  
  // Apply bookmark filter
  const bookmarkFilteredUsers = useMemo(() => {
    if (!showBookmarkedOnly) return earningsFilteredUsers;
    return earningsFilteredUsers.filter(user => bookmarkedBuilders.has(user.id));
  }, [earningsFilteredUsers, showBookmarkedOnly, bookmarkedBuilders]);
  
  // Use sorted users for display
  const displayUsers = bookmarkFilteredUsers;

  // Get top builders for each category in specified order
  const topBuildersByCategory = useMemo(() => {
    if (!data || !data.users.length) return [];
    
    const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 1);
    const soughtAfter = getSoughtAfterBuilder(data.users);
    const trending = getTrendingBuilder(data.users);
    const highestScore = getHighestScore(data.users);
    const featured = getFeaturedBuilder(data.users, priceForMCAP);
    const mostEarnings = getMostEarnings(data.users);
    
    // Return in specified order: sought after, trending, highest score, featured, most earnings
    return [
      { category: "sought_after" as BuilderCategory, builder: soughtAfter },
      { category: "trending" as BuilderCategory, builder: trending },
      { category: "highest_score" as BuilderCategory, builder: highestScore },
      { category: "featured" as BuilderCategory, builder: featured },
      { category: "most_earnings" as BuilderCategory, builder: mostEarnings },
    ].filter(item => item.builder !== null);
  }, [data, tokenPrice, isAllSponsors]);

  // Announce data updates to screen readers
  useEffect(() => {
    if (data && !loading) {
      const count = filteredUsers.length;
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = `Leaderboard updated. Showing ${count} ${count === 1 ? 'builder' : 'builders'}.`;
      document.body.appendChild(announcement);
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    }
  }, [data, loading, filteredUsers.length]);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {visibleColumns.position && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
              {visibleColumns.name && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
              )}
              {visibleColumns.score && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              )}
              {visibleColumns.earnings && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
              )}
              {visibleColumns.rankChange && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank Change</th>
              )}
              {visibleColumns.mcap && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MCAP</th>
              )}
              {visibleColumns.actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {visibleColumns.position && (
                  <td className="px-4 py-4">
                    <Skeleton width="2rem" height="1rem" />
                  </td>
                )}
                <td className="px-4 py-4">
                  <Skeleton width="1.5rem" height="1.5rem" rounded />
                </td>
                {visibleColumns.name && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Skeleton width="2rem" height="2rem" rounded />
                      <Skeleton width="8rem" height="1rem" />
                    </div>
                  </td>
                )}
                {visibleColumns.score && (
                  <td className="px-4 py-4">
                    <Skeleton width="4rem" height="1rem" />
                  </td>
                )}
                {visibleColumns.earnings && (
                  <td className="px-4 py-4">
                    <Skeleton width="6rem" height="1rem" />
                  </td>
                )}
                {visibleColumns.rankChange && (
                  <td className="px-4 py-4">
                    <Skeleton width="3rem" height="1rem" />
                  </td>
                )}
                {visibleColumns.mcap && (
                  <td className="px-4 py-4">
                    <Skeleton width="5rem" height="1rem" />
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Skeleton width="2rem" height="2rem" rounded />
                      <Skeleton width="2rem" height="2rem" rounded />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    // Show "search not found" if there's an active search query
    if (activeSearchQuery) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-4 text-gray-500 text-center text-sm font-medium">
              Search not found
            </p>
            <p className="mt-2 text-gray-400 text-center text-xs">
              No builders found matching &quot;{activeSearchQuery}&quot;
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear search
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
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
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true" id="leaderboard-announcements"></div>
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
                className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={!data || !data.users.length}
                className="px-3 py-2 text-sm bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-green-700 border border-green-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                title="Export to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </button>
              <button
                onClick={handleExportJSON}
                disabled={!data || !data.users.length}
                className="px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed text-purple-700 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                title="Export to JSON"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                JSON
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                title="Share leaderboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
                title="Copy link to clipboard"
                aria-label="Copy current page link to clipboard"
              >
                {copiedLink ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-700 border border-gray-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                title="Refresh leaderboard"
                aria-label="Refresh leaderboard data"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
                title="Print leaderboard"
                aria-label="Print leaderboard page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600">Sort by:</span>
            {(['position', 'score', 'earnings', 'mcap'] as const).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-colors flex items-center gap-1.5 ${
                  sortBy === field
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortBy === field && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Columns
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600">Quick Filter:</span>
            {(['all', 'top10', 'top50', 'top100'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setQuickFilter(filter)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-colors ${
                  quickFilter === filter
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'top10' ? 'Top 10' : filter === 'top50' ? 'Top 50' : 'Top 100'}
              </button>
            ))}
          </div>
          {categories.size > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600">Category:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs rounded-xl transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {(['sought_after', 'trending', 'highest_score', 'featured', 'most_earnings'] as BuilderCategory[]).map((category) => {
                const hasBuilders = Array.from(categories.values()).includes(category);
                if (!hasBuilders) return null;
                return (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1.5 text-xs rounded-xl transition-colors flex items-center gap-1.5 ${
                      categoryFilter === category
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <TrophyIcon category={category} className="w-3 h-3" />
                    {getCategoryLabel(category)}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
            {bookmarkedBuilders.size > 0 && (
              <button
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-colors flex items-center gap-1.5 ${
                  showBookmarkedOnly
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3" fill={showBookmarkedOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Bookmarks ({bookmarkedBuilders.size})
              </button>
            )}
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                title="Table view"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 text-xs transition-all duration-200 ${
                  viewMode === 'card'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
                title="Card view"
                aria-label="Switch to card view"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Auto-refresh</span>
            </label>
            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            )}
          </div>
          {selectedForComparison.size > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-blue-700">
                  {selectedForComparison.size} builder{selectedForComparison.size > 1 ? 's' : ''} selected for comparison
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowComparison(true)}
                  className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                >
                  Compare
                </button>
                <button
                  onClick={clearComparison}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          {showAdvancedFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Score Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={scoreRange.min}
                      onChange={(e) => setScoreRange({ ...scoreRange, min: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={scoreRange.max}
                      onChange={(e) => setScoreRange({ ...scoreRange, max: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Earnings Range (USD)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={earningsRange.min}
                      onChange={(e) => setEarningsRange({ ...earningsRange, min: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={earningsRange.max}
                      onChange={(e) => setEarningsRange({ ...earningsRange, max: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setScoreRange({ min: '', max: '' });
                    setEarningsRange({ min: '', max: '' });
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
          {showColumnToggle && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Toggle Columns:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })}
                      className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
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
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        </div>
        {showStats && data && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.pagination.total}</div>
                <div className="text-xs text-gray-600 mt-1">Total Builders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredUsers.length}</div>
                <div className="text-xs text-gray-600 mt-1">Displayed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredUsers.length > 0 
                    ? formatNumber(Math.round(filteredUsers.reduce((sum, u) => sum + (u.profile.builder_score?.points || 0), 0) / filteredUsers.length))
                    : "0"}
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {isAllSponsors && filteredUsers.length > 0
                    ? `$${formatNumber(Math.round(filteredUsers.reduce((sum, u) => sum + ((u as UserWithEarningsBreakdown).totalEarningsUSD || 0), 0) / filteredUsers.length))}`
                    : tokenPrice !== null && filteredUsers.length > 0
                    ? `$${formatNumber(Math.round(filteredUsers.reduce((sum, u) => {
                        const amt = typeof u.reward_amount === 'string' ? parseFloat(u.reward_amount) : u.reward_amount;
                        return sum + (amt * tokenPrice);
                      }, 0) / filteredUsers.length))}`
                    : "—"}
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Earnings</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Builders by Category Table */}
      {!activeSearchQuery && topBuildersByCategory.length > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow-sm"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <span className="text-xs font-medium text-gray-500">
                                {user.leaderboard_position}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.profile.display_name || user.profile.name || "Anonymous"}
                              </div>
                              {isAllSponsors && (user as UserWithEarningsBreakdown).sponsors && (user as UserWithEarningsBreakdown).sponsors!.length > 1 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0" title="Appears in multiple sponsors">
                                  Multi-Sponsor
                                </span>
                              )}
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

      {/* Main Leaderboard Table or Card View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl" role="region" aria-label="Leaderboard table">
          <table className="w-full rounded-xl overflow-hidden" role="table" aria-label="Builders leaderboard">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b border-gray-200 bg-gray-50">
              {visibleColumns.position && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  #
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <span className="sr-only">Compare</span>
              </th>
              {visibleColumns.name && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Member Name</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              )}
              {visibleColumns.score && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Score</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              )}
              {visibleColumns.earnings && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Earnings</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              )}
              {visibleColumns.rankChange && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Rank Change</span>
                </th>
              )}
              {visibleColumns.mcap && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>MCAP</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              )}
              {visibleColumns.actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${
            tableDensity === 'compact' ? 'text-xs' : tableDensity === 'comfortable' ? 'text-base' : ''
          }`}>
            {displayUsers.map((user, idx) => {
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
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  className="hover:bg-gray-50 transition-colors focus-within:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
                  tabIndex={0}
                  role="row"
                  aria-label={`Builder ${user.profile.display_name || user.profile.name || user.id}, position ${user.leaderboard_position || ((data.pagination.current_page - 1) * 30 + idx + 1)}, score ${user.profile.builder_score?.points || 0}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleViewProfile(user);
                    }
                  }}
                >
                  {visibleColumns.position && (
                    <td className="px-4 py-4" aria-label={`Position ${user.leaderboard_position || ((data.pagination.current_page - 1) * 30 + idx + 1)}`}>
                      <div className="text-sm font-semibold text-gray-600">
                        {user.leaderboard_position || ((data.pagination.current_page - 1) * 30 + idx + 1)}
                      </div>
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className="px-4 py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {user.profile.image_url ? (
                        <img
                          src={user.profile.image_url}
                          alt={user.profile.display_name || user.profile.name || `Builder ${user.id} profile picture`}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
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
                            {user.profile.human_checkmark && (
                              <Badge variant="success" size="sm" className="flex-shrink-0">
                                Verified
                              </Badge>
                            )}
                            {user.profile.verified_nationality && (
                              <Badge variant="info" size="sm" className="flex-shrink-0">
                                Nationality
                              </Badge>
                            )}
                            {category && (
                              <div className="flex items-center gap-1 flex-shrink-0" title={getCategoryLabel(category)}>
                                <TrophyIcon category={category} className="w-4 h-4" />
                              </div>
                            )}
                            {isAllSponsors && (user as UserWithEarningsBreakdown).sponsors && (user as UserWithEarningsBreakdown).sponsors!.length > 1 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0" title="Appears in multiple sponsors">
                                Multi-Sponsor
                              </span>
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
                    </td>
                  )}
                  {visibleColumns.score && (
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.profile.builder_score?.points !== undefined
                          ? formatNumber(user.profile.builder_score.points)
                          : "N/A"}
                      </div>
                    </td>
                  )}
                  {visibleColumns.earnings && (
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
                                      {userWithBreakdown.earningsBreakdown.map((breakdown, idx) => {
                                        // Calculate running total up to this point
                                        const runningTotal = userWithBreakdown.earningsBreakdown!
                                          .slice(0, idx + 1)
                                          .reduce((sum, item) => sum + item.amountUSD, 0);
                                        
                                        return (
                                          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-200 last:border-b-0">
                                            <div className="flex-1">
                                              <span className="text-gray-600 capitalize font-medium">
                                                {breakdown.sponsor.replace("-", " ")}:
                                              </span>
                                              <div className="text-gray-500 mt-0.5">
                                                {formatNumber(breakdown.amount)} {breakdown.tokenSymbol} × ${formatNumber(breakdown.amountUSD / breakdown.amount || 0)} = ${formatNumber(breakdown.amountUSD)}
                                              </div>
                                            </div>
                                            <div className="text-right ml-2">
                                              <div className="font-medium text-gray-900">
                                                ${formatNumber(breakdown.amountUSD)}
                                              </div>
                                              {idx < userWithBreakdown.earningsBreakdown!.length - 1 && (
                                                <div className="text-gray-400 text-xs mt-0.5">
                                                  + {idx === 0 ? '' : '... + '}
                                                </div>
                                              )}
                                              {idx === userWithBreakdown.earningsBreakdown!.length - 1 && (
                                                <div className="text-blue-600 font-semibold text-xs mt-1 pt-1 border-t border-gray-300">
                                                  = ${formatNumber(runningTotal)}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
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
                  )}
                  {visibleColumns.rankChange && (
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
                  )}
                  {visibleColumns.mcap && (
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
                  )}
                  {visibleColumns.actions && (
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => copyWalletAddress(user.recipient_wallet || '')}
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedAddress === user.recipient_wallet
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-blue-600'
                          }`}
                          title={copiedAddress === user.recipient_wallet ? 'Copied!' : 'Copy wallet address'}
                          aria-label={copiedAddress === user.recipient_wallet ? 'Wallet address copied' : 'Copy wallet address to clipboard'}
                        >
                          {copiedAddress === user.recipient_wallet ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => toggleBookmark(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            bookmarkedBuilders.has(user.id)
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-yellow-600'
                          }`}
                          title={bookmarkedBuilders.has(user.id) ? 'Remove bookmark' : 'Bookmark builder'}
                          aria-label={bookmarkedBuilders.has(user.id) ? 'Remove bookmark' : 'Bookmark this builder'}
                        >
                          <svg className="w-4 h-4" fill={bookmarkedBuilders.has(user.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingNote(editingNote === user.id ? null : user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            builderNotes[user.id]
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-600'
                          }`}
                          title={builderNotes[user.id] ? 'Edit note' : 'Add note'}
                          aria-label={builderNotes[user.id] ? 'Edit note for this builder' : 'Add note for this builder'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                      {editingNote === user.id && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <textarea
                            defaultValue={builderNotes[user.id] || ''}
                            placeholder="Add a note about this builder..."
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={2}
                            onBlur={(e) => saveNote(user.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                saveNote(user.id, e.currentTarget.value);
                              }
                            }}
                            autoFocus
                          />
                          <div className="mt-1 flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingNote(null);
                                saveNote(user.id, '');
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Clear
                            </button>
                            <button
                              onClick={(e) => {
                                const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                                if (textarea) saveNote(user.id, textarea.value);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                      {builderNotes[user.id] && editingNote !== user.id && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-gray-700">{builderNotes[user.id]}</p>
                        </div>
                      )}
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayUsers.map((user, idx) => {
            const rewardAmount = typeof user.reward_amount === 'string' 
              ? parseFloat(user.reward_amount) 
              : user.reward_amount;
            
            const category = categories.get(user.id) || null;
            const priceForMCAP = isAllSponsors 
              ? 1
              : (tokenPrice || 0);
            const mcap = priceForMCAP ? calculateMCAP(user, priceForMCAP) : 0;
            const userWithBreakdown = user as UserWithEarningsBreakdown;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {user.profile.image_url ? (
                      <img
                        src={user.profile.image_url}
                        alt={user.profile.display_name || user.profile.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xs font-medium text-gray-500">
                          {user.leaderboard_position || idx + 1}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.profile.display_name || user.profile.name || "Anonymous"}
                        </p>
                        {category && (
                          <TrophyIcon category={category} className="w-4 h-4 flex-shrink-0" />
                        )}
                        {isAllSponsors && userWithBreakdown.sponsors && userWithBreakdown.sponsors.length > 1 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0">
                            Multi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {user.profile.bio || user.profile.location || "No description"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(user.id)}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      bookmarkedBuilders.has(user.id)
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={bookmarkedBuilders.has(user.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-0.5">Score</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.profile.builder_score?.points !== undefined
                        ? formatNumber(user.profile.builder_score.points)
                        : "N/A"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-0.5">Earnings</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {isAllSponsors && userWithBreakdown.totalEarningsUSD !== undefined
                        ? `$${formatNumber(userWithBreakdown.totalEarningsUSD)}`
                        : tokenPrice !== null && tokenInfo
                        ? `$${formatNumber(rewardAmount * tokenPrice)}`
                        : `${formatNumber(rewardAmount)} ${tokenInfo?.symbol || ''}`}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-0.5">MCAP</div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${formatNumber(mcap)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-0.5">Position</div>
                    <div className="text-sm font-semibold text-gray-900">
                      #{user.leaderboard_position || idx + 1}
                    </div>
                  </div>
                </div>

                {user.ranking_change !== 0 && (
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.ranking_change > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.ranking_change > 0 ? "↑" : "↓"} {Math.abs(user.ranking_change)} positions
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewProfile(user)}
                    className="flex-1 px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && selectedForComparison.size > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Builder Comparison</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from(selectedForComparison).map(userId => {
                  const user = displayUsers.find(u => u.id === userId);
                  if (!user) return null;
                  
                  const rewardAmount = typeof user.reward_amount === 'string' 
                    ? parseFloat(user.reward_amount) 
                    : user.reward_amount;
                  const priceForMCAP = isAllSponsors ? 1 : (tokenPrice || 0);
                  const mcap = priceForMCAP ? calculateMCAP(user, priceForMCAP) : 0;
                  const userWithBreakdown = user as UserWithEarningsBreakdown;
                  
                  return (
                    <div key={user.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        {user.profile.image_url ? (
                          <img
                            src={user.profile.image_url}
                            alt={user.profile.display_name || user.profile.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center shadow-sm">
                            <span className="text-xs font-medium text-gray-500">#{user.leaderboard_position || 0}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.profile.display_name || user.profile.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Position #{user.leaderboard_position || 0}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Score</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {user.profile.builder_score?.points !== undefined
                              ? formatNumber(user.profile.builder_score.points)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Earnings</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {isAllSponsors && userWithBreakdown.totalEarningsUSD !== undefined
                              ? `$${formatNumber(userWithBreakdown.totalEarningsUSD)}`
                              : tokenPrice !== null && tokenInfo
                              ? `$${formatNumber(rewardAmount * tokenPrice)}`
                              : `${formatNumber(rewardAmount)} ${tokenInfo?.symbol || ''}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">MCAP</span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${formatNumber(mcap)}
                          </span>
                        </div>
                        {user.ranking_change !== 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Change</span>
                            <span className={`text-xs font-medium ${
                              user.ranking_change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {user.ranking_change > 0 ? '↑' : '↓'} {Math.abs(user.ranking_change)}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="mt-4 w-full px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                      >
                        View Full Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Infinite Scroll Load More Trigger */}
      {!filters.sponsor_slug && (allSponsorsHasMore || (data && displayedCount < allSponsorsAggregatedUsers.length)) && (
        <div
          id="load-more-trigger"
          className="h-20 flex items-center justify-center"
        >
          {loadingMore ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm">Loading more builders...</span>
            </div>
          ) : (
            <button
              onClick={() => {
                // Apply search filter if active
                let filteredUsers = allSponsorsAggregatedUsers;
                if (activeSearchQuery) {
                  const searchLower = activeSearchQuery.toLowerCase();
                  filteredUsers = allSponsorsAggregatedUsers.filter((user) => {
                    const name = (user.profile.display_name || user.profile.name || '').toLowerCase();
                    const bio = (user.profile.bio || '').toLowerCase();
                    const wallet = (user.recipient_wallet || '').toLowerCase();
                    return name.includes(searchLower) || bio.includes(searchLower) || wallet.includes(searchLower);
                  });
                }

                // If we have more loaded data to show, just increase display count
                if (displayedCount < filteredUsers.length) {
                  const newDisplayedCount = Math.min(displayedCount + 30, filteredUsers.length);
                  setDisplayedCount(newDisplayedCount);
                  // Update displayed users in data
                  const newDisplayedUsers = filteredUsers.slice(0, newDisplayedCount);
                  newDisplayedUsers.forEach((user, index) => {
                    user.leaderboard_position = index + 1;
                  });
                  setData({
                    users: newDisplayedUsers,
                    pagination: {
                      current_page: 1,
                      last_page: Math.ceil(filteredUsers.length / 30),
                      total: filteredUsers.length,
                    },
                  });
                } else {
                  // Need to fetch more data from API
                  fetchLeaderboard({ 
                    ...filters, 
                    page: 1,
                    search: activeSearchQuery || undefined,
                  }, true);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {(() => {
                // Apply search filter to determine available count
                let filteredUsers = allSponsorsAggregatedUsers;
                if (activeSearchQuery) {
                  const searchLower = activeSearchQuery.toLowerCase();
                  filteredUsers = allSponsorsAggregatedUsers.filter((user) => {
                    const name = (user.profile.display_name || user.profile.name || '').toLowerCase();
                    const bio = (user.profile.bio || '').toLowerCase();
                    const wallet = (user.recipient_wallet || '').toLowerCase();
                    return name.includes(searchLower) || bio.includes(searchLower) || wallet.includes(searchLower);
                  });
                }
                return displayedCount < filteredUsers.length 
                  ? `Show More (${Math.min(30, filteredUsers.length - displayedCount)} more)` 
                  : "Load More";
              })()}
            </button>
          )}
        </div>
      )}

      {/* Pagination (only for single sponsor mode) */}
      {filters.sponsor_slug && data.pagination.last_page > 1 && (
        <nav className="px-6 py-4 border-t border-gray-200 flex items-center justify-between" aria-label="Pagination">
          <p className="text-sm text-gray-500" aria-live="polite">
            Page {data.pagination.current_page} of {data.pagination.last_page}
          </p>
          <div className="flex items-center gap-2" role="group" aria-label="Pagination controls">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="First page"
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Previous page"
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
                  className={`px-3 py-1.5 text-sm border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    pageNum === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === page ? "page" : undefined}
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
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Next page"
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(data.pagination.last_page)}
              disabled={page === data.pagination.last_page || loading}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Last page"
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
