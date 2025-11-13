'use client';

import { useEffect, useState } from 'react';

interface TimeAgoProps {
  date: string | Date;
  className?: string;
}

export function TimeAgo({ date, className = '' }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      let interval = seconds / 31536000; // years
      if (interval > 1) {
        setTimeAgo(`${Math.floor(interval)}y ago`);
        return;
      }
      interval = seconds / 2592000; // months
      if (interval > 1) {
        setTimeAgo(`${Math.floor(interval)}mo ago`);
        return;
      }
      interval = seconds / 86400; // days
      if (interval > 1) {
        setTimeAgo(`${Math.floor(interval)}d ago`);
        return;
      }
      interval = seconds / 3600; // hours
      if (interval > 1) {
        setTimeAgo(`${Math.floor(interval)}h ago`);
        return;
      }
      interval = seconds / 60; // minutes
      if (interval > 1) {
        setTimeAgo(`${Math.floor(interval)}m ago`);
        return;
      }
      setTimeAgo('just now');
    };

    updateTimeAgo();
    const timer = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [date]);

  return <span className={className}>{timeAgo}</span>;
}
