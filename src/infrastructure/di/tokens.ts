/**
 * Dependency Injection Tokens
 * 
 * Define tokens for dependency injection to avoid string literals.
 */

export const DI_TOKENS = {
  // Repositories
  BUILDER_REPOSITORY: Symbol('IBuilderRepository'),
  SCORE_REPOSITORY: Symbol('IScoreRepository'),

  // Services
  API_CLIENT: Symbol('ApiClient'),
  STORAGE_SERVICE: Symbol('StorageService'),
  CACHE_SERVICE: Symbol('CacheService'),
  LOGGER_SERVICE: Symbol('LoggerService'),
  ANALYTICS_SERVICE: Symbol('AnalyticsService'),

  // External APIs
  TALENT_API: Symbol('TalentApi'),
  COINGECKO_API: Symbol('CoingeckoApi'),
  BLOCKCHAIN_RPC: Symbol('BlockchainRpc'),

  // Infrastructure
  HTTP_CLIENT: Symbol('HttpClient'),
  LOCAL_STORAGE: Symbol('LocalStorage'),
  SESSION_STORAGE: Symbol('SessionStorage'),
  INDEXED_DB: Symbol('IndexedDB'),
} as const;

export type DiToken = typeof DI_TOKENS[keyof typeof DI_TOKENS];

