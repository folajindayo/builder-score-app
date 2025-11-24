/**
 * Bundle optimization utilities
 */

export function preloadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = src;
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

export function prefetchScript(src: string): void {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "script";
  link.href = src;
  document.head.appendChild(link);
}

export function preconnect(origin: string, crossorigin?: boolean): void {
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = origin;
  if (crossorigin) {
    link.crossOrigin = "anonymous";
  }
  document.head.appendChild(link);
}

export function dnsPreFetch(origin: string): void {
  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = origin;
  document.head.appendChild(link);
}

export async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

export interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  loadTime?: number;
}

export function trackBundleLoad(name: string): () => void {
  const startTime = performance.now();

  return () => {
    const loadTime = performance.now() - startTime;
    
    if (typeof window !== "undefined") {
      if (!(window as any).__bundleInfo) {
        (window as any).__bundleInfo = [];
      }

      (window as any).__bundleInfo.push({
        name,
        loadTime,
        timestamp: Date.now(),
      });
    }
  };
}

export function getBundleInfo(): BundleInfo[] {
  if (typeof window !== "undefined" && (window as any).__bundleInfo) {
    return (window as any).__bundleInfo;
  }
  return [];
}

