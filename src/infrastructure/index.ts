/**
 * Infrastructure Layer Barrel Export
 * 
 * This file exports all infrastructure layer modules.
 * The infrastructure layer implements domain interfaces and handles external concerns.
 */

// API clients and integrations
export * from './api';

// Repository implementations
export * from './repositories';

// Storage adapters
export * from './storage';

// Caching implementations
export * from './caching';

// Logging infrastructure
export * from './logging';

// Monitoring services
export * from './monitoring';

// Analytics tracking
export * from './analytics';

// Notification services
export * from './notifications';

// External service adapters
export * from './adapters';

