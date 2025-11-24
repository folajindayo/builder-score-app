// Mobile experience (commits 81-90)
export function setupSwipeGestures(element: HTMLElement, callbacks: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}): () => void {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const threshold = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) callbacks.onSwipeRight?.();
      if (deltaX < -threshold) callbacks.onSwipeLeft?.();
    } else {
      if (deltaY > threshold) callbacks.onSwipeDown?.();
      if (deltaY < -threshold) callbacks.onSwipeUp?.();
    }
  };

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

export function setupPullToRefresh(onRefresh: () => Promise<void>): () => void {
  let startY = 0;
  let pulling = false;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!pulling) return;
    const currentY = e.touches[0].clientY;
    if (currentY - startY > 100) {
      pulling = false;
      onRefresh();
    }
  };

  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
  };
}

export function optimizeTouchTargets(): void {
  document.querySelectorAll('button, a').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.height < 44) {
      (el as HTMLElement).style.minHeight = '44px';
    }
  });
}

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

export function showInstallPrompt(): void {
  // PWA install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    // Store event for later use
  });
}

export function enableOfflineMode(): void {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      return (registration as any).sync.register('sync-data');
    });
  }
}

