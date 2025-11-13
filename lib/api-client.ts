// API optimizations (commits 171-180)
interface CacheConfig {
  ttl: number;
  key: string;
}

const apiCache = new Map<string, { data: any; timestamp: number }>();

export async function cachedFetch<T>(url: string, options?: RequestInit, cacheConfig?: CacheConfig): Promise<T> {
  if (cacheConfig) {
    const cached = apiCache.get(cacheConfig.key);
    if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
      return cached.data;
    }
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (cacheConfig) {
    apiCache.set(cacheConfig.key, { data, timestamp: Date.now() });
  }

  return data;
}

export function paginate<T>(data: T[], page: number, pageSize: number): { items: T[]; total: number; hasMore: boolean } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: data.slice(start, end),
    total: data.length,
    hasMore: end < data.length,
  };
}

export class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);

    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const waitTime = this.window - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.requests.push(now);
  }
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

export async function triggerWebhook(url: string, payload: WebhookPayload): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function batchApiCalls<T>(calls: Array<() => Promise<T>>, batchSize: number = 5): Promise<T[]> {
  const results: T[] = [];
  
  async function processBatch(batch: Array<() => Promise<T>>): Promise<void> {
    const batchResults = await Promise.all(batch.map(call => call()));
    results.push(...batchResults);
  }

  const batches: Array<Array<() => Promise<T>>> = [];
  for (let i = 0; i < calls.length; i += batchSize) {
    batches.push(calls.slice(i, i + batchSize));
  }

  return batches.reduce(
    (promise, batch) => promise.then(() => processBatch(batch)),
    Promise.resolve()
  ).then(() => results);
}

