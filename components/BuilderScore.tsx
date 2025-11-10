"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getBuilderScore, getBuilderProfile } from "@/lib/talent-api";
import type { BuilderScore, BuilderProfile } from "@/types/talent";
import { formatScore, formatNumber, formatDate } from "@/lib/utils";

export function BuilderScore() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState<BuilderScore | null>(null);
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(err instanceof Error ? err.message : "Failed to fetch builder score");
        console.error("Error fetching builder data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Connect your wallet to view your builder score
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="text-sm text-red-500 dark:text-red-500 mt-2">
          Note: API key may need to be configured
        </p>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No builder score found for this address
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Builder Score
        </h2>
        {profile?.profile?.name && (
          <p className="text-gray-600 dark:text-gray-400">{profile.profile.name}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            {formatScore(typeof score.score === 'number' ? score.score : 0)}
          </span>
          {score.rank && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rank #{formatNumber(score.rank)}
            </span>
          )}
        </div>
        {score.percentile !== undefined && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Top {formatScore(100 - score.percentile)}% of builders
          </p>
        )}
      </div>

      {score.credentials && score.credentials.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Credentials ({score.credentials.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {score.credentials.map((cred) => (
              <span
                key={cred.id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {cred.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {score.skills && score.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Skills ({score.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {score.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {score.updatedAt && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {formatDate(score.updatedAt)}
          </p>
        </div>
      )}

      {score.dataPoints && score.dataPoints.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Based on {score.dataPoints.length} verified data points
          </p>
        </div>
      )}
    </div>
  );
}

