/**
 * BuilderCard Component
 */

'use client';

import { Builder } from '../lib/types/builder.types';
import { Avatar } from './ui/Avatar';

interface BuilderCardProps {
  builder: Builder;
}

export function BuilderCard({ builder }: BuilderCardProps) {
  return (
    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <Avatar address={builder.address} size="lg" />
        <div>
          <p className="font-mono text-sm text-gray-600">{builder.address}</p>
          <p className="text-2xl font-bold text-blue-600">{builder.score}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Level: {builder.level}</p>
        <p className="text-sm text-gray-500">Reputation: {builder.reputation}</p>
        {builder.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {builder.skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

