/**
 * Root Layout
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Builder Score - Measure Your Web3 Reputation',
  description: 'Track and showcase your builder reputation score',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
          {children}
        </main>
      </body>
    </html>
  );
}
