/**
 * Base API Client
 * 
 * Provides common functionality for all API clients including error handling,
 * retry logic, and request/response interceptors.
 */

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export abstract class BaseApiClient {
  protected readonly config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      headers: {},
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Make an HTTP request
   */
  protected async request<T>(config: RequestConfig): Promise<T> {
    const url = this.buildUrl(config.path, config.params);
    const headers = { ...this.config.headers, ...config.headers };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.executeRequest(url, {
          method: config.method,
          headers,
          body: config.body ? JSON.stringify(config.body) : undefined,
        });

        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retryAttempts && this.shouldRetry(error)) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
          continue;
        }

        break;
      }
    }

    throw lastError;
  }

  /**
   * Execute the actual fetch request
   */
  private async executeRequest(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return (await response.text()) as any;
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.config.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx errors
    if (error instanceof ApiError) {
      return error.statusCode ? error.statusCode >= 500 : false;
    }
    return true; // Retry on network errors
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  protected async get<T>(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({ method: 'GET', path, params, headers });
  }

  /**
   * POST request
   */
  protected async post<T>(
    path: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, headers });
  }

  /**
   * PUT request
   */
  protected async put<T>(
    path: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body, headers });
  }

  /**
   * DELETE request
   */
  protected async delete<T>(
    path: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, headers });
  }

  /**
   * PATCH request
   */
  protected async patch<T>(
    path: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body, headers });
  }
}

