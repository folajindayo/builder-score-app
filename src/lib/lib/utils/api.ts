/**
 * API utility functions
 */

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function createApiClient(baseUrl: string) {
  return {
    get: <T>(path: string, params?: Record<string, any>) =>
      fetcher<T>(buildUrl(`${baseUrl}${path}`, params)),

    post: <T>(path: string, data?: any) =>
      fetcher<T>(`${baseUrl}${path}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    put: <T>(path: string, data?: any) =>
      fetcher<T>(`${baseUrl}${path}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    patch: <T>(path: string, data?: any) =>
      fetcher<T>(`${baseUrl}${path}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: <T>(path: string) =>
      fetcher<T>(`${baseUrl}${path}`, {
        method: "DELETE",
      }),
  };
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("network") || error.message.includes("fetch");
  }
  return false;
}

export function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return statusTexts[status] || "Unknown Status";
}

