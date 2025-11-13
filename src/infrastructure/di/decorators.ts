/**
 * Dependency Injection Decorators
 * 
 * Provides decorators for dependency injection (optional, for class-based approach).
 */

import { Container } from './Container';

const INJECTABLE_METADATA_KEY = Symbol('injectable');
const INJECT_METADATA_KEY = Symbol('inject');

/**
 * Mark a class as injectable
 */
export function Injectable(token?: string | symbol) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, constructor);
    return constructor;
  };
}

/**
 * Inject a dependency
 */
export function Inject(token: string | symbol) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex?: number
  ) {
    const existingInjections =
      Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    existingInjections.push({ token, propertyKey, parameterIndex });
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingInjections, target);
  };
}

/**
 * Check if class is injectable
 */
export function isInjectable(target: any): boolean {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}

/**
 * Get injection metadata
 */
export function getInjectionMetadata(target: any): any[] {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
}

/**
 * Auto-inject dependencies helper
 */
export function autoInject<T>(
  container: Container,
  constructor: new (...args: any[]) => T
): T {
  const metadata = getInjectionMetadata(constructor);
  const args: any[] = [];

  for (const injection of metadata) {
    if (typeof injection.parameterIndex === 'number') {
      args[injection.parameterIndex] = container.resolve(injection.token);
    }
  }

  return new constructor(...args);
}

