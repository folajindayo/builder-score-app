export const AchievementBadges = ({ badges }: { badges: Array<{ name: string; icon: string; earned: boolean }> }) => (
  <div className="grid grid-cols-3 gap-4">
    {badges.map((badge) => (
      <div key={badge.name} className={`text-center p-4 rounded-lg ${badge.earned ? 'bg-blue-50' : 'bg-gray-100 opacity-50'}`}>
        <div className="text-3xl mb-2">{badge.icon}</div>
        <p className="text-sm font-medium">{badge.name}</p>
      </div>
    ))}
  </div>
);

