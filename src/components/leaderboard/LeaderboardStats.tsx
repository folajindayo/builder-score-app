"use client";

interface LeaderboardStatsProps {
  totalBuilders: number;
  totalEarnings: number;
  averageScore: number;
  loading?: boolean;
}

export function LeaderboardStats({
  totalBuilders,
  totalEarnings,
  averageScore,
  loading = false,
}: LeaderboardStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Builders",
      value: totalBuilders.toLocaleString(),
      icon: "👥",
    },
    {
      label: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: "💰",
    },
    {
      label: "Average Score",
      value: averageScore.toFixed(1),
      icon: "⭐",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

