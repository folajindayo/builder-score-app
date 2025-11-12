"use client";

import { useState, useEffect } from "react";
import { WalletButton } from "@/components/WalletButton";
import dynamic from "next/dynamic";
import type { LeaderboardFilters as LeaderboardFiltersType } from "@/types/talent";
import Link from "next/link";
import { LoadingProgressBar } from "@/components/LoadingProgressBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ScrollToTop } from "@/components/ScrollToTop";

const Leaderboard = dynamic(() => import("@/components/Leaderboard").then(mod => ({ default: mod.Leaderboard })));
const LeaderboardFilters = dynamic(() => import("@/components/LeaderboardFilters").then(mod => ({ default: mod.LeaderboardFilters })));

export default function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFiltersType>({
    per_page: 20,
    page: 1,
    sponsor_slug: process.env.NEXT_PUBLIC_DEFAULT_SPONSOR_SLUG || undefined,
    grant_id: process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID
      ? Number(process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID)
      : undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Leaderboard - Builder Score";
  }, []);

  const handleFilterChange = (newFilters: LeaderboardFiltersType) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <LoadingProgressBar isLoading={loading} />
      <header className="bg-white border-b border-gray-200" role="banner">
        <nav className="mx-[200px] px-6 py-4" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Builder Score
            </h1>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Search
              </Link>
              <WalletButton />
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-[200px] px-6 py-8" role="main" aria-label="Leaderboard main content">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leaderboard" }]} />
          <div className="flex items-center gap-2 mb-2 mt-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Leaderboard
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Top builders ranked by their onchain reputation score
          </p>
        </div>

        <section role="region" aria-label="Leaderboard filters" className="mb-6">
          <LeaderboardFilters
            onFilterChange={handleFilterChange}
            loading={loading}
            initialFilters={filters}
          />
        </section>

        <section role="region" aria-label="Leaderboard table">
          <Leaderboard filters={filters} />
        </section>
      </main>
      <footer role="contentinfo" aria-label="Site footer" className="bg-white border-t border-gray-200 mt-12">
        <div className="mx-[200px] px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            Powered by Talent Protocol
          </p>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}

