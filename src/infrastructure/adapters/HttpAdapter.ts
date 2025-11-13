/**
 * HTTP Adapter for external integrations
 */

export interface HttpRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export class HttpAdapter {
  async request<T>(config: HttpRequest): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeout = config.timeout || 30000;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      const data = await response.json();

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        headers,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'GET', headers });
    return response.data;
  }

  async post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'POST', body, headers });
    return response.data;
  }

  async put<T>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'PUT', body, headers });
    return response.data;
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'DELETE', headers });
    return response.data;
  }
}

export const httpAdapter = new HttpAdapter();

