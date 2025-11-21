/**
 * Home Page
 */

'use client';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Measure Your Builder Reputation
          </h1>
          <p className="text-xl text-gray-600">
            Track your on-chain and off-chain contributions
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white text-center">
            <div className="text-6xl font-bold mb-2">85</div>
            <div className="text-xl mb-4">Your Builder Score</div>
            <div className="text-sm opacity-90">Top 10% of builders</div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold">GitHub Activity</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold">On-Chain</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold">Credentials</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold">Social</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
