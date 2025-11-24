/**
 * CredentialBadge Component
 */

'use client';

interface CredentialBadgeProps {
  type: 'passport' | 'achievement' | 'certification';
  title: string;
  verified: boolean;
}

const TYPE_CONFIG = {
  passport: { icon: '🛂', color: 'bg-blue-100 text-blue-700' },
  achievement: { icon: '🏆', color: 'bg-yellow-100 text-yellow-700' },
  certification: { icon: '📜', color: 'bg-purple-100 text-purple-700' },
};

export function CredentialBadge({ type, title, verified }: CredentialBadgeProps) {
  const config = TYPE_CONFIG[type];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium">{title}</span>
      {verified && <span className="text-xs">✓</span>}
    </div>
  );
}

