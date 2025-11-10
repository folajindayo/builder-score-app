import { WalletButton } from "@/components/WalletButton";
import { BuilderScore } from "@/components/BuilderScore";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-[200px] px-6 py-4">
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
        </div>
      </header>

      <main className="mx-[200px] px-6 py-8">
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
    </div>
  );
}
