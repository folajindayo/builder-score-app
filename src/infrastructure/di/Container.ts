/**
 * Dependency Injection Container
 * 
 * Simple IoC container for managing dependencies and their lifecycles.
 */

export type ServiceLifetime = 'singleton' | 'transient' | 'scoped';

export interface ServiceDescriptor<T = any> {
  token: string | symbol;
  factory: (container: Container) => T;
  lifetime: ServiceLifetime;
  instance?: T;
}

export class Container {
  private services: Map<string | symbol, ServiceDescriptor> = new Map();
  private scopedInstances: Map<string | symbol, any> = new Map();

  /**
   * Register a service
   */
  register<T>(
    token: string | symbol,
    factory: (container: Container) => T,
    lifetime: ServiceLifetime = 'transient'
  ): void {
    this.services.set(token, { token, factory, lifetime });
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    token: string | symbol,
    factory: (container: Container) => T
  ): void {
    this.register(token, factory, 'singleton');
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(
    token: string | symbol,
    factory: (container: Container) => T
  ): void {
    this.register(token, factory, 'transient');
  }

  /**
   * Register a scoped service
   */
  registerScoped<T>(
    token: string | symbol,
    factory: (container: Container) => T
  ): void {
    this.register(token, factory, 'scoped');
  }

  /**
   * Register an instance
   */
  registerInstance<T>(token: string | symbol, instance: T): void {
    this.services.set(token, {
      token,
      factory: () => instance,
      lifetime: 'singleton',
      instance,
    });
  }

  /**
   * Resolve a service
   */
  resolve<T>(token: string | symbol): T {
    const descriptor = this.services.get(token);

    if (!descriptor) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    switch (descriptor.lifetime) {
      case 'singleton':
        if (!descriptor.instance) {
          descriptor.instance = descriptor.factory(this);
        }
        return descriptor.instance;

      case 'scoped':
        if (!this.scopedInstances.has(token)) {
          this.scopedInstances.set(token, descriptor.factory(this));
        }
        return this.scopedInstances.get(token);

      case 'transient':
      default:
        return descriptor.factory(this);
    }
  }

  /**
   * Try to resolve a service
   */
  tryResolve<T>(token: string | symbol): T | null {
    try {
      return this.resolve<T>(token);
    } catch {
      return null;
    }
  }

  /**
   * Check if service is registered
   */
  has(token: string | symbol): boolean {
    return this.services.has(token);
  }

  /**
   * Clear scoped instances (call at end of scope)
   */
  clearScope(): void {
    this.scopedInstances.clear();
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.scopedInstances.clear();
  }

  /**
   * Get all registered service tokens
   */
  getRegisteredTokens(): (string | symbol)[] {
    return Array.from(this.services.keys());
  }

  /**
   * Create a child scope
   */
  createScope(): Container {
    const scope = new Container();
    // Copy service descriptors to child scope
    this.services.forEach((descriptor, token) => {
      scope.services.set(token, { ...descriptor });
    });
    return scope;
  }
}

// Global container instance
export const container = new Container();

