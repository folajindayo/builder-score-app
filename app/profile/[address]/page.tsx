'use client';

import { use } from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { SkipLink } from '@/components/SkipLink';
import { Skeleton } from '@/components/Skeleton';

interface PageProps {
  params: Promise<{ address: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { address } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SkipLink href="#main-content" />
      
      <header className="bg-white border-b border-gray-200" role="banner">
        <nav className="mx-auto max-w-7xl px-6 py-4" role="navigation">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <h1 className="text-xl font-semibold text-gray-900">
                Builder Profile
              </h1>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-6 py-8" role="main">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </h2>
                <Badge variant="primary">Verified</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                Full-stack Web3 developer with expertise in smart contracts and DeFi protocols
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Score:</span>
                  <span className="font-semibold text-gray-900">850</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Rank:</span>
                  <span className="font-semibold text-gray-900">#42</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Percentile:</span>
                  <span className="font-semibold text-gray-900">95%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Solidity', 'React', 'TypeScript', 'Smart Contract Security', 'Web3.js'].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Credentials */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credentials</h3>
              <div className="space-y-3">
                {[
                  { name: 'Ethereum Developer', issuer: 'Ethereum Foundation' },
                  { name: 'Security Auditor', issuer: 'OpenZeppelin' },
                  { name: 'Hackathon Winner', issuer: 'ETHGlobal' },
                ].map((credential) => (
                  <div key={credential.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{credential.name}</p>
                      <p className="text-sm text-gray-600">{credential.issuer}</p>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <span>🌐</span>
                  <span>Website</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <span>🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <span>💻</span>
                  <span>GitHub</span>
                </a>
              </div>
            </Card>

            {/* Activity */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Repositories</span>
                  <span className="font-semibold text-gray-900">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Contributions</span>
                  <span className="font-semibold text-gray-900">2,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Contracts</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

