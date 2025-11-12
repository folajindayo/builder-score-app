import { WalletButton } from "@/components/WalletButton";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoadingProgressBar } from "@/components/LoadingProgressBar";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

const BuilderScore = dynamic(() => import("@/components/BuilderScore").then(mod => ({ default: mod.BuilderScore })), {
  loading: () => <div className="p-8 bg-white rounded-xl border-2 border-gray-200 shadow-md animate-pulse">Loading...</div>,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkipLink href="#main-content" />
      <header className="bg-white border-b border-gray-200" role="banner">
        <nav className="mx-[200px] px-6 py-4" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Builder Score
            </h1>
            <div className="flex items-center gap-6">
              <Link
                href="/leaderboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Leaderboard
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

      <main id="main-content" className="mx-[200px] px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Builder Score
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Connect your wallet to view your onchain builder reputation score powered by Talent Protocol
          </p>
        </div>

        <BuilderScore />
      </main>
      <KeyboardShortcuts
        shortcuts={[
          { keys: ["/"], description: "Focus search" },
          { keys: ["Esc"], description: "Close modals" },
        ]}
      />
    </div>
  );
}
