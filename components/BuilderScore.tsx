"use client";

import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { useAccount } from "wagmi";
import { getBuilderScore, getBuilderProfile } from "@/lib/talent-api";
import type { BuilderScore, BuilderProfile } from "@/types/talent";
import { formatScore, formatNumber, formatDate, copyToClipboard, formatAddress } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToastContext } from "@/components/ToastProvider";

export const BuilderScore = memo(function BuilderScore() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<BuilderScore | null>(null);
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToastContext();

  useEffect(() => {
    if (!isConnected || !address) {
      setScore(null);
      setProfile(null);
      return;
    }

    async function fetchData() {
      if (!address) return;
      
      setLoading(true);
      setError(null);
      try {
        // Fetch score (required) and profile (optional - returns null if not available)
        const [scoreData, profileData] = await Promise.all([
          getBuilderScore(address),
          getBuilderProfile(address), // Returns null if endpoint not available
        ]);
        setScore(scoreData);
        setProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch builder score";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error fetching builder data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-md"
      >
        <p className="text-gray-600 text-center text-lg">
          Connect your wallet to view your builder score
        </p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-md"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-red-50 rounded-xl border-2 border-red-200 shadow-sm"
      >
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Note: API key may need to be configured
        </p>
      </motion.div>
    );
  }

  if (!score) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-md"
      >
        <p className="text-gray-600 text-center text-lg">
          No builder score found for this address
        </p>
      </motion.div>
    );
  }

  const handleCopyAddress = useCallback(async () => {
    if (!address) return;
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy address");
    }
  }, [address, toast]);

  const handleRefresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const [scoreData, profileData] = await Promise.all([
        getBuilderScore(address),
        getBuilderProfile(address),
      ]);
      setScore(scoreData);
      setProfile(profileData);
      toast.success("Builder score refreshed");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch builder score";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching builder data:", err);
    } finally {
      setLoading(false);
    }
  }, [address, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-lg"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Builder Score
          </h2>
          <div className="flex items-center gap-2">
            {address && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyAddress}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                title="Copy address"
              >
                <span className="font-mono text-xs">{formatAddress(address)}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {copied ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  )}
                </svg>
              </motion.button>
            )}
            {address && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors shadow-sm"
                title="Refresh score"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
        {profile?.profile?.name && (
          <p className="text-gray-600 text-lg">{profile.profile.name}</p>
        )}
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatScore(typeof score.score === 'number' ? score.score : 0)}
          </span>
          {score.rank && (
            <span className="text-sm text-gray-500">
              Rank #{formatNumber(score.rank)}
            </span>
          )}
        </div>
        {score.percentile !== undefined && (
          <p className="text-sm text-gray-600 mt-1">
            Top {formatScore(100 - score.percentile)}% of builders
          </p>
        )}
      </motion.div>

      {score.credentials && score.credentials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Credentials ({score.credentials.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {score.credentials.map((cred, idx) => (
              <motion.span
                key={cred.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
              >
                {cred.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {score.skills && score.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Skills ({score.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {useMemo(() => score.skills?.map((skill, idx) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
              >
                {skill.name}
              </motion.span>
            )), [score.skills])}
          </div>
        </motion.div>
      )}

      {score.updatedAt && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {formatDate(score.updatedAt)}
          </p>
        </div>
      )}

      {score.dataPoints && score.dataPoints.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Based on {score.dataPoints.length} verified data points
          </p>
        </div>
      )}
    </motion.div>
  );
});

