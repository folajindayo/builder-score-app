export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || response.statusText, error);
  }

  return response.json();
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit) =>
    fetchApi<T>(url, { ...options, method: 'GET' }),
    
  post: <T = any>(url: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T = any>(url: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T = any>(url: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T = any>(url: string, options?: RequestInit) =>
    fetchApi<T>(url, { ...options, method: 'DELETE' }),
};
