"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  points?: number;
}

interface ProfileActivityProps {
  activities: Activity[];
  loading?: boolean;
}

/**
 * Profile Activity Component
 * Displays recent user activities and transactions
 */
export default function ProfileActivity({
  activities,
  loading = false,
}: ProfileActivityProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="mt-4 text-center text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <div className="mt-4 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.type}</p>
              <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {activity.points && (
              <span className="ml-4 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
                +{activity.points}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

