/**
 * Browser utility functions
 */

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return !isBrowser();
}

export function getBrowserInfo(): {
  name: string;
  version: string;
  os: string;
} {
  if (!isBrowser()) {
    return { name: "Unknown", version: "Unknown", os: "Unknown" };
  }

  const ua = navigator.userAgent;
  
  let browserName = "Unknown";
  let browserVersion = "Unknown";
  
  if (ua.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
  } else if (ua.indexOf("Chrome") > -1) {
    browserName = "Chrome";
    browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
  } else if (ua.indexOf("Safari") > -1) {
    browserName = "Safari";
    browserVersion = ua.match(/Version\/(\d+)/)?.[1] || "Unknown";
  } else if (ua.indexOf("Edge") > -1) {
    browserName = "Edge";
    browserVersion = ua.match(/Edge\/(\d+)/)?.[1] || "Unknown";
  }
  
  let os = "Unknown";
  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "MacOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iOS") > -1) os = "iOS";
  
  return { name: browserName, version: browserVersion, os };
}

export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isTablet(): boolean {
  if (!isBrowser()) return false;
  return /iPad|Android/i.test(navigator.userAgent) && !isMobile();
}

export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

export function supportsLocalStorage(): boolean {
  if (!isBrowser()) return false;
  
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function supportsSessionStorage(): boolean {
  if (!isBrowser()) return false;
  
  try {
    const test = "__storage_test__";
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function supportsWebWorkers(): boolean {
  return isBrowser() && typeof Worker !== "undefined";
}

export function supportsServiceWorker(): boolean {
  return isBrowser() && "serviceWorker" in navigator;
}

export function supportsNotifications(): boolean {
  return isBrowser() && "Notification" in window;
}

export function supportsGeolocation(): boolean {
  return isBrowser() && "geolocation" in navigator;
}

export function getConnectionType(): string {
  if (!isBrowser() || !("connection" in navigator)) {
    return "unknown";
  }
  
  const connection = (navigator as any).connection;
  return connection.effectiveType || "unknown";
}

export function isOnline(): boolean {
  return isBrowser() ? navigator.onLine : true;
}

export function getLanguage(): string {
  if (!isBrowser()) return "en";
  return navigator.language || "en";
}

export function getLanguages(): readonly string[] {
  if (!isBrowser()) return ["en"];
  return navigator.languages || ["en"];
}

