/**
 * Configuration Service
 */

export interface AppConfig {
  apiUrl: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
  limits: {
    cacheSize: number;
    requestsPerMinute: number;
  };
}

export class ConfigService {
  private config: Partial<AppConfig> = {};

  set(key: keyof AppConfig, value: any): void {
    this.config[key] = value;
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] | undefined {
    return this.config[key];
  }

  getOrDefault<K extends keyof AppConfig>(key: K, defaultValue: AppConfig[K]): AppConfig[K] {
    return this.config[key] ?? defaultValue;
  }

  has(key: keyof AppConfig): boolean {
    return key in this.config;
  }

  load(config: Partial<AppConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isProduction(): boolean {
    return this.get('environment') === 'production';
  }

  isDevelopment(): boolean {
    return this.get('environment') === 'development';
  }

  isFeatureEnabled(feature: string): boolean {
    const features = this.get('features') || {};
    return features[feature] === true;
  }
}

export const configService = new ConfigService();

